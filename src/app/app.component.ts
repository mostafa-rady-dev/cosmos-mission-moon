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
import { LoaderComponent } from './ui/loader/loader.component';
import { LanguageToggleComponent } from './ui/language-toggle/language-toggle.component';
import { SoundToggleComponent } from './ui/sound-toggle/sound-toggle.component';
import { LaunchPadComponent } from './scenes/launch/launch-pad.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent,
    LanguageToggleComponent,
    SoundToggleComponent,
    LaunchPadComponent
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

  readonly launchPadRef = viewChild<LaunchPadComponent>(LaunchPadComponent);
  readonly masterTrackRef = viewChild<ElementRef<HTMLElement>>('masterTrack');

  readonly isAppReady = signal<boolean>(false);
  private masterScrollTrigger: ScrollTrigger | null = null;
  private hasFirstScrolled = false;

  ngAfterViewInit(): void {
    this.setupMasterScrollTrigger();
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
        const p = self.progress;
        this.masterTimeline.updateProgress(p);

        // First scroll automatically initiates launch sequence if not already launched
        if (p > 0.01 && !this.hasFirstScrolled) {
          this.hasFirstScrolled = true;
          this.launchPadRef()?.triggerLaunchSequence();
        }
      }
    });
  }

  onLoaderComplete(): void {
    this.isAppReady.set(true);
  }

  onLaunchCompleted(): void {
    // Advance progress past Scene 1
    const targetScroll = (document.documentElement.scrollHeight - window.innerHeight) * 0.18;
    this.scroll.scrollTo(targetScroll, { duration: 1 });
  }

  skipToMissions(): void {
    const targetScroll = (document.documentElement.scrollHeight - window.innerHeight) * 0.8;
    this.scroll.scrollTo(targetScroll, { duration: 1.2 });
  }
}
