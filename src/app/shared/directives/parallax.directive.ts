import {
  Directive, ElementRef, OnInit, OnDestroy, inject, Input, PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[parallax]',
  standalone: true
})
export class ParallaxDirective implements OnInit, OnDestroy {
  @Input() parallaxSpeed = 0.3;

  private el = inject(ElementRef<HTMLElement>);
  private platformId = inject(PLATFORM_ID);
  private onScroll = () => {
    const scrollY = window.scrollY;
    const rect = this.el.nativeElement.getBoundingClientRect();
    const center = rect.top + rect.height / 2 + scrollY;
    const offset = (scrollY + window.innerHeight / 2 - center) * this.parallaxSpeed;
    this.el.nativeElement.style.transform = `translateY(${offset}px)`;
  };

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.addEventListener('scroll', this.onScroll, { passive: true });
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.removeEventListener('scroll', this.onScroll);
  }
}
