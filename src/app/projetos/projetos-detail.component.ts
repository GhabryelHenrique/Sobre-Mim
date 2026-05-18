import {
  Component, OnInit, inject, computed,
  PLATFORM_ID, ChangeDetectionStrategy
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataService, Project } from '../core/services/data.service';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'app-projetos-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
<div class="detail-page">

  @if (project()) {
    <!-- ═══ HERO ═══ -->
    <section class="detail-hero" [style.--accent]="project()!.color_accent">
      <div class="detail-hero__bg" [style.background]="project()!.color_accent + '10'"></div>
      <div class="container">
        <a routerLink="/projetos" class="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          {{ lang() === 'pt' ? 'Todos os projetos' : 'All projects' }}
        </a>

        <div class="detail-hero__badges">
          <span class="badge" [class]="'badge--' + project()!.status">
            {{ statusLabel(project()!.status) }}
          </span>
          <span class="badge badge--year">{{ project()!.year }}</span>
        </div>

        <h1 class="detail-hero__title">{{ project()!.title }}</h1>
        <p class="detail-hero__tagline">
          {{ lang() === 'pt' ? project()!.tagline.pt : project()!.tagline.en }}
        </p>

        <p class="detail-hero__role">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          {{ project()!.role }}
        </p>
      </div>
    </section>

    <!-- ═══ CONTENT ═══ -->
    <section class="detail-content">
      <div class="container detail-grid">

        <!-- Main column -->
        <div class="detail-main">
          @if (project()!.cover_image) {
            <div class="detail-cover">
              <img [src]="project()!.cover_image" [alt]="project()!.title"
                   class="detail-cover__img" loading="lazy" />
            </div>
          }

          <div class="detail-card">
            <h2 class="detail-section-title">
              {{ lang() === 'pt' ? 'Sobre o projeto' : 'About' }}
            </h2>
            <p class="detail-desc">
              {{ lang() === 'pt' ? project()!.description.pt : project()!.description.en }}
            </p>
          </div>

          @if (project()!.highlights.pt.length > 0) {
            <div class="detail-card">
              <h2 class="detail-section-title">
                {{ lang() === 'pt' ? 'Principais conquistas' : 'Key highlights' }}
              </h2>
              <ul class="highlights-list">
                @for (h of (lang() === 'pt' ? project()!.highlights.pt : project()!.highlights.en); track $index) {
                  <li class="highlight-item">
                    <span class="hi-bullet" [style.color]="project()!.color_accent">→</span>
                    <span>{{ h }}</span>
                  </li>
                }
              </ul>
            </div>
          }
        </div>

        <!-- Sidebar -->
        <aside class="detail-sidebar">

          <!-- Metrics -->
          @if (metricEntries().length > 0) {
            <div class="detail-card">
              <h3 class="sidebar-title">{{ lang() === 'pt' ? 'Métricas' : 'Metrics' }}</h3>
              <div class="metrics-list">
                @for (m of metricEntries(); track m.key) {
                  <div class="metric-row">
                    <span class="metric-row__val" [style.color]="project()!.color_accent">{{ m.value }}</span>
                    <span class="metric-row__key">{{ m.key }}</span>
                  </div>
                }
              </div>
            </div>
          }

          <!-- Stack -->
          <div class="detail-card">
            <h3 class="sidebar-title">Stack</h3>
            <div class="stack-tags">
              @for (tech of project()!.stack; track tech) {
                <span class="tech">{{ tech }}</span>
              }
            </div>
          </div>

          <!-- Links -->
          <div class="detail-card">
            <h3 class="sidebar-title">{{ lang() === 'pt' ? 'Links' : 'Links' }}</h3>
            <div class="links-list">
              @if (project()!.links.live) {
                @if (project()!.links.live!.startsWith('http')) {
                  <a [href]="project()!.links.live" target="_blank" rel="noopener" class="detail-link detail-link--primary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                    {{ lang() === 'pt' ? 'Visitar projeto' : 'Visit project' }}
                  </a>
                } @else {
                  <a [routerLink]="project()!.links.live" class="detail-link detail-link--primary">
                    {{ lang() === 'pt' ? 'Saiba mais' : 'Learn more' }}
                  </a>
                }
              }
              @if (project()!.links.github) {
                <a [href]="project()!.links.github" target="_blank" rel="noopener" class="detail-link">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                  GitHub
                </a>
              }
            </div>
          </div>

        </aside>
      </div>
    </section>

    <!-- ═══ NEXT PROJECT ═══ -->
    @if (nextProject()) {
      <section class="next-project">
        <div class="container">
          <span class="next-label">{{ lang() === 'pt' ? 'Próximo projeto' : 'Next project' }}</span>
          <a [routerLink]="'/projetos/' + nextProject()!.slug" class="next-link">
            <span class="next-title">{{ nextProject()!.title }}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </section>
    }

  } @else if (notFound()) {
    <div class="not-found-state">
      <h1>404</h1>
      <p>{{ lang() === 'pt' ? 'Projeto não encontrado.' : 'Project not found.' }}</p>
      <a routerLink="/projetos" class="back-link">← {{ lang() === 'pt' ? 'Ver todos' : 'See all' }}</a>
    </div>
  }

  <footer class="main-footer">
    <div class="main-footer__container">
      <p class="main-footer__text">© 2025 Ghabryel Henrique. Desenvolvimento sério.</p>
    </div>
  </footer>

</div>
  `,
  styles: [`
    .detail-page { background: var(--color-bg); min-height: 100vh; }

    /* ─── HERO ─── */
    .detail-hero {
      position: relative;
      padding: calc(var(--section-py) + 80px) 0 var(--section-py);
      border-bottom: 1px solid var(--color-border);
      overflow: hidden;
    }

    .detail-hero__bg {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: var(--text-sm);
      color: var(--color-fg-muted);
      text-decoration: none;
      margin-bottom: 28px;
      transition: color var(--duration-fast);
    }

    .back-link:hover { color: var(--color-fg); }

    .detail-hero__badges { display: flex; gap: 8px; margin-bottom: 16px; }

    .badge {
      padding: 3px 10px;
      border-radius: var(--radius-full);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .badge--completed     { background: rgba(5,150,105,0.12);  border: 1px solid rgba(5,150,105,0.3);  color: #059669; }
    .badge--active        { background: rgba(0,217,255,0.1);   border: 1px solid rgba(0,217,255,0.3);  color: var(--color-accent-2); }
    .badge--in_development{ background: rgba(255,69,0,0.1);    border: 1px solid rgba(255,69,0,0.3);   color: var(--color-accent); }
    .badge--year          { background: var(--color-surface-2); border: 1px solid var(--color-border);  color: var(--color-fg-muted); }

    .detail-hero__title {
      font-size: clamp(2rem, 5vw, 4rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      margin-bottom: 14px;
      line-height: 1.1;
    }

    .detail-hero__tagline {
      font-size: var(--text-xl);
      color: var(--color-fg-muted);
      max-width: 620px;
      line-height: 1.5;
      margin-bottom: 16px;
    }

    .detail-hero__role {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: var(--text-sm);
      font-family: var(--font-mono);
      color: var(--color-fg-muted);
    }

    /* ─── CONTENT GRID ─── */
    .detail-content { padding: var(--section-py) 0; }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 32px;
      align-items: start;
    }

    @media (max-width: 900px) {
      .detail-grid { grid-template-columns: 1fr; }
    }

    .detail-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      padding: 24px;
      margin-bottom: 16px;
    }

    .detail-section-title {
      font-size: var(--text-lg);
      font-weight: 700;
      margin-bottom: 16px;
      letter-spacing: -0.02em;
    }

    .sidebar-title {
      font-size: var(--text-sm);
      font-weight: 700;
      color: var(--color-fg-muted);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 14px;
    }

    .detail-cover {
      border-radius: var(--radius-xl);
      overflow: hidden;
      margin-bottom: 16px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
    }

    .detail-cover__img {
      width: 100%;
      height: 280px;
      object-fit: contain;
      padding: 24px;
    }

    .detail-desc {
      font-size: var(--text-base);
      color: var(--color-fg-muted);
      line-height: 1.75;
    }

    /* Highlights */
    .highlights-list { display: flex; flex-direction: column; gap: 10px; }

    .highlight-item {
      display: flex;
      gap: 10px;
      font-size: var(--text-sm);
      color: var(--color-fg-muted);
      line-height: 1.55;
    }

    .hi-bullet { font-weight: 700; flex-shrink: 0; }

    /* Metrics */
    .metrics-list { display: flex; flex-direction: column; gap: 12px; }

    .metric-row { display: flex; align-items: baseline; justify-content: space-between; }

    .metric-row__val {
      font-size: var(--text-2xl);
      font-weight: 800;
      font-family: var(--font-mono);
      letter-spacing: -0.02em;
    }

    .metric-row__key {
      font-size: var(--text-xs);
      font-family: var(--font-mono);
      color: var(--color-fg-muted);
    }

    /* Stack */
    .stack-tags { display: flex; flex-wrap: wrap; gap: 6px; }

    .tech {
      padding: 3px 9px;
      background: var(--color-surface-2);
      border-radius: var(--radius-sm);
      font-size: var(--text-xs);
      font-family: var(--font-mono);
      color: var(--color-fg-muted);
    }

    /* Links */
    .links-list { display: flex; flex-direction: column; gap: 8px; }

    .detail-link {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 9px 14px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--text-sm);
      color: var(--color-fg-muted);
      text-decoration: none;
      transition: all var(--duration-fast);
    }

    .detail-link:hover { border-color: var(--color-border-2); color: var(--color-fg); }

    .detail-link--primary {
      background: var(--color-accent);
      border-color: var(--color-accent);
      color: #ffffff;
      font-weight: 600;
    }

    .detail-link--primary:hover { background: var(--color-accent-2); border-color: var(--color-accent-2); color: #000; }

    /* ─── NEXT PROJECT ─── */
    .next-project {
      padding: 40px 0;
      border-top: 1px solid var(--color-border);
    }

    .next-label {
      display: block;
      font-size: var(--text-xs);
      font-family: var(--font-mono);
      color: var(--color-fg-muted);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .next-link {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      font-size: var(--text-2xl);
      font-weight: 700;
      color: var(--color-fg);
      text-decoration: none;
      letter-spacing: -0.02em;
      transition: color var(--duration-fast), gap var(--duration-fast);
    }

    .next-link:hover { color: var(--color-accent); gap: 16px; }

    /* Not found state */
    .not-found-state {
      padding: calc(var(--section-py) + 80px) var(--container-px);
      text-align: center;
    }

    .not-found-state h1 { font-size: 6rem; font-weight: 900; color: var(--color-accent); }

    /* Footer */
    .main-footer { padding: 32px 0; border-top: 1px solid var(--color-border); margin-top: 64px; }
    .main-footer__container { max-width: 1280px; margin: 0 auto; padding: 0 var(--container-px); }
    .main-footer__text { font-size: var(--text-sm); color: var(--color-fg-muted); text-align: center; }
  `]
})
export class ProjetosDetailComponent implements OnInit {
  private route       = inject(ActivatedRoute);
  private dataService = inject(DataService);
  private i18nService = inject(I18nService);

  private _platformId = inject(PLATFORM_ID);

  projects    = this.dataService.projects;
  lang        = computed(() => this.i18nService.currentLang());

  project  = computed(() => {
    const slug = this.route.snapshot.paramMap.get('slug');
    return this.projects().find(p => p.slug === slug) ?? null;
  });

  notFound = computed(() => this.projects().length > 0 && this.project() === null);

  nextProject = computed((): Project | null => {
    const all = this.projects();
    const cur = this.project();
    if (!cur) return null;
    const idx = all.findIndex(p => p.id === cur.id);
    return all[(idx + 1) % all.length] ?? null;
  });

  ngOnInit(): void {
    this.dataService.loadProjects();
  }

  metricEntries(): Array<{ key: string; value: string }> {
    const p = this.project();
    if (!p) return [];
    return Object.entries(p.metrics).map(([key, value]) => ({ key, value }));
  }

  statusLabel(status: string): string {
    const l = this.lang();
    if (status === 'active')         return l === 'pt' ? 'Ativo'        : 'Active';
    if (status === 'completed')      return l === 'pt' ? 'Concluído'    : 'Completed';
    if (status === 'in_development') return l === 'pt' ? 'Em progresso' : 'In progress';
    return status;
  }
}
