import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-page flex items-center justify-center">
      <div class="auth-card card glass-panel">
        
        <!-- Header -->
        <div class="auth-header text-center mb-5">
          <div class="auth-logo">
            <i class="fa-solid fa-paintbrush"></i>
          </div>
          <h2 class="auth-title mt-2">{{ isRegister ? 'Create Account' : 'Welcome Back' }}</h2>
          <p class="auth-subtitle">Save custom room mockups, manage palettes, and access high-res exports.</p>
        </div>

        <!-- Quick 1-Click Demo Buttons -->
        <div class="demo-box card mb-5">
          <span class="demo-title">⚡ 1-Click Instant Demo Login:</span>
          <div class="flex items-center gap-2 mt-2 flex-wrap">
            <button (click)="quickLoginUser()" class="btn btn-secondary btn-sm flex-1">
              <i class="fa-solid fa-user"></i>
              <span>Demo User</span>
            </button>
            <button (click)="quickLoginAdmin()" class="btn btn-secondary btn-sm flex-1">
              <i class="fa-solid fa-shield-halved"></i>
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

        <!-- Tab Switcher -->
        <div class="auth-tabs flex items-center mb-4">
          <button 
            (click)="isRegister = false; errorMsg = ''" 
            class="tab-btn" 
            [class.active]="!isRegister"
          >
            Sign In
          </button>
          <button 
            (click)="isRegister = true; errorMsg = ''" 
            class="tab-btn" 
            [class.active]="isRegister"
          >
            Register
          </button>
        </div>

        <!-- Form -->
        <form (ngSubmit)="submitAuth()" class="auth-form flex flex-col gap-3">
          <div *ngIf="isRegister" class="form-group">
            <label class="form-label">Full Name</label>
            <input [(ngModel)]="name" name="name" required placeholder="John Doe" class="form-input">
          </div>

          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input [(ngModel)]="email" name="email" type="email" required placeholder="name@example.com" class="form-input">
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input [(ngModel)]="password" name="password" type="password" required placeholder="••••••••" class="form-input">
          </div>

          <div *ngIf="isRegister" class="form-group">
            <label class="form-label">Account Role</label>
            <select [(ngModel)]="role" name="role" class="form-select">
              <option value="user">Regular User / Designer</option>
              <option value="admin">Platform Administrator</option>
            </select>
          </div>

          <div *ngIf="errorMsg" class="error-banner animate-fade">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <span>{{ errorMsg }}</span>
          </div>

          <button type="submit" [disabled]="isLoading" class="btn btn-primary btn-lg mt-2 w-full">
            <i *ngIf="isLoading" class="fa-solid fa-spinner fa-spin"></i>
            <span>{{ isRegister ? 'Create Account' : 'Sign In' }}</span>
          </button>
        </form>

      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: calc(100vh - 200px);
      padding: 2.5rem 1rem 4rem;
    }
    .auth-card {
      width: 100%;
      max-width: 440px;
      padding: 2rem;
      box-shadow: var(--shadow-lg);
    }
    .auth-logo {
      width: 46px;
      height: 46px;
      border-radius: var(--radius-md);
      background: var(--accent-gradient);
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      margin: 0 auto;
    }
    .auth-title {
      font-size: 1.5rem;
      font-weight: 800;
    }
    .auth-subtitle {
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    .demo-box {
      background: rgba(15, 23, 42, 0.5);
      border: 1px dashed var(--accent-primary);
      padding: 0.85rem;
    }
    .demo-title {
      font-size: 0.78rem;
      font-weight: 600;
      color: #818CF8;
    }
    .auth-tabs {
      background: var(--bg-card);
      border-radius: var(--radius-md);
      padding: 0.25rem;
      border: 1px solid var(--border-subtle);
    }
    .tab-btn {
      flex: 1;
      padding: 0.45rem;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-muted);
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
      text-align: center;
    }
    .tab-btn.active {
      background: var(--accent-primary);
      color: #FFFFFF;
    }
    .error-banner {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.35);
      color: #EF4444;
      padding: 0.6rem 0.85rem;
      border-radius: var(--radius-md);
      font-size: 0.82rem;
      display: flex;
      align-items: center;
      gap: 0.45rem;
    }
    .w-full { width: 100%; }

    @media (max-width: 480px) {
      .auth-card { padding: 1.5rem 1rem; }
      .auth-title { font-size: 1.35rem; }
    }
  `]
})
export class AuthComponent {
  isRegister = false;
  name = '';
  email = '';
  password = '';
  role = 'user';
  errorMsg = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  quickLoginUser() {
    this.authService.loginDemoUser().subscribe({
      next: () => this.router.navigate(['/visualizer']),
      error: () => (this.errorMsg = 'Could not login as demo user')
    });
  }

  quickLoginAdmin() {
    this.authService.loginDemoAdmin().subscribe({
      next: () => this.router.navigate(['/admin']),
      error: () => (this.errorMsg = 'Could not login as admin')
    });
  }

  submitAuth() {
    this.errorMsg = '';
    this.isLoading = true;

    if (this.isRegister) {
      this.authService.register({
        name: this.name,
        email: this.email,
        password: this.password,
        role: this.role
      }).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/visualizer']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMsg = err.error?.message || 'Registration failed';
        }
      });
    } else {
      this.authService.login({
        email: this.email,
        password: this.password
      }).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/visualizer']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMsg = err.error?.message || 'Invalid email or password';
        }
      });
    }
  }
}
