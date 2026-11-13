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
  OnDestroy,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../core/i18n.service';
import { AudioService } from '../../core/audio.service';
import { ScrollService } from '../../core/scroll.service';
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
          <div class="visor-reflection-glint" aria-hidden="true"></div>
          <div class="visor-scanlines" aria-hidden="true"></div>

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
            <!-- Left/Center: Video Feed Player Area OR Robust Fallback Card -->
            <div class="visor-player-pane">
              <div class="player-wrapper">
                @if (hasVideoError() || !mission()?.videoSrc) {
                  <!-- Robust NASA Mission Card Fallback with Auto-Resume Countdown -->
                  <div class="video-mission-card-fallback">
                    <div class="fallback-poster-wrap">
                      <img [src]="mission()?.poster" [alt]="mission()?.titleEn" class="fallback-poster-img" />
                      <div class="fallback-badge-overlay">
                        <span>📡 NASA ARCHIVE DOWNLINK // SECURED</span>
                      </div>
                    </div>

                    <div class="fallback-body-content">
                      <h3 class="fallback-mission-title">
                        {{ i18n.currentLang() === 'ar' ? mission()?.titleAr : mission()?.titleEn }}
                      </h3>
                      
                      <!-- 3 Quick Scientific Facts -->
                      <div class="quick-facts-list">
                        @for (fact of (i18n.currentLang() === 'ar' ? mission()?.objectivesAr?.slice(0, 3) : mission()?.objectivesEn?.slice(0, 3)); track $index) {
                          <div class="quick-fact-item">
                            <span class="fact-bullet">0{{ $index + 1 }}</span>
                            <span class="fact-text">{{ fact }}</span>
                          </div>
                        }
                      </div>

                      <!-- Official NASA Source Link -->
                      <div class="official-source-row">
                        <span class="source-tag">NASA ARCHIVE:</span>
                        <span class="source-val">{{ i18n.currentLang() === 'ar' ? (mission()?.sourceAr || 'وكالة ناسا الفضائية — مركز جونسون للفضاء') : (mission()?.sourceEn || 'NASA Johnson Space Center Archives') }}</span>
                      </div>

                      <!-- Action Bar: Continue Button + Auto-Resume Countdown -->
                      <div class="fallback-action-bar">
                        <button class="btn-cinema continue-journey-btn" (click)="markCompleteAndClose()">
                          <span>{{ i18n.currentLang() === 'ar' ? 'متابعة الرحلة' : 'Continue Journey' }}</span>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                        </button>
                        <span class="auto-resume-text">
                          ⏱️ {{ i18n.currentLang() === 'ar' ? 'متابعة تلقائية بعد ' : 'Auto-resuming in ' }} {{ countdownRemaining() }}s...
                        </span>
                      </div>
                    </div>
                  </div>
                } @else {
                  <video
                    #videoPlayer
                    class="mission-video"
                    [src]="mission()?.videoSrc"
                    [poster]="mission()?.poster"
                    autoplay
                    muted
                    playsinline
                    preload="auto"
                    (play)="onVideoPlay()"
                    (pause)="onVideoPause()"
                    (ended)="onVideoEnded()"
                    (error)="onVideoError()"
                    (timeupdate)="onTimeUpdate()"
                  ></video>

                  <!-- Live Mission Subtitles Bar -->
                  @if (showSubtitles()) {
                    <div class="video-subtitles-bar">
                      <span class="subtitles-text">{{ i18n.currentLang() === 'ar' ? mission()?.descAr : mission()?.descEn }}</span>
                    </div>
                  }

                  <!-- Custom Lightweight Video Controls -->
                  <div class="custom-controls-overlay">
                    <button class="ctrl-btn play-pause-btn" (click)="togglePlay()" [attr.aria-label]="isPlaying() ? 'Pause' : 'Play'">
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

                    <div class="seek-bar-track" (click)="onSeek($event)">
                      <div class="seek-fill" [style.width.%]="videoProgress()"></div>
                    </div>

                    <button class="ctrl-btn" (click)="toggleVideoMute()" [attr.aria-label]="isVideoMuted() ? i18n.currentTranslations().unmuteVideo : i18n.currentTranslations().muteVideo">
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

                    <button class="ctrl-btn" [class.active-sub]="showSubtitles()" (click)="toggleSubtitles()" [attr.aria-label]="i18n.currentTranslations().subtitlesToggle">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="2" y="4" width="20" height="16" rx="2"/>
                        <path d="M7 15h3M14 15h3M7 11h10"/>
                      </svg>
                    </button>

                    <button class="ctrl-btn" (click)="toggleFullscreen()" [attr.aria-label]="'Fullscreen'">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                      </svg>
                    </button>

                    <button class="btn-skip-mission" (click)="skipVideoAndFinish()" [attr.aria-label]="i18n.currentTranslations().skipVideo">
                      <span>{{ i18n.currentTranslations().skipVideo }}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <polygon points="5 4 15 12 5 20 5 4"/>
                        <line x1="19" y1="5" x2="19" y2="19"/>
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
      background: rgba(3, 7, 21, 0.88);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      padding: 1.5rem;
      animation: modalFadeIn 0.3s ease-out;
    }

    .helmet-visor-frame {
      position: relative;
      width: 100%;
      max-width: 980px;
      max-height: 88vh;
      overflow-y: auto;
      border: 2px solid var(--accent-glow);
      border-radius: 28px;
      background: rgba(10, 14, 28, 0.94);
      box-shadow: 0 0 60px rgba(42, 113, 214, 0.4), inset 0 0 40px rgba(112, 177, 237, 0.12);
      display: flex;
      flex-direction: column;
      animation: visorExpand 0.35s ease-out;
    }

    .visor-reflection-glint {
      position: absolute;
      top: 0;
      left: 10%;
      right: 10%;
      height: 30%;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, transparent 100%);
      border-radius: 28px 28px 0 0;
      pointer-events: none;
      z-index: 5;
    }

    .visor-scanlines {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 6;
      opacity: 0.04;
      background: repeating-linear-gradient(0deg, #000, #000 2px, transparent 2px, transparent 4px);
    }

    .visor-top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.75rem 0.75rem;
      border-bottom: 1px solid var(--border-line);
      position: relative;
      z-index: 10;
    }

    .visor-meta-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .hud-tag {
      font-family: var(--font-mono);
      font-size: 0.78rem;
      color: var(--accent-glow);
      font-weight: 700;
      letter-spacing: 0.08em;
    }

    .telemetry-uplink {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--accent-success);
      background: rgba(62, 200, 125, 0.12);
      border: 1px solid rgba(62, 200, 125, 0.3);
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
    }

    .visor-close-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid var(--border-line);
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(239, 68, 68, 0.2);
        border-color: #EF4444;
        color: #EF4444;
      }
    }

    .visor-main-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 1.5rem;
      padding: 1.5rem 1.75rem 2rem;
      position: relative;
      z-index: 10;

      @media (max-width: 820px) {
        grid-template-columns: 1fr;
        padding: 1rem;
        gap: 1rem;
      }
    }

    .player-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      min-height: 380px;
      border-radius: 16px;
      overflow: hidden;
      background: #000000;
      border: 1px solid var(--border-line-strong);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Fallback Card Styling */
    .video-mission-card-fallback {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      background: rgba(6, 10, 22, 0.95);
      border-radius: 16px;
      overflow: hidden;
    }

    .fallback-poster-wrap {
      position: relative;
      width: 100%;
      height: 160px;
      overflow: hidden;
    }

    .fallback-poster-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(0.85);
    }

    .fallback-badge-overlay {
      position: absolute;
      top: 10px;
      inset-inline-start: 12px;
      padding: 0.25rem 0.6rem;
      border-radius: 4px;
      background: rgba(10, 14, 28, 0.85);
      border: 1px solid var(--accent-glow);
      font-family: var(--font-mono);
      font-size: 0.68rem;
      color: var(--accent-glow);
    }

    .fallback-body-content {
      padding: 1.2rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      flex: 1;
    }

    .fallback-mission-title {
      font-family: var(--font-display);
      font-size: 1.15rem;
      font-weight: 700;
      color: #FFFFFF;
      margin: 0;
    }

    .quick-facts-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .quick-fact-item {
      display: flex;
      align-items: flex-start;
      gap: 0.6rem;
      font-size: 0.82rem;
      line-height: 1.45;
      color: var(--text-muted);
    }

    .fact-bullet {
      font-family: var(--font-mono);
      font-weight: 700;
      font-size: 0.7rem;
      color: var(--accent-glow);
      background: rgba(54, 197, 240, 0.12);
      border: 1px solid rgba(54, 197, 240, 0.3);
      padding: 0.1rem 0.35rem;
      border-radius: 4px;
      flex-shrink: 0;
    }

    .official-source-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 0.6rem;
      background: rgba(15, 23, 42, 0.6);
      border-radius: 6px;
      font-size: 0.72rem;
      border-inline-start: 3px solid var(--accent-glow);
    }

    .source-tag {
      font-family: var(--font-mono);
      font-weight: 700;
      color: var(--accent-glow);
    }

    .source-val {
      color: var(--text-faint);
    }

    .fallback-action-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-top: auto;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border-line);
      flex-wrap: wrap;
    }

    .continue-journey-btn {
      padding: 0.65rem 1.4rem;
      font-size: 0.95rem;
      border-radius: 10px;
    }

    .auto-resume-text {
      font-family: var(--font-mono);
      font-size: 0.78rem;
      color: var(--accent-glow);
    }

    .mission-video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .video-subtitles-bar {
      position: absolute;
      bottom: 52px;
      left: 12px;
      right: 12px;
      background: rgba(0, 0, 0, 0.78);
      backdrop-filter: blur(8px);
      padding: 0.4rem 0.8rem;
      border-radius: 8px;
      text-align: center;
      z-index: 8;
      pointer-events: none;
    }

    .subtitles-text {
      color: #FFFFFF;
      font-size: 0.82rem;
      line-height: 1.4;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
      display: inline-block;
    }

    .custom-controls-overlay {
      position: absolute;
      bottom: 0;
      inset-inline: 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      background: linear-gradient(0deg, rgba(0, 0, 0, 0.85) 0%, transparent 100%);
      z-index: 10;
    }

    .ctrl-btn {
      background: transparent;
      border: none;
      color: #FFFFFF;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: color 0.15s ease;

      &:hover { color: var(--accent-glow); }
      &.active-sub { color: var(--accent-glow); }
    }

    .seek-bar-track {
      flex: 1;
      height: 6px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .seek-fill {
      height: 100%;
      background: var(--accent-glow);
      border-radius: 3px;
    }

    .btn-skip-mission {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.35rem 0.65rem;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid var(--border-line);
      color: #FFFFFF;
      font-family: var(--font-mono);
      font-size: 0.72rem;
      cursor: pointer;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: var(--accent-glow);
      }
    }

    .visor-info-pane {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .passport-stamp-seal {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .stamp-text-circle {
      font-family: var(--font-mono);
      font-size: 0.68rem;
      letter-spacing: 0.1em;
      color: var(--text-faint);
    }

    .stamp-number {
      font-family: var(--font-mono);
      font-weight: 800;
      color: var(--accent-glow);
      font-size: 0.8rem;
    }

    .mission-brief-title {
      font-family: var(--font-display);
      font-size: 1.25rem;
      font-weight: 700;
      color: #FFFFFF;
      margin: 0;
      line-height: 1.3;
    }

    .mission-brief-desc {
      font-size: 0.86rem;
      line-height: 1.6;
      color: var(--text-muted);
      margin: 0;
    }

    .details-checklist {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin: 0.5rem 0;
    }

    .checklist-item {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      font-size: 0.82rem;
      line-height: 1.45;
      color: var(--text-secondary);
    }

    .check-bullet {
      color: var(--accent-success);
      font-weight: bold;
    }

    .visor-action-row {
      margin-top: auto;
      padding-top: 1rem;
    }

    .complete-btn {
      width: 100%;
      padding: 0.75rem;
      font-size: 0.95rem;
    }

    @keyframes modalFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes visorExpand {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  `]
})
export class HudModalComponent implements AfterViewInit, OnDestroy {
  protected readonly i18n = inject(I18nService);
  private readonly audio = inject(AudioService);
  private readonly scroll = inject(ScrollService);

  readonly mission = input<MissionConfig | null>(null);
  readonly closeModalEvent = output<void>();
  readonly missionCompletedEvent = output<string>();

  readonly videoPlayer = viewChild<ElementRef<HTMLVideoElement>>('videoPlayer');
  readonly closeButton = viewChild<ElementRef<HTMLButtonElement>>('closeButton');

  readonly isPlaying = signal<boolean>(false);
  readonly isVideoMuted = signal<boolean>(true);
  readonly showSubtitles = signal<boolean>(true);
  readonly videoProgress = signal<number>(0);
  readonly hasVideoError = signal<boolean>(false);
  readonly countdownRemaining = signal<number>(5);

  private countdownInterval: ReturnType<typeof setInterval> | null = null;
  private stallTimeout: ReturnType<typeof setTimeout> | null = null;
  private previousActiveElement: HTMLElement | null = null;

  constructor() {
    effect(() => {
      const m = this.mission();
      this.clearTimers();

      if (m) {
        this.scroll.lockScroll();
        this.hasVideoError.set(false);
        this.countdownRemaining.set(5);

        // Check if video file is missing or triggers stall
        this.stallTimeout = setTimeout(() => {
          const video = this.videoPlayer()?.nativeElement;
          if (!video || video.paused || video.readyState < 2) {
            this.triggerFallbackWithCountdown();
          }
        }, 3500); // 3.5s stall threshold
      } else {
        this.scroll.unlockScroll();
      }
    });
  }

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
    this.clearTimers();
    this.scroll.unlockScroll();
    this.audio.duckAmbient(false);
  }

  private clearTimers(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
    if (this.stallTimeout) {
      clearTimeout(this.stallTimeout);
      this.stallTimeout = null;
    }
  }

  triggerFallbackWithCountdown(): void {
    this.clearTimers();
    this.hasVideoError.set(true);
    this.audio.duckAmbient(false);
    this.countdownRemaining.set(5);

    this.countdownInterval = setInterval(() => {
      const next = this.countdownRemaining() - 1;
      this.countdownRemaining.set(Math.max(0, next));
      if (next <= 0) {
        this.clearTimers();
        this.markCompleteAndClose();
      }
    }, 1000);
  }

  onBackdropClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('hud-modal-backdrop')) {
      this.closeModal();
    }
  }

  closeModal(): void {
    this.clearTimers();
    this.scroll.unlockScroll();
    this.audio.duckAmbient(false);
    this.audio.playBeep(700, 0.08);
    this.closeModalEvent.emit();
    this.previousActiveElement?.focus();
  }

  markCompleteAndClose(): void {
    this.clearTimers();
    const m = this.mission();
    if (m) {
      this.missionCompletedEvent.emit(m.id);
    }
    this.closeModal();
  }

  skipVideoAndFinish(): void {
    this.isPlaying.set(false);
    this.audio.duckAmbient(false);
    this.markCompleteAndClose();
  }

  toggleSubtitles(): void {
    this.showSubtitles.update(v => !v);
  }

  togglePlay(): void {
    const video = this.videoPlayer()?.nativeElement;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => this.triggerFallbackWithCountdown());
    } else {
      video.pause();
    }
  }

  onVideoPlay(): void {
    if (this.stallTimeout) {
      clearTimeout(this.stallTimeout);
      this.stallTimeout = null;
    }
    this.isPlaying.set(true);
    this.audio.duckAmbient(true);
  }

  onVideoPause(): void {
    this.isPlaying.set(false);
    this.audio.duckAmbient(false);
  }

  onVideoEnded(): void {
    this.isPlaying.set(false);
    this.audio.duckAmbient(false);
    const m = this.mission();
    if (m) {
      this.missionCompletedEvent.emit(m.id);
    }
  }

  onVideoError(): void {
    this.triggerFallbackWithCountdown();
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
