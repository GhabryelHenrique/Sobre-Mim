import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type Lang = 'pt' | 'en';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private http = inject(HttpClient);

  currentLang = signal<Lang>(this.getInitialLang());
  private translations = signal<Record<string, unknown>>({});
  private loaded = signal(false);

  constructor() {
    effect(() => {
      const lang = this.currentLang();
      this.loadTranslations(lang);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('lang', lang);
      }
    });
  }

  switchLang(): void {
    this.currentLang.update(l => l === 'pt' ? 'en' : 'pt');
  }

  setLang(lang: Lang): void {
    this.currentLang.set(lang);
  }

  t(key: string): string {
    const trans = this.translations();
    return this.resolve(trans, key) ?? key;
  }

  isLoaded = computed(() => this.loaded());

  private loadTranslations(lang: Lang): void {
    this.loaded.set(false);
    this.http.get<Record<string, unknown>>(`/assets/data/i18n/${lang}.json`).subscribe({
      next: data => {
        this.translations.set(data);
        this.loaded.set(true);
      },
      error: () => {
        this.loaded.set(true);
      }
    });
  }

  private resolve(obj: Record<string, unknown>, path: string): string | null {
    const parts = path.split('.');
    let current: unknown = obj;
    for (const part of parts) {
      if (current == null || typeof current !== 'object') return null;
      current = (current as Record<string, unknown>)[part];
    }
    return typeof current === 'string' ? current : null;
  }

  private getInitialLang(): Lang {
    if (typeof localStorage === 'undefined') return 'pt';
    const saved = localStorage.getItem('lang') as Lang;
    if (saved === 'pt' || saved === 'en') return saved;
    const browserLang = navigator.language?.startsWith('pt') ? 'pt' : 'en';
    return browserLang;
  }
}
