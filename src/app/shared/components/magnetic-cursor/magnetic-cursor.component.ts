import {
  Component, OnInit, OnDestroy, PLATFORM_ID, inject,
  signal, HostListener, ChangeDetectionStrategy
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-magnetic-cursor',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div
        class="cursor-dot"
        [style.left.px]="dotX()"
        [style.top.px]="dotY()"
        [class.is-hovering]="hovering()"
      ></div>
      <div
        class="cursor-ring"
        [style.left.px]="ringX()"
        [style.top.px]="ringY()"
        [class.is-hovering]="hovering()"
        [class.is-clicking]="clicking()"
      ></div>
    }
  `,
  styles: [`
    :host { pointer-events: none; }

    .cursor-dot,
    .cursor-ring {
      position: fixed;
      border-radius: 50%;
      pointer-events: none;
      z-index: var(--z-cursor, 9999);
      transform: translate(-50%, -50%);
      will-change: left, top;
    }

    .cursor-dot {
      width: 8px;
      height: 8px;
      background: var(--color-accent);
      transition: width 200ms ease, height 200ms ease, background 200ms ease;
    }

    .cursor-ring {
      width: 36px;
      height: 36px;
      border: 1.5px solid var(--color-accent);
      opacity: 0.6;
      transition:
        width 300ms var(--ease-out-expo, cubic-bezier(0.19,1,0.22,1)),
        height 300ms var(--ease-out-expo, cubic-bezier(0.19,1,0.22,1)),
        opacity 300ms ease,
        border-color 300ms ease;
    }

    .cursor-ring.is-hovering {
      width: 56px;
      height: 56px;
      opacity: 0.9;
      border-color: var(--color-accent-2);
    }

    .cursor-dot.is-hovering {
      width: 4px;
      height: 4px;
      background: var(--color-accent-2);
    }

    .cursor-ring.is-clicking {
      width: 28px;
      height: 28px;
      opacity: 1;
    }

    @media (pointer: coarse) {
      .cursor-dot, .cursor-ring { display: none; }
    }
  `]
})
export class MagneticCursorComponent implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);

  visible = signal(false);
  dotX = signal(0);
  dotY = signal(0);
  ringX = signal(0);
  ringY = signal(0);
  hovering = signal(false);
  clicking = signal(false);

  private mouseX = 0;
  private mouseY = 0;
  private currentRingX = 0;
  private currentRingY = 0;
  private rafId = 0;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    this.visible.set(true);
    this.startLoop();
  }

  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    this.dotX.set(e.clientX);
    this.dotY.set(e.clientY);

    const target = e.target as Element;
    const isInteractive = target.closest('a, button, [data-cursor-hover]') !== null;
    this.hovering.set(isInteractive);
  }

  @HostListener('document:mousedown')
  onMouseDown(): void { this.clicking.set(true); }

  @HostListener('document:mouseup')
  onMouseUp(): void { this.clicking.set(false); }

  private startLoop(): void {
    const loop = () => {
      this.currentRingX += (this.mouseX - this.currentRingX) * 0.1;
      this.currentRingY += (this.mouseY - this.currentRingY) * 0.1;
      this.ringX.set(this.currentRingX);
      this.ringY.set(this.currentRingY);
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }
}
