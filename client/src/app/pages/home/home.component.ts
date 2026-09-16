import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CanvasService } from '../../services/canvas.service';
import { ProjectService } from '../../services/project.service';
import { SampleRoom } from '../../models/project.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-page">
      <!-- HERO SECTION -->
      <section class="hero-section">
        <div class="container hero-grid">
          <div class="hero-content">
            <div class="hero-tag flex items-center gap-2">
              <span class="pulse-dot"></span>
              <span>MEAN Stack Room Paint Visualizer</span>
            </div>

            <h1 class="hero-title">
              See Your Room Painted <span class="gradient-text">Before Buying A Single Drop</span>
            </h1>

            <p class="hero-subtitle">
              Say goodbye to misleading paper shade cards. Upload your room photograph, define your walls with polygon precision, and simulate authentic paint colors with realistic lighting, shadows, and sheen finishes.
            </p>

            <!-- Quick Action Buttons -->
            <div class="hero-cta flex items-center gap-3">
              <a routerLink="/visualizer" class="btn btn-primary btn-lg">
                <i class="fa-solid fa-wand-magic-sparkles"></i>
                <span>Open Visualizer Studio</span>
              </a>
              <a routerLink="/colors" class="btn btn-secondary btn-lg">
                <i class="fa-solid fa-swatchbook"></i>
                <span>Explore 60+ Shades</span>
              </a>
            </div>

            <!-- Trust Metrics -->
            <div class="trust-metrics flex items-center gap-6 mt-8">
              <div class="metric-item">
                <span class="metric-value">60+</span>
                <span class="metric-label">Curated Shades</span>
              </div>
              <div class="metric-divider"></div>
              <div class="metric-item">
                <span class="metric-value">100%</span>
                <span class="metric-label">Realistic Lighting</span>
              </div>
              <div class="metric-divider"></div>
              <div class="metric-item">
                <span class="metric-value">Zero</span>
                <span class="metric-label">Repainting Regret</span>
              </div>
            </div>
          </div>

          <!-- Hero Live Interactive Preview Box -->
          <div class="hero-preview-wrapper glass-panel">
            <div class="preview-header flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="status-dot"></span>
                <span class="preview-title">Live Wall Color Simulator</span>
              </div>
              <span class="badge badge-primary">Interactive Demo</span>
            </div>

            <div class="canvas-container">
              <canvas #heroCanvas class="hero-canvas" width="600" height="400"></canvas>
            </div>

            <!-- Live Color Quick Palette Switcher -->
            <div class="hero-swatch-bar flex items-center justify-between">
              <div class="flex items-center gap-2">
                <button 
                  *ngFor="let c of demoColors" 
                  (click)="changeHeroColor(c)"
                  class="demo-swatch"
                  [class.active]="activeHeroColor.hex === c.hex"
                  [style.background-color]="c.hex"
                  [title]="c.name"
                ></button>
              </div>
              <div class="hero-color-label">
                <span class="color-name">{{ activeHeroColor.name }}</span>
                <span class="color-code">{{ activeHeroColor.code }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FEATURE HIGHLIGHTS SECTION -->
      <section class="features-section">
        <div class="container">
          <div class="section-header text-center">
            <span class="section-badge">How It Works</span>
            <h2 class="section-title">Designed for Real-World Room Planning</h2>
            <p class="section-desc">Traditional shade cards don't reflect your room's natural sunlight and corner shadows. Our engine bridges the gap.</p>
          </div>

          <div class="features-grid">
            <div class="feature-card card">
              <div class="feature-icon" style="background: linear-gradient(135deg, #3B82F6, #06B6D4)">
                <i class="fa-solid fa-draw-polygon"></i>
              </div>
              <h3 class="feature-name">Precision Polygon Tool</h3>
              <p class="feature-text">Click around wall edges, moldings, and windows to isolate walls with millimeter precision. Editable handles allow effortless boundary refinement.</p>
            </div>

            <div class="feature-card card">
              <div class="feature-icon" style="background: linear-gradient(135deg, #6366F1, #8B5CF6)">
                <i class="fa-solid fa-sun"></i>
              </div>
              <h3 class="feature-name">Shadow-Preserving Blending</h3>
              <p class="feature-text">Our HTML5 Canvas pixel compositing retains the room's original illumination, wall texture, and natural shadows rather than flat color fills.</p>
            </div>

            <div class="feature-card card">
              <div class="feature-icon" style="background: linear-gradient(135deg, #EC4899, #F43F5E)">
                <i class="fa-solid fa-layer-group"></i>
              </div>
              <h3 class="feature-name">Dual-Tone & Wallpapers</h3>
              <p class="feature-text">Preview modern horizontal or vertical split accent walls and seamless wallpaper patterns like Nordic chevron, brick loft, and linen weaves.</p>
            </div>

            <div class="feature-card card">
              <div class="feature-icon" style="background: linear-gradient(135deg, #10B981, #059669)">
                <i class="fa-solid fa-file-arrow-down"></i>
              </div>
              <h3 class="feature-name">Painter-Ready Export</h3>
              <p class="feature-text">Download high-resolution room renders embedded with exact shade codes, brand references, and finish specifications to hand to your painter.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- SAMPLE ROOM TEMPLATES SHOWCASE -->
      <section class="samples-section">
        <div class="container">
          <div class="section-header flex items-center justify-between">
            <div>
              <span class="section-badge">Ready Templates</span>
              <h2 class="section-title">No Room Photo? Try A Sample Room</h2>
            </div>
            <a routerLink="/visualizer" class="btn btn-outline">
              <span>View All In Studio</span>
              <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>

          <div class="samples-grid">
            <div *ngFor="let room of sampleRooms" class="sample-card card">
              <div class="sample-badge">{{ room.type }}</div>
              <h3 class="sample-name">{{ room.name }}</h3>
              <p class="sample-desc">{{ room.description }}</p>
              <div class="sample-walls-count">
                <i class="fa-solid fa-vector-square"></i>
                <span>{{ room.suggestedWalls.length }} Pre-configured Wall Zones</span>
              </div>
              <button (click)="launchSampleInStudio(room)" class="btn btn-primary btn-sm mt-4 w-full">
                <i class="fa-solid fa-paintbrush"></i>
                <span>Open in Studio</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- BOTTOM CTA BANNER -->
      <section class="cta-section">
        <div class="container">
          <div class="cta-card glass-panel flex items-center justify-between">
            <div>
              <h2 class="cta-title">Ready to Transform Your Home?</h2>
              <p class="cta-desc">Start experimenting with virtual colors right now. No software installation required.</p>
            </div>
            <a routerLink="/visualizer" class="btn btn-accent btn-lg">
              <i class="fa-solid fa-wand-magic-sparkles"></i>
              <span>Launch Studio Free</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-page {
      padding-bottom: 3rem;
    }
    .hero-section {
      padding: 4rem 0 5rem;
      position: relative;
    }
    .hero-grid {
      display: grid;
      grid-template-columns: 1.15fr 1fr;
      gap: 3.5rem;
      align-items: center;
    }
    .hero-tag {
      display: inline-flex;
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.35);
      padding: 0.35rem 0.85rem;
      border-radius: var(--radius-full);
      font-size: 0.85rem;
      font-weight: 600;
      color: #818CF8;
      margin-bottom: 1.5rem;
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #38BDF8;
      box-shadow: 0 0 10px #38BDF8;
    }
    .hero-title {
      font-size: 3.2rem;
      font-weight: 800;
      letter-spacing: -0.04em;
      line-height: 1.15;
      margin-bottom: 1.5rem;
    }
    .gradient-text {
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-subtitle {
      font-size: 1.15rem;
      color: var(--text-muted);
      line-height: 1.65;
      margin-bottom: 2rem;
    }
    .metric-item {
      display: flex;
      flex-direction: column;
    }
    .metric-value {
      font-family: var(--font-heading);
      font-size: 1.8rem;
      font-weight: 800;
      color: var(--text-main);
    }
    .metric-label {
      font-size: 0.82rem;
      color: var(--text-subtle);
    }
    .metric-divider {
      width: 1px;
      height: 36px;
      background: var(--border-subtle);
    }
    /* Hero Preview */
    .hero-preview-wrapper {
      padding: 1rem;
      box-shadow: var(--shadow-lg);
      border: 1px solid rgba(255, 255, 255, 0.12);
    }
    .preview-header {
      padding: 0.5rem 0.75rem 0.75rem;
    }
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10B981;
      box-shadow: 0 0 8px #10B981;
    }
    .preview-title {
      font-size: 0.9rem;
      font-weight: 600;
    }
    .canvas-container {
      width: 100%;
      background: #000;
      border-radius: var(--radius-md);
      overflow: hidden;
    }
    .hero-canvas {
      width: 100%;
      height: auto;
      display: block;
    }
    .hero-swatch-bar {
      padding: 1rem 0.75rem 0.25rem;
    }
    .demo-swatch {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid transparent;
      transition: all var(--transition-fast);
    }
    .demo-swatch:hover, .demo-swatch.active {
      transform: scale(1.2);
      border-color: #FFFFFF;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    }
    .hero-color-label {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    .color-name {
      font-size: 0.9rem;
      font-weight: 600;
    }
    .color-code {
      font-size: 0.75rem;
      color: var(--text-subtle);
    }

    /* Features */
    .features-section {
      padding: 5rem 0;
    }
    .section-badge {
      display: inline-block;
      font-size: 0.8rem;
      font-weight: 700;
      color: #38BDF8;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 0.5rem;
    }
    .section-title {
      font-size: 2.2rem;
      font-weight: 800;
      margin-bottom: 0.75rem;
    }
    .section-desc {
      font-size: 1rem;
      color: var(--text-muted);
      max-width: 600px;
      margin: 0 auto;
    }
    .text-center { text-align: center; }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.75rem;
      margin-top: 3.5rem;
    }
    .feature-card {
      padding: 2rem 1.5rem;
    }
    .feature-icon {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      color: #FFFFFF;
      margin-bottom: 1.25rem;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    }
    .feature-name {
      font-size: 1.15rem;
      margin-bottom: 0.65rem;
    }
    .feature-text {
      font-size: 0.9rem;
      color: var(--text-muted);
      line-height: 1.55;
    }

    /* Samples */
    .samples-section {
      padding: 4rem 0;
    }
    .samples-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      margin-top: 2rem;
    }
    .sample-card {
      position: relative;
    }
    .sample-badge {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 600;
      color: #818CF8;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
    }
    .sample-name {
      font-size: 1.1rem;
      margin-bottom: 0.4rem;
    }
    .sample-desc {
      font-size: 0.85rem;
      color: var(--text-muted);
      line-height: 1.5;
      margin-bottom: 1rem;
    }
    .sample-walls-count {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      font-size: 0.8rem;
      color: var(--text-subtle);
    }
    .w-full { width: 100%; }

    /* CTA Banner */
    .cta-section {
      padding: 3rem 0;
    }
    .cta-card {
      padding: 3rem;
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9));
      border: 1px solid rgba(255, 255, 255, 0.15);
    }
    .cta-title {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    .cta-desc {
      font-size: 1.05rem;
      color: var(--text-muted);
    }

    @media (max-width: 1024px) {
      .hero-grid { grid-template-columns: 1fr; gap: 2.5rem; }
      .features-grid { grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
      .samples-grid { grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
      .hero-title { font-size: 2.5rem; }
    }
    @media (max-width: 768px) {
      .hero-section { padding: 2.5rem 0 3rem; }
      .hero-title { font-size: 2rem; margin-bottom: 1rem; }
      .hero-subtitle { font-size: 0.98rem; margin-bottom: 1.5rem; }
      .hero-cta { flex-direction: column; width: 100%; gap: 0.75rem; }
      .hero-cta .btn { width: 100%; }
      .trust-metrics {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.75rem;
        text-align: center;
        margin-top: 1.75rem;
      }
      .metric-divider { display: none; }
      .metric-value { font-size: 1.4rem; }
      .metric-label { font-size: 0.72rem; }
      .features-section { padding: 3rem 0; }
      .features-grid { grid-template-columns: 1fr; margin-top: 2rem; }
      .samples-section { padding: 2.5rem 0; }
      .samples-grid { grid-template-columns: 1fr; }
      .section-header.flex { flex-direction: column; align-items: flex-start; gap: 1rem; }
      .cta-section { padding: 2rem 0; }
      .cta-card { padding: 2rem 1.25rem; flex-direction: column; gap: 1.25rem; text-align: center; }
      .cta-title { font-size: 1.5rem; }
      .cta-desc { font-size: 0.92rem; }
      .cta-card .btn { width: 100%; }
    }
    @media (max-width: 480px) {
      .hero-title { font-size: 1.75rem; }
      .trust-metrics { grid-template-columns: 1fr 1fr; gap: 0.5rem; }
      .trust-metrics .metric-item:last-child { grid-column: span 2; }
      .demo-swatch { width: 28px; height: 28px; }
    }

  `]
})
export class HomeComponent implements OnInit {
  @ViewChild('heroCanvas', { static: true }) heroCanvasRef!: ElementRef<HTMLCanvasElement>;

  demoColors = [
    { code: 'BL-201', name: 'Pacific Navy', hex: '#1E3A5F' },
    { code: 'GR-301', name: 'Eucalyptus Sage', hex: '#8F9E8B' },
    { code: 'TC-401', name: 'Moroccan Terracotta', hex: '#C26D53' },
    { code: 'WN-101', name: 'Tuscan Beige', hex: '#E8D8C8' },
    { code: 'PK-501', name: 'Dusty Rose', hex: '#C99A9C' }
  ];

  activeHeroColor = this.demoColors[0];
  sampleRooms: SampleRoom[] = [];

  constructor(
    private canvasService: CanvasService,
    private projectService: ProjectService,
    private router: Router
  ) {}

  ngOnInit() {
    this.renderHeroPreview();
    this.projectService.getSampleRooms().subscribe({
      next: (rooms) => (this.sampleRooms = rooms),
      error: () => {}
    });
  }

  renderHeroPreview() {
    const canvas = this.heroCanvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw base room
    this.canvasService.drawSampleRoom(ctx, canvas.width, canvas.height, 'Living Room');

    // Apply active demo color to the accent wall
    const wallLayer = {
      name: 'Accent Wall',
      polygon: [
        { x: 0.15, y: 0.15 },
        { x: 0.85, y: 0.15 },
        { x: 0.85, y: 0.72 },
        { x: 0.15, y: 0.72 }
      ],
      color: this.activeHeroColor,
      finish: 'matte',
      opacity: 0.86
    };

    this.canvasService.applyWallColor(ctx, wallLayer, canvas.width, canvas.height);
  }

  changeHeroColor(color: any) {
    this.activeHeroColor = color;
    this.renderHeroPreview();
  }

  launchSampleInStudio(room: SampleRoom) {
    this.router.navigate(['/visualizer'], { queryParams: { sampleId: room.id } });
  }
}
