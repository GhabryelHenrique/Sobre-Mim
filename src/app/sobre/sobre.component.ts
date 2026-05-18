import {
  Component, OnInit, OnDestroy, inject, signal, computed, effect,
  ElementRef, PLATFORM_ID, ChangeDetectionStrategy, afterNextRender
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../core/services/data.service';
import { I18nService } from '../core/services/i18n.service';
import { SeoService } from '../core/services/seo.service';
import { TranslatePipe } from '../shared/pipes/translate.pipe';
import { RevealOnScrollDirective } from '../shared/directives/reveal-on-scroll.directive';

const ROLES = ['Angular Architect', 'GDE Candidate', 'Community Builder', 'Tech Speaker'];
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#%&';

@Component({
  selector: 'app-sobre',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslatePipe, RevealOnScrollDirective],
  template: `
<div class="home-page">

  <!-- ═══════════════════ HERO ═══════════════════ -->
  <section class="hero">
    <canvas id="hero-canvas" class="hero-canvas" aria-hidden="true"></canvas>
    <div class="hero-grain" aria-hidden="true"></div>

    <div class="hero-content">
      <p class="hero-greeting">{{ 'home.hero.greeting' | translate }}</p>

      <h1 class="hero-name" aria-label="Ghabryel">
        @for (ch of nameChars; track $index) {
          <span class="char-wrap">
            <span class="char">{{ ch }}</span>
          </span>
        }
      </h1>

      <div class="hero-role-wrap">
        <span class="role-prefix">//</span>
        <span class="hero-role">{{ subtitle() }}</span>
        <span class="caret">_</span>
      </div>

      <p class="hero-bio">
        @if (profile()) {
          {{ lang() === 'pt'
              ? 'Sênior Engineer · GDE Candidate em Angular · Local Lead NASA Space Apps · Global Shaper (WEF)'
              : 'Senior Engineer · Angular GDE Candidate · NASA Space Apps Local Lead · Global Shaper (WEF)' }}
        }
      </p>

      <div class="hero-ctas">
        <a routerLink="/projetos" class="btn-primary" data-cursor-hover>
          {{ 'home.hero.cta_projects' | translate }}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
        <a href="https://ghabryel.medium.com" target="_blank" rel="noopener" class="btn-ghost" data-cursor-hover>
          Medium
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </a>
      </div>
    </div>

    <!-- Status Cards -->
    <div class="status-dock">
      @for (card of statusCards; track card.icon; let i = $index) {
        <a [href]="card.link" [attr.routerLink]="card.internal ? card.link : null"
           class="status-card" [style.animation-delay]="(i * 0.35) + 's'" data-cursor-hover>
          <span class="s-icon">{{ card.icon }}</span>
          <span class="s-label">{{ lang() === 'pt' ? card.pt : card.en }}</span>
          <span class="s-dot"></span>
        </a>
      }
    </div>

    <!-- Scroll cue -->
    <div class="scroll-cue" aria-hidden="true">
      <div class="scroll-line"></div>
      <svg class="scroll-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
  </section>

  <!-- ═══════════════════ ABOUT ═══════════════════ -->
  <section class="about-section">
    <div class="container">
      <div class="about-grid">

        <!-- Visual column -->
        <div class="about-visual" revealOnScroll>
          <div class="photo-frame">
            <img src="/images/ghabryelSorriso.jpg" alt="Ghabryel Henrique"
                 class="photo" loading="lazy" width="340" height="340" />
            <div class="photo-border"></div>
            <div class="photo-accent"></div>
          </div>

          <div class="stats-grid">
            @for (s of stats; track s.label.pt) {
              <div class="stat">
                <span class="stat-val">{{ s.value }}{{ s.suffix }}</span>
                <span class="stat-lbl">{{ lang() === 'pt' ? s.label.pt : s.label.en }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Text column -->
        <div class="about-text" revealOnScroll [revealDelay]="100">
          <span class="eyebrow">{{ 'about.bio_title' | translate }}</span>

          <h2 class="about-title">
            {{ lang() === 'pt' ? 'Arquitetando' : 'Architecting' }}
            <br><em class="accent-text">{{ lang() === 'pt' ? 'experiências excepcionais' : 'exceptional experiences' }}</em>
          </h2>

          @if (profile()) {
            <p class="bio-text">
              {{ lang() === 'pt' ? profile()!.bio.pt : profile()!.bio.en }}
            </p>
          }

          @if (profile()?.gde_status) {
            <div class="gde-badge">
              <span class="gde-dot"></span>
              <span>{{ lang() === 'pt' ? profile()!.gde_status.pt : profile()!.gde_status.en }}</span>
            </div>
          }

          <div class="about-links">
            <a routerLink="/projetos" class="text-link" data-cursor-hover>
              {{ lang() === 'pt' ? 'Ver projetos' : 'View projects' }} →
            </a>
            <a routerLink="/comunidade" class="text-link" data-cursor-hover>
              {{ lang() === 'pt' ? 'Comunidade' : 'Community' }} →
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══════════════════ TIMELINE (horizontal scroll-driven) ═══════════════════ -->
  <section class="tl-section">
    <div class="tl-inner">
      <header class="tl-header section-head" revealOnScroll>
        <span class="eyebrow">{{ 'about.timeline_title' | translate }}</span>
        <h2 class="section-title">
          {{ lang() === 'pt' ? 'Onde construí coisas importantes' : 'Where I built important things' }}
        </h2>
      </header>

      @if (timeline().length > 0) {
        <div class="tl-track">
          <div class="tl-cap">
            <span class="tl-cap-label">2021</span>
            <div class="tl-cap-line"></div>
          </div>

          @for (job of timelineReversed(); track job.id; let i = $index) {
            <article class="tl-card" [style.--card-color]="job.color">
              <div class="tl-stripe" [style.background]="job.color"></div>
              <div class="tl-body">
                <div class="tl-top-row">
                  @if (job.logo) {
                    <img [src]="job.logo" [alt]="job.company" class="tl-logo" loading="lazy" width="40" height="40" />
                  }
                  <div class="tl-meta">
                    <h3 class="tl-company">{{ job.company }}</h3>
                    <p class="tl-role">{{ lang() === 'pt' ? job.position.pt : job.position.en }}</p>
                  </div>
                  @if (job.current) {
                    <span class="tl-badge-current">{{ lang() === 'pt' ? 'Atual' : 'Now' }}</span>
                  }
                </div>
                <p class="tl-period">{{ lang() === 'pt' ? job.period.pt : job.period.en }}</p>
                <p class="tl-desc">{{ lang() === 'pt' ? job.description.pt : job.description.en }}</p>
                <div class="tl-stack">
                  @for (tech of job.stack.slice(0, 4); track tech) {
                    <span class="tech">{{ tech }}</span>
                  }
                </div>
              </div>
            </article>
          }

          <div class="tl-cap tl-cap-end">
            <div class="tl-cap-line"></div>
            <span class="tl-cap-label tl-cap-now">{{ lang() === 'pt' ? 'Hoje' : 'Today' }}</span>
            <div class="tl-cap-dot"></div>
          </div>
        </div>
      } @else {
        <div class="tl-track">
          @for (_ of [1,2,3,4]; track $index) {
            <div class="tl-skeleton"></div>
          }
        </div>
      }
    </div>
  </section>

  <!-- ═══════════════════ STACK CONSTELLATION ═══════════════════ -->
  <section class="stack-section">
    <div class="container">
      <header class="section-head" revealOnScroll>
        <span class="eyebrow">{{ lang() === 'pt' ? 'Tecnologias' : 'Stack' }}</span>
        <h2 class="section-title">
          {{ lang() === 'pt' ? 'Ferramentas que dominei' : 'Tools I mastered' }}
        </h2>
      </header>

      <div class="constellation-wrap" revealOnScroll [revealDelay]="100">
        <canvas id="stack-canvas" class="stack-canvas"
                aria-label="{{ lang() === 'pt' ? 'Constelação de tecnologias' : 'Technology constellation' }}">
        </canvas>
        <p class="constellation-hint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          {{ lang() === 'pt' ? 'Passe o mouse sobre os nós para explorar conexões' : 'Hover over nodes to explore connections' }}
        </p>
      </div>
    </div>
  </section>

</div>
  `,
  styles: [`
    /* ─── PAGE ─── */
    .home-page { background: var(--color-bg); }

    /* ─── HERO ─── */
    .hero {
      position: relative;
      height: 100svh;
      min-height: 600px;
      display: flex;
      align-items: center;
      overflow: hidden;
    }

    .hero-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
    }

    .hero-grain {
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      opacity: 0.04;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23n)'/%3E%3C/svg%3E");
      background-size: 180px 180px;
    }

    .hero-content {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 var(--container-px);
    }

    .hero-greeting {
      font-size: var(--text-sm);
      font-family: var(--font-mono);
      color: var(--color-accent-2);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 12px;
      opacity: 0;
    }

    .hero-name {
      display: flex;
      flex-wrap: wrap;
      gap: 0;
      font-size: clamp(3.5rem, 10vw, 9rem);
      font-weight: 900;
      letter-spacing: -0.04em;
      line-height: 0.9;
      margin-bottom: 20px;
      overflow: hidden;
    }

    .char-wrap {
      display: inline-block;
      overflow: hidden;
      line-height: 1;
    }

    .char {
      display: inline-block;
      color: var(--color-fg);
      will-change: transform;
    }

    .hero-role-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 20px;
      height: 36px;
      opacity: 0;
    }

    .role-prefix {
      font-family: var(--font-mono);
      font-size: var(--text-sm);
      color: var(--color-fg-muted);
      opacity: 0.5;
    }

    .hero-role {
      font-family: var(--font-mono);
      font-size: clamp(1rem, 2vw, 1.35rem);
      font-weight: 600;
      color: var(--color-accent);
      letter-spacing: 0.02em;
      min-width: 260px;
    }

    .caret {
      font-family: var(--font-mono);
      color: var(--color-accent);
      font-weight: 700;
      animation: blink 1.1s step-end infinite;
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0; }
    }

    .hero-bio {
      font-size: var(--text-base);
      color: var(--color-fg-muted);
      max-width: 540px;
      line-height: 1.6;
      margin-bottom: 32px;
      opacity: 0;
    }

    .hero-ctas {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      opacity: 0;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 28px;
      background: var(--color-accent);
      color: #fff;
      border-radius: var(--radius-full);
      font-weight: 700;
      font-size: var(--text-sm);
      text-decoration: none;
      letter-spacing: 0.01em;
      transition: background var(--duration-fast), transform var(--duration-fast) var(--ease-bounce), box-shadow var(--duration-fast);
    }

    .btn-primary:hover {
      background: #ff6633;
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(255,69,0,0.4);
    }

    .btn-ghost {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 14px 24px;
      border: 1.5px solid rgba(255,255,255,0.15);
      color: var(--color-fg-muted);
      border-radius: var(--radius-full);
      font-weight: 600;
      font-size: var(--text-sm);
      text-decoration: none;
      backdrop-filter: blur(8px);
      transition: border-color var(--duration-fast), color var(--duration-fast), transform var(--duration-fast);
    }

    .btn-ghost:hover {
      border-color: var(--color-fg);
      color: var(--color-fg);
      transform: translateY(-2px);
    }

    /* Status dock */
    .status-dock {
      position: absolute;
      bottom: 48px;
      left: var(--container-px);
      z-index: 3;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .status-card {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 16px;
      background: var(--glass-bg, rgba(17,17,17,0.7));
      border: 1px solid var(--glass-border, rgba(255,255,255,0.06));
      border-radius: var(--radius-full);
      backdrop-filter: blur(12px);
      text-decoration: none;
      color: var(--color-fg);
      font-size: var(--text-xs);
      font-weight: 500;
      animation: float 6s ease-in-out infinite;
      opacity: 0;
      transition: border-color var(--duration-fast), transform var(--duration-fast);
    }

    .status-card:hover {
      border-color: var(--color-accent);
      transform: translateX(4px) !important;
    }

    .s-icon { font-size: 14px; }

    .s-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--color-accent);
      margin-left: auto;
      animation: pulse-glow 2s ease-in-out infinite;
    }

    /* Scroll cue */
    .scroll-cue {
      position: absolute;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 3;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }

    .scroll-line {
      width: 1px;
      height: 40px;
      background: linear-gradient(to bottom, transparent, var(--color-fg-muted));
      animation: scroll-line 2s ease-in-out infinite;
    }

    @keyframes scroll-line {
      0%, 100% { transform: scaleY(0); transform-origin: top; }
      50%       { transform: scaleY(1); transform-origin: top; }
    }

    .scroll-chevron {
      color: var(--color-fg-muted);
      animation: bounce-down 1.8s ease-in-out infinite;
    }

    @keyframes bounce-down {
      0%, 100% { transform: translateY(0); opacity: 0.4; }
      50%       { transform: translateY(5px); opacity: 1; }
    }

    @media (max-width: 640px) {
      .status-dock { display: none; }
      .scroll-cue  { display: none; }
    }

    /* ─── ABOUT ─── */
    .about-section {
      padding: var(--section-py) 0;
      border-top: 1px solid var(--color-border);
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 var(--container-px);
    }

    .about-grid {
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: clamp(3rem, 8vw, 7rem);
      align-items: center;
    }

    /* Photo */
    .photo-frame {
      position: relative;
      width: min(340px, 100%);
      margin: 0 auto;
    }

    .photo {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      border-radius: var(--radius-xl);
      display: block;
      transition: transform var(--duration-slow) var(--ease-out-expo);
      position: relative;
      z-index: 1;
    }

    .photo-frame:hover .photo { transform: scale(1.02); }

    .photo-border {
      position: absolute;
      inset: -3px;
      border-radius: calc(var(--radius-xl) + 3px);
      background: linear-gradient(135deg, var(--color-accent) 0%, transparent 40%, var(--color-accent-2) 100%);
      z-index: 0;
    }

    .photo-accent {
      position: absolute;
      bottom: -20px;
      right: -20px;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,69,0,0.3) 0%, transparent 70%);
      z-index: 0;
      filter: blur(20px);
    }

    /* Stats */
    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 24px;
    }

    .stat {
      padding: 16px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      transition: border-color var(--duration-fast);
    }

    .stat:hover { border-color: var(--color-accent); }

    .stat-val {
      display: block;
      font-size: var(--text-3xl);
      font-weight: 800;
      font-family: var(--font-mono);
      color: var(--color-accent);
      line-height: 1;
      margin-bottom: 4px;
    }

    .stat-lbl {
      font-size: var(--text-xs);
      color: var(--color-fg-muted);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    /* About text */
    .eyebrow {
      display: inline-block;
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      color: var(--color-accent-2);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 16px;
    }

    .about-title {
      font-size: var(--text-4xl);
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.1;
      margin-bottom: 20px;
    }

    .accent-text {
      font-style: normal;
      background: linear-gradient(90deg, var(--color-accent), var(--color-accent-2));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .bio-text {
      font-size: var(--text-base);
      color: var(--color-fg-muted);
      line-height: 1.75;
      margin-bottom: 24px;
    }

    .gde-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 10px 18px;
      background: transparent;
      border: 1px solid var(--color-accent);
      border-radius: var(--radius-full);
      font-size: var(--text-sm);
      font-weight: 600;
      color: var(--color-accent);
      margin-bottom: 28px;
    }

    .gde-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--color-accent);
      animation: pulse-glow 2s ease-in-out infinite;
      flex-shrink: 0;
    }

    .about-links {
      display: flex;
      gap: 24px;
      flex-wrap: wrap;
    }

    .text-link {
      font-size: var(--text-sm);
      font-weight: 600;
      color: var(--color-fg-muted);
      text-decoration: none;
      transition: color var(--duration-fast);
    }

    .text-link:hover { color: var(--color-accent); }

    @media (max-width: 768px) {
      .about-grid { grid-template-columns: 1fr; }
    }

    /* ─── SHARED SECTION TYPOGRAPHY ─── */
    .section-head { margin-bottom: clamp(2rem, 5vw, 3.5rem); }

    .section-title {
      font-size: var(--text-4xl);
      font-weight: 800;
      letter-spacing: -0.03em;
      margin-top: 8px;
    }

    .tech {
      padding: 3px 9px;
      background: var(--color-surface-2);
      border-radius: var(--radius-sm);
      font-size: var(--text-xs);
      font-family: var(--font-mono);
      color: var(--color-fg-muted);
    }

    /* ─── HORIZONTAL TIMELINE ─── */
    .tl-section {
      overflow: hidden;
      border-top: 1px solid var(--color-border);
      padding-top: var(--section-py);
      padding-bottom: 0;
    }

    .tl-inner { width: 100%; }

    .tl-header { padding: 0 var(--container-px); }

    .tl-track {
      display: flex;
      align-items: stretch;
      gap: 0;
      padding: 0 var(--container-px) 64px;
      width: max-content;
      will-change: transform;
      position: relative;
    }

    /* Horizontal connector line running through cards */
    .tl-track::before {
      content: '';
      position: absolute;
      top: 52px;
      left: var(--container-px);
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, var(--color-border) 0%, var(--color-border-2) 50%, var(--color-border) 100%);
      pointer-events: none;
    }

    .tl-cap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding-top: 42px;
      width: 80px;
      flex-shrink: 0;
      position: relative;
      z-index: 1;
    }

    .tl-cap-end { justify-content: flex-start; }

    .tl-cap-line {
      width: 1px;
      height: 20px;
      background: var(--color-border-2);
    }

    .tl-cap-label {
      font-size: var(--text-xs);
      font-family: var(--font-mono);
      color: var(--color-fg-muted);
      white-space: nowrap;
    }

    .tl-cap-now { color: var(--color-accent); font-weight: 600; }

    .tl-cap-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--color-accent);
      margin-top: 6px;
      animation: pulse-glow 2s ease-in-out infinite;
    }

    .tl-card {
      width: min(340px, 82vw);
      flex-shrink: 0;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      overflow: hidden;
      margin: 24px 12px 0;
      position: relative;
      z-index: 1;
      transition: border-color var(--duration-base), transform 0.35s var(--ease-out-expo), box-shadow var(--duration-base);
    }

    .tl-card:hover {
      border-color: color-mix(in srgb, var(--card-color) 40%, var(--color-border));
      transform: translateY(-6px);
      box-shadow: 0 12px 32px -8px color-mix(in srgb, var(--card-color) 20%, transparent);
    }

    .tl-stripe { height: 3px; width: 100%; opacity: 0.8; }

    .tl-body { padding: 22px; }

    .tl-top-row {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 10px;
    }

    .tl-logo {
      width: 40px;
      height: 40px;
      object-fit: contain;
      border-radius: var(--radius-md);
      background: var(--color-surface-2);
      padding: 4px;
      flex-shrink: 0;
    }

    .tl-meta { flex: 1; min-width: 0; }

    .tl-company {
      font-size: var(--text-base);
      font-weight: 700;
      margin-bottom: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .tl-role {
      font-size: var(--text-sm);
      color: var(--color-accent);
      font-weight: 500;
    }

    .tl-badge-current {
      margin-left: auto;
      padding: 2px 8px;
      background: rgba(255,69,0,0.12);
      border: 1px solid rgba(255,69,0,0.28);
      border-radius: var(--radius-full);
      font-size: 10px;
      font-weight: 700;
      color: var(--color-accent);
      white-space: nowrap;
      flex-shrink: 0;
    }

    .tl-period {
      font-size: var(--text-xs);
      font-family: var(--font-mono);
      color: var(--color-fg-muted);
      margin-bottom: 10px;
    }

    .tl-desc {
      font-size: var(--text-sm);
      color: var(--color-fg-muted);
      line-height: 1.65;
      margin-bottom: 16px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .tl-stack { display: flex; flex-wrap: wrap; gap: 5px; }

    .tl-skeleton {
      width: 320px;
      height: 220px;
      flex-shrink: 0;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      margin: 24px 12px 0;
      background-image: linear-gradient(90deg, var(--color-surface) 0%, var(--color-surface-2) 50%, var(--color-surface) 100%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }

    /* Mobile: native horizontal scroll */
    @media (max-width: 1023px) {
      .tl-section { overflow-x: clip; }
      .tl-track {
        overflow-x: auto;
        overflow-y: visible;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        padding-bottom: 24px;
        width: auto;
      }
      .tl-card { scroll-snap-align: start; }
    }

    /* ─── STACK CONSTELLATION ─── */
    .stack-section {
      padding: var(--section-py) 0;
      border-top: 1px solid var(--color-border);
    }

    .constellation-wrap { position: relative; }

    .stack-canvas {
      display: block;
      width: 100%;
      height: 480px;
      border-radius: var(--radius-xl);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      cursor: crosshair;
    }

    .constellation-hint {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: var(--text-xs);
      font-family: var(--font-mono);
      color: var(--color-fg-muted);
      margin-top: 12px;
      opacity: 0.6;
    }

    /* Light theme */
    [data-theme="light"] .hero-canvas { opacity: 0.4; }
    [data-theme="light"] .hero-grain  { opacity: 0.02; }
    [data-theme="light"] .stack-canvas { background: #f5f5f5; border-color: #e0e0e0; }
  `]
})
export class SobreComponent implements OnInit, OnDestroy {
  private platformId  = inject(PLATFORM_ID);
  private el          = inject(ElementRef);
  private dataService = inject(DataService);
  private i18nService = inject(I18nService);
  private seoService  = inject(SeoService);

  profile          = this.dataService.profile;
  timeline         = this.dataService.timeline;
  timelineReversed = computed(() => [...this.timeline()].reverse());
  lang             = computed(() => this.i18nService.currentLang());

  subtitle  = signal(ROLES[0]);
  nameChars = 'Ghabryel'.split('');

  private renderer: unknown = null;
  private animRaf  = 0;
  private roleIdx  = 0;
  private scrambleId = 0;
  private rotateId   = 0;
  private tlInitialized = false;
  private mouseX = 0.5;
  private mouseY = 0.5;
  private onMouseMove = (e: MouseEvent) => {
    this.mouseX = e.clientX / window.innerWidth;
    this.mouseY = 1 - e.clientY / window.innerHeight;
  };

  stats = [
    { value: 5,  suffix: '',  label: { pt: 'Anos Exp.',       en: 'Years Exp.'     } },
    { value: 4,  suffix: '',  label: { pt: 'Empresas',        en: 'Companies'      } },
    { value: 50, suffix: '+', label: { pt: 'Devs Impactados', en: 'Devs Impacted'  } },
    { value: 9,  suffix: '',  label: { pt: 'Artigos',         en: 'Articles'       } }
  ];

  statusCards = [
    { icon: '🎤', pt: 'Disponível para Palestras', en: 'Available for Speaking',  link: '/palestras', internal: true  },
    { icon: '🚀', pt: 'Mentorando Devs',           en: 'Mentoring Devs',          link: '/mentoria',  internal: true  },
    { icon: '✍️', pt: 'Escrevendo no Medium',       en: 'Writing on Medium',       link: 'https://ghabryel.medium.com', internal: false }
  ];

  constructor() {
    afterNextRender(() => {
      this.initWebGL();
      this.initAnimations();
      this.initStackConstellation();
    });

    // Setup horizontal timeline once data arrives (effect runs in injection context)
    effect(() => {
      const jobs = this.timeline();
      if (jobs.length > 0 && !this.tlInitialized && isPlatformBrowser(this.platformId)) {
        this.tlInitialized = true;
        requestAnimationFrame(() => requestAnimationFrame(() => this.initHorizontalTimeline()));
      }
    });
  }

  ngOnInit(): void {
    this.seoService.setMeta({
      title: 'Ghabryel Henrique — Senior Software Engineer & Angular GDE Candidate',
      description: 'Senior Engineer especializado em Angular e arquitetura frontend. GDE Candidate, Local Lead NASA Space Apps, Global Shaper (WEF). Conheça meu trabalho.'
    });
    if (isPlatformBrowser(this.platformId)) {
      this.startRotation();
    }
    this.dataService.loadTimeline();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animRaf);
    clearInterval(this.rotateId);
    clearInterval(this.scrambleId);
    if (isPlatformBrowser(this.platformId)) {
      document.removeEventListener('mousemove', this.onMouseMove);
    }
    const r = this.renderer as { dispose?: () => void } | null;
    r?.dispose?.();
  }

  // ─── WebGL ───────────────────────────────────────────────────────
  private async initWebGL(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = this.el.nativeElement.querySelector('#hero-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const testGL = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!testGL) return;

    const THREE = await import('three');

    const W = window.innerWidth;
    const H = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer = renderer;

    const scene  = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geo    = new THREE.PlaneGeometry(2, 2);

    const uTime  = { value: 0 };
    const uMouse = { value: new THREE.Vector2(0.5, 0.5) };
    const uRes   = { value: new THREE.Vector2(W, H) };

    const mat = new THREE.ShaderMaterial({
      uniforms: { u_time: uTime, u_mouse: uMouse, u_resolution: uRes },
      vertexShader: `void main(){ gl_Position = vec4(position,1.0); }`,
      fragmentShader: `
        precision mediump float;
        uniform float u_time;
        uniform vec2  u_mouse;
        uniform vec2  u_resolution;

        /* 2D simplex noise by Ian McEwan, Ashima Arts */
        vec3 mod289v3(vec3 x){ return x - floor(x*(1./289.))*289.; }
        vec2 mod289v2(vec2 x){ return x - floor(x*(1./289.))*289.; }
        vec3 permute(vec3 x){ return mod289v3(((x*34.)+1.)*x); }
        float snoise(vec2 v){
          const vec4 C = vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy));
          vec2 x0 = v - i + dot(i, C.xx);
          vec2 i1  = (x0.x > x0.y) ? vec2(1.,0.) : vec2(0.,1.);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy  -= i1;
          i = mod289v2(i);
          vec3 p = permute(permute(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));
          vec3 m = max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);
          m = m*m; m = m*m;
          vec3 x_ = 2.*fract(p*C.www)-1.;
          vec3 h  = abs(x_)-0.5;
          vec3 ox = floor(x_+0.5);
          vec3 a0 = x_-ox;
          m *= 1.79284291400159 - 0.85373472095314*(a0*a0+h*h);
          vec3 g;
          g.x  = a0.x *x0.x  + h.x *x0.y;
          g.yz = a0.yz*x12.xz + h.yz*x12.yw;
          return 130.*dot(m,g);
        }

        void main(){
          vec2 uv = gl_FragCoord.xy / u_resolution;
          float t  = u_time;

          float n1 = snoise(uv * 1.6 + vec2( t*0.11,  t*0.07));
          float n2 = snoise(uv * 2.8 - vec2( t*0.06,  t*0.14));
          float n3 = snoise(uv * 1.1 + vec2(-t*0.04, -t*0.09) + u_mouse*0.25);

          float f = (n1*0.5 + n2*0.3 + n3*0.2)*0.5 + 0.5;

          float mDist = length(uv - u_mouse);
          float mGlow = exp(-mDist * 2.8) * 0.18;
          f = clamp(f + mGlow, 0., 1.);

          vec3 base   = vec3(0.051, 0.051, 0.051);
          vec3 warm   = vec3(0.09,  0.04,  0.02);
          vec3 orange = vec3(1.0,   0.271, 0.0);
          vec3 cyan   = vec3(0.0,   0.851, 1.0);

          vec3 col = base;
          col = mix(col, warm,   smoothstep(0.3, 0.65, f));
          col = mix(col, orange, smoothstep(0.6, 0.88, f) * 0.28);
          col = mix(col, cyan,   smoothstep(0.7, 0.95, f*(1.-uv.y*0.4)) * 0.18);

          float vig = 1. - smoothstep(0.38, 1.1, length((uv-0.5)*1.6));
          col *= 0.55 + vig * 0.45;

          gl_FragColor = vec4(col, 1.0);
        }
      `
    });

    scene.add(new THREE.Mesh(geo, mat));

    document.addEventListener('mousemove', this.onMouseMove, { passive: true });

    const handleResize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h);
      uRes.value.set(w, h);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    const t0 = performance.now();
    const loop = () => {
      this.animRaf = requestAnimationFrame(loop);
      uTime.value  = (performance.now() - t0) / 1000;
      uMouse.value.set(this.mouseX, this.mouseY);
      renderer.render(scene, camera);
    };
    loop();
  }

  // ─── GSAP Animations ─────────────────────────────────────────────
  private async initAnimations(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    const { gsap } = await import('gsap');

    const chars = this.el.nativeElement.querySelectorAll('.char');
    gsap.fromTo(chars,
      { y: '110%' },
      { y: '0%', duration: 0.9, stagger: 0.055, ease: 'power4.out', delay: 0.15 }
    );

    gsap.to('.hero-greeting', { opacity: 1, y: 0, duration: 0.6, delay: 0.05,
      from: { opacity: 0, y: 16 } });
    gsap.fromTo('.hero-role-wrap',  { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.9 });
    gsap.fromTo('.hero-bio',        { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, delay: 1.1 });
    gsap.fromTo('.hero-ctas',       { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, delay: 1.3 });
    gsap.fromTo('.status-card',     { opacity: 0, x: -20 }, {
      opacity: 1, x: 0, duration: 0.5, stagger: 0.12, delay: 1.5, ease: 'power2.out'
    });
  }

  // ─── Scramble subtitle ───────────────────────────────────────────
  private startRotation(): void {
    setTimeout(() => {
      this.rotateId = setInterval(() => {
        this.roleIdx = (this.roleIdx + 1) % ROLES.length;
        this.scrambleTo(ROLES[this.roleIdx]);
      }, 2800) as unknown as number;
    }, 2000);
  }

  private scrambleTo(target: string): void {
    clearInterval(this.scrambleId);
    let iter = 0;
    const total = target.length * 3;
    this.scrambleId = setInterval(() => {
      const out = target.split('').map((ch, i) => {
        if (ch === ' ') return ' ';
        return i < iter / 3 ? ch : CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join('');
      this.subtitle.set(out);
      if (++iter > total) {
        clearInterval(this.scrambleId);
        this.subtitle.set(target);
      }
    }, 35) as unknown as number;
  }

  // ─── Horizontal timeline (GSAP ScrollTrigger pin) ────────────────
  private async initHorizontalTimeline(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    if (window.innerWidth < 1024) return; // mobile uses native scroll

    const section = this.el.nativeElement.querySelector('.tl-section') as HTMLElement;
    const track   = this.el.nativeElement.querySelector('.tl-track')   as HTMLElement;
    if (!section || !track) return;

    const { gsap }          = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);

    const getTravel = () => track.scrollWidth - window.innerWidth + 64;

    gsap.to(track, {
      x: () => -getTravel(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 1.2,
        end: () => `+=${getTravel()}`,
        invalidateOnRefresh: true,
      }
    });
  }

  // ─── Stack constellation canvas ──────────────────────────────────
  private async initStackConstellation(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    const canvas = this.el.nativeElement.querySelector('#stack-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let stackData: { categories: Array<{ id: string; items: Array<{ name: string; proficiency: number; years: number; connections: string[] }> }> };
    try {
      stackData = await fetch('/assets/data/stack.json').then(r => r.json());
    } catch { return; }

    const catColors: Record<string, string> = {
      core:     '#FF4500',
      frontend: '#00D9FF',
      backend:  '#7C3AED',
      database: '#059669',
      cloud:    '#D97706',
      tools:    '#64748B'
    };

    // Set canvas dimensions
    const W = canvas.offsetWidth || 800;
    const H = 480;
    canvas.width  = W;
    canvas.height = H;

    interface CNode { name: string; x: number; y: number; vx: number; vy: number; r: number; color: string; years: number; adj: number[] }

    const nodes: CNode[] = [];
    const nameIdx: Record<string, number> = {};

    for (const cat of stackData.categories) {
      for (const item of cat.items) {
        nameIdx[item.name] = nodes.length;
        nodes.push({
          name:  item.name,
          x:     (nodes.length % 8 + 0.5) * (W / 8) + (Math.random() - 0.5) * 40,
          y:     (Math.floor(nodes.length / 8) + 0.5) * (H / 5) + (Math.random() - 0.5) * 30,
          vx: 0, vy: 0,
          r:     5 + item.proficiency * 2.8,
          color: catColors[cat.id] ?? '#666',
          years: item.years,
          adj:   []
        });
      }
    }

    // Build adjacency
    let globalIdx = 0;
    for (const cat of stackData.categories) {
      for (const item of cat.items) {
        for (const cn of item.connections) {
          const j = nameIdx[cn];
          if (j !== undefined) nodes[globalIdx].adj.push(j);
        }
        globalIdx++;
      }
    }

    // Force simulation (runs sync — ~10ms for 30 nodes)
    const N = nodes.length;
    for (let step = 0; step < 200; step++) {
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = nodes[j].x - nodes[i].x, dy = nodes[j].y - nodes[i].y;
          const d2 = dx * dx + dy * dy + 1;
          const f  = 3200 / d2;
          nodes[i].vx -= dx * f; nodes[i].vy -= dy * f;
          nodes[j].vx += dx * f; nodes[j].vy += dy * f;
        }
      }
      for (let i = 0; i < N; i++) {
        for (const j of nodes[i].adj) {
          const dx = nodes[j].x - nodes[i].x, dy = nodes[j].y - nodes[i].y;
          const d  = Math.sqrt(dx * dx + dy * dy) + 0.01;
          const f  = (d - 90) * 0.012;
          nodes[i].vx += dx / d * f; nodes[i].vy += dy / d * f;
          nodes[j].vx -= dx / d * f; nodes[j].vy -= dy / d * f;
        }
        nodes[i].vx += (W / 2 - nodes[i].x) * 0.003;
        nodes[i].vy += (H / 2 - nodes[i].y) * 0.003;
        nodes[i].vx *= 0.82; nodes[i].vy *= 0.82;
        nodes[i].x = Math.max(nodes[i].r + 8, Math.min(W - nodes[i].r - 8, nodes[i].x + nodes[i].vx));
        nodes[i].y = Math.max(nodes[i].r + 8, Math.min(H - nodes[i].r - 8, nodes[i].y + nodes[i].vy));
      }
    }

    let hovIdx = -1;
    const isDark = () => document.documentElement.getAttribute('data-theme') !== 'light';

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Edges
      for (let i = 0; i < N; i++) {
        for (const j of nodes[i].adj) {
          if (j <= i) continue;
          const hi = hovIdx === i || hovIdx === j ||
            (hovIdx !== -1 && (nodes[hovIdx].adj.includes(i) || nodes[hovIdx].adj.includes(j)));
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = hi ? 'rgba(255,69,0,0.45)' : (isDark() ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)');
          ctx.lineWidth = hi ? 1.5 : 0.8;
          ctx.stroke();
        }
      }

      // Nodes + labels
      for (let i = 0; i < N; i++) {
        const n  = nodes[i];
        const hi = i === hovIdx;
        const connected = hovIdx !== -1 && nodes[hovIdx].adj.includes(i);
        const dim = hovIdx !== -1 && !hi && !connected;
        const alpha = dim ? 0.25 : 1;

        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(n.x, n.y, hi ? n.r + 2 : n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();

        if (hi) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + 6, 0, Math.PI * 2);
          ctx.strokeStyle = n.color + '55';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        ctx.globalAlpha = dim ? 0.15 : (hovIdx === -1 ? 0.7 : (hi || connected ? 1 : 0.4));
        ctx.fillStyle   = isDark() ? '#ffffff' : '#111111';
        ctx.font        = `${hi ? '600' : '400'} ${hi ? 11 : 10}px JetBrains Mono, monospace`;
        ctx.textAlign   = 'center';
        ctx.fillText(n.name, n.x, n.y + n.r + 13);
      }
      ctx.globalAlpha = 1;

      // Tooltip on hovered node
      if (hovIdx !== -1) {
        const n = nodes[hovIdx];
        const label = `${n.years} ${n.years === 1 ? 'year' : 'years'}`;
        const px = Math.min(n.x + n.r + 10, W - 90);
        const py = Math.max(n.y - 12, 14);
        ctx.fillStyle = isDark() ? 'rgba(26,26,26,0.92)' : 'rgba(245,245,245,0.95)';
        ctx.beginPath();
        ctx.roundRect(px, py - 14, 80, 22, 4);
        ctx.fill();
        ctx.fillStyle = isDark() ? '#f0f0f0' : '#111';
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.textAlign = 'left';
        ctx.fillText(label, px + 8, py + 1);
      }
    };

    draw();

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * (W / rect.width);
      const my = (e.clientY - rect.top)  * (H / rect.height);
      let found = -1;
      for (let i = 0; i < N; i++) {
        const dx = nodes[i].x - mx, dy = nodes[i].y - my;
        if (dx * dx + dy * dy <= (nodes[i].r + 6) ** 2) { found = i; break; }
      }
      if (found !== hovIdx) { hovIdx = found; draw(); }
      canvas.style.cursor = found !== -1 ? 'pointer' : 'crosshair';
    });

    canvas.addEventListener('mouseleave', () => {
      hovIdx = -1;
      draw();
      canvas.style.cursor = 'crosshair';
    });
  }
}
