import {
  Component, OnInit, inject, signal, computed,
  ElementRef, PLATFORM_ID, ChangeDetectionStrategy, afterNextRender
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService, Project } from '../core/services/data.service';
import { I18nService } from '../core/services/i18n.service';

type FilterKey = 'all' | 'featured' | 'active' | 'completed';

@Component({
  selector: 'app-projetos',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
<div class="proj-page">

  <!-- ═══ HERO ═══ -->
  <section class="proj-hero">
    <div class="container">
      <span class="eyebrow">{{ lang() === 'pt' ? 'Trabalho' : 'Work' }}</span>
      <h1 class="proj-hero__title">
        {{ lang() === 'pt' ? 'Projetos com' : 'Projects with' }}
        <br><em class="accent">{{ lang() === 'pt' ? 'propósito técnico' : 'technical purpose' }}</em>
      </h1>
      <p class="proj-hero__sub">
        {{ lang() === 'pt'
          ? 'Não são projetos aleatórios. São iniciativas escolhidas para mostrar intenção, não volume.'
          : 'Not random projects. Chosen initiatives to show intention, not volume.' }}
      </p>
    </div>
  </section>

  <!-- ═══ FILTERS ═══ -->
  <div class="filters-bar">
    <div class="container">
      <div class="filters">
        @for (f of filters; track f.key) {
          <button class="filter-btn"
                  [class.active]="activeFilter() === f.key"
                  (click)="setFilter(f.key)">
            {{ lang() === 'pt' ? f.labelPt : f.labelEn }}
            <span class="filter-count">{{ countFor(f.key) }}</span>
          </button>
        }
      </div>
    </div>
  </div>

  <!-- ═══ BENTO GRID ═══ -->
  <section class="bento-section">
    <div class="container">
      @if (projects().length > 0) {
        <div class="bento-grid">
          @for (p of projects(); track p.id) {
            <article class="proj-card"
                     [attr.data-status]="p.status"
                     [attr.data-featured]="p.featured"
                     [class.proj-card--featured]="p.featured">

              <!-- Color bar -->
              <div class="proj-card__accent" [style.background]="p.color_accent"></div>

              <!-- Cover image or gradient placeholder -->
              @if (p.cover_image) {
                <div class="proj-card__cover">
                  <img [src]="p.cover_image" [alt]="p.title" loading="lazy" class="proj-card__img" />
                  <div class="proj-card__cover-overlay" [style.background]="'linear-gradient(to bottom, transparent 30%, ' + p.color_accent + '18 100%)'"></div>
                </div>
              } @else {
                <div class="proj-card__placeholder" [style.background]="p.color_accent + '12'">
                  <span class="proj-card__glyph" [style.color]="p.color_accent">{{ p.title[0] }}</span>
                </div>
              }

              <div class="proj-card__body">
                <!-- Status badge -->
                <div class="proj-card__badges">
                  <span class="badge" [class]="'badge--' + p.status">
                    {{ statusLabel(p.status) }}
                  </span>
                  @if (p.featured) {
                    <span class="badge badge--feat">★ {{ lang() === 'pt' ? 'Destaque' : 'Featured' }}</span>
                  }
                </div>

                <h2 class="proj-card__title">{{ p.title }}</h2>
                <p class="proj-card__tagline">{{ lang() === 'pt' ? p.tagline.pt : p.tagline.en }}</p>

                <!-- Metrics row -->
                @if (metricEntries(p).length > 0) {
                  <div class="proj-card__metrics">
                    @for (m of metricEntries(p).slice(0, 3); track m.key) {
                      <div class="metric">
                        <span class="metric-val" [style.color]="p.color_accent">{{ m.value }}</span>
                        <span class="metric-key">{{ m.key }}</span>
                      </div>
                    }
                  </div>
                }

                <!-- Stack pills -->
                <div class="proj-card__stack">
                  @for (tech of p.stack.slice(0, 4); track tech) {
                    <span class="tech">{{ tech }}</span>
                  }
                </div>

                <!-- CTA -->
                <div class="proj-card__footer">
                  @if (p.links.live && p.links.live.startsWith('http')) {
                    <a [href]="p.links.live" target="_blank" rel="noopener" class="proj-link proj-link--ext" data-cursor-hover>
                      {{ lang() === 'pt' ? 'Ver projeto' : 'View project' }}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                  } @else if (p.links.live && p.links.live.startsWith('/')) {
                    <a [routerLink]="p.links.live" class="proj-link" data-cursor-hover>
                      {{ lang() === 'pt' ? 'Saiba mais' : 'Learn more' }}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </a>
                  }
                  <a [routerLink]="'/projetos/' + p.slug" class="proj-link proj-link--ghost" data-cursor-hover>
                    Case study →
                  </a>
                </div>
              </div>
            </article>
          }
        </div>
      } @else {
        <!-- Skeleton -->
        <div class="bento-grid">
          @for (_ of [1,2,3,4,5,6]; track $index) {
            <div class="proj-skeleton"></div>
          }
        </div>
      }
    </div>
  </section>

  <!-- ═══ FOOTER ═══ -->
  <footer class="main-footer">
    <div class="main-footer__container">
      <p class="main-footer__text">© 2025 Ghabryel Henrique. Desenvolvimento sério.</p>
    </div>
  </footer>

</div>
  `,
  styles: [`
    .proj-page { background: var(--color-bg); min-height: 100vh; }

    /* ─── HERO ─── */
    .proj-hero {
      padding: calc(var(--section-py) + 80px) 0 var(--section-py);
      border-bottom: 1px solid var(--color-border);
    }

    .eyebrow {
      display: inline-block;
      font-size: var(--text-xs);
      font-family: var(--font-mono);
      color: var(--color-accent-2);
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 16px;
    }

    .proj-hero__title {
      font-size: clamp(2.5rem, 6vw, 5rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.05;
      margin-bottom: 20px;
    }

    .accent { color: var(--color-accent); font-style: normal; }

    .proj-hero__sub {
      font-size: var(--text-lg);
      color: var(--color-fg-muted);
      max-width: 520px;
      line-height: 1.6;
    }

    /* ─── FILTERS ─── */
    .filters-bar {
      position: sticky;
      top: 64px;
      z-index: 20;
      background: var(--glass-bg);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--color-border);
      padding: 14px 0;
    }

    .filters {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .filter-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 16px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-full);
      background: transparent;
      color: var(--color-fg-muted);
      font-size: var(--text-sm);
      font-family: var(--font-sans);
      cursor: pointer;
      transition: all var(--duration-fast);
    }

    .filter-btn:hover {
      border-color: var(--color-border-2);
      color: var(--color-fg);
    }

    .filter-btn.active {
      background: var(--color-accent);
      border-color: var(--color-accent);
      color: #ffffff;
      font-weight: 600;
    }

    .filter-count {
      font-size: 11px;
      font-family: var(--font-mono);
      opacity: 0.65;
    }

    .filter-btn.active .filter-count { opacity: 0.85; }

    /* ─── BENTO GRID ─── */
    .bento-section { padding: var(--section-py) 0; }

    .bento-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    @media (max-width: 1100px) {
      .bento-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 600px) {
      .bento-grid { grid-template-columns: 1fr; }
    }

    /* ─── PROJECT CARD ─── */
    .proj-card {
      position: relative;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: border-color var(--duration-base), transform 0.4s var(--ease-out-expo), box-shadow var(--duration-base);
    }

    .proj-card:hover {
      border-color: var(--color-border-2);
      transform: translateY(-6px);
      box-shadow: 0 20px 40px -12px rgba(0,0,0,0.35);
    }

    .proj-card--featured {
      grid-row: span 1;
    }

    .proj-card__accent { height: 2px; width: 100%; flex-shrink: 0; }

    .proj-card__cover {
      position: relative;
      width: 100%;
      height: 180px;
      overflow: hidden;
    }

    .proj-card--featured .proj-card__cover { height: 220px; }

    .proj-card__img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      background: var(--color-surface-2);
      padding: 20px;
      transition: transform 0.6s var(--ease-out-expo);
    }

    .proj-card:hover .proj-card__img { transform: scale(1.04); }

    .proj-card__cover-overlay {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .proj-card__placeholder {
      width: 100%;
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .proj-card__glyph {
      font-size: 3rem;
      font-weight: 900;
      opacity: 0.2;
    }

    .proj-card__body {
      padding: 20px 22px 22px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      flex: 1;
    }

    /* Badges */
    .proj-card__badges { display: flex; gap: 6px; flex-wrap: wrap; }

    .badge {
      padding: 2px 9px;
      border-radius: var(--radius-full);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .badge--completed  { background: rgba(5,150,105,0.12);  border: 1px solid rgba(5,150,105,0.3);  color: #059669; }
    .badge--active     { background: rgba(0,217,255,0.1);   border: 1px solid rgba(0,217,255,0.3);  color: var(--color-accent-2); }
    .badge--in_development { background: rgba(255,69,0,0.1); border: 1px solid rgba(255,69,0,0.3); color: var(--color-accent); }
    .badge--feat       { background: rgba(255,69,0,0.1);    border: 1px solid rgba(255,69,0,0.25); color: var(--color-accent); }

    .proj-card__title {
      font-size: var(--text-lg);
      font-weight: 700;
      letter-spacing: -0.02em;
      line-height: 1.25;
    }

    .proj-card__tagline {
      font-size: var(--text-sm);
      color: var(--color-fg-muted);
      line-height: 1.55;
    }

    /* Metrics */
    .proj-card__metrics {
      display: flex;
      gap: 16px;
      padding: 12px 0;
      border-top: 1px solid var(--color-border);
      border-bottom: 1px solid var(--color-border);
    }

    .metric { display: flex; flex-direction: column; gap: 2px; }

    .metric-val {
      font-size: var(--text-lg);
      font-weight: 800;
      letter-spacing: -0.02em;
      font-family: var(--font-mono);
    }

    .metric-key {
      font-size: 10px;
      font-family: var(--font-mono);
      color: var(--color-fg-muted);
      text-transform: lowercase;
    }

    /* Stack */
    .proj-card__stack { display: flex; flex-wrap: wrap; gap: 5px; margin-top: auto; }

    .tech {
      padding: 3px 9px;
      background: var(--color-surface-2);
      border-radius: var(--radius-sm);
      font-size: var(--text-xs);
      font-family: var(--font-mono);
      color: var(--color-fg-muted);
    }

    /* Footer */
    .proj-card__footer {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--color-border);
      margin-top: 4px;
    }

    .proj-link {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: var(--text-sm);
      font-weight: 600;
      color: var(--color-fg);
      text-decoration: none;
      transition: color var(--duration-fast), gap var(--duration-fast);
    }

    .proj-link:hover { color: var(--color-accent); gap: 8px; }

    .proj-link--ext { color: var(--color-accent); }
    .proj-link--ext:hover { color: var(--color-accent-2); }

    .proj-link--ghost {
      font-weight: 500;
      color: var(--color-fg-muted);
      font-size: var(--text-xs);
      margin-left: auto;
    }

    .proj-link--ghost:hover { color: var(--color-fg); }

    /* Hidden (for GSAP Flip) */
    .proj-card.is-hidden { display: none; }

    /* Skeleton */
    .proj-skeleton {
      height: 340px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      background-image: linear-gradient(90deg, var(--color-surface) 0%, var(--color-surface-2) 50%, var(--color-surface) 100%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }

    /* Footer */
    .main-footer { padding: 32px 0; border-top: 1px solid var(--color-border); margin-top: 64px; }
    .main-footer__container { max-width: 1280px; margin: 0 auto; padding: 0 var(--container-px); }
    .main-footer__text { font-size: var(--text-sm); color: var(--color-fg-muted); text-align: center; }
  `]
})
export class ProjetosComponent implements OnInit {
  private platformId  = inject(PLATFORM_ID);
  private el          = inject(ElementRef);
  private dataService = inject(DataService);
  private i18nService = inject(I18nService);

  projects     = this.dataService.projects;
  lang         = computed(() => this.i18nService.currentLang());
  activeFilter = signal<FilterKey>('all');

  filters: Array<{ key: FilterKey; labelPt: string; labelEn: string }> = [
    { key: 'all',       labelPt: 'Todos',       labelEn: 'All'       },
    { key: 'featured',  labelPt: 'Destaque',    labelEn: 'Featured'  },
    { key: 'active',    labelPt: 'Ativos',      labelEn: 'Active'    },
    { key: 'completed', labelPt: 'Concluídos',  labelEn: 'Completed' }
  ];

  constructor() {
    afterNextRender(() => this.initReveal());
  }

  ngOnInit(): void {
    this.dataService.loadProjects();
  }

  countFor(key: FilterKey): number {
    const all = this.projects();
    if (key === 'all')      return all.length;
    if (key === 'featured') return all.filter(p => p.featured).length;
    return all.filter(p => p.status === key).length;
  }

  metricEntries(p: Project): Array<{ key: string; value: string }> {
    return Object.entries(p.metrics).map(([key, value]) => ({ key, value }));
  }

  statusLabel(status: string): string {
    const l = this.lang();
    if (status === 'active')          return l === 'pt' ? 'Ativo'       : 'Active';
    if (status === 'completed')       return l === 'pt' ? 'Concluído'   : 'Completed';
    if (status === 'in_development')  return l === 'pt' ? 'Em progresso' : 'In progress';
    return status;
  }

  async setFilter(f: FilterKey): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    this.activeFilter.set(f);

    const cards = Array.from(
      this.el.nativeElement.querySelectorAll('.proj-card')
    ) as HTMLElement[];
    if (!cards.length) return;

    try {
      const { gsap }  = await import('gsap');
      const { Flip }  = await import('gsap/Flip');
      gsap.registerPlugin(Flip);

      const state = Flip.getState(cards);

      cards.forEach(card => {
        const status   = card.dataset['status']   ?? '';
        const featured = card.dataset['featured'] === 'true';
        const show = f === 'all'
          || (f === 'featured'  && featured)
          || (f === 'active'    && status === 'active')
          || (f === 'completed' && status === 'completed');
        card.classList.toggle('is-hidden', !show);
      });

      Flip.from(state, {
        duration: 0.5,
        ease: 'power2.inOut',
        absolute: true,
        stagger: 0.04,
        onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.35 }),
        onLeave: (els) => gsap.to(els,   { autoAlpha: 0, scale: 0.92, duration: 0.25 })
      });
    } catch {
      // Flip not available — fall back to instant toggle
    }
  }

  private async initReveal(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    const { gsap } = await import('gsap');

    gsap.fromTo('.proj-hero__title, .proj-hero__sub',
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out', delay: 0.1 }
    );
  }
}
