import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AnimationService {
  private platformId = inject(PLATFORM_ID);
  private gsap: typeof import('gsap').gsap | null = null;

  async init(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    const { gsap } = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    const { Flip } = await import('gsap/Flip');

    gsap.registerPlugin(ScrollTrigger, Flip);
    this.gsap = gsap;

    ScrollTrigger.defaults({ markers: false });
  }

  async getGsap() {
    if (!this.gsap) await this.init();
    return this.gsap;
  }

  async revealOnScroll(elements: Element | Element[] | NodeListOf<Element>, options: Record<string, unknown> = {}): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    const { gsap } = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);

    const els = elements instanceof Element ? [elements] : Array.from(elements);
    gsap.fromTo(els,
      { opacity: 0, y: 32 },
      {
        opacity: 1, y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: els[0],
          start: 'top 85%',
          toggleActions: 'play none none none',
          ...options
        },
        ...options
      }
    );
  }

  async countUp(element: HTMLElement, target: number, duration = 1.5): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      element.textContent = String(target);
      return;
    }
    const { gsap } = await import('gsap');
    const obj = { value: 0 };
    gsap.to(obj, {
      value: target,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        element.textContent = Math.round(obj.value).toString();
      }
    });
  }

  async splitTextReveal(element: HTMLElement): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    const { gsap } = await import('gsap');

    const text = element.textContent || '';
    element.innerHTML = '';

    const chars = text.split('').map(char => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? ' ' : char;
      span.style.display = 'inline-block';
      span.style.overflow = 'hidden';
      element.appendChild(span);
      return span;
    });

    gsap.fromTo(chars,
      { y: '110%', opacity: 0 },
      {
        y: '0%',
        opacity: 1,
        duration: 0.7,
        stagger: 0.03,
        ease: 'power3.out',
        delay: 0.2
      }
    );
  }
}
