import {
  Component, inject, signal, HostListener, OnInit,
  PLATFORM_ID, ChangeDetectionStrategy
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { I18nService } from '../../core/services/i18n.service';
import { LangSwitcherComponent } from '../../shared/components/lang-switcher/lang-switcher.component';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, LangSwitcherComponent, ThemeToggleComponent, TranslatePipe],
  template: `
    <header class="site-header" [class.scrolled]="scrolled()" [class.hidden]="headerHidden()">
      <div class="header-inner">
        <!-- Logo -->
        <a routerLink="/" class="logo" aria-label="Ghabryel Henrique — Home" data-cursor-hover>
          <span class="logo-letter">G</span>
          <span class="logo-name">Ghabryel</span>
        </a>

        <!-- Desktop Nav -->
        <nav class="nav-desktop" aria-label="Main navigation">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" data-cursor-hover>
            {{ 'nav.home' | translate }}
          </a>
          <a routerLink="/projetos" routerLinkActive="active" data-cursor-hover>
            {{ 'nav.projects' | translate }}
          </a>
          <a routerLink="/comunidade" routerLinkActive="active" data-cursor-hover>
            {{ 'nav.community' | translate }}
          </a>
          <a routerLink="/posts" routerLinkActive="active" data-cursor-hover>
            {{ 'nav.articles' | translate }}
          </a>
          <a routerLink="/palestras" routerLinkActive="active" data-cursor-hover>
            {{ 'nav.speaking' | translate }}
          </a>
        </nav>

        <!-- Actions -->
        <div class="header-actions">
          <app-lang-switcher />
          <app-theme-toggle />
          <a routerLink="/contato" class="cta-btn" data-cursor-hover>
            {{ 'nav.contact' | translate }}
          </a>

          <!-- Mobile hamburger -->
          <button
            class="hamburger"
            (click)="mobileOpen.set(!mobileOpen())"
            [class.open]="mobileOpen()"
            aria-label="Toggle navigation"
            data-cursor-hover
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      <!-- Mobile Nav Drawer -->
      @if (mobileOpen()) {
        <nav class="nav-mobile" aria-label="Mobile navigation">
          <a routerLink="/" (click)="mobileOpen.set(false)" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">
            {{ 'nav.home' | translate }}
          </a>
          <a routerLink="/projetos" (click)="mobileOpen.set(false)" routerLinkActive="active">
            {{ 'nav.projects' | translate }}
          </a>
          <a routerLink="/comunidade" (click)="mobileOpen.set(false)" routerLinkActive="active">
            {{ 'nav.community' | translate }}
          </a>
          <a routerLink="/posts" (click)="mobileOpen.set(false)" routerLinkActive="active">
            {{ 'nav.articles' | translate }}
          </a>
          <a routerLink="/palestras" (click)="mobileOpen.set(false)" routerLinkActive="active">
            {{ 'nav.speaking' | translate }}
          </a>
          <a routerLink="/mentoria" (click)="mobileOpen.set(false)" routerLinkActive="active">
            {{ 'nav.mentoria' | translate }}
          </a>
          <a routerLink="/contato" (click)="mobileOpen.set(false)" class="cta-btn-mobile">
            {{ 'nav.contact' | translate }}
          </a>
        </nav>
      }
    </header>
  `,
  styles: [`
    .site-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: var(--z-sticky);
      padding: 0 var(--container-px);
      transition:
        background var(--duration-base) ease,
        transform var(--duration-base) var(--ease-out-expo),
        backdrop-filter var(--duration-base) ease;
    }

    .site-header.scrolled {
      background: var(--glass-bg);
      backdrop-filter: blur(var(--glass-blur));
      border-bottom: 1px solid var(--glass-border);
    }

    .site-header.hidden {
      transform: translateY(-100%);
    }

    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
      max-width: 1280px;
      margin: 0 auto;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      color: var(--color-fg);
    }

    .logo-letter {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: var(--color-accent);
      color: white;
      border-radius: var(--radius-sm);
      font-weight: 800;
      font-size: 1rem;
      font-family: var(--font-mono);
      transition: transform var(--duration-fast) var(--ease-bounce);
    }

    .logo:hover .logo-letter {
      transform: rotate(-8deg) scale(1.1);
    }

    .logo-name {
      font-weight: 600;
      font-size: var(--text-sm);
      letter-spacing: -0.02em;
    }

    .nav-desktop {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .nav-desktop a {
      padding: 6px 12px;
      border-radius: var(--radius-sm);
      font-size: var(--text-sm);
      font-weight: 500;
      color: var(--color-fg-muted);
      text-decoration: none;
      transition: color var(--duration-fast), background var(--duration-fast);
    }

    .nav-desktop a:hover,
    .nav-desktop a.active {
      color: var(--color-fg);
      background: var(--color-surface);
    }

    .nav-desktop a.active {
      color: var(--color-accent);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .cta-btn {
      padding: 8px 16px;
      background: var(--color-accent);
      color: white;
      border-radius: var(--radius-full);
      font-size: var(--text-sm);
      font-weight: 600;
      text-decoration: none;
      transition: background var(--duration-fast), transform var(--duration-fast);
    }

    .cta-btn:hover {
      background: var(--color-accent-hover);
      transform: translateY(-1px);
    }

    .hamburger {
      display: none;
      flex-direction: column;
      gap: 5px;
      width: 28px;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 4px;
    }

    .hamburger span {
      display: block;
      height: 2px;
      background: var(--color-fg);
      border-radius: 2px;
      transition: transform var(--duration-base) ease, opacity var(--duration-fast) ease;
    }

    .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .hamburger.open span:nth-child(2) { opacity: 0; }
    .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

    .nav-mobile {
      display: flex;
      flex-direction: column;
      padding: 16px var(--container-px) 24px;
      border-top: 1px solid var(--color-border);
      background: var(--color-bg);
      gap: 4px;
    }

    .nav-mobile a {
      padding: 12px 16px;
      border-radius: var(--radius-md);
      font-size: var(--text-base);
      font-weight: 500;
      color: var(--color-fg-muted);
      text-decoration: none;
      transition: color var(--duration-fast), background var(--duration-fast);
    }

    .nav-mobile a:hover,
    .nav-mobile a.active {
      color: var(--color-fg);
      background: var(--color-surface);
    }

    .cta-btn-mobile {
      margin-top: 8px;
      padding: 14px 16px !important;
      background: var(--color-accent) !important;
      color: white !important;
      border-radius: var(--radius-md) !important;
      text-align: center;
      font-weight: 600 !important;
    }

    @media (max-width: 768px) {
      .nav-desktop, .cta-btn { display: none; }
      .hamburger { display: flex; }
    }

    @media (min-width: 769px) {
      .nav-mobile { display: none; }
    }
  `]
})
export class LayoutHeaderComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  protected theme = inject(ThemeService);
  protected i18n = inject(I18nService);

  scrolled = signal(false);
  headerHidden = signal(false);
  mobileOpen = signal(false);

  private lastScrollY = 0;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.updateScrollState();
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.updateScrollState();
  }

  private updateScrollState(): void {
    const current = window.scrollY;
    this.scrolled.set(current > 20);
    this.headerHidden.set(current > 100 && current > this.lastScrollY);
    this.lastScrollY = current;
  }
}
