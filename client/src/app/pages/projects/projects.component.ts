import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { RoomProject } from '../../models/project.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="projects-page container">
      <!-- Top Title Bar -->
      <div class="page-header flex items-center justify-between mb-5">
        <div>
          <span class="badge badge-primary">Design Portfolio</span>
          <h1 class="page-title mt-1">My Saved Room Designs</h1>
          <p class="page-subtitle">Revisit your saved color trials, download painter plans, or continue editing in studio.</p>
        </div>

        <a routerLink="/visualizer" class="btn btn-primary new-btn">
          <i class="fa-solid fa-plus"></i>
          <span>New Room Design</span>
        </a>
      </div>

      <!-- Guest Prompt -->
      <div *ngIf="!authService.isLoggedIn" class="guest-card card text-center mb-6">
        <div class="guest-icon">
          <i class="fa-solid fa-lock"></i>
        </div>
        <h3 class="text-xl font-bold mb-2">Sign In to Access Your Saved Designs</h3>
        <p class="text-muted mb-4">Saved designs are securely associated with your user account.</p>
        <div class="flex items-center justify-center gap-3 flex-wrap">
          <button (click)="loginDemoUser()" class="btn btn-primary">
            <span>Instant Demo Login</span>
          </button>
          <a routerLink="/auth" class="btn btn-secondary">
            <span>Sign In / Register</span>
          </a>
        </div>
      </div>

      <!-- Logged In Content -->
      <div *ngIf="authService.isLoggedIn">
        <!-- Projects Grid -->
        <div *ngIf="projects.length > 0; else emptyState" class="projects-grid">
          <div *ngFor="let proj of projects" class="project-card card">
            <!-- Thumbnail Preview -->
            <div class="project-preview">
              <img 
                [src]="proj.previewImage || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600'" 
                alt="{{ proj.title }}" 
                class="preview-img"
              >
              <span class="room-type-tag">{{ proj.roomType }}</span>
            </div>

            <!-- Card Details -->
            <div class="project-info">
              <h3 class="project-title">{{ proj.title }}</h3>
              <span class="project-date">{{ formatDate(proj.updatedAt || proj.createdAt) }}</span>

              <!-- Applied Wall Swatches -->
              <div class="wall-swatches flex items-center gap-2 mt-3">
                <span *ngFor="let w of proj.walls" class="swatch-dot" [style.background-color]="w.color?.hex || '#6366F1'" [title]="w.name + ': ' + (w.color?.name || '')"></span>
                <span class="text-xs text-subtle">{{ proj.walls.length }} painted zone(s)</span>
              </div>

              <!-- Actions -->
              <div class="project-actions flex items-center justify-between mt-4 pt-3">
                <button (click)="openInStudio(proj)" class="btn btn-secondary btn-sm flex-1 mr-2">
                  <i class="fa-solid fa-paintbrush"></i>
                  <span>Edit in Studio</span>
                </button>
                <button (click)="downloadDesign(proj)" class="btn-icon" title="Download image">
                  <i class="fa-solid fa-download"></i>
                </button>
                <button (click)="deleteProject(proj)" class="btn-icon text-danger" title="Delete project">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <ng-template #emptyState>
          <div class="empty-state card text-center">
            <div class="empty-icon">
              <i class="fa-regular fa-folder-open"></i>
            </div>
            <h3 class="text-xl font-bold mb-2">No Room Designs Saved Yet</h3>
            <p class="text-muted mb-4">Start creating virtual paint mockups for your living room, bedroom, or dining area.</p>
            <a routerLink="/visualizer" class="btn btn-primary">
              <i class="fa-solid fa-wand-magic-sparkles"></i>
              <span>Launch Visualizer Studio</span>
            </a>
          </div>
        </ng-template>
      </div>

      <!-- Feedback Toast -->
      <div *ngIf="toastMsg" class="toast-feedback animate-fade">
        <i class="fa-solid fa-check"></i>
        <span>{{ toastMsg }}</span>
      </div>
    </div>
  `,
  styles: [`
    .projects-page {
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
    .guest-card {
      padding: 2.5rem 1.5rem;
    }
    .guest-icon {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: rgba(99, 102, 241, 0.15);
      color: #818CF8;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      margin: 0 auto 1rem;
    }
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }
    .project-card {
      padding: 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .project-preview {
      height: 190px;
      position: relative;
      background: #000;
      overflow: hidden;
    }
    .preview-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .room-type-tag {
      position: absolute;
      top: 0.65rem;
      left: 0.65rem;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(6px);
      padding: 0.2rem 0.6rem;
      border-radius: var(--radius-full);
      font-size: 0.72rem;
      font-weight: 600;
      color: #38BDF8;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .project-info {
      padding: 1.15rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .project-title {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 0.2rem;
    }
    .project-date {
      font-size: 0.75rem;
      color: var(--text-subtle);
    }
    .swatch-dot {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 1.5px solid #FFFFFF;
      flex-shrink: 0;
    }
    .project-actions {
      border-top: 1px solid var(--border-subtle);
    }
    .btn-icon {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      transition: all var(--transition-fast);
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      margin-left: 0.35rem;
    }
    .btn-icon:hover {
      color: var(--text-main);
      background: rgba(255, 255, 255, 0.08);
    }
    .empty-state {
      padding: 3rem 1.5rem;
    }
    .empty-icon {
      font-size: 2.8rem;
      color: var(--text-subtle);
      margin-bottom: 0.85rem;
    }
    .toast-feedback {
      position: fixed;
      bottom: calc(75px + var(--safe-bottom));
      right: 1.5rem;
      background: #10B981;
      color: #FFFFFF;
      padding: 0.65rem 1.25rem;
      border-radius: var(--radius-full);
      font-size: 0.88rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.45rem;
      box-shadow: var(--shadow-lg);
      z-index: 999;
    }

    @media (max-width: 1024px) {
      .projects-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
    }
    @media (max-width: 768px) {
      .page-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
      .new-btn { width: 100%; }
      .projects-grid { grid-template-columns: 1fr; }
      .projects-page { padding: 1rem 0.75rem 4rem; }
      .page-title { font-size: 1.6rem; }
      .toast-feedback { right: 1rem; left: 1rem; justify-content: center; }
    }
  `]
})
export class ProjectsComponent implements OnInit {
  projects: RoomProject[] = [];
  toastMsg = '';

  constructor(
    public authService: AuthService,
    private projectService: ProjectService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn) {
      this.loadProjects();
    }
  }

  loadProjects() {
    this.projectService.getUserProjects().subscribe({
      next: (projs: RoomProject[]) => (this.projects = projs),
      error: () => {}
    });
  }

  loginDemoUser() {
    this.authService.loginDemoUser().subscribe({
      next: () => this.loadProjects()
    });
  }

  openInStudio(proj: RoomProject) {
    if (proj.originalImage && proj.originalImage !== 'custom_upload') {
      this.router.navigate(['/visualizer'], { queryParams: { sampleId: proj.originalImage } });
    } else {
      this.router.navigate(['/visualizer']);
    }
  }

  downloadDesign(proj: RoomProject) {
    if (proj.previewImage) {
      const link = document.createElement('a');
      link.download = `${proj.title.replace(/\s+/g, '_')}_design.jpg`;
      link.href = proj.previewImage;
      link.click();
      this.showToast('Downloaded room design preview!');
    }
  }

  deleteProject(proj: RoomProject) {
    if (!proj._id) return;
    const projId = proj._id;
    if (confirm(`Delete design "${proj.title}"?`)) {
      this.projectService.deleteProject(projId).subscribe({
        next: () => {
          this.projects = this.projects.filter(p => p._id !== projId);
          this.showToast('Design deleted');
        },
        error: () => this.showToast('Could not delete design')
      });
    }
  }


  formatDate(d?: string) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  showToast(msg: string) {
    this.toastMsg = msg;
    setTimeout(() => {
      if (this.toastMsg === msg) this.toastMsg = '';
    }, 3000);
  }
}
