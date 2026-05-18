import {
  Component, inject, signal, ChangeDetectionStrategy
} from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { SeoService } from '../../core/services/seo.service';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

@Component({
  selector: 'app-contact',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TranslatePipe, RevealOnScrollDirective],
  template: `
    <section class="contact-page">
      <div class="container">
        <div class="contact-grid">
          <!-- Left: Info -->
          <div class="contact-info" revealOnScroll>
            <h1 class="page-title">{{ 'contact.title' | translate }}</h1>
            <p class="page-subtitle">{{ 'contact.subtitle' | translate }}</p>

            <div class="contact-links">
              <a href="mailto:ghabryelcode@gmail.com" class="contact-link" data-cursor-hover>
                <span class="link-icon">✉</span>
                <span>ghabryelcode&#64;gmail.com</span>
              </a>
              <a href="https://www.linkedin.com/in/ghabryelhenrique/" target="_blank" rel="noopener" class="contact-link" data-cursor-hover>
                <span class="link-icon">in</span>
                <span>LinkedIn</span>
              </a>
              <a href="https://github.com/GhabryelHenrique" target="_blank" rel="noopener" class="contact-link" data-cursor-hover>
                <span class="link-icon">GH</span>
                <span>GitHub</span>
              </a>
            </div>
          </div>

          <!-- Right: Form -->
          <div class="contact-form-wrap" revealOnScroll [revealDelay]="150">
            @if (status() === 'success') {
              <div class="success-state">
                <svg class="check-svg" viewBox="0 0 60 60" fill="none">
                  <circle cx="30" cy="30" r="28" stroke="var(--color-accent)" stroke-width="2"/>
                  <path d="M18 30l9 9 15-15" stroke="var(--color-accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="check-path"/>
                </svg>
                <h2>{{ 'contact.success_title' | translate }}</h2>
                <p>{{ 'contact.success_desc' | translate }}</p>
              </div>
            } @else {
              <form [formGroup]="form" (ngSubmit)="submit()" class="contact-form" novalidate>
                <div class="field-group">
                  <div class="field">
                    <label for="name">{{ 'contact.name' | translate }}</label>
                    <input
                      id="name"
                      type="text"
                      formControlName="name"
                      [class.invalid]="isInvalid('name')"
                      autocomplete="name"
                    />
                  </div>
                  <div class="field">
                    <label for="email">{{ 'contact.email' | translate }}</label>
                    <input
                      id="email"
                      type="email"
                      formControlName="email"
                      [class.invalid]="isInvalid('email')"
                      autocomplete="email"
                    />
                  </div>
                </div>

                <div class="field">
                  <label for="subject">{{ 'contact.subject' | translate }}</label>
                  <input
                    id="subject"
                    type="text"
                    formControlName="subject"
                    [class.invalid]="isInvalid('subject')"
                  />
                </div>

                <div class="field">
                  <label for="message">{{ 'contact.message' | translate }}</label>
                  <textarea
                    id="message"
                    formControlName="message"
                    [class.invalid]="isInvalid('message')"
                    rows="5"
                  ></textarea>
                </div>

                @if (status() === 'error') {
                  <p class="error-msg">{{ 'contact.error_desc' | translate }}</p>
                }

                <button
                  type="submit"
                  class="submit-btn"
                  [disabled]="status() === 'submitting'"
                  data-cursor-hover
                >
                  @if (status() === 'submitting') {
                    <span class="btn-spinner"></span>
                    {{ 'contact.sending' | translate }}
                  } @else {
                    {{ 'contact.send' | translate }}
                  }
                </button>
              </form>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .contact-page {
      padding: var(--section-py) 0;
      min-height: 100vh;
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 var(--container-px);
    }

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: clamp(2rem, 6vw, 6rem);
      align-items: start;
    }

    .page-title {
      font-size: var(--text-5xl);
      font-weight: 800;
      letter-spacing: -0.03em;
      margin-bottom: 16px;
    }

    .page-subtitle {
      font-size: var(--text-lg);
      color: var(--color-fg-muted);
      line-height: 1.6;
      margin-bottom: 32px;
    }

    .contact-links {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .contact-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      color: var(--color-fg);
      text-decoration: none;
      font-size: var(--text-sm);
      font-weight: 500;
      transition: all var(--duration-fast);
    }

    .contact-link:hover {
      border-color: var(--color-accent);
      color: var(--color-accent);
      transform: translateX(4px);
    }

    .link-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: var(--color-surface-2);
      border-radius: var(--radius-sm);
      font-size: var(--text-xs);
      font-weight: 700;
      flex-shrink: 0;
    }

    .contact-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .field-group {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    label {
      font-size: var(--text-sm);
      font-weight: 500;
      color: var(--color-fg-muted);
    }

    input, textarea {
      padding: 12px 14px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      color: var(--color-fg);
      font-family: inherit;
      font-size: var(--text-base);
      transition: border-color var(--duration-fast);
      resize: vertical;
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: var(--color-accent);
    }

    input.invalid, textarea.invalid {
      border-color: #ef4444;
    }

    .error-msg {
      color: #ef4444;
      font-size: var(--text-sm);
    }

    .submit-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 14px 28px;
      background: var(--color-accent);
      color: white;
      border: none;
      border-radius: var(--radius-full);
      font-size: var(--text-base);
      font-weight: 600;
      cursor: pointer;
      transition: background var(--duration-fast), transform var(--duration-fast);
    }

    .submit-btn:hover:not(:disabled) {
      background: var(--color-accent-hover);
      transform: translateY(-2px);
    }

    .submit-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .btn-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin-slow 0.8s linear infinite;
    }

    .success-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 16px;
      padding: 48px 24px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
    }

    .check-svg {
      width: 80px;
      height: 80px;
    }

    .check-path {
      stroke-dasharray: 40;
      stroke-dashoffset: 40;
      animation: draw-stroke 0.6s ease-out 0.3s forwards;
    }

    .success-state h2 {
      font-size: var(--text-2xl);
      font-weight: 700;
    }

    .success-state p {
      color: var(--color-fg-muted);
      font-size: var(--text-base);
    }

    @media (max-width: 768px) {
      .contact-grid { grid-template-columns: 1fr; }
      .field-group { grid-template-columns: 1fr; }
    }
  `]
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private seo = inject(SeoService);

  status = signal<FormStatus>('idle');

  form = this.fb.group({
    name:    ['', [Validators.required, Validators.minLength(2)]],
    email:   ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required]],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  ngOnInit(): void {
    this.seo.setMeta({
      title: 'Contato | Ghabryel Henrique',
      description: 'Entre em contato para projetos, palestras, mentorias e colaborações.'
    });
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control.touched);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.status.set('submitting');
    const { name, email, subject, message } = this.form.value;

    this.http.post('https://api.web3forms.com/submit', {
      access_key: 'YOUR_WEB3FORMS_KEY',
      name, email, subject, message,
      from_name: 'Portfolio Contact Form'
    }).subscribe({
      next: () => this.status.set('success'),
      error: () => {
        const mailtoLink = `mailto:ghabryelcode@gmail.com?subject=${encodeURIComponent(subject||'')}&body=${encodeURIComponent(`De: ${name}\nEmail: ${email}\n\n${message}`)}`;
        window.location.href = mailtoLink;
        this.status.set('idle');
      }
    });
  }
}
