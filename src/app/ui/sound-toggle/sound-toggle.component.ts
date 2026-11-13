import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../core/audio.service';
import { I18nService } from '../../core/i18n.service';

@Component({
  selector: 'app-sound-toggle',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button 
      class="sound-btn" 
      (click)="toggle()"
      [attr.aria-label]="audio.isMuted() ? i18n.currentTranslations().soundOff : i18n.currentTranslations().soundOn"
      [title]="audio.isMuted() ? i18n.currentTranslations().soundOff : i18n.currentTranslations().soundOn"
    >
      <span class="speaker-icon">
        @if (audio.isMuted()) {
          <!-- Muted Speaker Icon -->
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <line x1="23" y1="9" x2="17" y2="15"/>
            <line x1="17" y1="9" x2="23" y2="15"/>
          </svg>
        } @else {
          <!-- Active Speaker Icon with Soundwaves -->
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
          </svg>
        }
      </span>
      <span class="status-indicator" [class.active]="!audio.isMuted()"></span>
    </button>
  `,
  styles: [`
    .sound-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.45rem;
      min-height: 44px;
      min-width: 44px;
      padding: 0.45rem 0.75rem;
      background: var(--glass-bg);
      backdrop-filter: var(--glass-blur);
      -webkit-backdrop-filter: var(--glass-blur);
      border: 1px solid var(--border-line-strong);
      border-radius: 999px;
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.25s var(--ease-cinematic);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);

      &:hover {
        background: rgba(102, 87, 245, 0.2);
        border-color: var(--accent-glow);
        transform: translateY(-1px);
        box-shadow: 0 6px 18px rgba(102, 87, 245, 0.35);
      }

      &:active {
        transform: translateY(0);
      }
    }

    .speaker-icon {
      display: flex;
      align-items: center;
      color: var(--text-muted);
      transition: color 0.2s ease;
    }

    .status-indicator {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--text-faint);
      transition: all 0.25s ease;

      &.active {
        background: var(--accent-success);
        box-shadow: 0 0 8px var(--accent-success);
      }
    }
  `]
})
export class SoundToggleComponent {
  protected readonly audio = inject(AudioService);
  protected readonly i18n = inject(I18nService);

  toggle(): void {
    this.audio.toggleMute();
  }
}
