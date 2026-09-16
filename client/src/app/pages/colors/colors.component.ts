import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PaintService } from '../../services/paint.service';
import { AuthService } from '../../services/auth.service';
import { PaintColor } from '../../models/color.model';
import { WallpaperPattern } from '../../models/pattern.model';

@Component({
  selector: 'app-colors',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="colors-page container">
      <!-- Top Title & Navigation Tabs -->
      <div class="page-header flex items-center justify-between mb-5">
        <div>
          <span class="badge badge-primary">Color Library</span>
          <h1 class="page-title mt-1">Curated Shades & Wallpapers</h1>
          <p class="page-subtitle">Authentic color formulas matched to Behr, Asian Paints, and Dulux collections.</p>
        </div>

        <div class="tabs-pill flex items-center">
          <button 
            (click)="activeTab = 'colors'" 
            class="tab-btn" 
            [class.active]="activeTab === 'colors'"
          >
            <i class="fa-solid fa-palette"></i>
            <span>Shades ({{ colors.length }})</span>
          </button>
          <button 
            (click)="activeTab = 'patterns'" 
            class="tab-btn" 
            [class.active]="activeTab === 'patterns'"
          >
            <i class="fa-solid fa-border-all"></i>
            <span>Wallpapers ({{ patterns.length }})</span>
          </button>
        </div>
      </div>

      <!-- TAB 1: PAINT COLORS -->
      <div *ngIf="activeTab === 'colors'" class="tab-content animate-fade">
        <!-- Search, Brand & Category Filter Bar -->
        <div class="filter-bar card mb-5 flex items-center justify-between gap-3">
          <div class="filter-inputs-group flex items-center gap-2 flex-1">
            <!-- Search Box -->
            <div class="search-box flex-1">
              <i class="fa-solid fa-magnifying-glass search-icon"></i>
              <input 
                [(ngModel)]="searchQuery" 
                (input)="applyFilters()" 
                placeholder="Search name, code (BL-201), or hex..."
                class="form-input search-field"
              >
            </div>

            <!-- Category Dropdown -->
            <select [(ngModel)]="selectedCategory" (change)="applyFilters()" class="form-select select-w">
              <option value="All">All Color Families</option>
              <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
            </select>
          </div>

          <!-- Brand Pills (Swipeable on Mobile) -->
          <div class="brand-pills flex items-center gap-1 touch-scroll-x">
            <button 
              *ngFor="let b of ['All', 'Behr', 'Asian Paints', 'Dulux']" 
              (click)="selectedBrand = b; applyFilters()"
              class="brand-pill-btn"
              [class.active]="selectedBrand === b"
            >
              {{ b }}
            </button>
          </div>
        </div>

        <!-- Color Cards Grid -->
        <div class="colors-grid">
          <div *ngFor="let color of filteredColors" class="color-card card">
            <!-- Swatch Tile -->
            <div class="swatch-tile" [style.background-color]="color.hex">
              <button 
                (click)="toggleFavorite(color.code)" 
                class="fav-btn"
                [class.favorited]="isFavorited(color.code)"
                title="Save to favorites"
              >
                <i [class]="isFavorited(color.code) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
              </button>
              <span *ngIf="color.popular" class="popular-tag">Trending</span>
            </div>

            <!-- Card Info -->
            <div class="card-body">
              <div class="flex items-center justify-between mb-1">
                <span class="color-brand">{{ color.brand }}</span>
                <span class="color-code">{{ color.code }}</span>
              </div>
              <h3 class="color-name">{{ color.name }}</h3>

              <div class="color-specs flex items-center justify-between mt-2">
                <button (click)="copyHex(color.hex)" class="hex-badge" title="Copy HEX to clipboard">
                  <span>{{ color.hex }}</span>
                  <i class="fa-regular fa-copy"></i>
                </button>
                <span class="rgb-text hidden-xs">RGB: {{ color.rgb }}</span>
              </div>

              <!-- Tags -->
              <div class="room-tags flex items-center gap-1 mt-2">
                <span *ngFor="let tag of color.tags?.slice(0, 2)" class="room-tag">{{ tag }}</span>
              </div>

              <!-- Try in Studio CTA Button -->
              <button (click)="tryInStudio(color)" class="btn btn-primary btn-sm mt-3 w-full">
                <i class="fa-solid fa-wand-magic-sparkles"></i>
                <span>Try in Studio</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 2: WALLPAPERS & PATTERNS -->
      <div *ngIf="activeTab === 'patterns'" class="tab-content animate-fade">
        <div class="patterns-grid">
          <div *ngFor="let p of patterns" class="pattern-item card">
            <div class="pattern-display" [innerHTML]="p.svgPattern"></div>
            <div class="pattern-body">
              <span class="badge badge-neutral mb-1">{{ p.category }}</span>
              <h3 class="pattern-title">{{ p.name }}</h3>
              <p class="pattern-desc">{{ p.description }}</p>
              <div class="pattern-meta flex items-center justify-between mt-2">
                <span class="text-xs text-subtle">Style: {{ p.style }}</span>
                <span class="text-xs text-subtle">Scale: {{ p.scale }}px</span>
              </div>
              <a routerLink="/visualizer" class="btn btn-secondary btn-sm mt-3 w-full">
                <i class="fa-solid fa-brush"></i>
                <span>Apply in Studio</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Toast Feedback -->
      <div *ngIf="toastMsg" class="toast-feedback animate-fade">
        <i class="fa-solid fa-check"></i>
        <span>{{ toastMsg }}</span>
      </div>
    </div>
  `,
  styles: [`
    .colors-page {
      padding: 1.5rem 1.5rem 5rem;
    }
    .page-title {
      font-size: 2.2rem;
      font-weight: 800;
    }
    .page-subtitle {
      font-size: 0.92rem;
      color: var(--text-muted);
    }
    .tabs-pill {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-full);
      padding: 0.25rem;
    }
    .tab-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 1rem;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-muted);
      border-radius: var(--radius-full);
      transition: all var(--transition-fast);
      white-space: nowrap;
    }
    .tab-btn.active {
      background: var(--accent-primary);
      color: #FFFFFF;
      box-shadow: 0 2px 10px rgba(99, 102, 241, 0.4);
    }
    .filter-bar {
      padding: 0.75rem 1rem;
    }
    .search-box {
      position: relative;
    }
    .search-icon {
      position: absolute;
      left: 0.85rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-subtle);
      font-size: 0.85rem;
    }
    .search-field {
      padding-left: 2.3rem;
      width: 100%;
      font-size: 0.88rem;
    }
    .select-w {
      min-width: 170px;
      font-size: 0.88rem;
    }
    .brand-pills {
      display: flex;
      gap: 0.35rem;
      padding-bottom: 0.15rem;
    }
    .brand-pill-btn {
      padding: 0.35rem 0.75rem;
      font-size: 0.8rem;
      font-weight: 600;
      border-radius: var(--radius-full);
      background: var(--bg-card-hover);
      color: var(--text-muted);
      border: 1px solid var(--border-subtle);
      transition: all var(--transition-fast);
      white-space: nowrap;
    }
    .brand-pill-btn.active {
      background: rgba(56, 189, 248, 0.18);
      border-color: #38BDF8;
      color: #38BDF8;
    }
    .colors-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25rem;
    }
    .color-card {
      padding: 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .swatch-tile {
      height: 130px;
      position: relative;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .fav-btn {
      position: absolute;
      top: 0.65rem;
      right: 0.65rem;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.45);
      backdrop-filter: blur(6px);
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-fast);
      font-size: 0.95rem;
    }
    .fav-btn.favorited {
      color: #EC4899;
    }
    .popular-tag {
      position: absolute;
      bottom: 0.65rem;
      left: 0.65rem;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 0.15rem 0.55rem;
      border-radius: var(--radius-full);
      font-size: 0.68rem;
      font-weight: 700;
      text-transform: uppercase;
      color: #FBBF24;
    }
    .card-body {
      padding: 1rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .color-brand {
      font-size: 0.72rem;
      font-weight: 600;
      color: #38BDF8;
      text-transform: uppercase;
    }
    .color-code {
      font-size: 0.72rem;
      color: var(--text-subtle);
    }
    .color-name {
      font-size: 1rem;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .hex-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      padding: 0.2rem 0.45rem;
      border-radius: 4px;
      font-size: 0.72rem;
      color: var(--text-main);
      transition: all var(--transition-fast);
    }
    .hex-badge:hover {
      border-color: var(--accent-primary);
    }
    .rgb-text {
      font-size: 0.7rem;
      color: var(--text-subtle);
    }
    .room-tags {
      flex-wrap: wrap;
    }
    .room-tag {
      font-size: 0.68rem;
      background: rgba(255, 255, 255, 0.05);
      padding: 0.12rem 0.4rem;
      border-radius: 4px;
      color: var(--text-subtle);
    }
    .w-full { width: 100%; }

    /* Patterns Grid */
    .patterns-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;
    }
    .pattern-item {
      padding: 0;
      overflow: hidden;
    }
    .pattern-display {
      height: 150px;
      background: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .pattern-body {
      padding: 1rem;
    }
    .pattern-title {
      font-size: 1rem;
      margin-bottom: 0.25rem;
    }
    .pattern-desc {
      font-size: 0.82rem;
      color: var(--text-muted);
      line-height: 1.45;
    }
    .toast-feedback {
      position: fixed;
      bottom: calc(75px + var(--safe-bottom));
      right: 1.5rem;
      background: #10B981;
      color: #FFFFFF;
      padding: 0.65rem 1.25rem;
      border-radius: var(--radius-full);
      font-size: 0.85rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.45rem;
      box-shadow: var(--shadow-lg);
      z-index: 999;
    }

    @media (max-width: 1100px) {
      .colors-grid { grid-template-columns: repeat(3, 1fr); }
      .patterns-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 800px) {
      .page-header { flex-direction: column; align-items: flex-start; gap: 0.85rem; }
      .tabs-pill { width: 100%; justify-content: space-around; }
      .tabs-pill .tab-btn { flex: 1; justify-content: center; }
      .filter-bar { flex-direction: column; align-items: stretch; gap: 0.75rem; }
      .filter-inputs-group { flex-direction: column; }
      .select-w { width: 100%; }
      .colors-grid { grid-template-columns: repeat(2, 1fr); gap: 0.85rem; }
      .patterns-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 480px) {
      .colors-page { padding: 1rem 0.75rem 4rem; }
      .page-title { font-size: 1.6rem; }
      .colors-grid { grid-template-columns: repeat(2, 1fr); gap: 0.65rem; }
      .swatch-tile { height: 105px; }
      .card-body { padding: 0.75rem; }
      .color-name { font-size: 0.88rem; }
      .hidden-xs { display: none; }
      .toast-feedback { right: 1rem; left: 1rem; justify-content: center; }
    }
  `]
})
export class ColorsComponent implements OnInit {
  activeTab: 'colors' | 'patterns' = 'colors';
  colors: PaintColor[] = [];
  filteredColors: PaintColor[] = [];
  patterns: WallpaperPattern[] = [];
  categories: string[] = [];

  searchQuery = '';
  selectedCategory = 'All';
  selectedBrand = 'All';
  toastMsg = '';
  favoriteCodes: Set<string> = new Set();

  constructor(
    private paintService: PaintService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadFavorites();
    this.loadColors();
    this.loadPatterns();
  }

  loadColors() {
    this.paintService.getColors().subscribe(c => {
      this.colors = c;
      this.filteredColors = c;
      this.categories = Array.from(new Set(c.map(item => item.category))).sort();
    });
  }

  loadPatterns() {
    this.paintService.getPatterns().subscribe(p => {
      this.patterns = p;
    });
  }

  loadFavorites() {
    const favs = localStorage.getItem('fav_colors');
    if (favs) {
      try {
        this.favoriteCodes = new Set(JSON.parse(favs));
      } catch (e) {}
    }
  }

  toggleFavorite(code: string) {
    if (this.favoriteCodes.has(code)) {
      this.favoriteCodes.delete(code);
      this.showToast('Removed from favorites');
    } else {
      this.favoriteCodes.add(code);
      this.showToast('Saved to favorites');
    }
    localStorage.setItem('fav_colors', JSON.stringify(Array.from(this.favoriteCodes)));
  }

  isFavorited(code: string): boolean {
    return this.favoriteCodes.has(code);
  }

  applyFilters() {
    let list = [...this.colors];
    if (this.selectedCategory !== 'All') {
      list = list.filter(c => c.category === this.selectedCategory);
    }
    if (this.selectedBrand !== 'All') {
      list = list.filter(c => c.brand === this.selectedBrand);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(c => 
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.hex.toLowerCase().includes(q)
      );
    }
    this.filteredColors = list;
  }

  copyHex(hex: string) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(hex);
      this.showToast(`Copied ${hex} to clipboard!`);
    }
  }

  tryInStudio(color: PaintColor) {
    this.router.navigate(['/visualizer']);
  }

  showToast(msg: string) {
    this.toastMsg = msg;
    setTimeout(() => {
      if (this.toastMsg === msg) this.toastMsg = '';
    }, 3000);
  }
}
