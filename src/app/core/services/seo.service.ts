import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface MetaConfig {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
}

const SITE_URL = 'https://ghabryelhenrique.com.br';

const DEFAULT_META: MetaConfig = {
  title: 'Ghabryel Henrique | GDE Angular | Software Engineer',
  description: 'Google Developer Expert em Angular, Senior Engineer e speaker. Local Lead NASA Space Apps e Global Shaper (WEF).',
  image: `${SITE_URL}/images/ghabryelSorriso.jpg`,
  url: SITE_URL,
  type: 'website'
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  private meta       = inject(Meta);
  private title      = inject(Title);
  private router     = inject(Router);
  private document   = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);

  init(): void {
    this.setMeta(DEFAULT_META);
    if (isPlatformBrowser(this.platformId)) {
      this.setPersonJsonLd();
    }
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((event) => {
      const nav  = event as NavigationEnd;
      const path = nav.urlAfterRedirects.split('?')[0];
      const url  = path === '/' ? SITE_URL : `${SITE_URL}${path}`;
      this.setMeta({ ...DEFAULT_META, url });
    });
  }

  setMeta(config: Partial<MetaConfig>): void {
    const merged = { ...DEFAULT_META, ...config };

    this.title.setTitle(merged.title);

    // Primary
    this.meta.updateTag({ name: 'description', content: merged.description });
    this.meta.updateTag({ name: 'author',      content: 'Ghabryel Henrique' });
    this.meta.updateTag({ name: 'robots',      content: 'index, follow' });

    // Open Graph
    this.meta.updateTag({ property: 'og:title',        content: merged.title });
    this.meta.updateTag({ property: 'og:description',  content: merged.description });
    this.meta.updateTag({ property: 'og:image',        content: merged.image! });
    this.meta.updateTag({ property: 'og:image:width',  content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ property: 'og:image:alt',    content: merged.title });
    this.meta.updateTag({ property: 'og:url',          content: merged.url! });
    this.meta.updateTag({ property: 'og:type',         content: merged.type! });
    this.meta.updateTag({ property: 'og:site_name',    content: 'Ghabryel Henrique' });
    this.meta.updateTag({ property: 'og:locale',       content: 'pt_BR' });

    // Twitter / X
    this.meta.updateTag({ name: 'twitter:card',        content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title',       content: merged.title });
    this.meta.updateTag({ name: 'twitter:description', content: merged.description });
    this.meta.updateTag({ name: 'twitter:image',       content: merged.image! });
    this.meta.updateTag({ name: 'twitter:creator',     content: '@NgGhab' });
    this.meta.updateTag({ name: 'twitter:site',        content: '@NgGhab' });

    if (isPlatformBrowser(this.platformId)) {
      this.updateCanonical(merged.url!);
    }
  }

  private updateCanonical(url: string): void {
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  setPersonJsonLd(): void {
    const existing = this.document.getElementById('person-jsonld');
    const script   = existing ?? this.document.createElement('script');
    script.id = 'person-jsonld';
    script.setAttribute('type', 'application/ld+json');
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Ghabryel Henrique',
      url: SITE_URL,
      image: `${SITE_URL}/images/ghabryelSorriso.jpg`,
      jobTitle: 'Senior Software Engineer',
      description: DEFAULT_META.description,
      knowsAbout: ['Angular', 'TypeScript', 'Frontend Architecture', 'Microfrontends', 'Web Performance'],
      award: 'Google Developer Expert in Angular (2026)',
      memberOf: [
        { '@type': 'Organization', name: 'Google Developer Experts',  url: 'https://developers.google.com/community/experts' },
        { '@type': 'Organization', name: 'Global Shapers Community',  url: 'https://www.globalshapers.org/' }
      ],
      sameAs: [
        'https://github.com/GhabryelHenrique',
        'https://www.linkedin.com/in/ghabryelhenrique/',
        'https://www.youtube.com/@NgGhab/',
        'https://ghabryel.medium.com'
      ]
    });
    if (!existing) {
      this.document.head.appendChild(script);
    }
  }
}
