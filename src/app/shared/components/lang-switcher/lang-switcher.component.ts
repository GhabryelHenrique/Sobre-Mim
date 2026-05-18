import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-lang-switcher',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="lang-btn"
      (click)="i18n.switchLang()"
      [attr.aria-label]="'Switch to ' + (i18n.currentLang() === 'pt' ? 'English' : 'Português')"
      data-cursor-hover
    >
      <span class="lang-current">{{ i18n.currentLang().toUpperCase() }}</span>
      <span class="lang-separator">/</span>
      <span class="lang-other">{{ i18n.currentLang() === 'pt' ? 'EN' : 'PT' }}</span>
    </button>
  `,
  styles: [`
    .lang-btn {
      display: flex;
      align-items: center;
      gap: 2px;
      background: transparent;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-full);
      padding: 4px 10px;
      font-size: var(--text-xs);
      font-family: var(--font-mono);
      font-weight: 600;
      letter-spacing: 0.05em;
      cursor: pointer;
      transition: border-color var(--duration-fast), color var(--duration-fast);
      color: var(--color-fg-muted);
    }

    .lang-btn:hover {
      border-color: var(--color-accent);
      color: var(--color-accent);
    }

    .lang-current { color: var(--color-accent); }
    .lang-separator { opacity: 0.4; }
  `]
})
export class LangSwitcherComponent {
  i18n = inject(I18nService);
}
