import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private platformId = inject(PLATFORM_ID);

  theme = signal<Theme>(this.getInitialTheme());

  constructor() {
    effect(() => {
      const currentTheme = this.theme();
      this.applyTheme(currentTheme);
      this.saveTheme(currentTheme);
    });
  }

  toggleTheme(originX?: number, originY?: number): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.theme.update(t => t === 'dark' ? 'light' : 'dark');
      return;
    }

    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';

    if ('startViewTransition' in document && originX !== undefined && originY !== undefined) {
      const transition = (document as unknown as {
        startViewTransition: (cb: () => void) => { ready: Promise<void> }
      }).startViewTransition(() => {
        this.theme.set(next);
      });

      transition.ready.then(() => {
        const maxRadius = Math.hypot(
          Math.max(originX, window.innerWidth - originX),
          Math.max(originY, window.innerHeight - originY)
        );
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${originX}px ${originY}px)`,
              `circle(${maxRadius}px at ${originX}px ${originY}px)`
            ]
          },
          {
            duration: 500,
            easing: 'ease-in-out',
            pseudoElement: '::view-transition-new(root)'
          }
        );
      });
    } else {
      this.theme.set(next);
    }
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
  }

  private getInitialTheme(): Theme {
    if (!isPlatformBrowser(this.platformId)) return 'dark';
    const saved = localStorage.getItem('theme') as Theme;
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private applyTheme(theme: Theme): void {
    if (!isPlatformBrowser(this.platformId)) return;
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.remove('theme-dark', 'theme-light');
    document.documentElement.classList.add(`theme-${theme}`);
  }

  private saveTheme(theme: Theme): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem('theme', theme);
  }
}
