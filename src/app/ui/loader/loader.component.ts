import { Component, ChangeDetectionStrategy, inject, signal, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../core/i18n.service';
import { AudioService } from '../../core/audio.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div 
      class="loader-container" 
      [class.loader-hidden]="isLoaded()"
      role="status"
      aria-live="polite"
    >
      <div class="loader-backdrop">
        <div class="glow-orb glow-orb-1"></div>
        <div class="glow-orb glow-orb-2"></div>
      </div>

      <div class="loader-content">
        <!-- Stylized Boarding Pass Header -->
        <div class="boarding-header">
          <div class="passport-badge">
            <span class="pulse-dot"></span>
            <span>ASYUT // MOON-FLIGHT-01</span>
          </div>
          <div class="telemetry-stamp">27.18°N 31.18°E</div>
        </div>

        <!-- Center Spacecraft Ring Graphic -->
        <div class="emblem-wrapper">
          <svg class="ring-svg" viewBox="0 0 200 200">
            <circle class="ring-bg" cx="100" cy="100" r="88" />
            <circle 
              class="ring-progress" 
              cx="100" 
              cy="100" 
              r="88" 
              [style.strokeDashoffset]="ringOffset()"
            />
          </svg>
          <div class="rocket-icon">
            <svg viewBox="0 0 48 48" fill="none" class="rocket-svg">
              <path d="M24 4C24 4 15 15 15 29C15 36 19 40 24 42C29 40 33 36 33 29C33 15 24 4 24 4Z" fill="#F9F5EC"/>
              <path d="M24 16C26.2 16 28 14.2 28 12C28 9.8 26.2 8 24 8C21.8 8 20 9.8 20 12C20 14.2 21.8 16 24 16Z" fill="#2A71D6"/>
              <path d="M15 28L8 35V39L15 37V28Z" fill="#70B1ED"/>
              <path d="M33 28L40 35V39L33 37V28Z" fill="#70B1ED"/>
              <path d="M21 42L24 46L27 42H21Z" fill="#F27636"/>
            </svg>
          </div>
        </div>

        <!-- Loading Text and Percentage -->
        <div class="text-block">
          <h1 class="loader-title">{{ i18n.currentTranslations().loading }}</h1>
          <p class="loader-subtitle">{{ i18n.currentTranslations().loadingSub }}</p>
        </div>

        <!-- Progress Bar and Telemetry Readout -->
        <div class="progress-section">
          <div class="bar-outer">
            <div class="bar-inner" [style.width.%]="progress()"></div>
          </div>
          <div class="telemetry-row">
            <span class="telemetry-label">SYS_INIT // CHECKOUT</span>
            <span class="telemetry-value">{{ progress() }}%</span>
          </div>
        </div>

        @if (progress() === 100) {
          <button class="btn-cinema enter-btn" (click)="dismiss()">
            <span>{{ i18n.currentTranslations().readyToLaunch }}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    .loader-container {
      position: fixed;
      inset: 0;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--bg-deep);
      transition: opacity 0.8s var(--ease-cinematic), visibility 0.8s;
      overflow: hidden;
    }

    .loader-hidden {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    .loader-backdrop {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .glow-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.35;
    }

    .glow-orb-1 {
      width: 450px;
      height: 450px;
      top: 15%;
      left: 50%;
      transform: translateX(-50%);
      background: radial-gradient(circle, var(--accent-primary) 0%, transparent 70%);
    }

    .glow-orb-2 {
      width: 320px;
      height: 320px;
      bottom: 10%;
      left: 45%;
      background: radial-gradient(circle, var(--accent-sand) 0%, transparent 70%);
      opacity: 0.15;
    }

    .loader-content {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 90%;
      max-width: 480px;
      padding: 2.5rem 2rem;
      border: 1px solid var(--border-line-strong);
      border-radius: 20px;
      background: var(--glass-bg);
      backdrop-filter: var(--glass-blur);
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.7);
      text-align: center;
    }

    .boarding-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 2rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px dashed var(--border-line);
    }

    .telemetry-stamp {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--accent-glow);
      letter-spacing: 0.05em;
    }

    .pulse-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: var(--accent-sand);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--accent-sand);
      animation: pulse 1.5s infinite;
    }

    .emblem-wrapper {
      position: relative;
      width: 150px;
      height: 150px;
      margin-bottom: 1.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ring-svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }

    .ring-bg {
      fill: none;
      stroke: rgba(227, 232, 239, 0.08);
      stroke-width: 5;
    }

    .ring-progress {
      fill: none;
      stroke: url(#gradient);
      stroke: var(--accent-glow);
      stroke-width: 5;
      stroke-linecap: round;
      stroke-dasharray: 553;
      transition: stroke-dashoffset 0.15s ease-out;
      filter: drop-shadow(0 0 8px var(--accent-glow));
    }

    .rocket-icon {
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: rocketFloat 2.5s ease-in-out infinite;
    }

    .rocket-svg {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 4px 12px rgba(112, 177, 237, 0.5));
    }

    .text-block {
      margin-bottom: 1.75rem;
    }

    .loader-title {
      font-family: var(--font-display);
      font-size: 1.4rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }

    .loader-subtitle {
      font-size: 0.9rem;
      color: var(--text-muted);
      line-height: 1.5;
    }

    .progress-section {
      width: 100%;
      margin-bottom: 1rem;
    }

    .bar-outer {
      width: 100%;
      height: 6px;
      background: rgba(227, 232, 239, 0.1);
      border-radius: 999px;
      overflow: hidden;
      margin-bottom: 0.6rem;
    }

    .bar-inner {
      height: 100%;
      background: linear-gradient(90deg, var(--accent-primary), var(--accent-glow));
      border-radius: 999px;
      box-shadow: 0 0 12px var(--accent-glow);
      transition: width 0.1s linear;
    }

    .telemetry-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--text-faint);
    }

    .telemetry-value {
      color: var(--accent-sand);
      font-weight: 700;
    }

    .enter-btn {
      margin-top: 1rem;
      animation: popIn 0.4s var(--ease-elastic);
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }

    @keyframes rocketFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    @keyframes popIn {
      0% { transform: scale(0.8); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
  `]
})
export class LoaderComponent implements OnInit {
  protected readonly i18n = inject(I18nService);
  private readonly audio = inject(AudioService);

  readonly progress = signal<number>(0);
  readonly isLoaded = signal<boolean>(false);
  readonly loaded = output<void>();

  // Circumference of 2 * PI * 88 = ~553
  readonly ringOffset = signal<number>(553);

  ngOnInit(): void {
    this.startLoadingSimulation();
  }

  private startLoadingSimulation(): void {
    // Quickly animate and dismiss so user immediately enters Planet Earth / Asyut Space Workspace
    this.progress.set(100);
    this.ringOffset.set(0);
    setTimeout(() => {
      this.dismiss();
    }, 200);
  }

  dismiss(): void {
    if (this.isLoaded()) return;
    this.isLoaded.set(true);
    this.loaded.emit();
  }
}
