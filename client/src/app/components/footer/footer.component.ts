import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <!-- Brand Column -->
          <div class="footer-brand">
            <div class="flex items-center gap-3 mb-3">
              <div class="logo-icon-sm">
                <i class="fa-solid fa-paintbrush"></i>
              </div>
              <span class="brand-title">SmartPaint Visualizer</span>
            </div>
            <p class="brand-desc">
              Next-generation interior room paint and design preview platform. Transforming real-world room photos with authentic lighting-preserved paint shades, wallpaper textures, and dual-tone walls.
            </p>
            <div class="tech-stack flex items-center gap-2 mt-3 flex-wrap">
              <span class="badge badge-primary">Angular 20</span>
              <span class="badge badge-success">Node & Express</span>
              <span class="badge badge-warning">MongoDB</span>
              <span class="badge badge-neutral">HTML5 Canvas</span>
            </div>
          </div>

          <!-- Quick Navigation -->
          <div class="footer-links">
            <h4 class="footer-heading">Studio Features</h4>
            <ul>
              <li><a routerLink="/visualizer">Visualizer Canvas</a></li>
              <li><a routerLink="/compare">Before & After Slider</a></li>
              <li><a routerLink="/colors">60+ Curated Paint Shades</a></li>
              <li><a routerLink="/colors">Wallpaper Textures</a></li>
              <li><a routerLink="/projects">Saved Room Projects</a></li>
            </ul>
          </div>

          <!-- Color Brands & Disclaimer -->
          <div class="footer-disclaimer">
            <h4 class="footer-heading">Color Standards</h4>
            <p class="disclaimer-text">
              Color collections inspired by leading international paint systems including Behr®, Asian Paints®, and Dulux®. Simulated results account for lighting and wall depth.
            </p>
            <div class="brand-tags flex items-center gap-2 mt-3 flex-wrap">
              <span class="brand-chip">Behr Reference</span>
              <span class="brand-chip">Asian Paints</span>
              <span class="brand-chip">Dulux Color</span>
              <span class="brand-chip">Unified Mentor</span>
            </div>
          </div>
        </div>

        <div class="footer-bottom flex items-center justify-between mt-6 pt-5">
          <p class="copyright">
            © 2026 Smart Wall Paint Visualizer. MEAN Stack Virtual Room Paint & Design Preview.
          </p>
          <div class="footer-bottom-links flex items-center gap-3">
            <a routerLink="/admin" class="footer-bottom-link">Admin</a>
            <span class="text-subtle">•</span>
            <a routerLink="/auth" class="footer-bottom-link">Account</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer {
      background: var(--bg-surface);
      border-top: 1px solid var(--border-subtle);
      padding: 3.5rem 0 2rem;
      margin-top: 4rem;
    }
    .footer-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1.3fr;
      gap: 2.5rem;
    }
    .logo-icon-sm {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-sm);
      background: var(--accent-gradient);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      font-size: 1rem;
      flex-shrink: 0;
    }
    .brand-title {
      font-family: var(--font-heading);
      font-size: 1.25rem;
      font-weight: 700;
    }
    .brand-desc {
      font-size: 0.88rem;
      color: var(--text-muted);
      line-height: 1.6;
    }
    .footer-heading {
      font-size: 0.95rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: var(--text-main);
    }
    .footer-links ul {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }
    .footer-links a {
      font-size: 0.88rem;
      color: var(--text-muted);
      transition: color var(--transition-fast);
    }
    .footer-links a:hover {
      color: var(--accent-secondary);
    }
    .disclaimer-text {
      font-size: 0.82rem;
      color: var(--text-muted);
      line-height: 1.55;
    }
    .brand-chip {
      font-size: 0.72rem;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      padding: 0.2rem 0.5rem;
      border-radius: var(--radius-sm);
      color: var(--text-subtle);
    }
    .footer-bottom {
      border-top: 1px solid var(--border-subtle);
    }
    .copyright {
      font-size: 0.8rem;
      color: var(--text-subtle);
    }
    .footer-bottom-link {
      font-size: 0.82rem;
      color: var(--text-muted);
      transition: color var(--transition-fast);
    }
    .footer-bottom-link:hover {
      color: var(--text-main);
    }
    @media (max-width: 900px) {
      .site-footer {
        padding: 2.5rem 0 calc(2rem + var(--safe-bottom));
        margin-top: 2.5rem;
      }
      .footer-grid {
        grid-template-columns: 1fr;
        gap: 1.75rem;
      }
      .footer-bottom {
        flex-direction: column;
        gap: 0.75rem;
        text-align: center;
      }
    }
  `]
})
export class FooterComponent {}
