import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LayoutHeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { MagneticCursorComponent } from './shared/components/magnetic-cursor/magnetic-cursor.component';
import { NoiseOverlayComponent } from './shared/components/noise-overlay/noise-overlay.component';
import { DataService } from './core/services/data.service';
import { SeoService } from './core/services/seo.service';
import { AnimationService } from './core/services/animation.service';
import { I18nService } from './core/services/i18n.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    LayoutHeaderComponent,
    FooterComponent,
    MagneticCursorComponent,
    NoiseOverlayComponent
  ],
  template: `
    <app-magnetic-cursor />
    <app-noise-overlay />
    <a href="#main-content" class="skip-link">Pular para o conteúdo</a>
    <app-header />
    <main id="main-content">
      <router-outlet />
    </main>
    <app-footer />
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--color-bg);
      color: var(--color-fg);
    }

    .skip-link {
      position: absolute;
      top: -100%;
      left: 16px;
      background: var(--color-accent);
      color: white;
      padding: 8px 16px;
      border-radius: 0 0 var(--radius-md) var(--radius-md);
      font-weight: 600;
      text-decoration: none;
      z-index: calc(var(--z-cursor) + 1);
      transition: top var(--duration-fast);
    }

    .skip-link:focus {
      top: 0;
    }

    main {
      padding-top: 64px;
    }
  `]
})
export class App implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private data = inject(DataService);
  private seo = inject(SeoService);
  private animation = inject(AnimationService);
  private i18n = inject(I18nService);

  ngOnInit(): void {
    this.data.loadAll();
    this.seo.init();

    if (isPlatformBrowser(this.platformId)) {
      this.animation.init();
      this.seo.setPersonJsonLd();
      this.registerEasterEggs();
    }
  }

  private registerEasterEggs(): void {
    const konami = [
      'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
      'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'
    ];
    let index = 0;

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === konami[index]) {
        index++;
        if (index === konami.length) {
          index = 0;
          this.triggerMatrixRain();
        }
      } else {
        index = 0;
      }
    });

    console.log(
      '%c\n' +
      '  ██████╗ ██╗  ██╗ █████╗ ██████╗ ██████╗ ██╗   ██╗███████╗██╗     \n' +
      ' ██╔════╝ ██║  ██║██╔══██╗██╔══██╗██╔══██╗╚██╗ ██╔╝██╔════╝██║     \n' +
      ' ██║  ███╗███████║███████║██████╔╝██████╔╝ ╚████╔╝ █████╗  ██║     \n' +
      ' ██║   ██║██╔══██║██╔══██║██╔══██╗██╔══██╗  ╚██╔╝  ██╔══╝  ██║     \n' +
      ' ╚██████╔╝██║  ██║██║  ██║██████╔╝██║  ██║   ██║   ███████╗███████╗\n' +
      '  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚══════╝\n' +
      '\n  Senior Software Engineer · Angular GDE Candidate\n' +
      '  📧 ghabryelcode@gmail.com\n' +
      '  🐙 github.com/GhabryelHenrique\n' +
      '  🔗 linkedin.com/in/ghabryelhenrique\n\n' +
      '  Hey dev 👋 You found the source! I built this with Angular 21,\n' +
      '  Three.js, GSAP and a lot of coffee. Want to talk? Hit me up!\n',
      'color: #FF4500; font-family: monospace; font-size: 11px;'
    );
  }

  private triggerMatrixRain(): void {
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-rain';
    canvas.style.cssText = `
      position: fixed; inset: 0; z-index: 9998;
      pointer-events: none; opacity: 0.85;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?/\\~`ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρστυφχψω';
    const fontSize = 14;
    const cols = Math.floor(canvas.width / fontSize);
    const drops = Array(cols).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(13,13,13,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FF4500';
      ctx.font = `${fontSize}px JetBrains Mono, monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    setTimeout(() => {
      clearInterval(interval);
      canvas.remove();
    }, 10000);
  }
}
