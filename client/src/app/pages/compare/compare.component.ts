import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CanvasService } from '../../services/canvas.service';

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="compare-page container">
      <!-- Top Header -->
      <div class="compare-header flex items-center justify-between mb-4">
        <div class="header-left">
          <span class="badge badge-primary">Comparison Mode</span>
          <h1 class="compare-title mt-1">{{ projectTitle }}</h1>
          <p class="compare-subtitle">Drag the interactive slider or switch views to inspect the virtual paint transformation.</p>
        </div>

        <div class="header-actions-bar flex items-center gap-2 flex-wrap">
          <!-- View Mode Toggle -->
          <div class="toggle-group flex items-center">
            <button 
              (click)="viewMode = 'slider'" 
              class="toggle-btn" 
              [class.active]="viewMode === 'slider'"
            >
              <i class="fa-solid fa-arrows-left-right"></i>
              <span>Split Slider</span>
            </button>
            <button 
              (click)="viewMode = 'side-by-side'" 
              class="toggle-btn" 
              [class.active]="viewMode === 'side-by-side'"
            >
              <i class="fa-solid fa-table-columns"></i>
              <span>Side-by-Side</span>
            </button>
          </div>

          <button (click)="downloadComparison()" class="btn btn-secondary btn-sm" title="Download side-by-side image">
            <i class="fa-solid fa-download"></i>
            <span>Export</span>
          </button>

          <a routerLink="/visualizer" class="btn btn-primary btn-sm">
            <i class="fa-solid fa-paintbrush"></i>
            <span>Studio</span>
          </a>
        </div>
      </div>

      <!-- VIEW 1: Split Slider -->
      <div *ngIf="viewMode === 'slider'" class="split-slider-card card">
        <div 
          class="slider-viewport" 
          #viewportRef 
          (mousemove)="onMouseMove($event)"
          (touchstart)="onTouchStart($event)"
          (touchmove)="onTouchMove($event)"
          (mousedown)="isDragging = true"
          (mouseup)="isDragging = false"
        >
          <!-- Canvas Container: Base Original Room -->
          <canvas #originalCanvas class="base-canvas" width="1000" height="600"></canvas>

          <!-- Painted Canvas with Clip Path controlled by slider percentage -->
          <div class="painted-overlay" [style.clip-path]="'inset(0 0 0 ' + sliderPos + '%)'">
            <canvas #paintedCanvas class="overlay-canvas" width="1000" height="600"></canvas>
          </div>

          <!-- Draggable Divider Line & Knob -->
          <div class="divider-line" [style.left.%]="sliderPos">
            <div class="divider-knob">
              <i class="fa-solid fa-arrows-left-right"></i>
            </div>
          </div>

          <!-- Labels -->
          <div class="badge-label badge-before">
            <span>ORIGINAL</span>
          </div>
          <div class="badge-label badge-after">
            <span>VIRTUAL PAINT</span>
          </div>
        </div>

        <div class="slider-hint text-center mt-3">
          <span class="text-subtle text-xs">
            <i class="fa-solid fa-arrows-left-right"></i> Drag the divider handle or swipe horizontally to reveal Before / After
          </span>
        </div>
      </div>

      <!-- VIEW 2: Side-by-Side -->
      <div *ngIf="viewMode === 'side-by-side'" class="side-by-side-grid">
        <div class="card compare-box">
          <div class="box-header flex items-center justify-between mb-2">
            <span class="badge badge-neutral">Before Paint</span>
            <span class="text-xs text-subtle">Natural Room Lighting</span>
          </div>
          <canvas #sideOriginalCanvas class="side-canvas" width="600" height="400"></canvas>
        </div>

        <div class="card compare-box">
          <div class="box-header flex items-center justify-between mb-2">
            <span class="badge badge-success">After Paint</span>
            <span class="text-xs text-subtle">Virtual Shade Blending</span>
          </div>
          <canvas #sidePaintedCanvas class="side-canvas" width="600" height="400"></canvas>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .compare-page {
      padding: 1.5rem 1.5rem 4rem;
    }
    .compare-title {
      font-size: 2rem;
      font-weight: 800;
    }
    .compare-subtitle {
      font-size: 0.92rem;
      color: var(--text-muted);
    }
    .toggle-group {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 0.25rem;
    }
    .toggle-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.4rem 0.75rem;
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-muted);
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
      white-space: nowrap;
    }
    .toggle-btn.active {
      background: var(--accent-primary);
      color: #FFFFFF;
    }
    .split-slider-card {
      padding: 0.75rem;
    }
    .slider-viewport {
      position: relative;
      width: 100%;
      height: 560px;
      border-radius: var(--radius-md);
      overflow: hidden;
      cursor: ew-resize;
      background: #000000;
      user-select: none;
      touch-action: none;
    }
    .base-canvas, .overlay-canvas {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
      touch-action: none;
    }
    .painted-overlay {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
    .divider-line {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 3px;
      background: #FFFFFF;
      box-shadow: 0 0 12px rgba(0, 0, 0, 0.75);
      pointer-events: none;
      transform: translateX(-50%);
    }
    .divider-knob {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #FFFFFF;
      color: #0F172A;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5);
    }
    .badge-label {
      position: absolute;
      top: 1rem;
      padding: 0.35rem 0.75rem;
      border-radius: var(--radius-full);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      pointer-events: none;
      backdrop-filter: blur(8px);
    }
    .badge-before {
      left: 1rem;
      background: rgba(15, 23, 42, 0.85);
      color: #94A3B8;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .badge-after {
      right: 1rem;
      background: rgba(16, 185, 129, 0.85);
      color: #FFFFFF;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .side-by-side-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
    }
    .compare-box {
      padding: 0.85rem;
    }
    .side-canvas {
      width: 100%;
      height: auto;
      border-radius: var(--radius-sm);
      display: block;
    }

    @media (max-width: 900px) {
      .compare-page { padding: 1rem 0.75rem 3rem; }
      .compare-header { flex-direction: column; align-items: stretch; gap: 0.85rem; }
      .header-actions-bar { justify-content: space-between; }
      .header-actions-bar .toggle-group { flex: 1; justify-content: space-around; }
      .side-by-side-grid { grid-template-columns: 1fr; }
      .slider-viewport { height: 350px; }
      .compare-title { font-size: 1.5rem; }
    }
    @media (max-width: 480px) {
      .slider-viewport { height: 290px; }
      .divider-knob { width: 38px; height: 38px; font-size: 0.95rem; }
      .badge-label { font-size: 0.65rem; padding: 0.25rem 0.5rem; }
    }
  `]
})
export class CompareComponent implements OnInit, AfterViewInit {
  @ViewChild('originalCanvas') originalCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('paintedCanvas') paintedCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('viewportRef') viewportRef!: ElementRef<HTMLDivElement>;

  @ViewChild('sideOriginalCanvas') sideOriginalCanvasRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('sidePaintedCanvas') sidePaintedCanvasRef?: ElementRef<HTMLCanvasElement>;

  projectTitle = 'Living Room Transformation';
  roomType = 'Living Room';
  sliderPos = 50;
  isDragging = false;
  viewMode: 'slider' | 'side-by-side' = 'slider';

  constructor(
    private canvasService: CanvasService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const storedTitle = localStorage.getItem('compare_title');
    if (storedTitle) this.projectTitle = storedTitle;

    this.route.queryParams.subscribe(params => {
      if (params['roomType']) this.roomType = params['roomType'];
    });
  }

  ngAfterViewInit() {
    this.renderCanvases();
  }

  renderCanvases() {
    const orig = this.originalCanvasRef?.nativeElement;
    const painted = this.paintedCanvasRef?.nativeElement;
    if (!orig || !painted) return;

    const ctxOrig = orig.getContext('2d');
    const ctxPainted = painted.getContext('2d');
    if (!ctxOrig || !ctxPainted) return;

    // 1. Draw Original Room
    this.canvasService.drawSampleRoom(ctxOrig, orig.width, orig.height, this.roomType);

    // 2. Draw Painted Room
    const storedPaintedData = localStorage.getItem('compare_painted');
    if (storedPaintedData) {
      const img = new Image();
      img.onload = () => {
        ctxPainted.drawImage(img, 0, 0, painted.width, painted.height);
      };
      img.src = storedPaintedData;
    } else {
      this.canvasService.drawSampleRoom(ctxPainted, painted.width, painted.height, this.roomType);
      const wallLayer = {
        name: 'Accent Wall',
        polygon: [
          { x: 0.15, y: 0.15 },
          { x: 0.85, y: 0.15 },
          { x: 0.85, y: 0.72 },
          { x: 0.15, y: 0.72 }
        ],
        color: { code: 'BL-201', name: 'Pacific Navy', hex: '#1E3A5F' },
        finish: 'matte' as const,
        opacity: 0.86
      };
      this.canvasService.applyWallColor(ctxPainted, wallLayer, painted.width, painted.height);
    }
  }

  onMouseMove(event: MouseEvent) {
    this.updateSlider(event.clientX);
  }

  onTouchStart(event: TouchEvent) {
    if (event.cancelable) event.preventDefault();
    if (event.touches.length > 0) {
      this.updateSlider(event.touches[0].clientX);
    }
  }

  onTouchMove(event: TouchEvent) {
    if (event.cancelable) event.preventDefault();
    if (event.touches.length > 0) {
      this.updateSlider(event.touches[0].clientX);
    }
  }

  private updateSlider(clientX: number) {
    const vp = this.viewportRef.nativeElement;
    const rect = vp.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    this.sliderPos = pct;
  }

  downloadComparison() {
    const orig = this.originalCanvasRef.nativeElement;
    const painted = this.paintedCanvasRef.nativeElement;

    const compCanvas = document.createElement('canvas');
    compCanvas.width = 1200;
    compCanvas.height = 450;
    const ctx = compCanvas.getContext('2d');
    if (!ctx) return;

    // Draw Left (Before)
    ctx.drawImage(orig, 0, 0, 595, 450);
    // Draw Right (After)
    ctx.drawImage(painted, 605, 0, 595, 450);

    // Separator line
    ctx.fillStyle = '#6366F1';
    ctx.fillRect(596, 0, 8, 450);

    const link = document.createElement('a');
    link.download = `${this.projectTitle.replace(/\s+/g, '_')}_before_after_comparison.png`;
    link.href = compCanvas.toDataURL('image/png');
    link.click();
  }
}
