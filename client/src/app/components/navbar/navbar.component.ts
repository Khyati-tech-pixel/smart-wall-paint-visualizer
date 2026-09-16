import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <!-- Top Site Header -->
    <header class="site-header glass-panel">
      <div class="container flex items-center justify-between">
        <!-- Brand Logo -->
        <a routerLink="/" class="brand-logo flex items-center gap-3" (click)="closeMobileMenu()">
          <div class="logo-icon">
            <i class="fa-solid fa-paintbrush"></i>
          </div>
          <div class="logo-text">
            <span class="logo-title">SmartPaint</span>
            <span class="logo-badge">Visualizer</span>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="nav-links desktop-nav flex items-center gap-1">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">
            <i class="fa-solid fa-house"></i>
            <span>Home</span>
          </a>
          <a routerLink="/visualizer" routerLinkActive="active" class="nav-item">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            <span>Visualizer Studio</span>
          </a>
          <a routerLink="/compare" routerLinkActive="active" class="nav-item">
            <i class="fa-solid fa-table-columns"></i>
            <span>Before / After</span>
          </a>
          <a routerLink="/colors" routerLinkActive="active" class="nav-item">
            <i class="fa-solid fa-swatchbook"></i>
            <span>Colors & Patterns</span>
          </a>
          <a routerLink="/projects" routerLinkActive="active" class="nav-item">
            <i class="fa-solid fa-folder-open"></i>
            <span>My Designs</span>
          </a>
          <a *ngIf="authService.isAdmin" routerLink="/admin" routerLinkActive="active" class="nav-item admin-link">
            <i class="fa-solid fa-chart-line"></i>
            <span>Admin</span>
          </a>
        </nav>

        <!-- Right Side Desktop Controls & Mobile Hamburger Toggle -->
        <div class="header-actions flex items-center gap-2">
          <!-- How to Use Tutorial Button (Desktop) -->
          <button (click)="openTutorial.emit()" class="btn btn-secondary btn-sm desktop-only" title="How to use visualizer">
            <i class="fa-regular fa-circle-question"></i>
            <span>Guide</span>
          </button>

          <!-- User State (Desktop) -->
          <div class="desktop-only">
            <ng-container *ngIf="authService.currentUser() as user; else loginBtn">
              <div class="user-menu flex items-center gap-2">
                <span class="user-pill" [class.admin-pill]="user.role === 'admin'">
                  <i [class]="user.role === 'admin' ? 'fa-solid fa-shield-halved' : 'fa-solid fa-circle-user'"></i>
                  <span class="user-name">{{ user.name }}</span>
                </span>
                <button (click)="authService.logout()" class="btn btn-outline btn-sm logout-btn" title="Sign Out">
                  <i class="fa-solid fa-arrow-right-from-bracket"></i>
                </button>
              </div>
            </ng-container>

            <ng-template #loginBtn>
              <div class="flex items-center gap-2">
                <button (click)="quickLoginDemoUser()" class="btn btn-secondary btn-sm" title="Instant demo login">
                  <span>Demo User</span>
                </button>
                <button (click)="quickLoginAdmin()" class="btn btn-secondary btn-sm" title="Instant admin login">
                  <span>Admin</span>
                </button>
                <a routerLink="/auth" class="btn btn-primary btn-sm">
                  <span>Sign In</span>
                </a>
              </div>
            </ng-template>
          </div>

          <!-- Mobile Guide Icon Button -->
          <button (click)="openTutorial.emit()" class="mobile-icon-btn mobile-only" title="Visualizer Guide">
            <i class="fa-regular fa-circle-question"></i>
          </button>

          <!-- Mobile Hamburger Menu Button -->
          <button 
            (click)="toggleMobileMenu()" 
            class="mobile-hamburger mobile-only" 
            [attr.aria-expanded]="mobileMenuOpen"
            aria-label="Toggle navigation menu"
          >
            <i [class]="mobileMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'"></i>
          </button>
        </div>
      </div>
    </header>

    <!-- Mobile Slide-Down Drawer Menu Overlay -->
    <div 
      *ngIf="mobileMenuOpen" 
      class="mobile-drawer-backdrop" 
      (click)="closeMobileMenu()"
    ></div>

    <div class="mobile-drawer glass-panel" [class.open]="mobileMenuOpen">
      <div class="mobile-drawer-header flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="logo-icon-sm">
            <i class="fa-solid fa-paintbrush"></i>
          </div>
          <span class="drawer-title">Navigation Menu</span>
        </div>
        <button (click)="closeMobileMenu()" class="btn-icon-sm" aria-label="Close menu">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- User Info / Auth Card inside Drawer -->
      <div class="mobile-auth-section card">
        <ng-container *ngIf="authService.currentUser() as user; else mobileLoginSection">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="avatar-circle" [class.admin-circle]="user.role === 'admin'">
                <i [class]="user.role === 'admin' ? 'fa-solid fa-shield-halved' : 'fa-solid fa-circle-user'"></i>
              </div>
              <div>
                <span class="mobile-user-name">{{ user.name }}</span>
                <span class="mobile-user-role badge" [class.badge-warning]="user.role === 'admin'" [class.badge-primary]="user.role !== 'admin'">
                  {{ user.role === 'admin' ? 'Administrator' : 'Interior Designer' }}
                </span>
              </div>
            </div>
            <button (click)="authService.logout(); closeMobileMenu()" class="btn btn-outline btn-sm" title="Sign Out">
              <i class="fa-solid fa-arrow-right-from-bracket"></i>
              <span>Logout</span>
            </button>
          </div>
        </ng-container>

        <ng-template #mobileLoginSection>
          <div class="flex flex-col gap-2">
            <span class="text-xs text-subtle font-semibold">1-CLICK INSTANT DEMO LOGIN:</span>
            <div class="grid grid-cols-2 gap-2">
              <button (click)="quickLoginDemoUser(); closeMobileMenu()" class="btn btn-secondary btn-sm">
                <i class="fa-solid fa-user"></i>
                <span>Demo User</span>
              </button>
              <button (click)="quickLoginAdmin(); closeMobileMenu()" class="btn btn-secondary btn-sm">
                <i class="fa-solid fa-shield-halved"></i>
                <span>Demo Admin</span>
              </button>
            </div>
            <a routerLink="/auth" (click)="closeMobileMenu()" class="btn btn-primary btn-sm mt-1 w-full text-center">
              <i class="fa-solid fa-right-to-bracket"></i>
              <span>Sign In / Register</span>
            </a>
          </div>
        </ng-template>
      </div>

      <!-- Mobile Navigation Links List -->
      <nav class="mobile-nav-list flex flex-col gap-1">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="closeMobileMenu()" class="mobile-nav-item">
          <i class="fa-solid fa-house"></i>
          <span>Home Overview</span>
          <i class="fa-solid fa-chevron-right ml-auto text-xs text-subtle"></i>
        </a>

        <a routerLink="/visualizer" routerLinkActive="active" (click)="closeMobileMenu()" class="mobile-nav-item highlight-item">
          <i class="fa-solid fa-wand-magic-sparkles"></i>
          <span>Visualizer Studio Canvas</span>
          <span class="badge badge-primary ml-auto">Studio</span>
        </a>

        <a routerLink="/compare" routerLinkActive="active" (click)="closeMobileMenu()" class="mobile-nav-item">
          <i class="fa-solid fa-table-columns"></i>
          <span>Before & After Split Slider</span>
          <i class="fa-solid fa-chevron-right ml-auto text-xs text-subtle"></i>
        </a>

        <a routerLink="/colors" routerLinkActive="active" (click)="closeMobileMenu()" class="mobile-nav-item">
          <i class="fa-solid fa-swatchbook"></i>
          <span>Color & Wallpaper Library</span>
          <i class="fa-solid fa-chevron-right ml-auto text-xs text-subtle"></i>
        </a>

        <a routerLink="/projects" routerLinkActive="active" (click)="closeMobileMenu()" class="mobile-nav-item">
          <i class="fa-solid fa-folder-open"></i>
          <span>My Saved Room Designs</span>
          <i class="fa-solid fa-chevron-right ml-auto text-xs text-subtle"></i>
        </a>

        <a *ngIf="authService.isAdmin" routerLink="/admin" routerLinkActive="active" (click)="closeMobileMenu()" class="mobile-nav-item admin-item">
          <i class="fa-solid fa-chart-line"></i>
          <span>Admin Analytics & Management</span>
          <span class="badge badge-warning ml-auto">Admin</span>
        </a>
      </nav>

      <!-- Bottom Guide Action -->
      <div class="mobile-drawer-footer pt-3 mt-auto">
        <button (click)="openTutorial.emit(); closeMobileMenu()" class="btn btn-secondary w-full">
          <i class="fa-regular fa-circle-question"></i>
          <span>Visualizer User Guide & Tutorial</span>
        </button>
      </div>
    </div>

    <!-- Smartphone Native-Style Bottom Navigation Bar -->
    <nav class="mobile-bottom-nav glass-panel mobile-only" aria-label="Mobile Navigation">
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="bottom-nav-tab">
        <i class="fa-solid fa-house"></i>
        <span>Home</span>
      </a>
      <a routerLink="/visualizer" routerLinkActive="active" class="bottom-nav-tab highlight-tab">
        <div class="tab-icon-wrap">
          <i class="fa-solid fa-wand-magic-sparkles"></i>
        </div>
        <span>Studio</span>
      </a>
      <a routerLink="/compare" routerLinkActive="active" class="bottom-nav-tab">
        <i class="fa-solid fa-table-columns"></i>
        <span>Compare</span>
      </a>
      <a routerLink="/colors" routerLinkActive="active" class="bottom-nav-tab">
        <i class="fa-solid fa-swatchbook"></i>
        <span>Colors</span>
      </a>
      <a routerLink="/projects" routerLinkActive="active" class="bottom-nav-tab">
        <i class="fa-solid fa-folder-open"></i>
        <span>Designs</span>
      </a>
    </nav>
  `,
  styles: [`
    .site-header {
      position: sticky;
      top: 0;
      z-index: 100;
      border-radius: 0;
      border-top: none;
      border-left: none;
      border-right: none;
      padding: 0.75rem 0;
      background: var(--bg-glass);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }
    .brand-logo {
      text-decoration: none;
    }
    .logo-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      background: var(--accent-gradient);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      font-size: 1.25rem;
      box-shadow: 0 4px 12px var(--accent-glow);
      flex-shrink: 0;
    }
    .logo-icon-sm {
      width: 28px;
      height: 28px;
      border-radius: var(--radius-sm);
      background: var(--accent-gradient);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      font-size: 0.9rem;
    }
    .logo-text {
      display: flex;
      align-items: baseline;
      gap: 0.35rem;
    }
    .logo-title {
      font-family: var(--font-heading);
      font-size: 1.35rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      background: linear-gradient(135deg, #FFFFFF, #CBD5E1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .logo-badge {
      font-size: 0.72rem;
      font-weight: 700;
      color: #38BDF8;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .nav-links {
      background: rgba(15, 23, 42, 0.5);
      padding: 0.3rem 0.5rem;
      border-radius: var(--radius-full);
      border: 1px solid var(--border-subtle);
    }
    .nav-item {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.45rem 0.9rem;
      font-size: 0.88rem;
      font-weight: 500;
      color: var(--text-muted);
      border-radius: var(--radius-full);
      transition: all var(--transition-fast);
      white-space: nowrap;
    }
    .nav-item:hover {
      color: var(--text-main);
      background: rgba(255, 255, 255, 0.06);
    }
    .nav-item.active {
      color: #FFFFFF;
      background: var(--accent-primary);
      box-shadow: 0 2px 10px rgba(99, 102, 241, 0.4);
    }
    .admin-link.active {
      background: linear-gradient(135deg, #EC4899, #8B5CF6);
    }
    .user-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      padding: 0.4rem 0.8rem;
      border-radius: var(--radius-full);
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-main);
    }
    .user-pill.admin-pill {
      border-color: rgba(236, 72, 153, 0.4);
      background: rgba(236, 72, 153, 0.1);
      color: #F472B6;
    }
    .logout-btn {
      padding: 0.45rem 0.65rem;
    }
    .mobile-hamburger, .mobile-icon-btn {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-main);
      font-size: 1.15rem;
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .mobile-hamburger:hover, .mobile-icon-btn:hover {
      background: var(--bg-card-hover);
      border-color: var(--border-highlight);
    }

    /* Mobile Drawer */
    .mobile-drawer-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(4px);
      z-index: 150;
      animation: fadeIn 0.25s ease forwards;
    }
    .mobile-drawer {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 86%;
      max-width: 360px;
      background: var(--bg-surface);
      border-left: 1px solid var(--border-highlight);
      z-index: 160;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      overflow-y: auto;
      transform: translateX(100%);
      transition: transform var(--transition-smooth);
      box-shadow: var(--shadow-lg);
    }
    .mobile-drawer.open {
      transform: translateX(0);
    }
    .drawer-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-main);
    }
    .btn-icon-sm {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
    }
    .mobile-auth-section {
      padding: 0.85rem;
      background: var(--bg-card);
    }
    .avatar-circle {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(99, 102, 241, 0.2);
      color: #818CF8;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
    }
    .avatar-circle.admin-circle {
      background: rgba(236, 72, 153, 0.2);
      color: #F472B6;
    }
    .mobile-user-name {
      display: block;
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--text-main);
    }
    .mobile-user-role {
      font-size: 0.65rem;
      padding: 0.15rem 0.45rem;
    }
    .mobile-nav-list {
      margin-top: 0.25rem;
    }
    .mobile-nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-md);
      font-size: 0.92rem;
      font-weight: 600;
      color: var(--text-muted);
      background: transparent;
      border: 1px solid transparent;
      transition: all var(--transition-fast);
    }
    .mobile-nav-item:hover {
      color: var(--text-main);
      background: var(--bg-card);
    }
    .mobile-nav-item.active {
      color: #FFFFFF;
      background: rgba(99, 102, 241, 0.18);
      border-color: rgba(99, 102, 241, 0.4);
    }
    .mobile-nav-item.highlight-item.active {
      background: var(--accent-gradient);
      border-color: transparent;
      box-shadow: 0 4px 12px var(--accent-glow);
    }
    .grid { display: grid; }
    .grid-cols-2 { grid-template-columns: 1fr 1fr; }
    .ml-auto { margin-left: auto; }
    .w-full { width: 100%; }

    /* Mobile Bottom Navigation Bar */
    .mobile-bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: calc(60px + var(--safe-bottom));
      padding-bottom: var(--safe-bottom);
      background: rgba(16, 22, 35, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-top: 1px solid var(--border-highlight);
      border-radius: 0;
      display: flex;
      align-items: center;
      justify-content: space-around;
      z-index: 99;
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.4);
    }
    .bottom-nav-tab {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.2rem;
      height: 100%;
      color: var(--text-subtle);
      font-size: 0.68rem;
      font-weight: 600;
      transition: all var(--transition-fast);
      text-decoration: none;
    }
    .bottom-nav-tab i {
      font-size: 1.15rem;
      transition: transform var(--transition-fast);
    }
    .bottom-nav-tab.active {
      color: #38BDF8;
    }
    .bottom-nav-tab.active i {
      transform: translateY(-2px);
      color: #38BDF8;
      text-shadow: 0 0 10px rgba(56, 189, 248, 0.5);
    }
    .bottom-nav-tab.highlight-tab.active {
      color: #818CF8;
    }
    .bottom-nav-tab.highlight-tab.active i {
      color: #818CF8;
      text-shadow: 0 0 10px rgba(99, 102, 241, 0.6);
    }

    /* Responsive Breakpoints */
    @media (min-width: 901px) {
      .mobile-only {
        display: none !important;
      }
    }
    @media (max-width: 900px) {
      .desktop-nav, .desktop-only {
        display: none !important;
      }
      .mobile-only {
        display: flex !important;
      }
      .logo-title {
        font-size: 1.2rem;
      }
      .logo-icon {
        width: 34px;
        height: 34px;
        font-size: 1.05rem;
      }
    }
  `]
})
export class NavbarComponent {
  openTutorial = output<void>();
  mobileMenuOpen = false;

  constructor(public authService: AuthService) {}

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  quickLoginDemoUser() {
    this.authService.loginDemoUser().subscribe();
  }

  quickLoginAdmin() {
    this.authService.loginDemoAdmin().subscribe();
  }
}
