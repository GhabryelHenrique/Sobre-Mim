import {
  Component, OnInit, inject, computed,
  PLATFORM_ID, ChangeDetectionStrategy, signal
} from '@angular/core';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DataService } from '../core/services/data.service';
import { I18nService } from '../core/services/i18n.service';
import { SeoService } from '../core/services/seo.service';
import { marked } from 'marked';

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

marked.use({
  renderer: {
    heading({ text, depth }: { text: string; depth: number; raw: string }) {
      const id = slugify(text);
      return `<h${depth} id="${id}">${text}</h${depth}>\n`;
    }
  }
});

@Component({
  selector: 'app-post-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgClass],
  template: `
<div class="post-detail-page">

  <!-- ═══ BACK NAV ═══ -->
  <nav class="post-back">
    <div class="container">
      <a routerLink="/posts" class="back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        {{ lang() === 'pt' ? 'Todos os artigos' : 'All articles' }}
      </a>
    </div>
  </nav>

  @if (loading()) {
    <div class="post-loading">
      <div class="container">
        <div class="skeleton skeleton--title"></div>
        <div class="skeleton skeleton--subtitle"></div>
        <div class="skeleton skeleton--meta"></div>
        <div class="skeleton-body">
          @for (_ of [1,2,3,4,5,6,7,8]; track $index) {
            <div class="skeleton skeleton--line" [ngClass]="'skeleton--line-' + ($index % 4)"></div>
          }
        </div>
      </div>
    </div>
  } @else if (post()) {
    <!-- ═══ HERO ═══ -->
    <header class="post-hero">
      <div class="container post-hero__inner">
        <div class="post-hero__tags">
          @for (tag of post()!.tags.slice(0, 4); track tag) {
            <span class="hero-tag">{{ tag }}</span>
          }
        </div>
        <h1 class="post-hero__title">
          {{ lang() === 'pt' ? post()!.title.pt : post()!.title.en }}
        </h1>
        <p class="post-hero__subtitle">
          {{ lang() === 'pt' ? post()!.subtitle.pt : post()!.subtitle.en }}
        </p>
        <div class="post-hero__meta">
          <span class="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {{ formatDate(post()!.date) }}
          </span>
          <span class="meta-sep">·</span>
          <span class="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {{ post()!.reading_time }} min
          </span>
          <span class="meta-sep">·</span>
          <span class="meta-item meta-author">Ghabryel Henrique</span>
        </div>
      </div>
    </header>

    @if (post()!.cover) {
      <div class="post-cover">
        <div class="container">
          <img [src]="post()!.cover!" [alt]="lang() === 'pt' ? post()!.title.pt : post()!.title.en"
               class="post-cover__img" loading="eager" />
        </div>
      </div>
    }

    <!-- ═══ CONTENT ═══ -->
    <div class="post-layout">
      <div class="container">
        <div class="post-grid">

          <!-- Table of Contents -->
          @if (toc().length > 0) {
            <aside class="post-toc">
              <p class="toc-label">{{ lang() === 'pt' ? 'Neste artigo' : 'In this article' }}</p>
              <nav class="toc-nav">
                @for (item of toc(); track item.anchor) {
                  <a [attr.href]="'#' + item.anchor"
                     (click)="scrollTo(item.anchor, $event)"
                     class="toc-item" [ngClass]="'toc-level-' + item.level">
                    {{ item.text }}
                  </a>
                }
              </nav>
              <div class="toc-share">
                <p class="toc-label">{{ lang() === 'pt' ? 'Compartilhar' : 'Share' }}</p>
                <div class="share-btns">
                  <a [href]="twitterShareUrl()" target="_blank" rel="noopener" class="share-btn share-btn--twitter" title="Share on X">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a [href]="linkedInShareUrl()" target="_blank" rel="noopener" class="share-btn share-btn--linkedin" title="Share on LinkedIn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                </div>
              </div>
            </aside>
          }

          <!-- Article body -->
          <article class="post-body" [innerHTML]="htmlContent()"></article>

        </div>
      </div>
    </div>

    <!-- ═══ FOOTER CTA ═══ -->
    <section class="post-end">
      <div class="container">
        <div class="post-end__inner">
          <div class="author-card">
            <div class="author-avatar">GH</div>
            <div class="author-info">
              <p class="author-name">Ghabryel Henrique</p>
              <p class="author-role">{{ lang() === 'pt' ? 'Senior Software Engineer · Angular GDE Candidate' : 'Senior Software Engineer · Angular GDE Candidate' }}</p>
            </div>
          </div>
          <div class="post-end__nav">
            <a routerLink="/posts" class="end-btn end-btn--secondary">
              ← {{ lang() === 'pt' ? 'Mais artigos' : 'More articles' }}
            </a>
            <a href="https://ghabryel.medium.com" target="_blank" rel="noopener" class="end-btn end-btn--primary">
              Medium →
            </a>
          </div>
        </div>
      </div>
    </section>

  } @else {
    <div class="post-not-found">
      <div class="container">
        <p class="not-found-code">404</p>
        <h2 class="not-found-title">{{ lang() === 'pt' ? 'Artigo não encontrado' : 'Article not found' }}</h2>
        <a routerLink="/posts" class="back-link">← {{ lang() === 'pt' ? 'Voltar' : 'Go back' }}</a>
      </div>
    </div>
  }

  <footer class="main-footer">
    <div class="main-footer__container">
      <p class="main-footer__text">© 2026 Ghabryel Henrique. Desenvolvimento sério.</p>
    </div>
  </footer>
</div>
  `,
  styles: [`
    .post-detail-page { background: var(--color-bg); min-height: 100vh; }

    /* ─── BACK ─── */
    .post-back {
      padding: 90px 0 0;
      border-bottom: 1px solid var(--color-border);
      padding-bottom: 16px;
    }
    .back-link {
      display: inline-flex; align-items: center; gap: 7px;
      font-size: var(--text-sm); font-family: var(--font-mono);
      color: var(--color-fg-muted); text-decoration: none;
      transition: color var(--duration-fast), gap var(--duration-fast);
    }
    .back-link:hover { color: var(--color-accent); gap: 10px; }

    /* ─── HERO ─── */
    .post-hero {
      padding: 48px 0 40px;
      border-bottom: 1px solid var(--color-border);
    }
    .post-hero__inner { max-width: 760px; }
    .post-hero__tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 20px; }
    .hero-tag {
      padding: 3px 10px; border-radius: var(--radius-full);
      background: rgba(221,0,49,0.1); color: var(--color-accent);
      font-size: var(--text-xs); font-family: var(--font-mono);
      font-weight: 600; letter-spacing: 0.04em;
    }
    .post-hero__title {
      font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800;
      letter-spacing: -0.03em; line-height: 1.15; margin-bottom: 16px;
    }
    .post-hero__subtitle {
      font-size: var(--text-lg); color: var(--color-fg-muted);
      line-height: 1.6; margin-bottom: 24px;
    }
    .post-hero__meta {
      display: flex; align-items: center; gap: 8px;
      font-size: var(--text-sm); font-family: var(--font-mono);
      color: var(--color-fg-muted);
    }
    .meta-item { display: flex; align-items: center; gap: 5px; }
    .meta-sep { opacity: 0.4; }
    .meta-author { color: var(--color-accent-2); font-weight: 600; }

    /* ─── COVER ─── */
    .post-cover { padding: 32px 0; }
    .post-cover__img {
      width: 100%; max-height: 480px; object-fit: cover;
      border-radius: var(--radius-xl); border: 1px solid var(--color-border);
    }

    /* ─── LAYOUT ─── */
    .post-layout { padding: 48px 0 64px; }
    .post-grid {
      display: grid;
      grid-template-columns: 220px 1fr;
      gap: 48px;
      align-items: start;
    }
    @media (max-width: 900px) {
      .post-grid { grid-template-columns: 1fr; }
      .post-toc { display: none; }
    }

    /* ─── TOC ─── */
    .post-toc {
      position: sticky; top: 90px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 20px;
    }
    .toc-label {
      font-size: var(--text-xs); font-family: var(--font-mono);
      text-transform: uppercase; letter-spacing: 0.1em;
      color: var(--color-fg-muted); margin-bottom: 12px;
    }
    .toc-nav { display: flex; flex-direction: column; gap: 4px; margin-bottom: 24px; }
    .toc-item {
      font-size: var(--text-sm); color: var(--color-fg-muted);
      text-decoration: none; padding: 4px 8px; border-radius: var(--radius-sm);
      transition: background var(--duration-fast), color var(--duration-fast);
      line-height: 1.4;
    }
    .toc-item:hover { background: var(--color-surface-2); color: var(--color-fg); }
    .toc-level-3 { padding-left: 20px; font-size: calc(var(--text-sm) - 1px); }

    .share-btns { display: flex; gap: 8px; margin-top: 8px; }
    .share-btn {
      width: 34px; height: 34px; border-radius: var(--radius-sm);
      display: flex; align-items: center; justify-content: center;
      border: 1px solid var(--color-border); color: var(--color-fg-muted);
      text-decoration: none; transition: all var(--duration-fast);
    }
    .share-btn:hover { border-color: var(--color-border-2); color: var(--color-fg); }

    /* ─── ARTICLE BODY ─── */
    .post-body {
      font-size: var(--text-base); line-height: 1.75;
      color: var(--color-fg); max-width: 720px;
    }

    :host ::ng-deep .post-body {
      h1, h2, h3, h4 {
        font-weight: 700; letter-spacing: -0.02em;
        color: var(--color-fg); margin: 2em 0 0.6em;
        line-height: 1.25;
      }
      h1 { font-size: clamp(1.8rem, 4vw, 2.8rem); margin-top: 0; }
      h2 { font-size: clamp(1.3rem, 2.5vw, 1.8rem); padding-bottom: 8px; border-bottom: 1px solid var(--color-border); }
      h3 { font-size: 1.15rem; }
      h4 { font-size: 1rem; }

      p { margin-bottom: 1.4em; }

      a { color: var(--color-accent); text-decoration: underline; text-underline-offset: 3px; }
      a:hover { color: var(--color-accent-2); }

      strong { font-weight: 700; color: var(--color-fg); }
      em { font-style: italic; }

      ul, ol {
        padding-left: 1.6em; margin-bottom: 1.4em;
      }
      li { margin-bottom: 0.5em; }

      blockquote {
        border-left: 3px solid var(--color-accent);
        margin: 1.8em 0; padding: 12px 20px;
        background: var(--color-surface);
        border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
        color: var(--color-fg-muted); font-style: italic;
      }

      hr {
        border: none; border-top: 1px solid var(--color-border);
        margin: 2.5em 0;
      }

      code {
        font-family: var(--font-mono); font-size: 0.875em;
        background: var(--color-surface-2); padding: 2px 6px;
        border-radius: var(--radius-sm); color: var(--color-accent-2);
      }

      pre {
        background: #0d1117; border: 1px solid var(--color-border);
        border-radius: var(--radius-lg); padding: 20px 24px;
        overflow-x: auto; margin: 1.8em 0;
        scrollbar-width: thin;
      }
      pre code {
        background: transparent; padding: 0; color: #e6edf3;
        font-size: var(--text-sm); line-height: 1.7;
      }

      table {
        width: 100%; border-collapse: collapse; margin-bottom: 1.8em;
        font-size: var(--text-sm);
      }
      th, td {
        padding: 10px 16px; text-align: left;
        border-bottom: 1px solid var(--color-border);
      }
      th { font-weight: 700; color: var(--color-fg-muted); font-family: var(--font-mono); font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 0.06em; }

      img { max-width: 100%; border-radius: var(--radius-lg); margin: 1.5em 0; }

      input[type="checkbox"] {
        accent-color: var(--color-accent);
        margin-right: 8px;
      }

      /* Task list */
      li:has(input[type="checkbox"]) { list-style: none; margin-left: -1.6em; }
    }

    /* ─── SKELETON ─── */
    .post-loading { padding: 48px 0; }
    .skeleton {
      background: var(--color-surface);
      border-radius: var(--radius-sm);
      background-image: linear-gradient(90deg, var(--color-surface) 0%, var(--color-surface-2) 50%, var(--color-surface) 100%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      margin-bottom: 16px;
    }
    .skeleton--title { height: 56px; width: 70%; }
    .skeleton--subtitle { height: 24px; width: 85%; }
    .skeleton--meta { height: 18px; width: 40%; margin-top: 8px; }
    .skeleton-body { margin-top: 40px; }
    .skeleton--line { height: 18px; width: 100%; }
    .skeleton--line-1 { width: 92%; }
    .skeleton--line-2 { width: 78%; }
    .skeleton--line-3 { width: 96%; }

    /* ─── NOT FOUND ─── */
    .post-not-found { padding: 120px 0; text-align: center; }
    .not-found-code { font-size: 6rem; font-weight: 900; font-family: var(--font-mono); color: var(--color-border); line-height: 1; }
    .not-found-title { font-size: 1.5rem; font-weight: 700; margin: 12px 0 24px; }

    /* ─── END ─── */
    .post-end { padding: 48px 0; border-top: 1px solid var(--color-border); }
    .post-end__inner {
      display: flex; align-items: center;
      justify-content: space-between; gap: 24px; flex-wrap: wrap;
    }
    .author-card { display: flex; align-items: center; gap: 14px; }
    .author-avatar {
      width: 44px; height: 44px; border-radius: 50%;
      background: var(--color-accent); color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: var(--text-sm); font-family: var(--font-mono);
      flex-shrink: 0;
    }
    .author-name { font-weight: 700; font-size: var(--text-sm); }
    .author-role { font-size: var(--text-xs); color: var(--color-fg-muted); font-family: var(--font-mono); }
    .post-end__nav { display: flex; gap: 10px; }
    .end-btn {
      padding: 9px 18px; border-radius: var(--radius-full);
      font-size: var(--text-sm); font-weight: 600; text-decoration: none;
      transition: all var(--duration-fast);
    }
    .end-btn--secondary {
      border: 1px solid var(--color-border); color: var(--color-fg-muted);
    }
    .end-btn--secondary:hover { border-color: var(--color-border-2); color: var(--color-fg); }
    .end-btn--primary {
      background: var(--color-accent); color: #fff; border: 1px solid var(--color-accent);
    }
    .end-btn--primary:hover { opacity: 0.88; }

    .main-footer { padding: 32px 0; border-top: 1px solid var(--color-border); margin-top: 32px; }
    .main-footer__container { max-width: 1280px; margin: 0 auto; padding: 0 var(--container-px); }
    .main-footer__text { font-size: var(--text-sm); color: var(--color-fg-muted); text-align: center; }
  `]
})
export class PostDetailComponent implements OnInit {
  private route        = inject(ActivatedRoute);
  private dataService  = inject(DataService);
  private i18nService  = inject(I18nService);
  private seoService   = inject(SeoService);
  private sanitizer    = inject(DomSanitizer);
  private platformId   = inject(PLATFORM_ID);

  post    = this.dataService.blogPost;
  loading = this.dataService.blogPostLoading;
  lang    = computed(() => this.i18nService.currentLang());

  htmlContent = computed<SafeHtml>(() => {
    const p = this.post();
    if (!p) return '';
    const md = this.lang() === 'pt' ? p.content_pt : p.content_en;
    const html = marked.parse(md, { async: false }) as string;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  });

  toc = computed(() => {
    const p = this.post();
    if (!p) return [];
    const md = this.lang() === 'pt' ? p.content_pt : p.content_en;
    const headings: { text: string; anchor: string; level: number }[] = [];
    const re = /^(#{2,3})\s+(.+)$/gm;
    let m: RegExpExecArray | null;
    while ((m = re.exec(md)) !== null) {
      const level = m[1].length;
      const text = m[2].trim();
      headings.push({ text, anchor: slugify(text), level });
    }
    return headings;
  });

  twitterShareUrl = computed(() => {
    const p = this.post();
    if (!p) return '#';
    const text = this.lang() === 'pt' ? p.title.pt : p.title.en;
    const url = `https://ghabryelhenrique.com.br/posts/${p.slug}`;
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  });

  linkedInShareUrl = computed(() => {
    const p = this.post();
    if (!p) return '#';
    const url = `https://ghabryelhenrique.com.br/posts/${p.slug}`;
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  });

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.dataService.loadBlogPost(slug);

    this.seoService.setMeta({
      title: 'Artigo | Ghabryel Henrique',
      description: 'Artigos técnicos sobre Angular, arquitetura e engenharia de software.'
    });
  }

  scrollTo(anchor: string, event: MouseEvent): void {
    event.preventDefault();
    if (isPlatformBrowser(this.platformId)) {
      document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  formatDate(iso: string): string {
    try {
      return new Intl.DateTimeFormat(this.lang() === 'pt' ? 'pt-BR' : 'en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      }).format(new Date(iso));
    } catch { return iso; }
  }
}
