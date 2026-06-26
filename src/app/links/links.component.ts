import {
  Component, inject, signal, ChangeDetectionStrategy, afterNextRender
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../core/services/seo.service';
import { I18nService } from '../core/services/i18n.service';
import QRCode from 'qrcode';

interface SocialLink {
  abbrev: string;
  accent: string;
  textColor: string;
  labelPt: string;
  labelEn: string;
  descPt: string;
  descEn: string;
  url: string;
}

interface SiteLink {
  abbrev: string;
  labelPt: string;
  labelEn: string;
  descPt: string;
  descEn: string;
  url: string;
  badgePt?: string;
  badgeEn?: string;
}

@Component({
  selector: 'app-links',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="links-page">
      <div class="links-container">

        <!-- Profile -->
        <header class="profile">
          <div class="avatar-wrap">
            <img
              src="/images/ghabryelSerio.png"
              alt="Ghabryel Henrique"
              class="avatar"
              width="96"
              height="96"
              loading="eager"
            />
          </div>
          <h1 class="profile-name">Ghabryel Henrique</h1>
          <div class="profile-tags">
            <span class="tag tag-gde">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              GDE Angular
            </span>
            <span class="tag">
              {{ lang() === 'pt' ? 'Engenheiro Sênior' : 'Senior Engineer' }}
            </span>
            <span class="tag">Uberlândia, BR</span>
          </div>
          <p class="profile-bio">
            {{ lang() === 'pt'
              ? 'Construindo sistemas críticos em escala global com Angular. Palestrante, mentor e contribuidor da comunidade tech.'
              : 'Building critical systems at global scale with Angular. Speaker, mentor, and tech community contributor.'
            }}
          </p>
        </header>

        <!-- Social Links -->
        <section class="links-section">
          <p class="section-label">Social</p>
          @for (link of socialLinks; track link.url) {
            <a
              [href]="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="link-card"
              data-cursor-hover
            >
              <span class="link-icon" [style.background]="link.accent" [style.color]="link.textColor">
                {{ link.abbrev }}
              </span>
              <div class="link-body">
                <span class="link-name">{{ lang() === 'pt' ? link.labelPt : link.labelEn }}</span>
                <span class="link-hint">{{ lang() === 'pt' ? link.descPt : link.descEn }}</span>
              </div>
              <svg class="link-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                <path d="M7 17L17 7M17 7H7M17 7v10"/>
              </svg>
            </a>
          }
        </section>

        <!-- Portfolio Links -->
        <section class="links-section">
          <p class="section-label">{{ lang() === 'pt' ? 'Portfólio' : 'Portfolio' }}</p>
          @for (link of siteLinks; track link.url) {
            <a
              [routerLink]="link.url"
              class="link-card"
              data-cursor-hover
            >
              <span class="link-icon link-icon--accent">{{ link.abbrev }}</span>
              <div class="link-body">
                <span class="link-name">{{ lang() === 'pt' ? link.labelPt : link.labelEn }}</span>
                <span class="link-hint">{{ lang() === 'pt' ? link.descPt : link.descEn }}</span>
              </div>
              @if (link.badgePt) {
                <span class="link-badge">
                  {{ lang() === 'pt' ? link.badgePt : link.badgeEn }}
                </span>
              }
              <svg class="link-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          }
        </section>

        <!-- QR Code -->
        <section class="qr-section" aria-label="QR Code para compartilhar">
          <div class="qr-header">
            <h2 class="qr-title">
              {{ lang() === 'pt' ? 'Compartilhar' : 'Share' }}
            </h2>
            <p class="qr-subtitle">
              {{ lang() === 'pt'
                ? 'Escaneie para acessar todos os links'
                : 'Scan to access all links'
              }}
            </p>
          </div>

          <div class="qr-card">
            @if (qrDataUrl()) {
              <img
                [src]="qrDataUrl()"
                alt="QR Code — ghabryelhenrique.com.br/links"
                class="qr-img"
                width="200"
                height="200"
              />
            } @else {
              <div class="qr-loading" aria-label="Gerando QR Code...">
                <div class="qr-spinner"></div>
              </div>
            }
          </div>

          <p class="qr-url">ghabryelhenrique.com.br/links</p>

          <div class="qr-actions">
            <button class="qr-btn" [class.qr-btn--success]="copied()" (click)="copyUrl()" data-cursor-hover>
              @if (copied()) {
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                {{ lang() === 'pt' ? 'Copiado!' : 'Copied!' }}
              } @else {
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                  <rect x="9" y="9" width="13" height="13" rx="2"/>
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                </svg>
                {{ lang() === 'pt' ? 'Copiar link' : 'Copy link' }}
              }
            </button>

            <button
              class="qr-btn"
              (click)="downloadQr()"
              [disabled]="!qrDataUrl()"
              data-cursor-hover
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              {{ lang() === 'pt' ? 'Baixar QR' : 'Download QR' }}
            </button>

            @if (canShare()) {
              <button class="qr-btn qr-btn--accent" (click)="share()" data-cursor-hover>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                  <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/>
                </svg>
                {{ lang() === 'pt' ? 'Compartilhar' : 'Share' }}
              </button>
            }
          </div>
        </section>

      </div>
    </div>
  `,
  styles: [`
    .links-page {
      min-height: calc(100vh - 80px);
      padding: clamp(40px, 8vw, 80px) 20px clamp(60px, 10vw, 100px);
      display: flex;
      justify-content: center;
    }

    .links-container {
      width: 100%;
      max-width: 520px;
      display: flex;
      flex-direction: column;
      gap: 28px;
    }

    /* ─── Profile ─── */
    .profile {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 12px;
      padding-bottom: 8px;
    }

    .avatar-wrap {
      position: relative;
    }

    .avatar {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid var(--color-accent);
      box-shadow: 0 0 0 5px var(--color-bg), 0 0 28px rgba(221,0,49,0.35);
      display: block;
    }

    .profile-name {
      font-size: var(--text-3xl);
      font-weight: 800;
      letter-spacing: -0.03em;
      margin: 4px 0 0;
      line-height: 1.1;
    }

    .profile-tags {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .tag {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 10px;
      border-radius: var(--radius-full);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      font-size: var(--text-xs);
      font-weight: 600;
      color: var(--color-fg-muted);
    }

    .tag-gde {
      background: rgba(221, 0, 49, 0.12);
      border-color: rgba(221, 0, 49, 0.3);
      color: var(--color-accent);
    }

    .profile-bio {
      font-size: var(--text-sm);
      color: var(--color-fg-muted);
      line-height: 1.65;
      max-width: 380px;
      margin: 4px 0 0;
    }

    /* ─── Links Sections ─── */
    .links-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .section-label {
      font-size: var(--text-xs);
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--color-fg-muted);
      margin: 0 0 2px 2px;
    }

    .link-card {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 16px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      color: var(--color-fg);
      text-decoration: none;
      transition: border-color var(--duration-fast), transform var(--duration-fast), box-shadow var(--duration-fast);
      position: relative;
      overflow: hidden;
    }

    .link-card::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(120deg, rgba(221,0,49,0.06) 0%, transparent 60%);
      opacity: 0;
      transition: opacity var(--duration-fast);
      pointer-events: none;
    }

    .link-card:hover {
      border-color: rgba(221,0,49,0.5);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .link-card:hover::after {
      opacity: 1;
    }

    .link-card:hover .link-arrow {
      transform: translate(2px, -2px);
      color: var(--color-accent);
    }

    .link-card:active {
      transform: translateY(0);
    }

    .link-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      border-radius: var(--radius-md);
      font-size: 13px;
      font-weight: 800;
      flex-shrink: 0;
      font-family: var(--font-mono);
      letter-spacing: -0.05em;
      line-height: 1;
    }

    .link-icon--accent {
      background: var(--color-accent) !important;
      color: white !important;
    }

    .link-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .link-name {
      font-size: var(--text-base);
      font-weight: 600;
      line-height: 1.2;
    }

    .link-hint {
      font-size: var(--text-xs);
      color: var(--color-fg-muted);
      line-height: 1.3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .link-badge {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      padding: 2px 8px;
      border-radius: var(--radius-full);
      background: rgba(221,0,49,0.12);
      border: 1px solid rgba(221,0,49,0.3);
      color: var(--color-accent);
      white-space: nowrap;
      flex-shrink: 0;
    }

    .link-arrow {
      color: var(--color-fg-muted);
      flex-shrink: 0;
      transition: transform var(--duration-fast), color var(--duration-fast);
    }

    /* ─── QR Section ─── */
    .qr-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 32px 24px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      text-align: center;
    }

    .qr-header {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .qr-title {
      font-size: var(--text-xl);
      font-weight: 700;
      margin: 0;
    }

    .qr-subtitle {
      font-size: var(--text-sm);
      color: var(--color-fg-muted);
      margin: 0;
    }

    .qr-card {
      width: 216px;
      height: 216px;
      background: #ffffff;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px;
      box-shadow: var(--shadow-lg);
    }

    .qr-img {
      width: 200px;
      height: 200px;
      border-radius: var(--radius-md);
      display: block;
    }

    .qr-loading {
      width: 200px;
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .qr-spinner {
      width: 36px;
      height: 36px;
      border: 3px solid rgba(221,0,49,0.15);
      border-top-color: var(--color-accent);
      border-radius: 50%;
      animation: spin 0.75s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .qr-url {
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      color: var(--color-fg-muted);
      padding: 6px 14px;
      background: var(--color-surface-2);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      margin: 0;
      letter-spacing: 0.02em;
    }

    .qr-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .qr-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 9px 16px;
      background: var(--color-surface-2);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      color: var(--color-fg);
      font-size: var(--text-sm);
      font-weight: 500;
      cursor: pointer;
      transition: border-color var(--duration-fast), color var(--duration-fast), background var(--duration-fast);
      font-family: inherit;
      line-height: 1;
    }

    .qr-btn:hover:not(:disabled) {
      border-color: var(--color-accent);
      color: var(--color-accent);
    }

    .qr-btn:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }

    .qr-btn--success {
      border-color: #22c55e !important;
      color: #22c55e !important;
    }

    .qr-btn--accent {
      background: var(--color-accent);
      border-color: var(--color-accent);
      color: #fff;
    }

    .qr-btn--accent:hover:not(:disabled) {
      background: var(--color-accent-hover);
      border-color: var(--color-accent-hover);
      color: #fff;
    }

    @media (max-width: 480px) {
      .links-page {
        padding: 32px 14px 60px;
      }

      .link-card {
        padding: 12px 14px;
      }

      .link-icon {
        width: 38px;
        height: 38px;
      }
    }
  `]
})
export class LinksComponent {
  private seo = inject(SeoService);
  private i18n = inject(I18nService);

  lang = this.i18n.currentLang;
  qrDataUrl = signal('');
  copied = signal(false);
  canShare = signal(false);

  readonly socialLinks: SocialLink[] = [
    {
      abbrev: 'GH',
      accent: '#24292e',
      textColor: '#ffffff',
      labelPt: 'GitHub',
      labelEn: 'GitHub',
      descPt: 'Repositórios e projetos open-source',
      descEn: 'Repositories and open-source projects',
      url: 'https://github.com/GhabryelHenrique'
    },
    {
      abbrev: 'in',
      accent: '#0A66C2',
      textColor: '#ffffff',
      labelPt: 'LinkedIn',
      labelEn: 'LinkedIn',
      descPt: 'Rede profissional e carreira',
      descEn: 'Professional network and career',
      url: 'https://www.linkedin.com/in/ghabryelhenrique/'
    },
    {
      abbrev: '▶',
      accent: '#FF0000',
      textColor: '#ffffff',
      labelPt: 'YouTube — @GhabDev',
      labelEn: 'YouTube — @GhabDev',
      descPt: 'Conteúdo sobre Angular e desenvolvimento frontend',
      descEn: 'Content about Angular and frontend development',
      url: 'https://www.youtube.com/@GhabDev'
    },
    {
      abbrev: 'M',
      accent: '#02b875',
      textColor: '#ffffff',
      labelPt: 'Medium — Artigos Técnicos',
      labelEn: 'Medium — Technical Articles',
      descPt: 'Artigos aprofundados sobre Angular e arquitetura frontend',
      descEn: 'In-depth articles about Angular and frontend architecture',
      url: 'https://ghabryel.medium.com'
    }
  ];

  readonly siteLinks: SiteLink[] = [
    {
      abbrev: '⚡',
      labelPt: 'Beyond the Framework — Mentoria',
      labelEn: 'Beyond the Framework — Mentorship',
      descPt: 'Programa técnico para devs que pensam como seniores',
      descEn: 'Technical program for devs who think like seniors',
      url: '/mentoria',
      badgePt: 'Programa',
      badgeEn: 'Program'
    },
    {
      abbrev: '{}',
      labelPt: 'Projetos',
      labelEn: 'Projects',
      descPt: 'Sistemas e iniciativas que construí ao longo da carreira',
      descEn: 'Systems and initiatives I built throughout my career',
      url: '/projetos'
    },
    {
      abbrev: '✎',
      labelPt: 'Artigos',
      labelEn: 'Articles',
      descPt: 'Conteúdo técnico sobre Angular e engenharia frontend',
      descEn: 'Technical content about Angular and frontend engineering',
      url: '/posts'
    },
    {
      abbrev: '◉',
      labelPt: 'Palestras & Workshops',
      labelEn: 'Talks & Workshops',
      descPt: 'Eventos, conferências e workshops em que palestrei',
      descEn: 'Events, conferences, and workshops where I spoke',
      url: '/palestras'
    },
    {
      abbrev: '◈',
      labelPt: 'Comunidade',
      labelEn: 'Community',
      descPt: 'Iniciativas e organizações em que contribuo',
      descEn: 'Initiatives and organizations I contribute to',
      url: '/comunidade'
    },
    {
      abbrev: '▣',
      labelPt: 'Livros Recomendados',
      labelEn: 'Recommended Books',
      descPt: 'Minha lista de leitura essencial para devs',
      descEn: 'My essential reading list for developers',
      url: '/livros'
    },
    {
      abbrev: '✉',
      labelPt: 'Contato',
      labelEn: 'Contact',
      descPt: 'Projetos, palestras, mentorias e colaborações',
      descEn: 'Projects, talks, mentorships, and collaborations',
      url: '/contato'
    }
  ];

  constructor() {
    afterNextRender(() => {
      this.canShare.set(!!navigator.share);
      this.generateQr();
    });
  }

  ngOnInit(): void {
    this.seo.setMeta({
      title: 'Links | Ghabryel Henrique',
      description:
        'Todos os links de Ghabryel Henrique — GitHub, LinkedIn, YouTube, Medium, Mentoria, Projetos e muito mais.',
      url: 'https://ghabryelhenrique.com.br/links'
    });
  }

  private generateQr(): void {
    QRCode.toDataURL('https://ghabryelhenrique.com.br/links', {
      width: 200,
      margin: 2,
      color: { dark: '#DD0031', light: '#ffffff' }
    }).then(url => this.qrDataUrl.set(url));
  }

  copyUrl(): void {
    navigator.clipboard.writeText('https://ghabryelhenrique.com.br/links').then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }

  downloadQr(): void {
    const url = this.qrDataUrl();
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ghabryel-links-qr.png';
    a.click();
  }

  share(): void {
    navigator.share({
      title: 'Ghabryel Henrique',
      text: 'Senior Angular Engineer & GDE — Todos os meus links',
      url: 'https://ghabryelhenrique.com.br/links'
    }).catch(() => this.copyUrl());
  }
}
