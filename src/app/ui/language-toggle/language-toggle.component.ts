import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../core/i18n.service';
import { AudioService } from '../../core/audio.service';

@Component({
  selector: 'app-language-toggle',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button 
      class="lang-btn" 
      (click)="toggle()"
      [attr.aria-label]="i18n.currentLang() === 'ar' ? 'Switch to English' : 'التحويل للغة العربية'"
      title="Switch Language / تبديل اللغة"
    >
      <span class="globe-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      </span>
      <span class="lang-text">{{ i18n.currentTranslations().switchLang }}</span>
      <span class="lang-pill">{{ i18n.currentLang() === 'ar' ? 'EN' : 'AR' }}</span>
    </button>
  `,
  styles: [`
    .lang-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      min-height: 44px;
      padding: 0.45rem 0.95rem;
      background: var(--glass-bg);
      backdrop-filter: var(--glass-blur);
      -webkit-backdrop-filter: var(--glass-blur);
      border: 1px solid var(--border-line-strong);
      border-radius: 999px;
      color: var(--text-primary);
      font-family: var(--font-body);
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.25s var(--ease-cinematic);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);

      &:hover {
        background: rgba(102, 87, 245, 0.2);
        border-color: var(--accent-glow);
        transform: translateY(-1px);
        box-shadow: 0 6px 18px rgba(102, 87, 245, 0.35);

        .globe-icon {
          color: var(--accent-glow);
          transform: rotate(20deg);
        }
      }

      &:active {
        transform: translateY(0);
      }
    }

    .globe-icon {
      display: flex;
      align-items: center;
      color: var(--accent-glow);
      transition: transform 0.3s ease, color 0.3s ease;
    }

    .lang-text {
      font-size: 0.85rem;
      letter-spacing: 0.02em;
    }

    .lang-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-mono);
      font-size: 0.65rem;
      font-weight: 700;
      padding: 0.15rem 0.35rem;
      background: rgba(244, 245, 255, 0.12);
      border-radius: 4px;
      color: var(--accent-glow);
    }
  `]
})
export class LanguageToggleComponent {
  protected readonly i18n = inject(I18nService);
  private readonly audio = inject(AudioService);

  toggle(): void {
    this.audio.playBeep(980, 0.06);
    this.i18n.toggleLanguage();
  }
}
