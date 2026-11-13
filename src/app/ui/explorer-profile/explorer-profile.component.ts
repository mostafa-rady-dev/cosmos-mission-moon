import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  input,
  output,
  HostListener,
  AfterViewInit,
  viewChild,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../core/i18n.service';
import { AudioService } from '../../core/audio.service';
import { ExplorerProgressionService, Achievement } from '../../core/explorer-progression.service';
import { MISSIONS_DATA } from '../../../assets/missions/missions.config';

type ProfileTab = 'dossier' | 'history' | 'achievements';

@Component({
  selector: 'app-explorer-profile',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen()) {
      <div 
        class="profile-modal-backdrop"
        (click)="onBackdropClick($event)"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="i18n.currentTranslations().explorerProfileTitle"
      >
        <div #modalFrame class="profile-modal-frame">
          <div class="glass-reflection-sheen" aria-hidden="true"></div>

          <!-- Modal Header -->
          <div class="profile-header">
            <div class="header-titles">
              <div class="agency-tag-row">
                <span class="agency-tag">COSMOS // EXPLORER DOSSIER</span>
                <span class="status-certified-tag">
                  <span class="ping-dot"></span>
                  FLIGHT REGISTERED
                </span>
              </div>
              <h2 class="profile-heading">{{ i18n.currentTranslations().explorerProfileTitle }}</h2>
              <p class="profile-sub">{{ i18n.currentTranslations().explorerProfileSub }}</p>
            </div>

            <button 
              #closeButton
              class="profile-close-btn" 
              (click)="close()" 
              [attr.aria-label]="i18n.currentTranslations().closeModal"
            >
              ✕
            </button>
          </div>

          <!-- Navigation Tabs -->
          <div class="profile-tabs-bar">
            <nav class="profile-tabs-nav" aria-label="Profile Tabs">
              <button 
                class="tab-btn" 
                [class.active]="activeTab() === 'dossier'" 
                (click)="switchTab('dossier')"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>{{ i18n.currentTranslations().tabProfileOverview }}</span>
              </button>

              <button 
                class="tab-btn" 
                [class.active]="activeTab() === 'history'" 
                (click)="switchTab('history')"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>{{ i18n.currentTranslations().tabMissionHistory }}</span>
                <span class="badge-count">{{ progression.completedHistory().length }}</span>
              </button>

              <button 
                class="tab-btn" 
                [class.active]="activeTab() === 'achievements'" 
                (click)="switchTab('achievements')"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                <span>{{ i18n.currentTranslations().tabAchievements }}</span>
                <span class="badge-count">{{ progression.unlockedAchievementsCount() }} / {{ progression.achievements().length }}</span>
              </button>
            </nav>
          </div>

          <!-- Body Content based on Active Tab -->
          <div class="profile-body">
            <!-- TAB 1: DOSSIER & CREDENTIALS -->
            @if (activeTab() === 'dossier') {
              <div class="tab-pane-content dossier-grid">
                <!-- Left: Identity & Passport Card Preview -->
                <div class="dossier-card hud-panel">
                  <div class="dossier-hero-row">
                    <div class="avatar-hexagon">
                      <span class="avatar-glyph">🚀</span>
                    </div>
                    <div class="dossier-name-block">
                      <span class="passport-num geo-coord" dir="ltr">{{ passportData.passportId }}</span>
                      <h3 class="explorer-name">{{ passportData.fullName }}</h3>
                      <span class="explorer-callsign">CALL SIGN: <strong class="geo-coord" dir="ltr">{{ passportData.callSign }}</strong></span>
                    </div>
                  </div>

                  <div class="dossier-specs-list">
                    <div class="spec-row">
                      <span class="spec-lbl">{{ i18n.currentTranslations().levelLabel }}:</span>
                      <span class="spec-val highlight-cyan">{{ i18n.t(progression.currentRank().titleKey) }} (LVL 0{{ progression.currentRank().level }})</span>
                    </div>
                    <div class="spec-row">
                      <span class="spec-lbl">{{ i18n.currentTranslations().destinationLabel }}:</span>
                      <span class="spec-val">{{ passportData.destination }}</span>
                    </div>
                    <div class="spec-row">
                      <span class="spec-lbl">{{ i18n.currentTranslations().originStationLabel }}:</span>
                      <span class="spec-val geo-coord" dir="ltr">ASYUT, EGYPT (27.18°N, 31.18°E)</span>
                    </div>
                    <div class="spec-row">
                      <span class="spec-lbl">{{ i18n.currentTranslations().issueDateLabel }}:</span>
                      <span class="spec-val geo-coord" dir="ltr">{{ passportData.issueTimestamp }}</span>
                    </div>
                  </div>

                  <div class="dossier-action-bar">
                    <button class="btn-cinema open-passport-btn" (click)="openPassportWizard()">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <span>{{ i18n.currentTranslations().viewPassportCard }}</span>
                    </button>
                  </div>
                </div>

                <!-- Right: Experience & Career Progress -->
                <div class="career-progress-card hud-panel">
                  <h4 class="card-subtitle">{{ i18n.currentTranslations().xpLabel }}</h4>
                  <div class="xp-hero-display">
                    <span class="xp-big-num telemetry-num" dir="ltr">{{ progression.totalXp() }}</span>
                    <span class="xp-unit">XP</span>
                  </div>

                  <!-- Rank Progress Track -->
                  <div class="rank-track-container">
                    <div class="track-header">
                      <span>{{ i18n.t(progression.currentRank().titleKey) }}</span>
                      <span class="geo-coord" dir="ltr">{{ progression.currentRank().minXp }} / {{ progression.currentRank().nextLevelXp }} XP</span>
                    </div>
                    <div class="progress-bar-rail">
                      <div class="progress-bar-fill" [style.width.%]="progression.currentRank().progressPercent"></div>
                    </div>
                  </div>

                  <!-- Quick Career Milestones -->
                  <div class="career-stats-summary">
                    <div class="c-stat-box">
                      <span class="c-num">{{ progression.completedMissionsCount() }}</span>
                      <span class="c-lbl">{{ i18n.currentTranslations().completedCountLabel }}</span>
                    </div>
                    <div class="c-stat-box">
                      <span class="c-num">{{ progression.unlockedAchievementsCount() }}</span>
                      <span class="c-lbl">{{ i18n.currentTranslations().tabAchievements }}</span>
                    </div>
                    <div class="c-stat-box">
                      <span class="c-num">0{{ progression.currentRank().level }}</span>
                      <span class="c-lbl">{{ i18n.currentTranslations().levelLabel }}</span>
                    </div>
                  </div>
                </div>
              </div>
            }

            <!-- TAB 2: MISSION HISTORY -->
            @if (activeTab() === 'history') {
              <div class="tab-pane-content history-list-wrap">
                @if (progression.completedHistory().length === 0) {
                  <div class="empty-history-state">
                    <div class="empty-icon">🛰️</div>
                    <p class="empty-msg">{{ i18n.currentTranslations().noCompletedMissions }}</p>
                  </div>
                } @else {
                  <div class="history-cards-col">
                    @for (record of progression.completedHistory(); track record.missionId) {
                      <div class="history-item-card">
                        <div class="hist-badge">✓</div>
                        <div class="hist-details">
                          <h4 class="hist-title">{{ getMissionTitle(record.missionId) }}</h4>
                          <span class="hist-meta geo-coord" dir="ltr">
                            COMPLETED: {{ record.completedAt | slice:0:10 }} · +{{ record.xpEarned }} XP AWARDED
                          </span>
                        </div>
                        <span class="hist-certified-seal">CERTIFIED</span>
                      </div>
                    }
                  </div>
                }
              </div>
            }

            <!-- TAB 3: ACHIEVEMENTS -->
            @if (activeTab() === 'achievements') {
              <div class="tab-pane-content achievements-grid-wrap">
                <div class="achievements-cards-grid">
                  @for (ach of progression.achievements(); track ach.id) {
                    <div 
                      class="achievement-badge-card" 
                      [class.unlocked]="ach.isUnlocked"
                    >
                      <div class="badge-icon-box">
                        <span class="badge-glyph">{{ ach.icon }}</span>
                        @if (!ach.isUnlocked) {
                          <span class="lock-overlay">🔒</span>
                        }
                      </div>

                      <div class="badge-info">
                        <div class="badge-title-row">
                          <h4 class="badge-name">{{ i18n.t(ach.titleKey) }}</h4>
                          <span class="badge-xp-reward">+{{ ach.xpReward }} XP</span>
                        </div>
                        <p class="badge-description">{{ i18n.t(ach.descKey) }}</p>

                        <div class="badge-status-row">
                          @if (ach.isUnlocked) {
                            <span class="status-unlocked-tag">
                              ✓ {{ i18n.currentTranslations().achUnlocked }} ({{ ach.unlockedAt }})
                            </span>
                          } @else {
                            <div class="ach-progress-bar-wrap">
                              <div class="ach-rail">
                                <div class="ach-fill" [style.width.%]="(ach.progress / ach.maxProgress) * 100"></div>
                              </div>
                              <span class="ach-counter">{{ ach.progress }} / {{ ach.maxProgress }}</span>
                            </div>
                          }
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .profile-modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 10003;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(8, 11, 26, 0.88);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      padding: 1.25rem;
      animation: modalFadeIn 0.3s ease-out;
    }

    .profile-modal-frame {
      position: relative;
      width: 100%;
      max-width: 980px;
      max-height: 90vh;
      overflow-y: auto;
      border: 2px solid var(--accent-glow);
      border-radius: 28px;
      background: rgba(17, 26, 53, 0.96);
      box-shadow: 0 0 60px rgba(54, 197, 240, 0.35), inset 0 0 40px rgba(102, 87, 245, 0.15);
      display: flex;
      flex-direction: column;
      animation: visorExpand 0.35s var(--ease-cinematic);
    }

    .glass-reflection-sheen {
      position: absolute;
      top: 0;
      left: 10%;
      right: 10%;
      height: 25%;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, transparent 100%);
      border-radius: 28px 28px 0 0;
      pointer-events: none;
      z-index: 5;
    }

    /* Header */
    .profile-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      padding: 1.5rem 2rem 1rem;
      border-bottom: 1px dashed var(--border-line-strong);
      position: relative;
      z-index: 10;
    }

    .agency-tag-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.35rem;
    }

    .agency-tag {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--accent-glow);
      background: rgba(54, 197, 240, 0.12);
      border: 1px solid rgba(54, 197, 240, 0.3);
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      letter-spacing: 0.08em;
    }

    .status-certified-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      font-family: var(--font-mono);
      font-size: 0.68rem;
      color: var(--accent-success);
    }

    .ping-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--accent-success);
      box-shadow: 0 0 8px var(--accent-success);
      animation: pulseAnim 1.4s infinite;
    }

    .profile-heading {
      font-family: var(--font-display);
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 0.2rem;
    }

    .profile-sub {
      font-size: 0.82rem;
      color: var(--text-muted);
    }

    .profile-close-btn {
      width: 44px;
      height: 44px;
      min-width: 44px;
      min-height: 44px;
      border-radius: 50%;
      background: rgba(244, 245, 255, 0.08);
      border: 1px solid var(--border-line-strong);
      color: var(--text-primary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(244, 81, 79, 0.25);
        border-color: var(--accent-danger);
        color: var(--accent-danger);
        transform: rotate(90deg);
      }
    }

    /* Tabs Bar */
    .profile-tabs-bar {
      padding: 0.75rem 2rem;
      background: rgba(8, 11, 26, 0.4);
      border-bottom: 1px solid var(--border-line);
    }

    .profile-tabs-nav {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .tab-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      background: transparent;
      border: 1px solid var(--border-line);
      color: var(--text-muted);
      padding: 0.4rem 0.9rem;
      min-height: 40px;
      border-radius: 999px;
      font-family: var(--font-display);
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        color: var(--text-primary);
        border-color: var(--accent-glow);
      }

      &.active {
        background: var(--accent-primary);
        border-color: var(--accent-glow);
        color: #fff;
        box-shadow: 0 0 12px rgba(102, 87, 245, 0.4);
      }
    }

    .badge-count {
      font-size: 0.65rem;
      font-family: var(--font-mono);
      background: rgba(8, 11, 26, 0.6);
      padding: 0.1rem 0.45rem;
      border-radius: 999px;
    }

    /* Body */
    .profile-body {
      padding: 1.5rem 2rem;
      flex: 1;
    }

    .dossier-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 1.5rem;

      @media (max-width: 820px) {
        grid-template-columns: 1fr;
      }
    }

    .dossier-card {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .dossier-hero-row {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .avatar-hexagon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      background: rgba(8, 11, 26, 0.8);
      border: 1px solid var(--accent-glow);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.6rem;
      flex-shrink: 0;
    }

    .passport-num {
      font-family: var(--font-mono);
      font-size: 0.68rem;
      color: var(--accent-glow);
      font-weight: 700;
    }

    .explorer-name {
      font-family: var(--font-display);
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--text-primary);
    }

    .explorer-callsign {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--text-muted);
    }

    .dossier-specs-list {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      background: rgba(8, 11, 26, 0.5);
      border: 1px solid var(--border-line);
      border-radius: 8px;
      padding: 0.75rem 0.85rem;
    }

    .spec-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.78rem;
    }

    .spec-lbl {
      color: var(--text-muted);
      font-family: var(--font-mono);
      font-size: 0.7rem;
    }

    .spec-val {
      font-weight: 600;
      color: var(--text-primary);

      &.highlight-cyan { color: var(--accent-glow); }
    }

    .open-passport-btn {
      width: 100%;
      font-size: 0.88rem;
    }

    /* Career Progress Card */
    .career-progress-card {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .card-subtitle {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--text-muted);
      text-transform: uppercase;
    }

    .xp-hero-display {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
    }

    .xp-big-num {
      font-size: 2.8rem;
      font-weight: 900;
      color: var(--accent-glow);
      line-height: 1;
    }

    .xp-unit {
      font-family: var(--font-mono);
      font-size: 1rem;
      color: #A79BFD;
      font-weight: 700;
    }

    .rank-track-container {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .track-header {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .progress-bar-rail {
      width: 100%;
      height: 8px;
      background: rgba(244, 245, 255, 0.1);
      border-radius: 999px;
      overflow: hidden;
    }

    .progress-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent-primary), var(--accent-glow));
      border-radius: 999px;
      transition: width 0.3s ease;
    }

    .career-stats-summary {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 0.75rem;
    }

    .c-stat-box {
      background: rgba(8, 11, 26, 0.5);
      border: 1px solid var(--border-line);
      border-radius: 8px;
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.2rem;
    }

    .c-num {
      font-family: var(--font-mono);
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--accent-glow);
    }

    .c-lbl {
      font-size: 0.65rem;
      color: var(--text-muted);
      text-align: center;
    }

    /* History Tab */
    .empty-history-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 1rem;
      gap: 1rem;
      color: var(--text-muted);
    }

    .empty-icon {
      font-size: 2.5rem;
    }

    .history-cards-col {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .history-item-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: rgba(8, 11, 26, 0.6);
      border: 1px solid var(--border-line);
      border-radius: 12px;
      padding: 1rem 1.25rem;
    }

    .hist-badge {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--accent-success);
      color: #080B1A;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      flex-shrink: 0;
    }

    .hist-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .hist-title {
      font-size: 0.95rem;
      color: var(--text-primary);
    }

    .hist-meta {
      font-size: 0.7rem;
      color: var(--text-faint);
    }

    .hist-certified-seal {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      font-weight: 800;
      color: var(--accent-glow);
      background: rgba(54, 197, 240, 0.1);
      border: 1px solid rgba(54, 197, 240, 0.3);
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
    }

    /* Achievements Tab */
    .achievements-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }

    .achievement-badge-card {
      background: rgba(8, 11, 26, 0.6);
      border: 1px solid var(--border-line);
      border-radius: 12px;
      padding: 1rem;
      display: flex;
      align-items: flex-start;
      gap: 0.85rem;
      transition: all 0.25s ease;

      &.unlocked {
        border-color: rgba(62, 200, 125, 0.4);
        background: rgba(8, 11, 26, 0.85);
        box-shadow: 0 0 16px rgba(62, 200, 125, 0.15);
      }
    }

    .badge-icon-box {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      background: rgba(8, 11, 26, 0.8);
      border: 1px solid var(--border-line-strong);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      flex-shrink: 0;
    }

    .badge-glyph {
      font-size: 1.5rem;
    }

    .lock-overlay {
      position: absolute;
      bottom: -4px;
      right: -4px;
      font-size: 0.75rem;
    }

    .badge-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .badge-title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .badge-name {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .badge-xp-reward {
      font-family: var(--font-mono);
      font-size: 0.68rem;
      color: #A79BFD;
      font-weight: 700;
    }

    .badge-description {
      font-size: 0.75rem;
      color: var(--text-muted);
      line-height: 1.4;
    }

    .status-unlocked-tag {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      color: var(--accent-success);
      font-weight: 700;
    }

    .ach-progress-bar-wrap {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.2rem;
    }

    .ach-rail {
      flex: 1;
      height: 4px;
      background: rgba(244, 245, 255, 0.1);
      border-radius: 999px;
      overflow: hidden;
    }

    .ach-fill {
      height: 100%;
      background: var(--accent-glow);
      border-radius: 999px;
    }

    .ach-counter {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      color: var(--text-faint);
    }
  `]
})
export class ExplorerProfileComponent implements AfterViewInit {
  protected readonly i18n = inject(I18nService);
  protected readonly progression = inject(ExplorerProgressionService);
  private readonly audio = inject(AudioService);

  readonly isOpen = input<boolean>(false);
  readonly closeModal = output<void>();
  readonly openPassportEvent = output<void>();

  readonly closeButton = viewChild<ElementRef<HTMLButtonElement>>('closeButton');
  readonly modalFrame = viewChild<ElementRef<HTMLElement>>('modalFrame');
  readonly activeTab = signal<ProfileTab>('dossier');

  private previousActiveElement: HTMLElement | null = null;

  // Resolved passport data
  passportData = {
    passportId: 'ASY-EXP-7721',
    fullName: 'Ahmed Mostafa',
    callSign: 'FALCON-99',
    destination: 'The Moon (Mare Tranquillitatis)',
    issueTimestamp: '2026.10.30 // 04:00 UTC'
  };

  constructor() {
    this.refreshPassportData();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen()) {
      this.close();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Tab') {
      const container = this.modalFrame()?.nativeElement;
      if (!container) return;
      const focusable = container.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.isOpen()) {
      this.refreshPassportData();
      if (typeof document !== 'undefined') {
        this.previousActiveElement = document.activeElement as HTMLElement;
      }
      this.closeButton()?.nativeElement.focus();
    }
  }

  onBackdropClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('profile-modal-backdrop')) {
      this.close();
    }
  }

  close(): void {
    this.audio.playBeep(650, 0.08);
    this.closeModal.emit();
    this.previousActiveElement?.focus();
  }

  switchTab(tab: ProfileTab): void {
    this.activeTab.set(tab);
    this.audio.playBeep(900, 0.04);
  }

  openPassportWizard(): void {
    this.close();
    this.openPassportEvent.emit();
  }

  getMissionTitle(id: string): string {
    const m = MISSIONS_DATA.find(item => item.id === id);
    if (!m) return id;
    return this.i18n.currentLang() === 'ar' ? m.titleAr : m.titleEn;
  }

  private refreshPassportData(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      const raw = localStorage.getItem('COSMOS_EXPLORER_PASSPORT');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.passportId) this.passportData.passportId = parsed.passportId;
        if (parsed.fullName) this.passportData.fullName = parsed.fullName;
        if (parsed.callSign) this.passportData.callSign = parsed.callSign;
        if (parsed.destination) this.passportData.destination = parsed.destination;
        if (parsed.issueTimestamp) this.passportData.issueTimestamp = parsed.issueTimestamp;
      }
    } catch {
      // ignore
    }
  }
}

