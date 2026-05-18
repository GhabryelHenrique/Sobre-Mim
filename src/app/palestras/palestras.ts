import {
  Component, OnInit, inject, signal, computed,
  PLATFORM_ID, ChangeDetectionStrategy
} from '@angular/core';
import { DataService } from '../core/services/data.service';
import { I18nService } from '../core/services/i18n.service';
import { SeoService } from '../core/services/seo.service';
import { RevealOnScrollDirective } from '../shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-palestras',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealOnScrollDirective],
  template: `
<div class="speaking-page">

  <!-- ═══ HERO ═══ -->
  <section class="speaking-hero">
    <div class="container">
      <span class="eyebrow">{{ lang() === 'pt' ? 'Palestras' : 'Speaking' }}</span>
      <h1 class="speaking-hero__title">
        {{ lang() === 'pt' ? 'Compartilhando' : 'Sharing' }}
        <br><em class="accent">{{ lang() === 'pt' ? 'conhecimento técnico' : 'technical knowledge' }}</em>
      </h1>
      <p class="speaking-hero__sub">
        {{ lang() === 'pt'
          ? 'Workshops, palestras e imersões para devs que querem sair do superficial.'
          : 'Workshops, talks and immersions for devs who want depth over surface.' }}
      </p>
    </div>
  </section>

  <!-- ═══ YEAR FILTERS ═══ -->
  @if (years().length > 1) {
    <div class="year-bar">
      <div class="container">
        <div class="year-btns">
          <button class="year-btn" [class.active]="activeYear() === 0" (click)="activeYear.set(0)">
            {{ lang() === 'pt' ? 'Todos' : 'All' }}
          </button>
          @for (y of years(); track y) {
            <button class="year-btn" [class.active]="activeYear() === y" (click)="activeYear.set(y)">
              {{ y }}
            </button>
          }
        </div>
      </div>
    </div>
  }

  <!-- ═══ TIMELINE ═══ -->
  <section class="timeline-section">
    <div class="container">
      <div class="speaking-timeline">

        @for (item of filtered(); track item.id; let i = $index; let last = $last) {
          <article class="speaking-item" revealOnScroll [revealDelay]="i * 80">

            <!-- Marker -->
            <div class="item-marker">
              <div class="marker-dot" [class.dot-paid]="item.paid"></div>
              @if (!last) {
                <div class="marker-line"></div>
              }
            </div>

            <!-- Content -->
            <div class="item-content">

              <div class="item-head">
                <div class="item-badges">
                  <span class="badge" [class.badge-workshop]="item.type === 'workshop'" [class.badge-palestra]="item.type === 'palestra'">
                    {{ typeLabel(item.type) }}
                  </span>
                  @if (item.paid) {
                    <span class="badge badge-paid">
                      {{ lang() === 'pt' ? 'Pago' : 'Paid' }}
                    </span>
                  }
                </div>
                <span class="item-meta-right">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {{ item.year }}
                </span>
              </div>

              <h2 class="item-title">{{ lang() === 'pt' ? item.title.pt : item.title.en }}</h2>

              <div class="item-meta">
                <span class="meta-event">{{ item.event }}</span>
                @if (item.location) {
                  <span class="meta-sep">·</span>
                  <span class="meta-location">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {{ item.location }}
                  </span>
                }
              </div>

              <p class="item-desc">{{ lang() === 'pt' ? item.description.pt : item.description.en }}</p>

              <div class="item-topics">
                @for (topic of (lang() === 'pt' ? item.topics.pt : item.topics.en).slice(0, 3); track $index) {
                  <span class="topic-chip">{{ topic }}</span>
                }
              </div>

              @if (item.image) {
                <div class="item-photo">
                  <img [src]="item.image" [alt]="item.event" loading="lazy" class="item-photo__img" />
                </div>
              }

              <div class="item-links">
                @if (item.slides) {
                  <a [href]="item.slides" target="_blank" rel="noopener" class="item-link">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                    Slides
                  </a>
                }
                @if (item.video) {
                  <a [href]="item.video" target="_blank" rel="noopener" class="item-link">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    {{ lang() === 'pt' ? 'Vídeo' : 'Video' }}
                  </a>
                }
              </div>

            </div>
          </article>
        }

        @if (filtered().length === 0 && speaking().length > 0) {
          <p class="empty-state">{{ lang() === 'pt' ? 'Nenhuma palestra neste ano.' : 'No talks this year.' }}</p>
        }

        @if (speaking().length === 0) {
          @for (_ of [1, 2, 3]; track $index) {
            <div class="speaking-skeleton"></div>
          }
        }

      </div>
    </div>
  </section>

  <!-- ═══ INVITE CTA ═══ -->
  <section class="invite-cta">
    <div class="container">
      <div class="invite-card" revealOnScroll>
        <span class="eyebrow">{{ lang() === 'pt' ? 'Convite' : 'Invite' }}</span>
        <h2 class="invite-title">
          {{ lang() === 'pt' ? 'Quer me convidar para palestrar?' : 'Want to invite me to speak?' }}
        </h2>
        <p class="invite-sub">
          {{ lang() === 'pt'
            ? 'Falo sobre Angular, arquitetura frontend, IA generativa e carreira em desenvolvimento de software.'
            : 'I speak about Angular, frontend architecture, generative AI, and software development careers.' }}
        </p>
        <a href="mailto:ghabryelcode@gmail.com" class="invite-btn">
          ghabryelcode&#64;gmail.com
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
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
    .speaking-page { background: var(--color-bg); min-height: 100vh; }

    .speaking-hero {
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
      margin-bottom: 14px;
    }

    .speaking-hero__title {
      font-size: clamp(2.5rem, 6vw, 5rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.05;
      margin-bottom: 18px;
    }

    .accent { color: var(--color-accent); font-style: normal; }

    .speaking-hero__sub {
      font-size: var(--text-lg);
      color: var(--color-fg-muted);
      max-width: 520px;
      line-height: 1.6;
    }

    .year-bar {
      position: sticky;
      top: 64px;
      z-index: 20;
      background: var(--glass-bg);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--color-border);
      padding: 12px 0;
    }

    .year-btns { display: flex; gap: 6px; }

    .year-btn {
      padding: 5px 16px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-full);
      background: transparent;
      color: var(--color-fg-muted);
      font-size: var(--text-sm);
      font-family: var(--font-mono);
      cursor: pointer;
      transition: all var(--duration-fast);
    }

    .year-btn:hover { border-color: var(--color-border-2); color: var(--color-fg); }

    .year-btn.active { background: var(--color-accent); border-color: var(--color-accent); color: #fff; font-weight: 600; }

    .timeline-section { padding: var(--section-py) 0; }

    .speaking-timeline { max-width: 780px; margin: 0 auto; }

    .speaking-item { display: grid; grid-template-columns: 28px 1fr; gap: 20px; }

    .item-marker { display: flex; flex-direction: column; align-items: center; padding-top: 6px; }

    .marker-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--color-border-2);
      border: 2px solid var(--color-bg);
      flex-shrink: 0;
      z-index: 1;
    }

    .dot-paid { background: var(--color-accent); box-shadow: 0 0 8px rgba(255,69,0,0.4); }

    .marker-line { flex: 1; width: 1px; background: var(--color-border); margin-top: 6px; min-height: 60px; }

    .item-content { padding-bottom: 48px; }

    .item-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }

    .item-badges { display: flex; gap: 6px; }

    .badge {
      padding: 2px 9px;
      border-radius: var(--radius-full);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .badge-palestra { background: rgba(0,217,255,0.1); border: 1px solid rgba(0,217,255,0.3); color: var(--color-accent-2); }
    .badge-workshop  { background: rgba(124,58,237,0.1); border: 1px solid rgba(124,58,237,0.3); color: #a78bfa; }
    .badge-paid      { background: rgba(255,69,0,0.1); border: 1px solid rgba(255,69,0,0.3); color: var(--color-accent); }

    .item-meta-right { display: flex; align-items: center; gap: 4px; font-size: var(--text-xs); font-family: var(--font-mono); color: var(--color-fg-muted); }

    .item-title { font-size: var(--text-xl); font-weight: 700; letter-spacing: -0.02em; margin-bottom: 8px; line-height: 1.3; }

    .item-meta { display: flex; align-items: center; gap: 6px; font-size: var(--text-sm); color: var(--color-fg-muted); margin-bottom: 12px; flex-wrap: wrap; }

    .meta-event { font-weight: 600; color: var(--color-fg); }
    .meta-location { display: flex; align-items: center; gap: 3px; }
    .meta-sep { opacity: 0.4; }

    .item-desc { font-size: var(--text-sm); color: var(--color-fg-muted); line-height: 1.65; margin-bottom: 14px; }

    .item-topics { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }

    .topic-chip { padding: 3px 10px; background: var(--color-surface-2); border-radius: var(--radius-sm); font-size: var(--text-xs); font-family: var(--font-mono); color: var(--color-fg-muted); }

    .item-photo { border-radius: var(--radius-xl); overflow: hidden; margin-bottom: 14px; }
    .item-photo__img { width: 100%; max-height: 300px; object-fit: cover; display: block; }

    .item-links { display: flex; gap: 10px; }

    .item-link {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 6px 14px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--text-xs);
      font-weight: 600;
      color: var(--color-fg-muted);
      text-decoration: none;
      transition: all var(--duration-fast);
    }

    .item-link:hover { border-color: var(--color-accent); color: var(--color-accent); }

    .empty-state { text-align: center; padding: 60px 0; color: var(--color-fg-muted); font-family: var(--font-mono); }

    .speaking-skeleton {
      height: 180px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      margin-bottom: 20px;
      background-image: linear-gradient(90deg, var(--color-surface) 0%, var(--color-surface-2) 50%, var(--color-surface) 100%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }

    .invite-cta { padding: var(--section-py) 0; border-top: 1px solid var(--color-border); }

    .invite-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-2xl);
      padding: clamp(2rem, 5vw, 4rem);
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
    }

    .invite-title { font-size: var(--text-3xl); font-weight: 800; letter-spacing: -0.03em; margin: 12px 0 14px; }

    .invite-sub { font-size: var(--text-base); color: var(--color-fg-muted); line-height: 1.6; margin-bottom: 28px; }

    .invite-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 28px;
      background: var(--color-accent);
      border-radius: var(--radius-full);
      color: #ffffff;
      font-size: var(--text-base);
      font-weight: 700;
      text-decoration: none;
      transition: background var(--duration-fast), gap var(--duration-fast);
    }

    .invite-btn:hover { background: var(--color-accent-2); color: #000; gap: 12px; }

    .main-footer { padding: 32px 0; border-top: 1px solid var(--color-border); margin-top: 64px; }
    .main-footer__container { max-width: 1280px; margin: 0 auto; padding: 0 var(--container-px); }
    .main-footer__text { font-size: var(--text-sm); color: var(--color-fg-muted); text-align: center; }
  `]
})
export class PalestrasComponent implements OnInit {
  private dataService = inject(DataService);
  private i18nService = inject(I18nService);
  private seoService  = inject(SeoService);

  speaking   = this.dataService.speaking;
  lang       = computed(() => this.i18nService.currentLang());
  activeYear = signal(0);

  years = computed(() => {
    const ys = new Set(this.speaking().map(s => s.year));
    return [...ys].sort((a, b) => b - a);
  });

  filtered = computed(() => {
    const y = this.activeYear();
    if (y === 0) return this.speaking();
    return this.speaking().filter(s => s.year === y);
  });

  ngOnInit(): void {
    this.seoService.setMeta({
      title: 'Palestras & Workshops | Ghabryel Henrique',
      description: 'Palestras e workshops sobre Angular, IA generativa, Gemini e carreira em tecnologia. Disponível para eventos.'
    });
    this.dataService.loadSpeaking();
  }

  typeLabel(type: string): string {
    const l = this.lang();
    if (type === 'palestra') return l === 'pt' ? 'Palestra' : 'Talk';
    if (type === 'workshop') return 'Workshop';
    return type;
  }
}
