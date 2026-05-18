import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../core/services/i18n.service';
import { SeoService } from '../core/services/seo.service';

interface DemoCard {
  id: string;
  route: string;
  icon: string;
  titlePt: string;
  titleEn: string;
  descPt: string;
  descEn: string;
  tags: string[];
  color: string;
  difficulty: 'Intermediário' | 'Avançado';
}

@Component({
  selector: 'app-demos',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
<div class="demos-page">

  <!-- ═══ HERO ═══ -->
  <section class="demos-hero">
    <div class="container">
      <span class="eyebrow">{{ lang() === 'pt' ? 'Laboratório' : 'Lab' }}</span>
      <h1 class="demos-hero__title">
        {{ lang() === 'pt' ? 'Demos & Sistemas' : 'Demos & Systems' }}
      </h1>
      <p class="demos-hero__sub">
        {{ lang() === 'pt'
          ? 'Exemplos funcionais que demonstram o poder do Angular moderno — Signals, Reactive Forms, State Management e muito mais.'
          : 'Working examples that showcase the power of modern Angular — Signals, Reactive Forms, State Management and much more.' }}
      </p>
    </div>
  </section>

  <!-- ═══ GRID ═══ -->
  <section class="demos-grid-section">
    <div class="container">
      <div class="demos-grid">
        @for (demo of demos; track demo.id) {
          <article class="demo-card" [style.--demo-color]="demo.color" routerLink="{{ demo.route }}">
            <div class="demo-card__icon">{{ demo.icon }}</div>
            <div class="demo-card__body">
              <div class="demo-card__header">
                <h2 class="demo-card__title">
                  {{ lang() === 'pt' ? demo.titlePt : demo.titleEn }}
                </h2>
                <span class="demo-badge">{{ demo.difficulty }}</span>
              </div>
              <p class="demo-card__desc">
                {{ lang() === 'pt' ? demo.descPt : demo.descEn }}
              </p>
              <div class="demo-card__tags">
                @for (tag of demo.tags; track tag) {
                  <span class="demo-tag">{{ tag }}</span>
                }
              </div>
            </div>
            <div class="demo-card__cta">
              <span>{{ lang() === 'pt' ? 'Abrir demo' : 'Open demo' }}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
            <div class="demo-card__glow" aria-hidden="true"></div>
          </article>
        }
      </div>
    </div>
  </section>

  <footer class="main-footer">
    <div class="main-footer__container">
      <p class="main-footer__text">© 2025 Ghabryel Henrique. Código sério.</p>
    </div>
  </footer>
</div>
  `,
  styles: [`
    .demos-page { background: var(--color-bg); min-height: 100vh; }

    /* ─── HERO ─── */
    .demos-hero {
      padding: calc(var(--section-py) + 80px) 0 var(--section-py);
      border-bottom: 1px solid var(--color-border);
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 var(--container-px);
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

    .demos-hero__title {
      font-size: clamp(2.5rem, 6vw, 5rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      margin-bottom: 16px;
    }

    .demos-hero__sub {
      font-size: var(--text-lg);
      color: var(--color-fg-muted);
      max-width: 600px;
      line-height: 1.6;
    }

    /* ─── GRID ─── */
    .demos-grid-section { padding: var(--section-py) 0; }

    .demos-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    @media (max-width: 768px) { .demos-grid { grid-template-columns: 1fr; } }

    /* ─── CARD ─── */
    .demo-card {
      position: relative;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      padding: 28px;
      cursor: pointer;
      text-decoration: none;
      color: inherit;
      display: flex;
      flex-direction: column;
      gap: 16px;
      overflow: hidden;
      transition: border-color var(--duration-base), transform 0.4s var(--ease-out-expo), box-shadow var(--duration-base);
    }

    .demo-card:hover {
      border-color: var(--demo-color, var(--color-accent));
      transform: translateY(-6px);
      box-shadow: 0 16px 40px -12px color-mix(in srgb, var(--demo-color, var(--color-accent)) 25%, transparent);
    }

    .demo-card__glow {
      position: absolute;
      top: -60px;
      right: -60px;
      width: 180px;
      height: 180px;
      border-radius: 50%;
      background: radial-gradient(circle, color-mix(in srgb, var(--demo-color) 20%, transparent) 0%, transparent 70%);
      pointer-events: none;
      transition: opacity var(--duration-base);
      opacity: 0;
    }

    .demo-card:hover .demo-card__glow { opacity: 1; }

    .demo-card__icon {
      font-size: 2.5rem;
      line-height: 1;
    }

    .demo-card__body { flex: 1; }

    .demo-card__header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 10px;
    }

    .demo-card__title {
      font-size: var(--text-xl);
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .demo-badge {
      flex-shrink: 0;
      padding: 3px 10px;
      background: rgba(255,255,255,0.06);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-full);
      font-size: 10px;
      font-family: var(--font-mono);
      color: var(--color-fg-muted);
      white-space: nowrap;
    }

    .demo-card__desc {
      font-size: var(--text-sm);
      color: var(--color-fg-muted);
      line-height: 1.65;
      margin-bottom: 14px;
    }

    .demo-card__tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .demo-tag {
      padding: 3px 9px;
      background: var(--color-surface-2, rgba(255,255,255,0.05));
      border-radius: var(--radius-sm);
      font-size: 10px;
      font-family: var(--font-mono);
      color: var(--demo-color, var(--color-accent));
      border: 1px solid color-mix(in srgb, var(--demo-color, var(--color-accent)) 30%, transparent);
    }

    .demo-card__cta {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: var(--text-sm);
      font-weight: 600;
      color: var(--demo-color, var(--color-accent));
      border-top: 1px solid var(--color-border);
      padding-top: 14px;
      transition: gap var(--duration-fast);
    }

    .demo-card:hover .demo-card__cta { gap: 10px; }

    .main-footer { padding: 32px 0; border-top: 1px solid var(--color-border); margin-top: 64px; }
    .main-footer__container { max-width: 1280px; margin: 0 auto; padding: 0 var(--container-px); }
    .main-footer__text { font-size: var(--text-sm); color: var(--color-fg-muted); text-align: center; }
  `]
})
export class DemosComponent {
  private i18nService = inject(I18nService);
  private seoService  = inject(SeoService);

  lang = computed(() => this.i18nService.currentLang());

  constructor() {
    this.seoService.setMeta({
      title: 'Demos & Sistemas | Ghabryel Henrique',
      description: 'Exemplos funcionais de sistemas Angular: Dashboard com Signals, Forms reativas, State Management e mapas interativos.'
    });
  }

  readonly demos: DemoCard[] = [
    {
      id: 'dashboard',
      route: '/demos/dashboard',
      icon: '📊',
      titlePt: 'Dashboard Analytics',
      titleEn: 'Analytics Dashboard',
      descPt: 'KPIs em tempo real com Signals, gráfico SVG puro, tabela ordenável e filtros de período. Dados simulados que atualizam a cada segundo.',
      descEn: 'Real-time KPIs with Signals, pure SVG chart, sortable table and period filters. Simulated data that updates every second.',
      tags: ['Signals', 'computed()', 'effect()', 'SVG', 'Interval'],
      color: '#FF4500',
      difficulty: 'Avançado'
    },
    {
      id: 'forms',
      route: '/demos/forms',
      icon: '📝',
      titlePt: 'Formulários Reativos',
      titleEn: 'Reactive Forms',
      descPt: 'Formulário multi-etapa com Reactive Forms + Signals para máquina de estados. Validadores customizados, feedback em tempo real e animação de sucesso.',
      descEn: 'Multi-step form with Reactive Forms + Signals for state machine. Custom validators, real-time feedback and success animation.',
      tags: ['ReactiveFormsModule', 'Signals', 'Validators', 'FormGroup'],
      color: '#00D9FF',
      difficulty: 'Avançado'
    },
    {
      id: 'state',
      route: '/demos/state',
      icon: '🗂️',
      titlePt: 'Gerenciamento de Estado',
      titleEn: 'State Management',
      descPt: 'Task manager estilo Kanban com Signals puros. Colunas Todo → Em Progresso → Concluído, persistência em localStorage e computed() para stats.',
      descEn: 'Kanban-style task manager with pure Signals. Columns Todo → In Progress → Done, localStorage persistence and computed() for stats.',
      tags: ['signal()', 'computed()', 'update()', 'localStorage', 'CRUD'],
      color: '#7C3AED',
      difficulty: 'Intermediário'
    },
    {
      id: 'maps',
      route: '/demos/maps',
      icon: '🗺️',
      titlePt: 'Mapas Interativos',
      titleEn: 'Interactive Maps',
      descPt: 'Mapa com Leaflet.js carregado via @defer. Marcadores de cidades brasileiras, troca de camada de tile e painel lateral com flyTo.',
      descEn: 'Map with Leaflet.js loaded via @defer. Brazilian city markers, tile layer switching and side panel with flyTo.',
      tags: ['Leaflet.js', '@defer', 'afterNextRender', 'LazyLoad'],
      color: '#059669',
      difficulty: 'Intermediário'
    }
  ];
}
