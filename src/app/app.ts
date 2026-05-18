import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { LayoutHeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { MagneticCursorComponent } from './shared/components/magnetic-cursor/magnetic-cursor.component';
import { NoiseOverlayComponent } from './shared/components/noise-overlay/noise-overlay.component';
import { DataService } from './core/services/data.service';
import { SeoService } from './core/services/seo.service';
import { AnimationService } from './core/services/animation.service';
import { I18nService } from './core/services/i18n.service';
import { ThemeService } from './core/services/theme.service';

interface PaletteCmd {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  group: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, LayoutHeaderComponent, FooterComponent, MagneticCursorComponent, NoiseOverlayComponent],
  template: `
    <app-magnetic-cursor />
    <app-noise-overlay />
    <a href="#main-content" class="skip-link">Pular para o conteúdo</a>
    <app-header />
    <main id="main-content">
      <router-outlet />
    </main>
    <app-footer />

    <!-- Command Palette -->
    @if (paletteOpen()) {
      <div class="palette-backdrop" (click)="closePalette()" role="dialog" aria-modal="true" aria-label="Command palette">
        <div class="palette-modal" (click)="$event.stopPropagation()" (keydown)="onPaletteKey($event)">
          <div class="palette-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input #paletteInput type="text" class="palette-input"
                   placeholder="Buscar ou navegar... / Search or navigate..."
                   [value]="paletteQuery()"
                   (input)="paletteQuery.set($any($event.target).value)"
                   autocomplete="off" />
            <kbd class="palette-esc">esc</kbd>
          </div>
          <div class="palette-results" role="listbox">
            @for (cmd of paletteFiltered(); track cmd.id; let i = $index) {
              <button class="palette-item"
                      [class.active]="paletteCursor() === i"
                      (click)="runCmd(cmd)"
                      (mouseenter)="paletteCursor.set(i)"
                      role="option" [attr.aria-selected]="paletteCursor() === i">
                <span class="palette-item__icon">{{ cmd.icon }}</span>
                <span class="palette-item__label">{{ cmd.label }}</span>
                <span class="palette-item__group">{{ cmd.group }}</span>
              </button>
            }
            @if (paletteFiltered().length === 0) {
              <p class="palette-empty">Nenhum resultado / No results</p>
            }
          </div>
          <div class="palette-footer">
            <span><kbd>↑↓</kbd> navegar</span>
            <span><kbd>↵</kbd> executar</span>
            <span><kbd>esc</kbd> fechar</span>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: var(--color-bg); color: var(--color-fg); }

    .skip-link {
      position: absolute; top: -100%; left: 16px;
      background: var(--color-accent); color: white;
      padding: 8px 16px;
      border-radius: 0 0 var(--radius-md) var(--radius-md);
      font-weight: 600; text-decoration: none;
      z-index: calc(var(--z-cursor) + 1);
      transition: top var(--duration-fast);
    }
    .skip-link:focus { top: 0; }

    main { padding-top: 64px; }

    /* ─── COMMAND PALETTE ─── */
    .palette-backdrop {
      position: fixed; inset: 0; z-index: 9990;
      background: rgba(0,0,0,0.65);
      backdrop-filter: blur(8px);
      display: flex; align-items: flex-start; justify-content: center;
      padding-top: clamp(80px, 15vh, 160px);
      animation: fade-in 0.15s ease;
    }

    .palette-modal {
      width: min(600px, 90vw);
      background: var(--color-surface);
      border: 1px solid var(--color-border-2);
      border-radius: var(--radius-2xl);
      overflow: hidden;
      box-shadow: 0 24px 64px rgba(0,0,0,0.5);
      animation: scale-in 0.15s var(--ease-out-expo);
    }

    .palette-search {
      display: flex; align-items: center; gap: 10px;
      padding: 14px 18px;
      border-bottom: 1px solid var(--color-border);
    }

    .palette-search svg { flex-shrink: 0; color: var(--color-fg-muted); }

    .palette-input {
      flex: 1; border: none; background: transparent;
      font-size: var(--text-base); color: var(--color-fg);
      font-family: var(--font-sans);
      outline: none;
    }

    .palette-input::placeholder { color: var(--color-fg-muted); }

    .palette-esc {
      padding: 2px 6px;
      background: var(--color-surface-2);
      border: 1px solid var(--color-border);
      border-radius: 4px;
      font-size: 11px;
      font-family: var(--font-mono);
      color: var(--color-fg-muted);
    }

    .palette-results {
      max-height: 340px;
      overflow-y: auto;
      padding: 6px;
    }

    .palette-item {
      display: flex; align-items: center; gap: 10px;
      width: 100%; padding: 10px 12px;
      border: none; background: transparent;
      color: var(--color-fg); text-align: left;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: background var(--duration-fast);
    }

    .palette-item.active, .palette-item:hover {
      background: var(--color-surface-2);
    }

    .palette-item.active { background: rgba(255,69,0,0.1); }

    .palette-item__icon { font-size: 16px; width: 20px; text-align: center; flex-shrink: 0; }

    .palette-item__label { flex: 1; font-size: var(--text-sm); font-weight: 500; }

    .palette-item__group {
      font-size: 10px; font-family: var(--font-mono);
      color: var(--color-fg-muted);
      text-transform: uppercase; letter-spacing: 0.08em;
    }

    .palette-empty {
      text-align: center; padding: 24px;
      font-size: var(--text-sm); color: var(--color-fg-muted);
      font-family: var(--font-mono);
    }

    .palette-footer {
      display: flex; gap: 16px;
      padding: 10px 18px;
      border-top: 1px solid var(--color-border);
      font-size: 11px; color: var(--color-fg-muted);
      font-family: var(--font-mono);
    }

    .palette-footer kbd {
      padding: 1px 5px;
      background: var(--color-surface-2);
      border: 1px solid var(--color-border);
      border-radius: 3px;
    }
  `]
})
export class App implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private router     = inject(Router);
  private data       = inject(DataService);
  private seo        = inject(SeoService);
  private animation  = inject(AnimationService);
  private i18n       = inject(I18nService);
  private theme      = inject(ThemeService);

  // ─── Command palette state ───────────────────────────────────────
  paletteOpen    = signal(false);
  paletteQuery   = signal('');
  paletteCursor  = signal(0);

  private readonly CMDS: PaletteCmd[] = [
    { id: 'nav-home',       label: 'Início / Home',           icon: '🏠', group: 'Navegar', action: () => this.router.navigate(['/']) },
    { id: 'nav-projetos',   label: 'Projetos / Projects',     icon: '🚀', group: 'Navegar', action: () => this.router.navigate(['/projetos']) },
    { id: 'nav-palestras',  label: 'Palestras / Speaking',    icon: '🎤', group: 'Navegar', action: () => this.router.navigate(['/palestras']) },
    { id: 'nav-posts',      label: 'Artigos / Articles',      icon: '✍️',  group: 'Navegar', action: () => this.router.navigate(['/posts']) },
    { id: 'nav-livros',     label: 'Livros / Books',          icon: '📚', group: 'Navegar', action: () => this.router.navigate(['/livros']) },
    { id: 'nav-comunidade', label: 'Comunidade / Community',  icon: '🌐', group: 'Navegar', action: () => this.router.navigate(['/comunidade']) },
    { id: 'nav-setup',      label: 'Setup do Dev',            icon: '⚙️',  group: 'Navegar', action: () => this.router.navigate(['/setup']) },
    { id: 'nav-mentoria',   label: 'Mentoria',                icon: '🎯', group: 'Navegar', action: () => this.router.navigate(['/mentoria']) },
    { id: 'nav-contato',    label: 'Contato / Contact',       icon: '📬', group: 'Navegar', action: () => this.router.navigate(['/contato']) },
    { id: 'act-theme',      label: 'Alternar tema / Toggle theme', icon: '🌙', group: 'Ação', action: () => this.theme.toggleTheme(window.innerWidth / 2, window.innerHeight / 2) },
    { id: 'act-lang',       label: 'Mudar idioma / Switch language', icon: '🌍', group: 'Ação', action: () => this.i18n.switchLang() },
    { id: 'act-github',     label: 'GitHub',                  icon: '🐙', group: 'Links',   action: () => window.open('https://github.com/GhabryelHenrique', '_blank') },
    { id: 'act-linkedin',   label: 'LinkedIn',                icon: '💼', group: 'Links',   action: () => window.open('https://www.linkedin.com/in/ghabryelhenrique/', '_blank') },
    { id: 'act-medium',     label: 'Medium',                  icon: '📝', group: 'Links',   action: () => window.open('https://ghabryel.medium.com', '_blank') },
  ];

  paletteFiltered = computed(() => {
    const q = this.paletteQuery().toLowerCase().trim();
    return q ? this.CMDS.filter(c =>
      c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q)
    ) : this.CMDS;
  });

  openPalette():  void { this.paletteOpen.set(true);  this.paletteQuery.set(''); this.paletteCursor.set(0); }
  closePalette(): void { this.paletteOpen.set(false); }

  runCmd(cmd: PaletteCmd): void {
    this.closePalette();
    cmd.action();
  }

  onPaletteKey(e: KeyboardEvent): void {
    const len = this.paletteFiltered().length;
    if (e.key === 'ArrowDown') { e.preventDefault(); this.paletteCursor.update(c => Math.min(c + 1, len - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); this.paletteCursor.update(c => Math.max(c - 1, 0)); }
    if (e.key === 'Enter')     { const cmd = this.paletteFiltered()[this.paletteCursor()]; if (cmd) this.runCmd(cmd); }
    if (e.key === 'Escape')    { this.closePalette(); }
  }

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
      // Cmd+K / Ctrl+K → command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.paletteOpen() ? this.closePalette() : this.openPalette();
        return;
      }
      // Escape closes palette
      if (e.key === 'Escape' && this.paletteOpen()) {
        this.closePalette();
        return;
      }
      // Konami code
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
