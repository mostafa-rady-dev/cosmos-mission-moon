import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';

export interface NasaApod {
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  date: string;
  copyright?: string;
  media_type: 'image' | 'video';
  isOfflineFallback?: boolean;
}

export interface NasaImageItem {
  nasaId: string;
  title: string;
  description: string;
  dateCreated: string;
  imageUrl: string;
  thumbUrl: string;
  center?: string;
  keywords?: string[];
  isOfflineFallback?: boolean;
}

interface CacheEnvelope<T> {
  timestamp: number;
  data: T;
}

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

@Injectable({
  providedIn: 'root'
})
export class NasaApiService {
  readonly isLoading = signal<boolean>(false);
  readonly apiError = signal<string | null>(null);

  /**
   * Fetches the NASA Astronomy Picture of the Day (APOD) with 24h caching & offline fallback.
   */
  async getApod(): Promise<NasaApod> {
    const cacheKey = 'COSMOS_NASA_APOD';
    const cached = this.readCache<NasaApod>(cacheKey);
    if (cached) return cached;

    this.isLoading.set(true);
    this.apiError.set(null);

    const url = `${environment.nasaApodUrl}?api_key=${environment.nasaApiKey}`;

    try {
      if (typeof window !== 'undefined' && !navigator.onLine) {
        throw new Error('Offline');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`NASA APOD API error: HTTP ${res.status}`);
      }

      const data: NasaApod = await res.json();
      this.writeCache(cacheKey, data);
      this.isLoading.set(false);
      return data;
    } catch (err: unknown) {
      console.warn('[COSMOS] NASA APOD live fetch failed or offline; serving verified fallback.', err);
      this.isLoading.set(false);
      this.apiError.set(err instanceof Error ? err.message : 'NASA APOD unavailable');

      const staleCache = this.readCache<NasaApod>(cacheKey, true);
      if (staleCache) return staleCache;

      return this.getFallbackApod();
    }
  }

  /**
   * Searches the NASA Image and Video Library with 24h caching & curated mission fallbacks.
   */
  async searchMissionImages(query: string, limit = 8): Promise<NasaImageItem[]> {
    const sanitized = query.trim().toLowerCase();
    const cacheKey = `COSMOS_NASA_IMAGES_${sanitized}`;
    const cached = this.readCache<NasaImageItem[]>(cacheKey);
    if (cached && cached.length > 0) return cached.slice(0, limit);

    this.isLoading.set(true);
    this.apiError.set(null);

    const url = `${environment.nasaImagesApiUrl}/search?q=${encodeURIComponent(query)}&media_type=image`;

    try {
      if (typeof window !== 'undefined' && !navigator.onLine) {
        throw new Error('Offline');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`NASA Image Library error: HTTP ${res.status}`);
      }

      const json = await res.json();
      const items: unknown[] = json?.collection?.items || [];

      const parsed: NasaImageItem[] = [];
      for (const raw of items) {
        const item = raw as {
          data?: Array<{
            nasa_id?: string;
            title?: string;
            description?: string;
            date_created?: string;
            center?: string;
            keywords?: string[];
          }>;
          links?: Array<{ href?: string; rel?: string }>;
        };

        const d = item.data?.[0];
        const link = item.links?.[0]?.href;

        if (d && link) {
          parsed.push({
            nasaId: d.nasa_id || `NASA-${Math.random().toString(36).slice(2, 8)}`,
            title: d.title || query,
            description: d.description || '',
            dateCreated: d.date_created?.slice(0, 10) || '',
            imageUrl: link.replace('~thumb.', '~orig.').replace('~thumb.jpg', '~medium.jpg'),
            thumbUrl: link,
            center: d.center || 'NASA',
            keywords: d.keywords || []
          });
        }
        if (parsed.length >= 16) break;
      }

      if (parsed.length > 0) {
        this.writeCache(cacheKey, parsed);
        this.isLoading.set(false);
        return parsed.slice(0, limit);
      }

      throw new Error('Empty NASA results');
    } catch (err: unknown) {
      console.warn(`[COSMOS] NASA Image search failed for query "${query}"; serving curated offline fallback.`, err);
      this.isLoading.set(false);
      this.apiError.set(err instanceof Error ? err.message : 'NASA Image Library unavailable');

      const staleCache = this.readCache<NasaImageItem[]>(cacheKey, true);
      if (staleCache && staleCache.length > 0) return staleCache.slice(0, limit);

      return this.getFallbackMissionImages(query).slice(0, limit);
    }
  }

  // --- Caching Utilities ---

  private readCache<T>(key: string, ignoreTtl = false): T | null {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const envelope: CacheEnvelope<T> = JSON.parse(raw);
      const isExpired = Date.now() - envelope.timestamp > CACHE_TTL_MS;
      if (isExpired && !ignoreTtl) {
        return null;
      }
      return envelope.data;
    } catch {
      return null;
    }
  }

  private writeCache<T>(key: string, data: T): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      const envelope: CacheEnvelope<T> = {
        timestamp: Date.now(),
        data
      };
      localStorage.setItem(key, JSON.stringify(envelope));
    } catch {
      // Storage quota or private browsing mode
    }
  }

  // --- Verified Scientific Fallbacks (Guaranteed Offline Availability) ---

  private getFallbackApod(): NasaApod {
    return {
      title: 'Cosmic Reef: Giant Star-Forming Nebula NGC 2014 & NGC 2020',
      explanation: 'Celebrating astronomical discovery across the cosmos, this image shows the sparkling blue stars and surrounding crimson hydrogen gas of the Large Magellanic Cloud, 163,000 light-years away.',
      url: 'assets/images/earth_realistic.jpg',
      date: new Date().toISOString().slice(0, 10),
      media_type: 'image',
      copyright: 'NASA, ESA, and STScI',
      isOfflineFallback: true
    };
  }

  private getFallbackMissionImages(query: string): NasaImageItem[] {
    const q = query.toLowerCase();

    if (q.includes('apollo')) {
      return [
        {
          nasaId: 'AS11-40-5903',
          title: 'Apollo 11: Buzz Aldrin on the Moon',
          description: 'Astronaut Buzz Aldrin walks on the surface of the Moon near the leg of the Lunar Module Eagle. Photographed by Neil Armstrong.',
          dateCreated: '1969-07-20',
          imageUrl: 'assets/images/asyut_user_rocket_launch.png',
          thumbUrl: 'assets/images/asyut_user_rocket_launch.png',
          center: 'JSC',
          isOfflineFallback: true
        },
        {
          nasaId: 'AS11-40-5874',
          title: 'Apollo 11 Lunar Module Eagle on Tranquility Base',
          description: 'The Apollo 11 Lunar Module Eagle rests on the lunar surface during humanity\'s first manned lunar landing.',
          dateCreated: '1969-07-20',
          imageUrl: 'assets/images/lunar_lander_realistic.png',
          thumbUrl: 'assets/images/lunar_lander_realistic.png',
          center: 'JSC',
          isOfflineFallback: true
        }
      ];
    }

    if (q.includes('webb') || q.includes('jwst')) {
      return [
        {
          nasaId: 'JWST-DEEP-FIELD-SMACS',
          title: 'Webb\'s First Deep Field — SMACS 0723',
          description: 'NASA\'s James Webb Space Telescope delivered the deepest and sharpest infrared image of the distant universe to date.',
          dateCreated: '2022-07-12',
          imageUrl: 'assets/images/deep-space-stars.png',
          thumbUrl: 'assets/images/deep-space-stars.png',
          center: 'GSFC',
          isOfflineFallback: true
        },
        {
          nasaId: 'JWST-CARINA-NEBULA',
          title: 'Cosmic Cliffs in the Carina Nebula',
          description: 'JWST reveals emerging stellar nurseries and individual stars that were previously obscured in visible light.',
          dateCreated: '2022-07-12',
          imageUrl: 'assets/images/deep-space-stars.png',
          thumbUrl: 'assets/images/deep-space-stars.png',
          center: 'GSFC',
          isOfflineFallback: true
        }
      ];
    }

    if (q.includes('artemis')) {
      return [
        {
          nasaId: 'ARTEMIS-I-EARTHRISE',
          title: 'Orion Spacecraft Captures Earthrise from Lunar Orbit',
          description: 'On Flight Day 13 of the Artemis I mission, Orion captured stunning high-resolution photography of Earth receding beyond the Moon.',
          dateCreated: '2022-11-28',
          imageUrl: 'assets/images/moon_realistic.jpg',
          thumbUrl: 'assets/images/moon_realistic.jpg',
          center: 'JSC',
          isOfflineFallback: true
        },
        {
          nasaId: 'ARTEMIS-SLS-LIFTOFF',
          title: 'Space Launch System (SLS) Artemis I Ignition',
          description: 'The world\'s most powerful operational rocket lifts off from Pad 39B at Kennedy Space Center.',
          dateCreated: '2022-11-16',
          imageUrl: 'assets/images/asyut_launch_realistic.jpg',
          thumbUrl: 'assets/images/asyut_launch_realistic.jpg',
          center: 'KSC',
          isOfflineFallback: true
        }
      ];
    }

    if (q.includes('perseverance') || q.includes('mars')) {
      return [
        {
          nasaId: 'PIA24484',
          title: 'Perseverance Rover on Jezero Crater Delta',
          description: 'Mastcam-Z panorama of the ancient river delta where Perseverance searches for biosignatures and collects core samples.',
          dateCreated: '2021-03-04',
          imageUrl: 'assets/images/mars_realistic.jpg',
          thumbUrl: 'assets/images/mars_realistic.jpg',
          center: 'JPL',
          isOfflineFallback: true
        },
        {
          nasaId: 'PIA24651',
          title: 'Ingenuity Mars Helicopter Airfield',
          description: 'Ingenuity completed historic aerial scouting sorties across Martian bedrock in Jezero Crater.',
          dateCreated: '2021-05-07',
          imageUrl: 'assets/images/mars_realistic.jpg',
          thumbUrl: 'assets/images/mars_realistic.jpg',
          center: 'JPL',
          isOfflineFallback: true
        }
      ];
    }

    // Default Voyager fallback
    return [
      {
        nasaId: 'PIA17046',
        title: 'Voyager 1 Crosses into Interstellar Space',
        description: 'Artist concept depicting NASA\'s Voyager 1 spacecraft exploring the exotic interstellar medium outside the Sun\'s heliosphere.',
        dateCreated: '2013-09-12',
        imageUrl: 'assets/images/saturn_realistic.png',
        thumbUrl: 'assets/images/saturn_realistic.png',
        center: 'JPL',
        isOfflineFallback: true
      },
      {
        nasaId: 'PIA01384',
        title: 'Pale Blue Dot — Voyager 1 Solar System Portrait',
        description: 'From 6 billion kilometers away, Earth appears as a tiny fraction of a single pixel caught in a beam of sunlight.',
        dateCreated: '1990-02-14',
        imageUrl: 'assets/images/earth_realistic.jpg',
        thumbUrl: 'assets/images/earth_realistic.jpg',
        center: 'JPL',
        isOfflineFallback: true
      }
    ];
  }
}
