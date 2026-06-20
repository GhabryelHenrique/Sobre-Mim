import {
  Component, OnInit, inject, signal, computed, ChangeDetectionStrategy
} from '@angular/core';
import { DataService, CommunityItem } from '../../core/services/data.service';
import { I18nService } from '../../core/services/i18n.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-community',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, RevealOnScrollDirective],
  template: `
    <section class="community-page">
      <div class="container">
        <header class="page-header" revealOnScroll>
          <h1 class="page-title">{{ 'community.title' | translate }}</h1>
          <p class="page-subtitle">{{ 'community.subtitle' | translate }}</p>
        </header>

        <!-- Community Cards -->
        <div class="community-grid">
          @for (item of community(); track item.id) {
            <article
              class="community-card"
              [class.featured]="item.featured"
              revealOnScroll
            >
              <div class="card-top">
                @if (item.logo) {
                  <img [src]="item.logo" [alt]="item.organization" class="org-logo" loading="lazy" width="56" height="56" />
                }
                <div class="org-info">
                  <h2 class="org-name">{{ item.organization }}</h2>
                  <p class="org-role">{{ lang() === 'pt' ? item.role.pt : item.role.en }}</p>
                  <span class="org-period">{{ lang() === 'pt' ? item.period.pt : item.period.en }}</span>
                </div>
              </div>

              <p class="org-description">
                {{ lang() === 'pt' ? item.description.pt : item.description.en }}
              </p>

              <div class="org-metrics">
                @for (metric of item.metrics; track metric.label.pt) {
                  <div class="metric">
                    <span class="metric-value">{{ metric.value }}</span>
                    <span class="metric-label">{{ lang() === 'pt' ? metric.label.pt : metric.label.en }}</span>
                  </div>
                }
              </div>

              <div class="card-links">
                @for (entry of getEntries(item.links); track entry[0]) {
                  <a [href]="entry[1]" target="_blank" rel="noopener" class="org-link" data-cursor-hover>
                    {{ entry[0] === 'website' ? 'Website' : entry[0] === 'hub' ? 'Hub' : 'Global' }}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                }
              </div>

              <div class="card-accent" [style.background]="item.color"></div>
            </article>
          }

          @if (community().length === 0) {
            <div class="loading-state">
              <div class="loading-spinner"></div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .community-page {
      padding: var(--section-py) 0;
      min-height: 100vh;
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 var(--container-px);
    }

    .page-header {
      margin-bottom: clamp(2rem, 5vw, 4rem);
    }

    .page-title {
      font-size: var(--text-5xl);
      font-weight: 800;
      letter-spacing: -0.03em;
      margin-bottom: 12px;
    }

    .page-subtitle {
      font-size: var(--text-lg);
      color: var(--color-fg-muted);
      max-width: 560px;
    }

    .community-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 24px;
    }

    .community-card {
      position: relative;
      padding: 28px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      overflow: hidden;
      transition: border-color var(--duration-base) ease, transform var(--duration-base) var(--ease-out-expo);
    }

    .community-card:hover {
      border-color: var(--color-accent);
      transform: translateY(-4px);
    }

    .community-card.featured {
      grid-column: span 1;
    }

    .card-top {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .org-logo {
      width: 56px;
      height: 56px;
      object-fit: contain;
      border-radius: var(--radius-md);
      background: var(--color-surface-2);
      flex-shrink: 0;
      padding: 4px;
    }

    .org-name {
      font-size: var(--text-lg);
      font-weight: 700;
      margin-bottom: 4px;
    }

    .org-role {
      font-size: var(--text-sm);
      color: var(--color-accent);
      font-weight: 600;
      margin-bottom: 2px;
    }

    .org-period {
      font-size: var(--text-xs);
      color: var(--color-fg-muted);
      font-family: var(--font-mono);
    }

    .org-description {
      font-size: var(--text-sm);
      color: var(--color-fg-muted);
      line-height: 1.6;
      margin-bottom: 20px;
    }

    .org-metrics {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      margin-bottom: 20px;
      padding: 16px;
      background: var(--color-surface-2);
      border-radius: var(--radius-md);
    }

    .metric {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .metric-value {
      font-size: var(--text-xl);
      font-weight: 800;
      color: var(--color-accent);
      font-family: var(--font-mono);
    }

    .metric-label {
      font-size: var(--text-xs);
      color: var(--color-fg-muted);
    }

    .card-links {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .org-link {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 6px 12px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-full);
      font-size: var(--text-xs);
      font-weight: 600;
      color: var(--color-fg-muted);
      text-decoration: none;
      transition: all var(--duration-fast);
    }

    .org-link:hover {
      border-color: var(--color-accent);
      color: var(--color-accent);
    }

    .card-accent {
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      opacity: 0.6;
    }

    .loading-state {
      grid-column: 1/-1;
      display: flex;
      justify-content: center;
      padding: 60px;
    }

    .loading-spinner {
      width: 32px;
      height: 32px;
      border: 2px solid var(--color-border);
      border-top-color: var(--color-accent);
      border-radius: 50%;
      animation: spin-slow 1s linear infinite;
    }
  `]
})
export class CommunityComponent implements OnInit {
  private dataService = inject(DataService);
  private i18nService = inject(I18nService);
  private seo = inject(SeoService);

  community = this.dataService.community;
  lang = computed(() => this.i18nService.currentLang());

  ngOnInit(): void {
    this.seo.setMeta({
      title: 'Comunidade | Ghabryel Henrique',
      description: 'Google Developer Expert em Angular, NASA Space Apps Challenge CTO, Global Shapers Community (WEF) — contribuições na comunidade tech brasileira e global.'
    });
    this.dataService.loadCommunity();
  }

  getEntries(links: Record<string, string>): [string, string][] {
    return Object.entries(links).filter(([, v]) => !!v);
  }
}
