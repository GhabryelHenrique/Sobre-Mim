import {
  Component, OnInit, inject, signal, computed,
  PLATFORM_ID, ChangeDetectionStrategy
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DataService } from '../core/services/data.service';
import { I18nService } from '../core/services/i18n.service';

@Component({
  selector: 'app-posts',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
<div class="posts-page">

  <!-- ═══ HERO ═══ -->
  <section class="posts-hero">
    <div class="container">
      <span class="eyebrow">Blog</span>
      <h1 class="posts-hero__title">
        {{ lang() === 'pt' ? 'Artigos & Ensaios' : 'Articles & Essays' }}
      </h1>
      <p class="posts-hero__sub">
        {{ lang() === 'pt'
          ? 'Pensamentos técnicos sobre Angular, arquitetura e engenharia de software.'
          : 'Technical thoughts on Angular, architecture and software engineering.' }}
      </p>

      @if (articles().length > 0) {
        <div class="posts-counter">
          <span class="counter-num">{{ articles().length }}</span>
          <span class="counter-label">{{ lang() === 'pt' ? 'artigos publicados' : 'published articles' }}</span>
        </div>
      }
    </div>
  </section>

  <!-- ═══ TAG FILTERS ═══ -->
  @if (allTags().length > 0) {
    <div class="tags-bar">
      <div class="container">
        <div class="tags-scroll">
          <button class="tag-btn" [class.active]="activeTag() === ''"
                  (click)="setTag('')">
            {{ lang() === 'pt' ? 'Todos' : 'All' }}
            <span class="tag-count">{{ articles().length }}</span>
          </button>
          @for (tag of allTags(); track tag) {
            <button class="tag-btn" [class.active]="activeTag() === tag"
                    (click)="setTag(tag)">
              {{ tag }}
              <span class="tag-count">{{ countForTag(tag) }}</span>
            </button>
          }
        </div>
      </div>
    </div>
  }

  <!-- ═══ ARTICLES GRID ═══ -->
  <section class="posts-grid-section">
    <div class="container">

      @if (articles().length > 0) {
        <div class="posts-grid">
          @for (a of filtered(); track a.id; let i = $index) {
            <article class="post-card" [class.post-card--featured]="a.featured">
              @if (a.thumbnail) {
                <a [href]="a.url" target="_blank" rel="noopener" class="post-card__thumb-link">
                  <div class="post-card__thumb">
                    <img [src]="a.thumbnail" [alt]="lang() === 'pt' ? a.title.pt : a.title.en"
                         loading="lazy" class="post-card__img" />
                  </div>
                </a>
              }

              <div class="post-card__body">
                <div class="post-card__meta">
                  <span class="meta-platform">{{ a.platform }}</span>
                  <span class="meta-sep">·</span>
                  <span class="meta-date">{{ formatDate(a.date) }}</span>
                  <span class="meta-sep">·</span>
                  <span class="meta-read">{{ a.reading_time }} min</span>
                </div>

                <h2 class="post-card__title">
                  <a [href]="a.url" target="_blank" rel="noopener">
                    {{ lang() === 'pt' ? a.title.pt : a.title.en }}
                  </a>
                </h2>

                <p class="post-card__sub">
                  {{ lang() === 'pt' ? a.subtitle.pt : a.subtitle.en }}
                </p>

                <div class="post-card__tags">
                  @for (tag of a.tags.slice(0, 3); track tag) {
                    <span class="tag-chip" (click)="setTag(tag)">{{ tag }}</span>
                  }
                </div>

                <a [href]="a.url" target="_blank" rel="noopener" class="post-card__cta">
                  {{ lang() === 'pt' ? 'Ler artigo' : 'Read article' }}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </a>
              </div>
            </article>
          }
        </div>

        @if (filtered().length === 0) {
          <p class="empty-state">
            {{ lang() === 'pt' ? 'Nenhum artigo com essa tag.' : 'No articles with this tag.' }}
          </p>
        }

      } @else {
        <div class="posts-grid">
          @for (_ of [1,2,3,4,5,6]; track $index) {
            <div class="post-skeleton"></div>
          }
        </div>
      }

    </div>
  </section>

  <!-- ═══ CTA ═══ -->
  <section class="posts-cta">
    <div class="container">
      <p class="cta-text">
        {{ lang() === 'pt' ? 'Mais no Medium →' : 'More on Medium →' }}
      </p>
      <a href="https://ghabryel.medium.com" target="_blank" rel="noopener" class="cta-link">
        @ghabryel.medium.com
      </a>
    </div>
  </section>

  <footer class="main-footer">
    <div class="main-footer__container">
      <p class="main-footer__text">© 2025 Ghabryel Henrique. Desenvolvimento sério.</p>
    </div>
  </footer>
</div>
  `,
  styles: [`
    .posts-page { background: var(--color-bg); min-height: 100vh; }

    /* ─── HERO ─── */
    .posts-hero {
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

    .posts-hero__title {
      font-size: clamp(2.5rem, 6vw, 5rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      margin-bottom: 16px;
    }

    .posts-hero__sub {
      font-size: var(--text-lg);
      color: var(--color-fg-muted);
      max-width: 520px;
      line-height: 1.6;
      margin-bottom: 28px;
    }

    .posts-counter {
      display: flex;
      align-items: baseline;
      gap: 10px;
    }

    .counter-num {
      font-size: clamp(3rem, 8vw, 5.5rem);
      font-weight: 900;
      font-family: var(--font-mono);
      color: var(--color-accent);
      letter-spacing: -0.04em;
      line-height: 1;
    }

    .counter-label {
      font-size: var(--text-base);
      color: var(--color-fg-muted);
    }

    /* ─── TAGS BAR ─── */
    .tags-bar {
      position: sticky;
      top: 64px;
      z-index: 20;
      background: var(--glass-bg);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--color-border);
      padding: 12px 0;
    }

    .tags-scroll {
      display: flex;
      gap: 6px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      padding-bottom: 2px;
    }

    .tags-scroll::-webkit-scrollbar { display: none; }

    .tag-btn {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 5px 14px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-full);
      background: transparent;
      color: var(--color-fg-muted);
      font-size: var(--text-sm);
      font-family: var(--font-sans);
      white-space: nowrap;
      cursor: pointer;
      transition: all var(--duration-fast);
      flex-shrink: 0;
    }

    .tag-btn:hover { border-color: var(--color-border-2); color: var(--color-fg); }

    .tag-btn.active {
      background: var(--color-accent);
      border-color: var(--color-accent);
      color: #fff;
      font-weight: 600;
    }

    .tag-count { font-size: 11px; font-family: var(--font-mono); opacity: 0.6; }

    /* ─── GRID ─── */
    .posts-grid-section { padding: var(--section-py) 0; }

    .posts-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }

    @media (max-width: 1100px) { .posts-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 600px)  { .posts-grid { grid-template-columns: 1fr; } }

    /* ─── CARD ─── */
    .post-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: border-color var(--duration-base), transform 0.4s var(--ease-out-expo);
    }

    .post-card:hover {
      border-color: var(--color-border-2);
      transform: translateY(-5px);
    }

    .post-card--featured {
      border-color: rgba(255,69,0,0.2);
    }

    .post-card__thumb-link { display: block; }

    .post-card__thumb {
      width: 100%;
      height: 180px;
      overflow: hidden;
    }

    .post-card__img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s var(--ease-out-expo);
    }

    .post-card:hover .post-card__img { transform: scale(1.04); }

    .post-card__body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex: 1;
    }

    .post-card__meta {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: var(--text-xs);
      font-family: var(--font-mono);
      color: var(--color-fg-muted);
    }

    .meta-platform { color: var(--color-accent-2); font-weight: 600; }
    .meta-sep { opacity: 0.4; }

    .post-card__title {
      font-size: var(--text-base);
      font-weight: 700;
      letter-spacing: -0.02em;
      line-height: 1.35;
    }

    .post-card__title a {
      color: var(--color-fg);
      text-decoration: none;
      transition: color var(--duration-fast);
    }

    .post-card__title a:hover { color: var(--color-accent); }

    .post-card__sub {
      font-size: var(--text-sm);
      color: var(--color-fg-muted);
      line-height: 1.55;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .post-card__tags {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-top: auto;
    }

    .tag-chip {
      padding: 2px 8px;
      background: var(--color-surface-2);
      border-radius: var(--radius-sm);
      font-size: 10px;
      font-family: var(--font-mono);
      color: var(--color-fg-muted);
      cursor: pointer;
      transition: background var(--duration-fast), color var(--duration-fast);
    }

    .tag-chip:hover { background: rgba(255,69,0,0.12); color: var(--color-accent); }

    .post-card__cta {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: var(--text-sm);
      font-weight: 600;
      color: var(--color-accent);
      text-decoration: none;
      padding-top: 8px;
      border-top: 1px solid var(--color-border);
      margin-top: 4px;
      transition: gap var(--duration-fast), color var(--duration-fast);
    }

    .post-card__cta:hover { color: var(--color-accent-2); gap: 8px; }

    /* Skeleton */
    .post-skeleton {
      height: 340px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      background-image: linear-gradient(90deg, var(--color-surface) 0%, var(--color-surface-2) 50%, var(--color-surface) 100%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }

    .empty-state {
      text-align: center;
      padding: 80px 0;
      color: var(--color-fg-muted);
      font-family: var(--font-mono);
    }

    /* ─── CTA ─── */
    .posts-cta {
      padding: 48px 0;
      border-top: 1px solid var(--color-border);
      text-align: center;
    }

    .cta-text {
      font-size: var(--text-sm);
      color: var(--color-fg-muted);
      margin-bottom: 8px;
    }

    .cta-link {
      font-size: var(--text-2xl);
      font-weight: 800;
      color: var(--color-accent);
      text-decoration: none;
      letter-spacing: -0.02em;
      transition: color var(--duration-fast);
    }

    .cta-link:hover { color: var(--color-accent-2); }

    .main-footer { padding: 32px 0; border-top: 1px solid var(--color-border); margin-top: 64px; }
    .main-footer__container { max-width: 1280px; margin: 0 auto; padding: 0 var(--container-px); }
    .main-footer__text { font-size: var(--text-sm); color: var(--color-fg-muted); text-align: center; }
  `]
})
export class PostsComponent implements OnInit {
  private dataService = inject(DataService);
  private i18nService = inject(I18nService);
  private platformId  = inject(PLATFORM_ID);

  articles  = this.dataService.articles;
  lang      = computed(() => this.i18nService.currentLang());
  activeTag = signal('');

  allTags = computed(() => {
    const tags = new Set<string>();
    this.articles().forEach(a => a.tags.forEach(t => tags.add(t)));
    return [...tags].sort();
  });

  filtered = computed(() => {
    const tag = this.activeTag();
    if (!tag) return this.articles();
    return this.articles().filter(a => a.tags.includes(tag));
  });

  ngOnInit(): void {
    this.dataService.loadArticles();
  }

  setTag(tag: string): void { this.activeTag.set(tag); }

  countForTag(tag: string): number {
    return this.articles().filter(a => a.tags.includes(tag)).length;
  }

  formatDate(iso: string): string {
    try {
      return new Intl.DateTimeFormat(this.lang() === 'pt' ? 'pt-BR' : 'en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      }).format(new Date(iso));
    } catch { return iso; }
  }
}
