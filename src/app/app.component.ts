import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  viewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { I18nService } from './core/i18n.service';
import { ScrollService } from './core/scroll.service';
import { AudioService } from './core/audio.service';
import { MotionPrefsService } from './core/motion-prefs.service';
import { MasterTimelineService } from './core/master-timeline.service';
import { MissionConfig } from '../assets/missions/missions.config';

import { LoaderComponent } from './ui/loader/loader.component';
import { ProgressRocketComponent } from './ui/progress-rocket/progress-rocket.component';
import { HudModalComponent } from './ui/hud-modal/hud-modal.component';
import { ExplorerPassportComponent } from './ui/explorer-passport/explorer-passport.component';
import { MissionControlComponent } from './ui/mission-control/mission-control.component';
import { ExplorerProfileComponent } from './ui/explorer-profile/explorer-profile.component';
import { AchievementToastComponent } from './ui/achievement-toast/achievement-toast.component';
import { ExplorerProgressionService } from './core/explorer-progression.service';

import { LaunchPadComponent } from './scenes/launch/launch-pad.component';
import { OrbitComponent } from './scenes/orbit/orbit.component';
import { SolarSystemComponent } from './scenes/solar-system/solar-system.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent,
    ProgressRocketComponent,
    HudModalComponent,
    ExplorerPassportComponent,
    MissionControlComponent,
    ExplorerProfileComponent,
    AchievementToastComponent,
    LaunchPadComponent,
    OrbitComponent,
    SolarSystemComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class App implements AfterViewInit, OnDestroy {
  protected readonly i18n = inject(I18nService);
  protected readonly scroll = inject(ScrollService);
  protected readonly audio = inject(AudioService);
  protected readonly motionPrefs = inject(MotionPrefsService);
  protected readonly masterTimeline = inject(MasterTimelineService);
  protected readonly progression = inject(ExplorerProgressionService);

  readonly launchPadRef = viewChild<LaunchPadComponent>(LaunchPadComponent);
  readonly masterTrackRef = viewChild<ElementRef<HTMLElement>>('masterTrack');

  readonly isAppReady = signal<boolean>(false);
  readonly selectedMission = signal<MissionConfig | null>(null);
  readonly isPassportOpen = signal<boolean>(false);
  readonly isMissionControlOpen = signal<boolean>(false);
  readonly isExplorerProfileOpen = signal<boolean>(false);

  private masterScrollTrigger: ScrollTrigger | null = null;
  private hasFirstScrolled = false;
  private hasTriggeredPlanetaryVisit = false;
  private hasTriggeredLunarTouchdown = false;
  private initialUrlProgress: number | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const pStr = params.get('progress') || params.get('p');
      if (pStr !== null) {
        const p = parseFloat(pStr);
        this.initialUrlProgress = p;
        this.masterTimeline.updateProgress(p);
      }
    }
  }

  ngAfterViewInit(): void {
    this.setupMasterScrollTrigger();

    if (this.initialUrlProgress !== null && typeof window !== 'undefined') {
      const p = this.initialUrlProgress;
      setTimeout(() => {
        this.masterTimeline.updateProgress(p);
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo(0, maxScroll * p);
      }, 50);
    }
  }

  ngOnDestroy(): void {
    this.masterScrollTrigger?.kill();
  }

  private setupMasterScrollTrigger(): void {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const track = this.masterTrackRef()?.nativeElement;
    if (!track) return;

    this.masterScrollTrigger = ScrollTrigger.create({
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        if (this.initialUrlProgress !== null && !this.hasFirstScrolled && self.progress === 0 && this.initialUrlProgress > 0) {
          return;
        }
        if (self.progress > 0) {
          this.hasFirstScrolled = true;
        }
        this.masterTimeline.updateProgress(self.progress);

        // Milestone progression triggers based on journey position (idempotently guarded)
        if (self.progress >= 0.35 && self.progress < 0.65) {
          if (!this.hasTriggeredPlanetaryVisit) {
            this.hasTriggeredPlanetaryVisit = true;
            this.progression.recordPlanetaryVisit();
          }
        } else if (self.progress >= 0.75) {
          if (!this.hasTriggeredLunarTouchdown) {
            this.hasTriggeredLunarTouchdown = true;
            this.progression.recordLunarTouchdown();
          }
        }
      }
    });
  }

  onLoaderComplete(): void {
    this.isAppReady.set(true);
  }

  onLaunchCompleted(): void {
    this.progression.recordLaunch();
    const targetScroll = (document.documentElement.scrollHeight - window.innerHeight) * 0.18;
    this.scroll.scrollTo(targetScroll, { duration: 1.2 });
  }

  openMissionModal(mission: MissionConfig): void {
    this.selectedMission.set(mission);
  }

  closeMissionModal(): void {
    this.selectedMission.set(null);
  }

  openPassport(): void {
    this.audio.playBeep(900, 0.08);
    this.isPassportOpen.set(true);
  }

  closePassport(): void {
    this.isPassportOpen.set(false);
  }

  openMissionControl(): void {
    this.audio.playBeep(900, 0.08);
    this.isMissionControlOpen.set(true);
  }

  closeMissionControl(): void {
    this.isMissionControlOpen.set(false);
  }

  openExplorerProfile(): void {
    this.audio.playBeep(900, 0.08);
    this.isExplorerProfileOpen.set(true);
  }

  closeExplorerProfile(): void {
    this.isExplorerProfileOpen.set(false);
  }

  launchMissionFromControl(mission: MissionConfig): void {
    this.progression.setMissionInProgress(mission.id);
    this.selectedMission.set(mission);
  }

  onMissionCompleted(missionId: string): void {
    this.progression.completeMission(missionId);
    this.selectedMission.set(null);
  }

  skipToMissions(): void {
    const targetScroll = (document.documentElement.scrollHeight - window.innerHeight) * 0.25;
    this.scroll.scrollTo(targetScroll, { duration: 1.5 });
  }
}
