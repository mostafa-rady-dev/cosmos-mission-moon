import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  input,
  output,
  viewChild,
  ElementRef,
  HostListener,
  AfterViewInit,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../core/i18n.service';
import { AudioService } from '../../core/audio.service';

export type DestinationType = 'moon' | 'mars' | 'jupiter' | 'saturn' | 'deep-space';
export type MissionRoleType = 'astrobiology' | 'pilot' | 'engineer' | 'scientist';

interface PassportData {
  passportId: string;
  fullName: string;
  callSign: string;
  originStation: string;
  destination: DestinationType;
  role: MissionRoleType;
  issueTimestamp: string;
}

@Component({
  selector: 'app-explorer-passport',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen()) {
      <div 
        class="passport-modal-backdrop"
        (click)="onBackdropClick($event)"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="i18n.currentTranslations().passportTitle"
      >
        <div #modalFrame class="passport-modal-container">
          <!-- Top Holographic Sheen & Border -->
          <div class="modal-sheen" aria-hidden="true"></div>

          <!-- Modal Header -->
          <div class="passport-modal-header">
            <div class="header-titles">
              <div class="badge-row">
                <span class="agency-badge">COSMOS // REGISTRY</span>
                <span class="step-indicator">PHASE 0{{ currentStep() }} / 05</span>
              </div>
              <h2 class="passport-heading">{{ i18n.currentTranslations().passportTitle }}</h2>
              <p class="passport-sub">{{ i18n.currentTranslations().passportSub }}</p>
            </div>

            <button 
              class="modal-close-btn" 
              (click)="close()" 
              [attr.aria-label]="i18n.currentTranslations().closeModal"
            >
              ✕
            </button>
          </div>

          <!-- Wizard Step Progress Bar -->
          <div class="wizard-stepper-bar">
            @for (s of [1, 2, 3, 4, 5]; track s) {
              <div 
                class="step-segment" 
                [class.active]="currentStep() === s"
                [class.completed]="currentStep() > s"
              >
                <div class="step-num">{{ s }}</div>
                <div class="step-line" *ngIf="s < 5"></div>
              </div>
            }
          </div>

          <!-- Wizard Body -->
          <div class="passport-modal-body">
            <!-- STEP 1: IDENTITY -->
            @if (currentStep() === 1) {
              <div class="wizard-step-pane">
                <div class="step-intro">
                  <h3 class="step-title">{{ i18n.currentTranslations().step1Title }}</h3>
                  <p class="step-desc">{{ i18n.currentLang() === 'ar' ? 'سجّل هويتك الرسمية في سجل رواد الفضاء المعتمد لدى مساحة أسيوط الفضائية.' : 'Register your official explorer identity in the Asyut Space certified flight registry.' }}</p>
                </div>

                <div class="form-fields-grid">
                  <div class="form-group">
                    <label class="field-label" for="full-name">
                      {{ i18n.currentTranslations().fullNameLabel }} *
                    </label>
                    <input 
                      id="full-name"
                      type="text" 
                      class="form-input" 
                      [placeholder]="i18n.currentTranslations().fullNamePlaceholder"
                      [value]="fullName()"
                      (input)="onFullNameChange($event)"
                      maxlength="40"
                    />
                    @if (showValidation() && !isNameValid()) {
                      <span class="validation-msg">{{ i18n.currentTranslations().requiredFieldError }}</span>
                    }
                  </div>

                  <div class="form-group">
                    <label class="field-label" for="call-sign">
                      {{ i18n.currentTranslations().callSignLabel }} *
                    </label>
                    <input 
                      id="call-sign"
                      type="text" 
                      class="form-input mono-input" 
                      [placeholder]="i18n.currentTranslations().callSignPlaceholder"
                      [value]="callSign()"
                      (input)="onCallSignChange($event)"
                      maxlength="20"
                    />
                    @if (showValidation() && !isCallSignValid()) {
                      <span class="validation-msg">{{ i18n.currentTranslations().requiredFieldError }}</span>
                    }
                  </div>

                  <div class="form-group">
                    <label class="field-label" for="origin-station">
                      {{ i18n.currentTranslations().originStationLabel }}
                    </label>
                    <input 
                      id="origin-station"
                      type="text" 
                      class="form-input readonly-input geo-coord" 
                      [value]="originStation()"
                      readonly
                    />
                  </div>
                </div>
              </div>
            }

            <!-- STEP 2: DESTINATION -->
            @if (currentStep() === 2) {
              <div class="wizard-step-pane">
                <div class="step-intro">
                  <h3 class="step-title">{{ i18n.currentTranslations().step2Title }}</h3>
                  <p class="step-desc">{{ i18n.currentTranslations().selectDestination }}</p>
                </div>

                <div class="cards-select-grid">
                  @for (d of destinationsList; track d.id) {
                    <div 
                      class="choice-card"
                      [class.selected]="destination() === d.id"
                      (click)="selectDestination(d.id)"
                    >
                      <div class="choice-icon-wrap">
                        <span class="dest-glyph">{{ d.glyph }}</span>
                      </div>
                      <div class="choice-meta">
                        <h4 class="choice-name">{{ i18n.currentLang() === 'ar' ? d.nameAr : d.nameEn }}</h4>
                        <span class="choice-coords geo-coord" dir="ltr">{{ d.coords }}</span>
                        <p class="choice-desc">{{ i18n.currentLang() === 'ar' ? d.descAr : d.descEn }}</p>
                      </div>
                      <div class="radio-indicator"></div>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- STEP 3: MISSION ROLE -->
            @if (currentStep() === 3) {
              <div class="wizard-step-pane">
                <div class="step-intro">
                  <h3 class="step-title">{{ i18n.currentTranslations().step3Title }}</h3>
                  <p class="step-desc">{{ i18n.currentTranslations().selectRole }}</p>
                </div>

                <div class="cards-select-grid">
                  @for (r of rolesList; track r.id) {
                    <div 
                      class="choice-card"
                      [class.selected]="role() === r.id"
                      (click)="selectRole(r.id)"
                    >
                      <div class="choice-icon-wrap">
                        <span class="role-badge-tag">{{ r.code }}</span>
                      </div>
                      <div class="choice-meta">
                        <h4 class="choice-name">{{ i18n.currentLang() === 'ar' ? r.nameAr : r.nameEn }}</h4>
                        <p class="choice-desc">{{ i18n.currentLang() === 'ar' ? r.descAr : r.descEn }}</p>
                      </div>
                      <div class="radio-indicator"></div>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- STEP 4: FLIGHT TELEMETRY -->
            @if (currentStep() === 4) {
              <div class="wizard-step-pane">
                <div class="step-intro">
                  <h3 class="step-title">{{ i18n.currentTranslations().step4Title }}</h3>
                  <p class="step-desc">{{ i18n.currentLang() === 'ar' ? 'مراجعة قياسات المسار المداري والمواصفات الفنية للرحلة قبل اعتماد وثيقة الجواز.' : 'Review target orbital trajectory telemetry and mission specifications prior to authorization.' }}</p>
                </div>

                <div class="telemetry-preview-board hud-panel">
                  <div class="preview-header-bar">
                    <span class="mission-flight-tag">TRAJECTORY PROFILE // ASY-NAV-{{ destination().toUpperCase() }}</span>
                    <span class="status-live-tag">READY FOR CERTIFICATION</span>
                  </div>

                  <div class="preview-data-grid">
                    <div class="preview-item">
                      <span class="p-label">{{ i18n.currentLang() === 'ar' ? 'رائد الفضاء' : 'Explorer Identity' }}</span>
                      <span class="p-value">{{ fullName() }} ({{ callSign() }})</span>
                    </div>
                    <div class="preview-item">
                      <span class="p-label">{{ i18n.currentLang() === 'ar' ? 'التخصص الميداني' : 'Crew Specialty' }}</span>
                      <span class="p-value highlight-purple">{{ currentRoleData()?.nameEn }}</span>
                    </div>
                    <div class="preview-item">
                      <span class="p-label">{{ i18n.currentTranslations().destinationLabel }}</span>
                      <span class="p-value highlight-cyan">{{ currentDestinationData()?.nameEn }}</span>
                    </div>
                    <div class="preview-item">
                      <span class="p-label">{{ i18n.currentTranslations().targetCoordsLabel }}</span>
                      <span class="p-value geo-coord" dir="ltr">{{ currentDestinationData()?.coords }}</span>
                    </div>
                    <div class="preview-item">
                      <span class="p-label">{{ i18n.currentTranslations().distanceLabel }}</span>
                      <span class="p-value geo-coord" dir="ltr">{{ currentDestinationData()?.distance }}</span>
                    </div>
                    <div class="preview-item">
                      <span class="p-label">{{ i18n.currentLang() === 'ar' ? 'مدة العبور المداري' : 'Estimated Transit' }}</span>
                      <span class="p-value">{{ currentDestinationData()?.transit }}</span>
                    </div>
                  </div>

                  <div class="environment-brief">
                    <span class="env-label">{{ i18n.currentLang() === 'ar' ? 'البيئة والظروف الفيزيائية:' : 'Target Environmental Parameters:' }}</span>
                    <p class="env-text">{{ currentDestinationData()?.environment }}</p>
                  </div>
                </div>
              </div>
            }

            <!-- STEP 5: HOLOGRAPHIC PASSPORT -->
            @if (currentStep() === 5) {
              <div class="wizard-step-pane">
                <div class="step-intro text-center">
                  <span class="approved-badge">{{ i18n.currentTranslations().statusApproved }}</span>
                  <h3 class="step-title">{{ i18n.currentTranslations().step5Title }}</h3>
                </div>

                <!-- Holographic Passport Card Container -->
                <div #passportCardElement class="holographic-credential-card">
                  <!-- Holographic Foil Sheen & Security Pattern -->
                  <div class="holo-foil-layer" aria-hidden="true"></div>
                  <div class="holo-watermark" aria-hidden="true">COSMOS</div>

                  <!-- Card Header -->
                  <div class="card-head-strip">
                    <div class="card-agency">
                      <div class="agency-mini-logo">ASYUT</div>
                      <div class="agency-title-wrap">
                        <span class="agency-sub">OFFICIAL FLIGHT CREDENTIAL</span>
                        <span class="agency-main">COSMOS SPACE EXPLORER REGISTRY</span>
                      </div>
                    </div>
                    <div class="card-id-block">
                      <span class="id-label">{{ i18n.currentTranslations().passportIdLabel }}</span>
                      <span class="id-val geo-coord" dir="ltr">{{ passportId() }}</span>
                    </div>
                  </div>

                  <!-- Card Main Body -->
                  <div class="card-content-grid">
                    <div class="card-explorer-profile">
                      <div class="profile-avatar-box">
                        <span class="avatar-glyph">🚀</span>
                        <span class="avatar-rank">{{ currentRoleData()?.code }}</span>
                      </div>
                      <div class="profile-info-block">
                        <span class="profile-name">{{ fullName() }}</span>
                        <span class="profile-callsign">CALL SIGN: <strong class="geo-coord" dir="ltr">{{ callSign() }}</strong></span>
                        <span class="profile-role">{{ i18n.currentLang() === 'ar' ? currentRoleData()?.nameAr : currentRoleData()?.nameEn }}</span>
                      </div>
                    </div>

                    <div class="card-flight-details">
                      <div class="flight-row">
                        <span class="detail-label">{{ i18n.currentTranslations().destinationLabel }}:</span>
                        <span class="detail-value highlight-cyan">{{ i18n.currentLang() === 'ar' ? currentDestinationData()?.nameAr : currentDestinationData()?.nameEn }}</span>
                      </div>
                      <div class="flight-row">
                        <span class="detail-label">{{ i18n.currentTranslations().targetCoordsLabel }}:</span>
                        <span class="detail-value geo-coord" dir="ltr">{{ currentDestinationData()?.coords }}</span>
                      </div>
                      <div class="flight-row">
                        <span class="detail-label">{{ i18n.currentTranslations().originStationLabel }}:</span>
                        <span class="detail-value geo-coord" dir="ltr">ASYUT, EGYPT (27.18°N, 31.18°E)</span>
                      </div>
                      <div class="flight-row">
                        <span class="detail-label">{{ i18n.currentTranslations().issueDateLabel }}:</span>
                        <span class="detail-value geo-coord" dir="ltr">{{ issueTimestamp() }}</span>
                      </div>
                    </div>

                    <!-- Security Seal Canvas -->
                    <div class="card-security-seal-wrap">
                      <canvas #sealCanvas class="security-seal-canvas" width="100" height="100"></canvas>
                      <span class="seal-caption">{{ i18n.currentTranslations().securitySealLabel }}</span>
                    </div>
                  </div>

                  <!-- Barcode Strip Footer -->
                  <div class="card-barcode-strip">
                    <div class="simulated-barcode" aria-hidden="true"></div>
                    <span class="barcode-text geo-coord" dir="ltr">ASY-EXP-{{ passportId() }}-CERTIFIED-FLIGHT-DECK</span>
                  </div>
                </div>

                <!-- Action Buttons: Download & Share -->
                <div class="passport-actions-row">
                  <button class="btn-cinema download-btn" (click)="downloadPassportPng()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    <span>{{ i18n.currentTranslations().downloadPassportBtn }}</span>
                  </button>

                  <button class="btn-secondary-deck" (click)="copyShareCode()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                    <span>{{ isCopied() ? i18n.currentTranslations().shareCopiedToast : i18n.currentTranslations().copyShareCodeBtn }}</span>
                  </button>
                </div>
              </div>
            }
          </div>

          <!-- Wizard Footer Navigation Controls -->
          <div class="passport-modal-footer">
            @if (currentStep() > 1 && currentStep() < 5) {
              <button class="btn-secondary-deck" (click)="prevStep()">
                <span>← {{ i18n.currentTranslations().prevStepBtn }}</span>
              </button>
            } @else {
              <div></div>
            }

            @if (currentStep() < 4) {
              <button class="btn-cinema" (click)="nextStep()">
                <span>{{ i18n.currentTranslations().nextStepBtn }} →</span>
              </button>
            } @else if (currentStep() === 4) {
              <button class="btn-cinema" (click)="generateAndIssuePassport()">
                <span>{{ i18n.currentTranslations().generatePassportBtn }} 🚀</span>
              </button>
            } @else {
              <button class="btn-secondary-deck" (click)="resetWizard()">
                <span>{{ i18n.currentLang() === 'ar' ? 'إنشاء جواز جديد' : 'Issue Another Passport' }}</span>
              </button>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .passport-modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 10001;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(8, 11, 26, 0.88);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      padding: 1.25rem;
      animation: modalFadeIn 0.3s ease-out;
    }

    .passport-modal-container {
      position: relative;
      width: 100%;
      max-width: 860px;
      max-height: 90vh;
      overflow-y: auto;
      border: 2px solid var(--accent-glow);
      border-radius: 28px;
      background: rgba(17, 26, 53, 0.95);
      box-shadow: 0 0 60px rgba(54, 197, 240, 0.35), inset 0 0 40px rgba(102, 87, 245, 0.15);
      display: flex;
      flex-direction: column;
      animation: modalExpand 0.35s var(--ease-cinematic);
    }

    .modal-sheen {
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

    .passport-modal-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      padding: 1.5rem 2rem 1rem;
      border-bottom: 1px dashed var(--border-line-strong);
      position: relative;
      z-index: 10;
    }

    .badge-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.4rem;
    }

    .agency-badge {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      color: var(--accent-glow);
      background: rgba(54, 197, 240, 0.12);
      border: 1px solid rgba(54, 197, 240, 0.3);
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      letter-spacing: 0.08em;
    }

    .step-indicator {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      color: var(--accent-primary);
      font-weight: 700;
    }

    .passport-heading {
      font-family: var(--font-display);
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--text-primary);
      line-height: 1.25;
      margin-bottom: 0.25rem;
    }

    .passport-sub {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .modal-close-btn {
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
      font-size: 1.15rem;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(244, 81, 79, 0.25);
        border-color: var(--accent-danger);
        color: var(--accent-danger);
        transform: rotate(90deg);
      }
    }

    /* Stepper Bar */
    .wizard-stepper-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.85rem 2rem;
      background: rgba(8, 11, 26, 0.4);
      border-bottom: 1px solid var(--border-line);
    }

    .step-segment {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .step-num {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(244, 245, 255, 0.08);
      border: 1px solid var(--border-line);
      color: var(--text-muted);
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.25s ease;
    }

    .step-segment.active .step-num {
      background: var(--accent-primary);
      border-color: var(--accent-glow);
      color: #fff;
      box-shadow: 0 0 12px rgba(102, 87, 245, 0.5);
    }

    .step-segment.completed .step-num {
      background: var(--accent-success);
      border-color: #fff;
      color: #080B1A;
    }

    .step-line {
      width: 40px;
      height: 2px;
      background: rgba(244, 245, 255, 0.1);

      @media (max-width: 480px) {
        width: 16px;
      }
    }

    .step-segment.completed .step-line {
      background: var(--accent-success);
    }

    /* Wizard Body */
    .passport-modal-body {
      padding: 1.5rem 2rem;
      flex: 1;
    }

    .wizard-step-pane {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      animation: stepFade 0.25s ease-out;
    }

    .step-intro {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;

      &.text-center {
        align-items: center;
        text-align: center;
      }
    }

    .step-title {
      font-family: var(--font-display);
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .step-desc {
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    /* Form Fields */
    .form-fields-grid {
      display: flex;
      flex-direction: column;
      gap: 1.15rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .field-label {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .form-input {
      width: 100%;
      background: rgba(8, 11, 26, 0.75);
      border: 1px solid var(--border-line-strong);
      border-radius: 8px;
      padding: 0.75rem 1rem;
      color: var(--text-primary);
      font-family: var(--font-body);
      font-size: 0.95rem;
      outline: none;
      transition: all 0.2s ease;

      &:focus {
        border-color: var(--accent-glow);
        box-shadow: 0 0 16px rgba(54, 197, 240, 0.3);
      }

      &.mono-input {
        font-family: var(--font-mono);
        letter-spacing: 0.05em;
      }

      &.readonly-input {
        background: rgba(8, 11, 26, 0.4);
        color: var(--accent-glow);
        border-color: rgba(54, 197, 240, 0.2);
        cursor: not-allowed;
      }
    }

    .validation-msg {
      font-size: 0.72rem;
      color: var(--accent-danger);
      font-weight: 600;
    }

    /* Choice Cards Grid */
    .cards-select-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 0.85rem;
    }

    .choice-card {
      background: rgba(8, 11, 26, 0.6);
      border: 1px solid var(--border-line);
      border-radius: 12px;
      padding: 1rem;
      cursor: pointer;
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      position: relative;
      transition: all 0.25s ease;

      &:hover {
        border-color: var(--accent-glow);
        transform: translateY(-2px);
        background: rgba(8, 11, 26, 0.85);
      }

      &.selected {
        border-color: var(--accent-primary);
        background: rgba(102, 87, 245, 0.12);
        box-shadow: 0 0 20px rgba(102, 87, 245, 0.35);

        .radio-indicator {
          border-color: var(--accent-glow);
          background: var(--accent-primary);
          box-shadow: 0 0 8px var(--accent-glow);
        }
      }
    }

    .choice-icon-wrap {
      flex-shrink: 0;
    }

    .dest-glyph {
      font-size: 1.5rem;
    }

    .role-badge-tag {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      font-weight: 800;
      color: var(--accent-glow);
      background: rgba(54, 197, 240, 0.15);
      border: 1px solid rgba(54, 197, 240, 0.35);
      padding: 0.2rem 0.45rem;
      border-radius: 4px;
    }

    .choice-meta {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .choice-name {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .choice-coords {
      font-size: 0.68rem;
      color: var(--accent-glow);
    }

    .choice-desc {
      font-size: 0.78rem;
      color: var(--text-muted);
      line-height: 1.4;
    }

    .radio-indicator {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 1px solid var(--border-line-strong);
      margin-top: 4px;
      flex-shrink: 0;
    }

    /* Step 4 Telemetry Preview Board */
    .telemetry-preview-board {
      padding: 1.25rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.15rem;
    }

    .preview-header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px dashed var(--border-line);
      padding-bottom: 0.6rem;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .mission-flight-tag {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--accent-glow);
      font-weight: 700;
    }

    .status-live-tag {
      font-family: var(--font-mono);
      font-size: 0.68rem;
      color: var(--accent-success);
    }

    .preview-data-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .preview-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .p-label {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      color: var(--text-muted);
      text-transform: uppercase;
    }

    .p-value {
      font-size: 0.92rem;
      font-weight: 700;
      color: var(--text-primary);

      &.highlight-cyan { color: var(--accent-glow); }
      &.highlight-purple { color: #A79BFD; }
    }

    .environment-brief {
      background: rgba(8, 11, 26, 0.6);
      border-radius: 8px;
      padding: 0.75rem 1rem;
      border: 1px solid var(--border-line);
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .env-label {
      font-family: var(--font-mono);
      font-size: 0.68rem;
      color: var(--accent-glow);
    }

    .env-text {
      font-size: 0.82rem;
      color: var(--text-muted);
      line-height: 1.45;
    }

    /* STEP 5 HOLOGRAPHIC CARD */
    .approved-badge {
      display: inline-block;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 800;
      color: var(--accent-success);
      background: rgba(62, 200, 125, 0.12);
      border: 1px solid rgba(62, 200, 125, 0.4);
      padding: 0.25rem 0.85rem;
      border-radius: 999px;
      letter-spacing: 0.08em;
    }

    .holographic-credential-card {
      position: relative;
      border-radius: 20px;
      background: linear-gradient(135deg, rgba(24, 35, 70, 0.95) 0%, rgba(8, 11, 26, 0.98) 100%);
      border: 2px solid var(--accent-glow);
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.8), 0 0 30px rgba(54, 197, 240, 0.3), inset 0 0 30px rgba(102, 87, 245, 0.2);
      overflow: hidden;
      padding: 1.5rem 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .holo-foil-layer {
      position: absolute;
      inset: -50%;
      background: linear-gradient(
        115deg,
        transparent 35%,
        rgba(54, 197, 240, 0.12) 45%,
        rgba(102, 87, 245, 0.15) 50%,
        rgba(62, 200, 125, 0.12) 55%,
        transparent 65%
      );
      pointer-events: none;
      animation: holoSheen 6s infinite linear;
      z-index: 2;
    }

    .holo-watermark {
      position: absolute;
      right: 5%;
      bottom: 10%;
      font-family: var(--font-display);
      font-size: 7rem;
      font-weight: 900;
      color: rgba(244, 245, 255, 0.02);
      letter-spacing: 0.2em;
      pointer-events: none;
      user-select: none;
      z-index: 1;
    }

    .card-head-strip {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1px dashed rgba(54, 197, 240, 0.3);
      padding-bottom: 0.85rem;
      position: relative;
      z-index: 3;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .card-agency {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .agency-mini-logo {
      font-family: var(--font-display);
      font-weight: 900;
      font-size: 0.95rem;
      color: #080B1A;
      background: var(--accent-glow);
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
      letter-spacing: 0.1em;
    }

    .agency-title-wrap {
      display: flex;
      flex-direction: column;
    }

    .agency-sub {
      font-family: var(--font-mono);
      font-size: 0.6rem;
      color: var(--accent-glow);
      letter-spacing: 0.1em;
    }

    .agency-main {
      font-family: var(--font-display);
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .card-id-block {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .id-label {
      font-family: var(--font-mono);
      font-size: 0.6rem;
      color: var(--text-muted);
    }

    .id-val {
      font-family: var(--font-mono);
      font-size: 1rem;
      font-weight: 800;
      color: var(--accent-glow);
      letter-spacing: 0.1em;
    }

    /* Content Grid */
    .card-content-grid {
      display: grid;
      grid-template-columns: 1.1fr 1.3fr 0.8fr;
      gap: 1.25rem;
      align-items: center;
      position: relative;
      z-index: 3;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .card-explorer-profile {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .profile-avatar-box {
      width: 64px;
      height: 64px;
      border-radius: 12px;
      background: rgba(8, 11, 26, 0.8);
      border: 1px solid var(--accent-glow);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .avatar-glyph {
      font-size: 1.6rem;
    }

    .avatar-rank {
      position: absolute;
      bottom: -6px;
      font-family: var(--font-mono);
      font-size: 0.55rem;
      font-weight: 800;
      background: var(--accent-primary);
      color: #fff;
      padding: 0.1rem 0.35rem;
      border-radius: 3px;
    }

    .profile-info-block {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .profile-name {
      font-family: var(--font-display);
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--text-primary);
    }

    .profile-callsign {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--text-muted);
    }

    .profile-role {
      font-size: 0.8rem;
      color: var(--accent-glow);
      font-weight: 600;
    }

    .card-flight-details {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      background: rgba(8, 11, 26, 0.5);
      border: 1px solid var(--border-line);
      border-radius: 8px;
      padding: 0.75rem 0.85rem;
    }

    .flight-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
    }

    .detail-label {
      color: var(--text-muted);
      font-family: var(--font-mono);
      font-size: 0.68rem;
    }

    .detail-value {
      font-weight: 600;
      color: var(--text-primary);
    }

    .card-security-seal-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.35rem;
    }

    .security-seal-canvas {
      width: 76px;
      height: 76px;
      border-radius: 50%;
      box-shadow: 0 0 16px rgba(54, 197, 240, 0.4);
    }

    .seal-caption {
      font-family: var(--font-mono);
      font-size: 0.6rem;
      color: var(--accent-glow);
      letter-spacing: 0.05em;
    }

    .card-barcode-strip {
      border-top: 1px dashed rgba(54, 197, 240, 0.3);
      padding-top: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      position: relative;
      z-index: 3;
    }

    .simulated-barcode {
      width: 100%;
      height: 24px;
      background: repeating-linear-gradient(
        90deg,
        #fff 0, #fff 2px,
        transparent 2px, transparent 4px,
        #fff 4px, #fff 5px,
        transparent 5px, transparent 8px,
        #fff 8px, #fff 11px,
        transparent 11px, transparent 13px,
        #fff 13px, #fff 14px,
        transparent 14px, transparent 18px
      );
      opacity: 0.75;
    }

    .barcode-text {
      font-family: var(--font-mono);
      font-size: 0.62rem;
      color: var(--text-faint);
      letter-spacing: 0.15em;
      text-align: center;
    }

    .passport-actions-row {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 0.5rem;
    }

    /* Modal Footer */
    .passport-modal-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 2rem;
      border-top: 1px dashed var(--border-line-strong);
      background: rgba(8, 11, 26, 0.4);
    }

    @keyframes modalFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes modalExpand {
      from { transform: scale(0.92); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    @keyframes stepFade {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes holoSheen {
      0% { transform: translateX(-60%) translateY(-60%) rotate(0deg); }
      100% { transform: translateX(60%) translateY(60%) rotate(360deg); }
    }
  `]
})
export class ExplorerPassportComponent implements AfterViewInit {
  protected readonly i18n = inject(I18nService);
  private readonly audio = inject(AudioService);

  readonly isOpen = input<boolean>(false);
  readonly closeModal = output<void>();

  readonly passportCardElement = viewChild<ElementRef<HTMLElement>>('passportCardElement');
  readonly sealCanvas = viewChild<ElementRef<HTMLCanvasElement>>('sealCanvas');
  readonly modalFrame = viewChild<ElementRef<HTMLElement>>('modalFrame');

  private previousActiveElement: HTMLElement | null = null;

  readonly currentStep = signal<1 | 2 | 3 | 4 | 5>(1);
  readonly fullName = signal<string>('');
  readonly callSign = signal<string>('');
  readonly originStation = signal<string>('Asyut Space Complex (27.18°N, 31.18°E)');
  readonly destination = signal<DestinationType>('moon');
  readonly role = signal<MissionRoleType>('pilot');

  readonly passportId = signal<string>('ASY-EXP-7721');
  readonly issueTimestamp = signal<string>('');
  readonly showValidation = signal<boolean>(false);
  readonly isCopied = signal<boolean>(false);

  readonly isNameValid = computed(() => this.fullName().trim().length >= 2);
  readonly isCallSignValid = computed(() => this.callSign().trim().length >= 2);

  readonly destinationsList = [
    {
      id: 'moon' as DestinationType,
      glyph: '🌖',
      nameAr: 'القمر (Mare Tranquillitatis)',
      nameEn: 'The Moon (Mare Tranquillitatis)',
      coords: '0.67° N · 23.47° E',
      distance: '384,400 km',
      transit: '~3 Days (TLI Injection)',
      environment: 'Vacuum · 1/6th Gravity · -130°C to +120°C',
      descAr: 'قاعدة بحر الهدوء، استكشاف التربة القمرية وموارد المياه الجليدية.',
      descEn: 'Sea of Tranquility outpost, lunar regolith sampling & water ice survey.'
    },
    {
      id: 'mars' as DestinationType,
      glyph: '🔴',
      nameAr: 'المريخ (Jezero Crater)',
      nameEn: 'Mars (Jezero Crater)',
      coords: '18.38° N · 77.58° E',
      distance: '~225M km (Average)',
      transit: '~7 Months (Hohmann Transfer)',
      environment: '0.38g · 95% CO2 Atmosphere · -60°C Mean',
      descAr: 'فوهة جيزيرو القديمة، البحث عن بصمات حيوية متحجرة ورواسب طميية.',
      descEn: 'Ancient Jezero delta, biosignature exploration and sample caching.'
    },
    {
      id: 'jupiter' as DestinationType,
      glyph: '🪐',
      nameAr: 'المشتري (Europa Orbit)',
      nameEn: 'Jupiter (Europa Orbit)',
      coords: '5.2 AU · Jovian Orbital Corridor',
      distance: '~628M km',
      transit: '~3.5 Years (Gravity Slingshot)',
      environment: 'High-radiation torus · Cryogenic ocean under ice shell',
      descAr: 'مدار قمر يوروبا، مسح الرادار لسبر المحيط السائل تحت الجليدي.',
      descEn: 'Europa orbital sounding, subsurface ocean search & magnetic field mapping.'
    },
    {
      id: 'saturn' as DestinationType,
      glyph: '🪐',
      nameAr: 'زحل (Titan Atmosphere)',
      nameEn: 'Saturn (Titan Atmosphere)',
      coords: '9.5 AU · Ring Plane Incline 26.7°',
      distance: '~1.4B km',
      transit: '~7 Years (Deep Flight Plan)',
      environment: '1.5 bar N2/CH4 · Cryogenic liquid hydrocarbon lakes',
      descAr: 'غلاف تيتان الكثيف، دراسة كيمياء ما قبل الحياة وبحيرات الميثان.',
      descEn: 'Titan atmospheric descent, prebiotic organic molecules & methane lakes.'
    },
    {
      id: 'deep-space' as DestinationType,
      glyph: '✨',
      nameAr: 'الفضاء السحيق (Interstellar Void)',
      nameEn: 'Deep Space (Interstellar Void)',
      coords: '160+ AU · Ophiuchus Trajectory',
      distance: '>24 Billion km',
      transit: 'Continuous Interstellar Drift',
      environment: 'Interstellar plasma · Pristine galactic cosmic ray spectrum',
      descAr: 'ما وراء الغلاف الشمسي، دراسة الفراغ النجمي والأشعة الكونية المجرية.',
      descEn: 'Beyond the heliopause, interstellar medium profiling and cosmic drift.'
    }
  ];

  readonly rolesList = [
    {
      id: 'pilot' as MissionRoleType,
      code: 'CMD-PILOT',
      nameAr: 'طيار مداري فائق',
      nameEn: 'Orbital Flight Commander',
      descAr: 'قيادة المناورات المدارية، الالتحام الآلي، ومسارات الدخول الجوي.',
      descEn: 'Precision orbital burns, spacecraft rendezvous and planetary atmospheric entry.'
    },
    {
      id: 'astrobiology' as MissionRoleType,
      code: 'SCI-BIO',
      nameAr: 'علم الأحياء الفلكي',
      nameEn: 'Astrobiology Specialist',
      descAr: 'فحص البصمات الحيوية، تحليل كيمياء الكربون والتربة خارج الأرض.',
      descEn: 'Extraterrestrial biosignatures, extremophile chemistry and regolith analysis.'
    },
    {
      id: 'engineer' as MissionRoleType,
      code: 'ENG-PROP',
      nameAr: 'مهندس فضاء عميق',
      nameEn: 'Deep Space Systems Engineer',
      descAr: 'صيانة مفاعلات الدفع النووي، أنظمة دعم الحياة ودروع الإشعاع.',
      descEn: 'Nuclear thermal propulsion, closed-loop life support and radiation shield management.'
    },
    {
      id: 'scientist' as MissionRoleType,
      code: 'SCI-PHYS',
      nameAr: 'كبير الأخصائيين العلميين',
      nameEn: 'Principal Science Specialist',
      descAr: 'تحليل الأطياف الكهرومغناطيسية، معالجة التيليميتري وموجات الرادار.',
      descEn: 'Electromagnetic spectroscopy, radio telemetry interpretation and deep sensor arrays.'
    }
  ];

  readonly currentDestinationData = computed(() => {
    return this.destinationsList.find(d => d.id === this.destination());
  });

  readonly currentRoleData = computed(() => {
    return this.rolesList.find(r => r.id === this.role());
  });

  constructor() {
    // Load persisted passport if exists
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('COSMOS_EXPLORER_PASSPORT');
        if (saved) {
          const parsed: PassportData = JSON.parse(saved);
          if (parsed.fullName) this.fullName.set(parsed.fullName);
          if (parsed.callSign) this.callSign.set(parsed.callSign);
          if (parsed.destination) this.destination.set(parsed.destination);
          if (parsed.role) this.role.set(parsed.role);
          if (parsed.passportId) this.passportId.set(parsed.passportId);
          if (parsed.issueTimestamp) this.issueTimestamp.set(parsed.issueTimestamp);
          if (parsed.passportId && parsed.fullName) {
            this.currentStep.set(5);
          }
        }
      } catch {
        // ignore storage parse error
      }
    }

    // Modal focus management when opened
    effect(() => {
      if (this.isOpen()) {
        if (typeof document !== 'undefined') {
          this.previousActiveElement = document.activeElement as HTMLElement;
        }
        setTimeout(() => {
          const container = this.modalFrame()?.nativeElement;
          const firstFocusable = container?.querySelector<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );
          firstFocusable?.focus();
        }, 50);
      }
    });

    // Reactively draw seal canvas when step 5 is active
    effect(() => {
      if (this.currentStep() === 5 && this.isOpen()) {
        setTimeout(() => this.drawSecuritySeal(), 80);
      }
    });
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
    if (this.currentStep() === 5) {
      this.drawSecuritySeal();
    }
  }

  onBackdropClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('passport-modal-backdrop')) {
      this.close();
    }
  }

  close(): void {
    this.audio.playBeep(650, 0.08);
    this.closeModal.emit();
    setTimeout(() => {
      this.previousActiveElement?.focus();
    }, 50);
  }

  onFullNameChange(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    this.fullName.set(val);
  }

  onCallSignChange(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    this.callSign.set(val);
  }

  selectDestination(dest: DestinationType): void {
    this.destination.set(dest);
    this.audio.playBeep(850, 0.04);
  }

  selectRole(r: MissionRoleType): void {
    this.role.set(r);
    this.audio.playBeep(900, 0.04);
  }

  nextStep(): void {
    if (this.currentStep() === 1) {
      if (!this.isNameValid() || !this.isCallSignValid()) {
        this.showValidation.set(true);
        this.audio.playBeep(350, 0.1);
        return;
      }
    }

    this.showValidation.set(false);
    this.audio.playBeep(1000, 0.06);
    this.currentStep.update(s => (s < 5 ? (s + 1) as 1 | 2 | 3 | 4 | 5 : s));
  }

  prevStep(): void {
    this.audio.playBeep(800, 0.05);
    this.currentStep.update(s => (s > 1 ? (s - 1) as 1 | 2 | 3 | 4 | 5 : s));
  }

  generateAndIssuePassport(): void {
    // Generate unique identifier
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `ASY-EXP-${randNum}`;
    this.passportId.set(newId);

    // Format ISO / human date
    const now = new Date();
    const formattedDate = `${now.getUTCFullYear()}.${String(now.getUTCMonth() + 1).padStart(2, '0')}.${String(now.getUTCDate()).padStart(2, '0')} // ${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')} UTC`;
    this.issueTimestamp.set(formattedDate);

    // Persist to local storage
    if (typeof window !== 'undefined') {
      const data: PassportData = {
        passportId: newId,
        fullName: this.fullName(),
        callSign: this.callSign(),
        originStation: this.originStation(),
        destination: this.destination(),
        role: this.role(),
        issueTimestamp: formattedDate
      };
      try {
        localStorage.setItem('COSMOS_EXPLORER_PASSPORT', JSON.stringify(data));
      } catch {
        // ignore
      }
    }

    this.audio.playBeep(1200, 0.12);
    this.currentStep.set(5);
  }

  resetWizard(): void {
    this.currentStep.set(1);
  }

  private drawSecuritySeal(): void {
    const canvas = this.sealCanvas()?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
    const cssSize = 100;
    canvas.width = Math.round(cssSize * dpr);
    canvas.height = Math.round(cssSize * dpr);

    ctx.save();
    ctx.scale(dpr, dpr);

    const w = cssSize;
    const h = cssSize;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    // Outer concentric circle with dashed cyber rings
    ctx.strokeStyle = '#36C5F0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 42, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#6657F5';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.arc(cx, cy, 35, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Central geometric holographic emblem
    ctx.fillStyle = '#3EC87D';
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();

    // 8 Radial cryptographic tick marks
    ctx.strokeStyle = '#36C5F0';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const x1 = cx + Math.cos(angle) * 18;
      const y1 = cy + Math.sin(angle) * 18;
      const x2 = cx + Math.cos(angle) * 30;
      const y2 = cy + Math.sin(angle) * 30;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    ctx.restore();
  }

  downloadPassportPng(): void {
    this.audio.playBeep(1100, 0.08);

    // Render official high-res PNG image using a canvas
    if (typeof document === 'undefined') return;

    const cv = document.createElement('canvas');
    cv.width = 1200;
    cv.height = 700;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    // Background cosmic gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 700);
    bgGrad.addColorStop(0, '#080B1A');
    bgGrad.addColorStop(0.5, '#111A35');
    bgGrad.addColorStop(1, '#182346');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 700);

    // Glowing border
    ctx.strokeStyle = '#36C5F0';
    ctx.lineWidth = 6;
    ctx.strokeRect(20, 20, 1160, 660);

    ctx.strokeStyle = '#6657F5';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, 1140, 640);

    // Header Agency
    ctx.fillStyle = '#36C5F0';
    ctx.font = 'bold 34px monospace';
    ctx.fillText('ASYUT SPACE WORKSPACE // COSMOS REGISTRY', 60, 85);

    ctx.fillStyle = '#F4F5FF';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('OFFICIAL SPACE EXPLORER FLIGHT CREDENTIAL', 60, 125);

    // Credential ID badge
    ctx.fillStyle = '#36C5F0';
    ctx.font = 'bold 28px monospace';
    ctx.fillText(`ID: ${this.passportId()}`, 860, 85);

    ctx.fillStyle = '#3EC87D';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('STATUS: FLIGHT CERTIFIED', 860, 125);

    // Divider
    ctx.strokeStyle = 'rgba(54, 197, 240, 0.35)';
    ctx.beginPath();
    ctx.moveTo(60, 155);
    ctx.lineTo(1140, 155);
    ctx.stroke();

    // Explorer Details
    ctx.fillStyle = '#8993AA';
    ctx.font = '18px monospace';
    ctx.fillText('EXPLORER NAME:', 60, 210);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText(this.fullName().toUpperCase(), 60, 250);

    ctx.fillStyle = '#8993AA';
    ctx.font = '18px monospace';
    ctx.fillText('CALL SIGN:', 60, 305);
    ctx.fillStyle = '#36C5F0';
    ctx.font = 'bold 26px monospace';
    ctx.fillText(this.callSign().toUpperCase(), 60, 340);

    ctx.fillStyle = '#8993AA';
    ctx.font = '18px monospace';
    ctx.fillText('MISSION SPECIALTY & ROLE:', 60, 395);
    ctx.fillStyle = '#A79BFD';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(this.currentRoleData()?.nameEn || '', 60, 430);

    ctx.fillStyle = '#8993AA';
    ctx.font = '18px monospace';
    ctx.fillText('DESTINATION & TARGET COORDINATES:', 600, 210);
    ctx.fillStyle = '#36C5F0';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(this.currentDestinationData()?.nameEn || '', 600, 250);
    ctx.fillStyle = '#F4F5FF';
    ctx.font = '20px monospace';
    ctx.fillText(`COORDS: ${this.currentDestinationData()?.coords || ''}`, 600, 285);
    ctx.fillText(`TRANSIT: ${this.currentDestinationData()?.transit || ''}`, 600, 320);

    ctx.fillStyle = '#8993AA';
    ctx.font = '18px monospace';
    ctx.fillText('LAUNCH ORIGIN:', 600, 385);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px monospace';
    ctx.fillText('ASYUT, EGYPT (27.18°N, 31.18°E)', 600, 415);

    ctx.fillStyle = '#8993AA';
    ctx.font = '18px monospace';
    ctx.fillText('TIMESTAMP AUTHORIZED:', 600, 475);
    ctx.fillStyle = '#3EC87D';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(this.issueTimestamp(), 600, 505);

    // Barcode Strip
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let x = 60; x < 1140; x += 10) {
      const barW = (x % 3 === 0) ? 5 : (x % 2 === 0 ? 3 : 1.5);
      ctx.fillRect(x, 560, barW, 40);
    }

    ctx.fillStyle = '#8993AA';
    ctx.font = '16px monospace';
    ctx.fillText(`AUTHENTICATION SEC_HASH: ASY-${this.passportId()}-COSMOS-SPACE-PASSPORT`, 60, 625);

    // Trigger PNG download
    const link = document.createElement('a');
    link.download = `COSMOS-Explorer-Passport-${this.passportId()}.png`;
    link.href = cv.toDataURL('image/png');
    link.click();
  }

  copyShareCode(): void {
    const code = `[COSMOS SPACE EXPLORER REGISTRY]\nPassport ID: ${this.passportId()}\nExplorer: ${this.fullName()} (${this.callSign()})\nRole: ${this.currentRoleData()?.nameEn}\nDestination: ${this.currentDestinationData()?.nameEn}\nOrigin: Asyut Space Complex (Egypt)\nStatus: FLIGHT CERTIFIED & APPROVED`;

    if (navigator?.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        this.isCopied.set(true);
        this.audio.playBeep(1200, 0.05);
        setTimeout(() => this.isCopied.set(false), 3000);
      });
    }
  }
}

