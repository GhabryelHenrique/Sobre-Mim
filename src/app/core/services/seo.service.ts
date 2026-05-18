import { Injectable, inject } from '@angular/core';
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

const DEFAULT_META: MetaConfig = {
  title: 'Ghabryel Henrique — Senior Software Engineer & Angular GDE Candidate',
  description: 'Senior Software Engineer especializado em Angular, TypeScript e arquitetura frontend. GDE Candidate, Local Lead do NASA Space Apps Challenge e Global Shaper (WEF).',
  image: '/images/ghabryelSorriso.jpg',
  url: 'https://ghabryelhenrique.com.br',
  type: 'website'
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  private meta = inject(Meta);
  private title = inject(Title);
  private router = inject(Router);

  init(): void {
    this.setMeta(DEFAULT_META);
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      this.setMeta(DEFAULT_META);
    });
  }

  setMeta(config: Partial<MetaConfig>): void {
    const merged = { ...DEFAULT_META, ...config };

    this.title.setTitle(merged.title);

    this.meta.updateTag({ name: 'description', content: merged.description });

    this.meta.updateTag({ property: 'og:title', content: merged.title });
    this.meta.updateTag({ property: 'og:description', content: merged.description });
    this.meta.updateTag({ property: 'og:image', content: merged.image! });
    this.meta.updateTag({ property: 'og:url', content: merged.url! });
    this.meta.updateTag({ property: 'og:type', content: merged.type! });
    this.meta.updateTag({ property: 'og:site_name', content: 'Ghabryel Henrique' });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: merged.title });
    this.meta.updateTag({ name: 'twitter:description', content: merged.description });
    this.meta.updateTag({ name: 'twitter:image', content: merged.image! });
  }

  setPersonJsonLd(): void {
    const script = document.getElementById('person-jsonld') || document.createElement('script');
    script.id = 'person-jsonld';
    script.setAttribute('type', 'application/ld+json');
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Ghabryel Henrique',
      url: 'https://ghabryelhenrique.com.br',
      image: 'https://ghabryelhenrique.com.br/images/ghabryelSorriso.jpg',
      jobTitle: 'Senior Software Engineer',
      description: DEFAULT_META.description,
      sameAs: [
        'https://github.com/GhabryelHenrique',
        'https://www.linkedin.com/in/ghabryelhenrique/',
        'https://www.youtube.com/@NgGhab/',
        'https://ghabryel.medium.com'
      ]
    });
    document.head.appendChild(script);
  }
}
