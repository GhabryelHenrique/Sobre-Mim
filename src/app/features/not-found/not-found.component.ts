import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-not-found',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslatePipe],
  template: `
    <section class="not-found">
      <div class="nf-content">
        <div class="nf-code" aria-hidden="true">404</div>
        <h1>{{ 'not_found.title' | translate }}</h1>
        <p>{{ 'not_found.subtitle' | translate }}</p>
        <div class="nf-actions">
          <a routerLink="/" class="btn-primary" data-cursor-hover>
            {{ 'not_found.cta_home' | translate }}
          </a>
          <a routerLink="/projetos" class="btn-ghost" data-cursor-hover>
            {{ 'not_found.cta_projects' | translate }}
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .not-found {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 64px);
      padding: var(--section-py) var(--container-px);
      text-align: center;
    }

    .nf-content {
      max-width: 480px;
    }

    .nf-code {
      font-size: clamp(6rem, 15vw, 10rem);
      font-weight: 900;
      font-family: var(--font-mono);
      color: transparent;
      -webkit-text-stroke: 2px var(--color-accent);
      line-height: 1;
      margin-bottom: 16px;
      animation: float 4s ease-in-out infinite;
    }

    h1 {
      font-size: var(--text-3xl);
      font-weight: 700;
      margin-bottom: 12px;
    }

    p {
      font-size: var(--text-base);
      color: var(--color-fg-muted);
      margin-bottom: 32px;
      line-height: 1.6;
    }

    .nf-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn-primary {
      padding: 12px 24px;
      background: var(--color-accent);
      color: white;
      border-radius: var(--radius-full);
      font-weight: 600;
      text-decoration: none;
      transition: background var(--duration-fast), transform var(--duration-fast);
    }

    .btn-primary:hover {
      background: var(--color-accent-hover);
      transform: translateY(-2px);
    }

    .btn-ghost {
      padding: 12px 24px;
      border: 1px solid var(--color-border);
      color: var(--color-fg);
      border-radius: var(--radius-full);
      font-weight: 600;
      text-decoration: none;
      transition: all var(--duration-fast);
    }

    .btn-ghost:hover {
      border-color: var(--color-fg);
      transform: translateY(-2px);
    }
  `]
})
export class NotFoundComponent {}
