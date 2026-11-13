import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../core/i18n.service';
import { ExplorerProgressionService } from '../../core/explorer-progression.service';

@Component({
  selector: 'app-achievement-toast',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (progression.activeUnlockToast()) {
      <div 
        class="achievement-toast-container"
        role="alert"
        aria-live="polite"
        (click)="progression.dismissToast()"
      >
        <div class="toast-card hud-panel-elevated">
          <div class="toast-icon-wrap">
            <span class="toast-glyph">{{ progression.activeUnlockToast()?.icon }}</span>
          </div>

          <div class="toast-text-wrap">
            <span class="toast-kicker">
              <span class="sparkle-star">★</span>
              {{ i18n.currentTranslations().achievementUnlocked }}
            </span>
            <h4 class="toast-title">{{ i18n.t(progression.activeUnlockToast()!.titleKey) }}</h4>
            <span class="toast-reward telemetry-num" dir="ltr">+{{ progression.activeUnlockToast()?.xpReward }} XP</span>
          </div>

          <button class="toast-close" (click)="$event.stopPropagation(); progression.dismissToast()">✕</button>
        </div>
      </div>
    }
  `,
  styles: [`
    .achievement-toast-container {
      position: fixed;
      top: 5rem;
      inset-inline-end: 1.5rem;
      z-index: 10005;
      cursor: pointer;
      animation: toastSlideIn 0.35s var(--ease-cinematic);
    }

    .toast-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.85rem 1.25rem;
      border-radius: 16px;
      border: 1px solid var(--accent-glow);
      background: rgba(17, 26, 53, 0.95);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6), 0 0 24px rgba(54, 197, 240, 0.35);
      min-width: 290px;
      max-width: 380px;
    }

    .toast-icon-wrap {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: rgba(8, 11, 26, 0.8);
      border: 1px solid var(--accent-glow);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      flex-shrink: 0;
      box-shadow: 0 0 12px rgba(54, 197, 240, 0.3);
    }

    .toast-text-wrap {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .toast-kicker {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      font-weight: 800;
      color: var(--accent-glow);
      letter-spacing: 0.08em;
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }

    .sparkle-star {
      color: #F2CA8D;
    }

    .toast-title {
      font-family: var(--font-display);
      font-size: 0.98rem;
      font-weight: 800;
      color: var(--text-primary);
      line-height: 1.2;
    }

    .toast-reward {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      font-weight: 800;
      color: #3EC87D;
    }

    .toast-close {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 0.9rem;
      padding: 0.2rem;
      line-height: 1;

      &:hover { color: #fff; }
    }

    @keyframes toastSlideIn {
      from { transform: translateY(-20px) scale(0.9); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }
  `]
})
export class AchievementToastComponent {
  protected readonly i18n = inject(I18nService);
  protected readonly progression = inject(ExplorerProgressionService);
}

