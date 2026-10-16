import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from './core/i18n.service';
import { ScrollService } from './core/scroll.service';
import { AudioService } from './core/audio.service';
import { MotionPrefsService } from './core/motion-prefs.service';
import { MasterTimelineService } from './core/master-timeline.service';
import { LoaderComponent } from './ui/loader/loader.component';
import { LanguageToggleComponent } from './ui/language-toggle/language-toggle.component';
import { SoundToggleComponent } from './ui/sound-toggle/sound-toggle.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent,
    LanguageToggleComponent,
    SoundToggleComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class App {
  protected readonly i18n = inject(I18nService);
  protected readonly scroll = inject(ScrollService);
  protected readonly audio = inject(AudioService);
  protected readonly motionPrefs = inject(MotionPrefsService);
  protected readonly masterTimeline = inject(MasterTimelineService);

  readonly isAppReady = signal<boolean>(false);

  onLoaderComplete(): void {
    this.isAppReady.set(true);
  }

  skipToMissions(): void {
    // Jump straight to missions segment (75% of page)
    const targetScroll = document.documentElement.scrollHeight * 0.75;
    this.scroll.scrollTo(targetScroll, { duration: 1.2 });
  }
}
