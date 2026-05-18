import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-noise-overlay',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="noise-overlay" aria-hidden="true"></div>`,
  styles: [`
    .noise-overlay {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: var(--z-overlay, 300);
      opacity: 0.025;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
      background-size: 200px 200px;
    }

    [data-theme="light"] .noise-overlay {
      opacity: 0.015;
    }
  `]
})
export class NoiseOverlayComponent {}
