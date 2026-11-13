import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../core/i18n.service';
import { MasterTimelineService, SCENE_SEGMENTS } from '../../core/master-timeline.service';
import { ScrollService } from '../../core/scroll.service';
import { AudioService } from '../../core/audio.service';

@Component({
  selector: 'app-progress-rocket',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="vertical-progress-dock" [attr.aria-label]="i18n.currentTranslations().siteTitle">
      <!-- Deep Space / Voyager Icon at Top Destination -->
      <div 
        class="checkpoint-endpoint endpoint-moon" 
        (click)="jumpToScene(segments.length - 1)"
        [title]="i18n.currentTranslations().checkpointSolar"
      >
        <div class="moon-icon-dot"></div>
        <span class="endpoint-name">{{ i18n.currentTranslations().checkpointSolar }}</span>
      </div>

      <!-- Vertical Progress Rail Track -->
      <div class="progress-rail" (click)="onRailClick($event)">
        <!-- Fill line showing flight path completed -->
        <div class="rail-fill" [style.height.%]="progressPercent()"></div>

        <!-- Moving Rocket Cursor Indicator -->
        <div 
          class="traveling-rocket" 
          [style.bottom.%]="progressPercent()"
          [title]="'ALT: ' + liveAltitude() + ' | VEL: ' + liveVelocity()"
        >
          <svg viewBox="0 0 24 24" class="rocket-cursor-svg">
            <path d="M12 2C12 2 7 8 7 15C7 18 9 20 12 21C15 20 17 18 17 15C17 8 12 2 12 2Z" fill="#F4F5FF"/>
            <circle cx="12" cy="8" r="2" fill="var(--accent-primary)"/>
            <polygon points="7,15 3,18 7,19" fill="var(--accent-glow)"/>
            <polygon points="17,15 21,18 17,19" fill="var(--accent-glow)"/>
            <polygon points="10,21 12,24 14,21" fill="var(--accent-ember)" class="rocket-cursor-flame"/>
          </svg>
        </div>

        <!-- Checkpoints per Scene Segment -->
        @for (seg of segments; track seg.id) {
          <button
            class="checkpoint-node"
            [style.bottom.%]="seg.start * 100"
            [class.active]="masterTimeline.activeSceneIndex() === seg.index"
            [class.passed]="masterTimeline.progress() >= seg.start"
            (click)="$event.stopPropagation(); jumpToScene(seg.index)"
            [attr.aria-label]="getCheckpointLabel(seg.index)"
            [title]="getCheckpointLabel(seg.index)"
          >
            <span class="node-bullet"></span>
            <span class="node-tooltip">{{ getCheckpointLabel(seg.index) }}</span>
          </button>
        }
      </div>

      <!-- Earth Icon at Bottom Origin -->
      <div 
        class="checkpoint-endpoint endpoint-earth" 
        (click)="jumpToScene(0)"
        [title]="i18n.currentTranslations().checkpointLaunch"
      >
        <div class="earth-icon-dot"></div>
        <span class="endpoint-name">{{ i18n.currentTranslations().checkpointLaunch }}</span>
      </div>
    </nav>

    <!-- Compact Mobile Floating Flight Telemetry Ribbon -->
    <div class="mobile-flight-telemetry-pill" dir="ltr" aria-hidden="true">
      <span class="mob-pulse-dot"></span>
      <span class="mob-spec">ALT: {{ liveAltitude() }}</span>
      <span class="mob-sep">//</span>
      <span class="mob-spec">VEL: {{ liveVelocity() }}</span>
    </div>
  `,
  styles: [`
    /* Floating Telemetry Ribbon on Mobile */
    .mobile-flight-telemetry-pill {
      display: none;
      position: fixed;
      bottom: 1.25rem;
      inset-inline-end: 1rem;
      z-index: 100;
      align-items: center;
      gap: 0.45rem;
      padding: 0.35rem 0.75rem;
      background: rgba(8, 11, 26, 0.82);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(54, 197, 240, 0.35);
      border-radius: 999px;
      font-family: var(--font-mono);
      font-size: 0.65rem;
      color: var(--text-primary);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);

      @media (max-width: 768px) {
        display: flex;
      }
    }

    .mob-pulse-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--accent-success);
      box-shadow: 0 0 6px var(--accent-success);
    }

    .mob-spec {
      color: var(--accent-glow);
      font-weight: 700;
    }

    .mob-sep {
      color: var(--text-faint);
    }

    /* Minimalist Slim Scroller Needle (اصغر حجم ممكن) */
    .vertical-progress-dock {
      position: fixed;
      top: 50%;
      transform: translateY(-50%);
      inset-inline-end: 0.75rem;
      z-index: 100;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.4rem;
      padding: 0.5rem 0.2rem;
      width: 24px;
      box-sizing: border-box;
      background: rgba(8, 12, 26, 0.55);
      backdrop-filter: var(--glass-blur);
      -webkit-backdrop-filter: var(--glass-blur);
      border: 1px solid rgba(56, 189, 248, 0.22);
      border-radius: 999px;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.45);

      @media (max-width: 768px) {
        display: none;
      }
    }

    .checkpoint-endpoint {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      position: relative;
      transition: transform 0.2s ease;

      &:hover {
        transform: scale(1.25);

        .endpoint-name {
          opacity: 1;
          visibility: visible;
        }
      }
    }

    .moon-icon-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #F8FAFC, #94A3B8);
      box-shadow: 0 0 8px rgba(248, 250, 252, 0.8);
    }

    .earth-icon-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #38BDF8, #1E3A8A);
      box-shadow: 0 0 8px rgba(56, 189, 248, 0.8);
    }

    .endpoint-name {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      inset-inline-end: 1.8rem;
      font-family: var(--font-mono);
      font-size: 0.62rem;
      font-weight: 700;
      color: var(--accent-glow);
      white-space: nowrap;
      background: rgba(17, 26, 53, 0.9);
      padding: 0.18rem 0.45rem;
      border-radius: 4px;
      border: 1px solid var(--border-line);
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s ease;
      pointer-events: none;
    }

    /* Rail Track */
    .progress-rail {
      position: relative;
      width: 3px;
      height: 160px;
      background: rgba(227, 232, 239, 0.15);
      border-radius: 999px;
      cursor: pointer;
    }

    .rail-fill {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      background: linear-gradient(180deg, var(--accent-glow), var(--accent-primary));
      border-radius: 999px;
      box-shadow: 0 0 6px var(--accent-glow);
      transition: height 0.1s linear;
    }

    /* Moving Rocket Cursor */
    .traveling-rocket {
      position: absolute;
      left: 50%;
      transform: translate(-50%, 50%);
      width: 16px;
      height: 16px;
      z-index: 5;
      pointer-events: auto;
      cursor: help;
      transition: bottom 0.1s linear;
    }

    .rocket-cursor-svg {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 0 5px var(--accent-glow));
    }

    .rocket-cursor-flame {
      animation: flameFlicker 0.1s infinite alternate;
    }

    /* Checkpoint Nodes */
    .checkpoint-node {
      position: absolute;
      left: 50%;
      transform: translate(-50%, 50%);
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: transparent;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 0;

      &:hover .node-tooltip {
        opacity: 1;
        visibility: visible;
        transform: translateY(-50%) translateX(0);
      }
    }

    .node-bullet {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--bg-surface);
      border: 1.2px solid var(--text-faint);
      transition: all 0.2s ease;
    }

    .checkpoint-node.passed .node-bullet {
      background: var(--accent-primary);
      border-color: var(--accent-glow);
    }

    .checkpoint-node.active .node-bullet {
      background: var(--accent-glow);
      border-color: #FFFFFF;
      box-shadow: 0 0 6px var(--accent-glow);
      transform: scale(1.25);
    }

    .node-tooltip {
      position: absolute;
      top: 50%;
      transform: translateY(-50%) translateX(-6px);
      inset-inline-end: 1.6rem;
      font-family: var(--font-mono);
      font-size: 0.62rem;
      color: var(--text-primary);
      background: rgba(15, 22, 34, 0.92);
      border: 1px solid var(--border-line-strong);
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s ease;
      pointer-events: none;
    }

    @keyframes flameFlicker {
      0% { transform: scaleY(0.8); }
      100% { transform: scaleY(1.3); }
    }
  `]
})
export class ProgressRocketComponent {
  protected readonly masterTimeline = inject(MasterTimelineService);
  protected readonly scroll = inject(ScrollService);
  protected readonly i18n = inject(I18nService);
  private readonly audio = inject(AudioService);

  readonly segments = SCENE_SEGMENTS;
  readonly progressPercent = computed(() => this.masterTimeline.progress() * 100);

  readonly liveAltitude = computed<string>(() => {
    const p = this.masterTimeline.progress();
    if (p < 0.01) return '0.0 M';
    if (p < 0.12) {
      const p0 = p / 0.12;
      return `${Math.round(p0 * p0 * 160)} KM`;
    }
    if (p < 0.22) {
      const p1 = (p - 0.12) / 0.10;
      return `${Math.round(160 + p1 * 160)} KM`;
    }
    // Main flight corridor (0.22 to 1.0)
    const p2 = (p - 0.22) / 0.78;
    if (p2 < 0.3) {
      // Moon segment
      const sub = p2 / 0.3;
      const km = Math.round(320 + sub * 384080);
      return `${km.toLocaleString('en-US')} KM`;
    } else if (p2 < 0.6) {
      // Mars & Asteroid belt segment
      const sub = (p2 - 0.3) / 0.3;
      const km = Math.round(384400 + sub * 224615600);
      return `${(km / 1000000).toFixed(1)}M KM`;
    } else {
      // Pioneer & Voyager interstellar segment
      const sub = (p2 - 0.6) / 0.4;
      const au = 1.5 + sub * 162.5;
      return `${au.toFixed(1)} AU`;
    }
  });

  readonly liveVelocity = computed<string>(() => {
    const p = this.masterTimeline.progress();
    if (p < 0.01) return '0.00 KM/S';
    if (p < 0.12) {
      const p0 = p / 0.12;
      return `${(p0 * 3.8).toFixed(2)} KM/S`;
    }
    if (p < 0.22) {
      const p1 = (p - 0.12) / 0.10;
      return `${(3.8 + p1 * 4.0).toFixed(2)} KM/S`;
    }
    const p2 = (p - 0.22) / 0.78;
    const v = 7.8 + p2 * 9.2;
    return `${v.toFixed(2)} KM/S`;
  });

  getCheckpointLabel(index: number): string {
    const t = this.i18n.currentTranslations();
    switch (index) {
      case 0: return t.checkpointLaunch;
      case 1: return t.checkpointOrbit;
      case 2: return t.checkpointSolar;
      case 3: return t.checkpointLanding;
      case 4: return t.checkpointMoon;
      default: return '';
    }
  }

  jumpToScene(index: number): void {
    const seg = this.segments[index];
    if (!seg) return;
    this.audio.playBeep(950, 0.08);

    const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
    const target = seg.start * scrollTotal;
    this.scroll.scrollTo(target, { duration: 1.2 });
  }

  onRailClick(e: MouseEvent): void {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const pct = 1 - (clickY / rect.height); // bottom is 0%
    const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
    this.scroll.scrollTo(pct * scrollTotal, { duration: 1 });
  }
}
