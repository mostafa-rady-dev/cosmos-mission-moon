import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  input,
  output,
  viewChild,
  ElementRef,
  HostListener,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../core/i18n.service';
import { AudioService } from '../../core/audio.service';
import { MissionConfig } from '../../../assets/missions/missions.config';

@Component({
  selector: 'app-hud-modal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (mission()) {
      <div 
        class="hud-modal-backdrop" 
        (click)="onBackdropClick($event)"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="mission()?.titleAr"
      >
        <!-- Astronaut Helmet Visor Container -->
        <div #visorContainer class="helmet-visor-frame">
          <!-- Visor Curved Glass Reflections & Scanlines -->
          <div class="visor-reflection-glint" aria-hidden="true"></div>
          <div class="visor-scanlines" aria-hidden="true"></div>
          <div class="visor-curvature-mask" aria-hidden="true"></div>

          <!-- Top Visor Telemetry HUD Bar -->
          <div class="visor-top-bar">
            <div class="visor-meta-left">
              <span class="hud-tag">HELMET HUD // SYS_FEED_0{{ mission()?.order }}</span>
              <span class="telemetry-uplink">{{ i18n.currentTranslations().hudSystemStatus }}</span>
            </div>

            <!-- Close Button -->
            <button 
              #closeButton
              class="visor-close-btn" 
              (click)="closeModal()" 
              [attr.aria-label]="i18n.currentTranslations().closeHud"
              title="Close (ESC)"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- Main Visor Content -->
          <div class="visor-main-grid">
            <!-- Left/Center: Video Feed Player Area -->
            <div class="visor-player-pane">
              <div class="player-wrapper">
                @if (hasVideoError() || !mission()?.videoSrc) {
                  <!-- Graceful Video Footage Being Prepared State -->
                  <div class="video-placeholder-fallback">
                    <div class="telemetry-scanner">
                      <div class="scanner-crosshair"></div>
                    </div>
                    <span class="fallback-status-badge">ARCHIVE_UPLINK // DOWNLINK_PENDING</span>
                    <p class="fallback-msg">{{ i18n.currentTranslations().videoPreparing }}</p>
                    <span class="fallback-coords">COORDINATES: 0.67° N · 23.47° E // MARE TRANQUILLITATIS</span>
                  </div>
                } @else {
                  <video
                    #videoPlayer
                    class="mission-video"
                    [src]="mission()?.videoSrc"
                    [poster]="mission()?.poster"
                    preload="none"
                    (play)="onVideoPlay()"
                    (pause)="onVideoPause()"
                    (ended)="onVideoEnded()"
                    (error)="onVideoError()"
                    (timeupdate)="onTimeUpdate()"
                  ></video>

                  <!-- Custom Lightweight Video Controls -->
                  <div class="custom-controls-overlay">
                    <button class="ctrl-btn play-pause-btn" (click)="togglePlay()">
                      @if (isPlaying()) {
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <rect x="6" y="4" width="4" height="16"/>
                          <rect x="14" y="4" width="4" height="16"/>
                        </svg>
                      } @else {
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                      }
                    </button>

                    <!-- Seek Bar -->
                    <div class="seek-bar-track" (click)="onSeek($event)">
                      <div class="seek-fill" [style.width.%]="videoProgress()"></div>
                    </div>

                    <!-- Mute & Fullscreen -->
                    <button class="ctrl-btn" (click)="toggleVideoMute()">
                      @if (isVideoMuted()) {
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                          <line x1="23" y1="9" x2="17" y2="15"/>
                          <line x1="17" y1="9" x2="23" y2="15"/>
                        </svg>
                      } @else {
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                        </svg>
                      }
                    </button>

                    <button class="ctrl-btn" (click)="toggleFullscreen()">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                      </svg>
                    </button>
                  </div>
                }
              </div>
            </div>

            <!-- Right: Mission Briefing & Passport Stamp Info -->
            <div class="visor-info-pane">
              <div class="passport-stamp-seal">
                <span class="stamp-text-circle">ASYUT SPACE WORKSPACE</span>
                <span class="stamp-number">0{{ mission()?.order }}</span>
              </div>

              <h2 class="mission-brief-title">
                {{ i18n.currentLang() === 'ar' ? mission()?.titleAr : mission()?.titleEn }}
              </h2>

              <p class="mission-brief-desc">
                {{ i18n.currentLang() === 'ar' ? mission()?.descAr : mission()?.descEn }}
              </p>

              <!-- Technical Details Checklist -->
              <div class="details-checklist">
                @for (item of (i18n.currentLang() === 'ar' ? mission()?.detailsAr : mission()?.detailsEn); track $index) {
                  <div class="checklist-item">
                    <span class="check-bullet">✓</span>
                    <span class="check-text">{{ item }}</span>
                  </div>
                }
              </div>

              <div class="visor-action-row">
                <button class="btn-cinema complete-btn" (click)="markCompleteAndClose()">
                  <span>{{ i18n.currentTranslations().completed }} ✓</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .hud-modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(3, 7, 21, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      padding: 1.5rem;
      animation: modalFadeIn 0.3s ease-out;
    }

    /* Helmet Visor Shape */
    .helmet-visor-frame {
      position: relative;
      width: 100%;
      max-width: 960px;
      max-height: 88vh;
      overflow-y: auto;
      border: 2px solid var(--accent-glow);
      border-radius: 40px / 24px;
      background: rgba(10, 14, 28, 0.92);
      box-shadow: 0 0 60px rgba(42, 113, 214, 0.4), inset 0 0 40px rgba(112, 177, 237, 0.15);
      display: flex;
      flex-direction: column;
      animation: visorExpand 0.4s var(--ease-elastic);
    }

    .visor-reflection-glint {
      position: absolute;
      top: 0;
      left: 10%;
      right: 10%;
      height: 35%;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, transparent 100%);
      border-radius: 40px 40px 0 0;
      pointer-events: none;
      z-index: 5;
    }

    .visor-scanlines {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 6;
      opacity: 0.04;
      background: linear-gradient(
        rgba(18, 16, 16, 0) 50%, 
        rgba(0, 0, 0, 0.25) 50%
      ), linear-gradient(
        90deg,
        rgba(255, 0, 0, 0.06),
        rgba(0, 255, 0, 0.02),
        rgba(0, 0, 255, 0.06)
      );
      background-size: 100% 3px, 6px 100%;
    }

    /* Top Visor Bar */
    .visor-top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 2rem;
      border-bottom: 1px dashed var(--border-line-strong);
      position: relative;
      z-index: 10;
    }

    .visor-meta-left {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .hud-tag {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--accent-sand);
      letter-spacing: 0.1em;
    }

    .telemetry-uplink {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      color: var(--accent-success);
    }

    .visor-close-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: rgba(227, 232, 239, 0.1);
      border: 1px solid var(--border-line-strong);
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(244, 81, 79, 0.25);
        border-color: var(--accent-danger);
        color: var(--accent-danger);
        transform: rotate(90deg);
      }
    }

    /* Main Grid */
    .visor-main-grid {
      display: grid;
      grid-template-columns: 1.3fr 1fr;
      gap: 1.5rem;
      padding: 1.75rem 2rem 2.25rem;
      position: relative;
      z-index: 10;

      @media (max-width: 860px) {
        grid-template-columns: 1fr;
        padding: 1.25rem;
      }
    }

    /* Player Pane */
    .visor-player-pane {
      display: flex;
      flex-direction: column;
    }

    .player-wrapper {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 10;
      border-radius: 16px;
      overflow: hidden;
      background: #000000;
      border: 1px solid var(--border-line);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .mission-video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Graceful Fallback State */
    .video-placeholder-fallback {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2rem;
      background: radial-gradient(circle, rgba(42, 113, 214, 0.15) 0%, rgba(10, 14, 28, 0.95) 80%);
      width: 100%;
      height: 100%;
    }

    .telemetry-scanner {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: 2px dashed var(--accent-glow);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
      animation: spinScanner 8s linear infinite;
    }

    .scanner-crosshair {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--accent-sand);
      box-shadow: 0 0 10px var(--accent-sand);
    }

    .fallback-status-badge {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      color: var(--accent-glow);
      letter-spacing: 0.1em;
      margin-bottom: 0.5rem;
    }

    .fallback-msg {
      font-family: var(--font-display);
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.75rem;
    }

    .fallback-coords {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      color: var(--text-faint);
    }

    /* Custom Controls */
    .custom-controls-overlay {
      position: absolute;
      bottom: 0;
      inset-inline-start: 0;
      inset-inline-end: 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      background: linear-gradient(180deg, transparent, rgba(10, 14, 28, 0.9));
    }

    .ctrl-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-primary);
      cursor: pointer;
      background: transparent;
      border: none;
      transition: color 0.2s ease;

      &:hover {
        color: var(--accent-glow);
      }
    }

    .seek-bar-track {
      flex: 1;
      height: 6px;
      background: rgba(227, 232, 239, 0.2);
      border-radius: 999px;
      cursor: pointer;
      overflow: hidden;
    }

    .seek-fill {
      height: 100%;
      background: var(--accent-glow);
      border-radius: 999px;
      transition: width 0.1s linear;
    }

    /* Visor Info Pane */
    .visor-info-pane {
      display: flex;
      flex-direction: column;
    }

    .passport-stamp-seal {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      border: 1px dashed var(--accent-sand);
      padding: 0.25rem 0.6rem;
      border-radius: 4px;
      width: fit-content;
      margin-bottom: 1rem;
    }

    .stamp-text-circle {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      color: var(--accent-sand);
      letter-spacing: 0.08em;
    }

    .stamp-number {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 800;
      color: #fff;
    }

    .mission-brief-title {
      font-family: var(--font-display);
      font-size: 1.45rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 0.75rem;
      line-height: 1.25;
    }

    .mission-brief-desc {
      font-size: 0.9rem;
      line-height: 1.6;
      color: var(--text-muted);
      margin-bottom: 1.25rem;
    }

    .details-checklist {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      margin-bottom: 1.75rem;
      background: rgba(15, 22, 34, 0.6);
      border: 1px solid var(--border-line);
      padding: 1rem;
      border-radius: 12px;
    }

    .checklist-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .check-bullet {
      color: var(--accent-success);
      font-weight: 700;
      font-size: 0.85rem;
    }

    .check-text {
      font-size: 0.82rem;
      color: var(--text-primary);
    }

    .visor-action-row {
      margin-top: auto;
    }

    .complete-btn {
      width: 100%;
      background: linear-gradient(135deg, rgba(62, 200, 125, 0.9), rgba(22, 29, 57, 0.95));
      border-color: var(--accent-success);
    }

    @keyframes modalFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes visorExpand {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    @keyframes spinScanner {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class HudModalComponent implements AfterViewInit, OnDestroy {
  protected readonly i18n = inject(I18nService);
  private readonly audio = inject(AudioService);

  readonly mission = input<MissionConfig | null>(null);
  readonly closeModalEvent = output<void>();
  readonly missionCompletedEvent = output<string>();

  readonly videoPlayer = viewChild<ElementRef<HTMLVideoElement>>('videoPlayer');
  readonly closeButton = viewChild<ElementRef<HTMLButtonElement>>('closeButton');

  readonly isPlaying = signal<boolean>(false);
  readonly isVideoMuted = signal<boolean>(false);
  readonly videoProgress = signal<number>(0);
  readonly hasVideoError = signal<boolean>(false);

  private previousActiveElement: HTMLElement | null = null;

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal();
  }

  ngAfterViewInit(): void {
    if (typeof document !== 'undefined') {
      this.previousActiveElement = document.activeElement as HTMLElement;
      this.closeButton()?.nativeElement.focus();
    }
  }

  ngOnDestroy(): void {
    // Restore audio ducking if closed
    this.audio.duckAmbient(false);
  }

  onBackdropClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('hud-modal-backdrop')) {
      this.closeModal();
    }
  }

  closeModal(): void {
    this.audio.duckAmbient(false);
    this.audio.playBeep(700, 0.08);
    this.closeModalEvent.emit();
    this.previousActiveElement?.focus();
  }

  markCompleteAndClose(): void {
    const m = this.mission();
    if (m) {
      this.missionCompletedEvent.emit(m.id);
    }
    this.closeModal();
  }

  togglePlay(): void {
    const video = this.videoPlayer()?.nativeElement;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => this.hasVideoError.set(true));
    } else {
      video.pause();
    }
  }

  onVideoPlay(): void {
    this.isPlaying.set(true);
    // Duck ambient space audio when video plays
    this.audio.duckAmbient(true);
  }

  onVideoPause(): void {
    this.isPlaying.set(false);
    // Restore ambient space audio
    this.audio.duckAmbient(false);
  }

  onVideoEnded(): void {
    this.isPlaying.set(false);
    this.audio.duckAmbient(false);
  }

  onVideoError(): void {
    this.hasVideoError.set(true);
    this.audio.duckAmbient(false);
  }

  onTimeUpdate(): void {
    const video = this.videoPlayer()?.nativeElement;
    if (!video || !video.duration) return;
    const progress = (video.currentTime / video.duration) * 100;
    this.videoProgress.set(progress);
  }

  onSeek(e: MouseEvent): void {
    const video = this.videoPlayer()?.nativeElement;
    if (!video || !video.duration) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = clickX / rect.width;
    video.currentTime = pct * video.duration;
  }

  toggleVideoMute(): void {
    const video = this.videoPlayer()?.nativeElement;
    if (!video) return;
    video.muted = !video.muted;
    this.isVideoMuted.set(video.muted);
  }

  toggleFullscreen(): void {
    const video = this.videoPlayer()?.nativeElement;
    if (!video) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen().catch(() => {});
    }
  }
}
