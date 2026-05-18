import {
  Component, inject, signal, computed, effect,
  ChangeDetectionStrategy, OnDestroy
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { I18nService } from '../../core/services/i18n.service';

function cpfValidator(control: AbstractControl): ValidationErrors | null {
  const v = (control.value as string ?? '').replace(/\D/g, '');
  if (!v) return null;
  if (v.length !== 11 || /^(\d)\1+$/.test(v)) return { cpf: true };
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += +v[i] * (10 - i);
  let r = (sum * 10) % 11;
  if (r === 10 || r === 11) r = 0;
  if (r !== +v[9]) return { cpf: true };
  sum = 0;
  for (let i = 0; i < 10; i++) sum += +v[i] * (11 - i);
  r = (sum * 10) % 11;
  if (r === 10 || r === 11) r = 0;
  return r !== +v[10] ? { cpf: true } : null;
}

@Component({
  selector: 'app-forms-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ReactiveFormsModule],
  template: `
<div class="forms-page">

  <!-- ─── NAV ─── -->
  <nav class="forms-nav">
    <a routerLink="/demos" class="back-link">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
      {{ lang() === 'pt' ? 'Voltar' : 'Back' }}
    </a>
    <div class="forms-nav__title">
      <span class="demo-badge">Demo</span>
      <h1>{{ lang() === 'pt' ? 'Formulários Reativos' : 'Reactive Forms' }}</h1>
    </div>
  </nav>

  <div class="forms-content">

    <!-- Step Indicator -->
    <div class="step-indicator">
      @for (step of steps; track step.id; let i = $index) {
        <div class="step-item" [class.active]="currentStep() === i" [class.done]="currentStep() > i">
          <div class="step-circle">
            @if (currentStep() > i) {
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            } @else {
              {{ i + 1 }}
            }
          </div>
          <span class="step-label">{{ lang() === 'pt' ? step.labelPt : step.labelEn }}</span>
        </div>
        @if (i < steps.length - 1) {
          <div class="step-connector" [class.done]="currentStep() > i"></div>
        }
      }
    </div>

    <!-- Form Card -->
    <div class="form-card">

      <!-- ─── SUCCESS ─── -->
      @if (submitted()) {
        <div class="success-state">
          <div class="checkmark-wrap">
            <svg class="checkmark" viewBox="0 0 52 52">
              <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
              <path class="checkmark-path" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </div>
          <h2 class="success-title">{{ lang() === 'pt' ? 'Formulário enviado!' : 'Form submitted!' }}</h2>
          <p class="success-sub">{{ lang() === 'pt' ? 'Dados recebidos com sucesso.' : 'Data received successfully.' }}</p>
          <div class="success-data">
            @for (entry of summaryEntries(); track entry.key) {
              <div class="summary-row">
                <span class="summary-key">{{ entry.key }}</span>
                <span class="summary-val">{{ entry.value }}</span>
              </div>
            }
          </div>
          <button class="btn-reset" (click)="reset()">
            {{ lang() === 'pt' ? 'Novo envio' : 'New submission' }}
          </button>
        </div>
      } @else {

        <!-- ─── STEP 0: Dados Pessoais ─── -->
        @if (currentStep() === 0) {
          <form [formGroup]="stepForms[0]" class="step-form" (ngSubmit)="next()">
            <h2 class="step-title">{{ lang() === 'pt' ? 'Dados Pessoais' : 'Personal Info' }}</h2>

            <div class="field-group">
              <div class="field">
                <label class="field-label">{{ lang() === 'pt' ? 'Nome completo' : 'Full name' }}</label>
                <input class="field-input" formControlName="name" type="text"
                       [placeholder]="lang() === 'pt' ? 'Seu nome' : 'Your name'"
                       [class.error]="fieldError(stepForms[0], 'name')" />
                @if (fieldError(stepForms[0], 'name')) {
                  <span class="field-err">{{ lang() === 'pt' ? 'Nome obrigatório' : 'Name required' }}</span>
                }
              </div>

              <div class="field">
                <label class="field-label">E-mail</label>
                <input class="field-input" formControlName="email" type="email"
                       placeholder="voce@exemplo.com"
                       [class.error]="fieldError(stepForms[0], 'email')" />
                @if (fieldError(stepForms[0], 'email')) {
                  <span class="field-err">{{ lang() === 'pt' ? 'E-mail inválido' : 'Invalid email' }}</span>
                }
              </div>

              <div class="field">
                <label class="field-label">CPF</label>
                <input class="field-input" formControlName="cpf" type="text"
                       placeholder="000.000.000-00"
                       [class.error]="fieldError(stepForms[0], 'cpf')" />
                @if (fieldError(stepForms[0], 'cpf')) {
                  <span class="field-err">{{ lang() === 'pt' ? 'CPF inválido' : 'Invalid CPF' }}</span>
                }
              </div>
            </div>

            <div class="step-actions">
              <button class="btn-next" type="submit">
                {{ lang() === 'pt' ? 'Próximo' : 'Next' }}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </form>
        }

        <!-- ─── STEP 1: Endereço ─── -->
        @if (currentStep() === 1) {
          <form [formGroup]="stepForms[1]" class="step-form" (ngSubmit)="next()">
            <h2 class="step-title">{{ lang() === 'pt' ? 'Endereço' : 'Address' }}</h2>

            <div class="field-group">
              <div class="field field--half">
                <label class="field-label">CEP</label>
                <input class="field-input" formControlName="cep" type="text"
                       placeholder="00000-000"
                       [class.error]="fieldError(stepForms[1], 'cep')" />
                @if (fieldError(stepForms[1], 'cep')) {
                  <span class="field-err">{{ lang() === 'pt' ? 'CEP inválido' : 'Invalid ZIP' }}</span>
                }
              </div>

              <div class="field">
                <label class="field-label">{{ lang() === 'pt' ? 'Rua / Logradouro' : 'Street' }}</label>
                <input class="field-input" formControlName="street" type="text"
                       [placeholder]="lang() === 'pt' ? 'Rua...' : 'Street...'"
                       [class.error]="fieldError(stepForms[1], 'street')" />
                @if (fieldError(stepForms[1], 'street')) {
                  <span class="field-err">{{ lang() === 'pt' ? 'Obrigatório' : 'Required' }}</span>
                }
              </div>

              <div class="field-row">
                <div class="field field--third">
                  <label class="field-label">{{ lang() === 'pt' ? 'Número' : 'Number' }}</label>
                  <input class="field-input" formControlName="number" type="text" placeholder="123"
                         [class.error]="fieldError(stepForms[1], 'number')" />
                </div>
                <div class="field">
                  <label class="field-label">{{ lang() === 'pt' ? 'Cidade' : 'City' }}</label>
                  <input class="field-input" formControlName="city" type="text"
                         [placeholder]="lang() === 'pt' ? 'Sua cidade' : 'Your city'"
                         [class.error]="fieldError(stepForms[1], 'city')" />
                </div>
              </div>
            </div>

            <div class="step-actions">
              <button class="btn-back" type="button" (click)="back()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                {{ lang() === 'pt' ? 'Voltar' : 'Back' }}
              </button>
              <button class="btn-next" type="submit">
                {{ lang() === 'pt' ? 'Próximo' : 'Next' }}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </form>
        }

        <!-- ─── STEP 2: Preferências ─── -->
        @if (currentStep() === 2) {
          <form [formGroup]="stepForms[2]" class="step-form" (ngSubmit)="next()">
            <h2 class="step-title">{{ lang() === 'pt' ? 'Preferências' : 'Preferences' }}</h2>

            <div class="field-group">
              <div class="field">
                <label class="field-label">{{ lang() === 'pt' ? 'Área de interesse' : 'Area of interest' }}</label>
                <select class="field-input field-select" formControlName="area">
                  <option value="">{{ lang() === 'pt' ? 'Selecione...' : 'Select...' }}</option>
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="fullstack">Fullstack</option>
                  <option value="mobile">Mobile</option>
                  <option value="devops">DevOps</option>
                </select>
                @if (fieldError(stepForms[2], 'area')) {
                  <span class="field-err">{{ lang() === 'pt' ? 'Selecione uma área' : 'Select an area' }}</span>
                }
              </div>

              <div class="field">
                <label class="field-label">{{ lang() === 'pt' ? 'Nível de experiência' : 'Experience level' }}</label>
                <div class="radio-group">
                  @for (lvl of levels; track lvl.value) {
                    <label class="radio-option" [class.selected]="stepForms[2].get('level')?.value === lvl.value">
                      <input type="radio" formControlName="level" [value]="lvl.value" />
                      <span>{{ lang() === 'pt' ? lvl.labelPt : lvl.labelEn }}</span>
                    </label>
                  }
                </div>
              </div>

              <div class="field">
                <label class="field-label field-label--check">
                  <input type="checkbox" formControlName="newsletter" class="check-input" />
                  <span>{{ lang() === 'pt' ? 'Receber newsletter com conteúdo técnico' : 'Receive newsletter with technical content' }}</span>
                </label>
              </div>
            </div>

            <div class="step-actions">
              <button class="btn-back" type="button" (click)="back()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                {{ lang() === 'pt' ? 'Voltar' : 'Back' }}
              </button>
              <button class="btn-next" type="submit">
                {{ lang() === 'pt' ? 'Revisar' : 'Review' }}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </form>
        }

        <!-- ─── STEP 3: Revisão ─── -->
        @if (currentStep() === 3) {
          <div class="step-form">
            <h2 class="step-title">{{ lang() === 'pt' ? 'Revisão' : 'Review' }}</h2>
            <div class="review-grid">
              @for (entry of summaryEntries(); track entry.key) {
                <div class="review-row">
                  <span class="review-key">{{ entry.key }}</span>
                  <span class="review-val">{{ entry.value }}</span>
                </div>
              }
            </div>
            <div class="step-actions">
              <button class="btn-back" type="button" (click)="back()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                {{ lang() === 'pt' ? 'Editar' : 'Edit' }}
              </button>
              <button class="btn-submit" (click)="submit()">
                {{ lang() === 'pt' ? 'Enviar' : 'Submit' }}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </button>
            </div>
          </div>
        }

      }
    </div>

    <!-- Live state panel -->
    <div class="state-panel">
      <span class="state-panel__title">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
        Signal State
      </span>
      <div class="state-line"><span class="sk">currentStep</span><span class="sv">{{ currentStep() }}</span></div>
      <div class="state-line"><span class="sk">stepValid</span><span class="sv" [class.valid]="currentStepValid()">{{ currentStepValid() }}</span></div>
      <div class="state-line"><span class="sk">submitted</span><span class="sv">{{ submitted() }}</span></div>
    </div>

  </div>
</div>
  `,
  styles: [`
    .forms-page { background: var(--color-bg); min-height: 100vh; }

    .forms-nav {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 16px 24px;
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      position: sticky;
      top: 64px;
      z-index: 10;
    }
    .back-link {
      display: flex; align-items: center; gap: 6px;
      font-size: var(--text-sm); color: var(--color-fg-muted); text-decoration: none;
      transition: color var(--duration-fast);
    }
    .back-link:hover { color: var(--color-fg); }
    .forms-nav__title { display: flex; align-items: center; gap: 10px; flex: 1; }
    .forms-nav__title h1 { font-size: var(--text-base); font-weight: 700; }
    .demo-badge {
      padding: 2px 8px; background: rgba(0,217,255,0.1); border: 1px solid rgba(0,217,255,0.3);
      border-radius: var(--radius-full); font-size: 10px; font-family: var(--font-mono);
      color: var(--color-accent-2); font-weight: 600;
    }

    .forms-content {
      max-width: 640px;
      margin: 48px auto;
      padding: 0 24px;
    }

    /* ─── STEPS ─── */
    .step-indicator {
      display: flex;
      align-items: center;
      gap: 0;
      margin-bottom: 32px;
    }
    .step-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      flex: 1;
    }
    .step-circle {
      width: 32px; height: 32px; border-radius: 50%;
      border: 2px solid var(--color-border);
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-family: var(--font-mono); font-weight: 600;
      color: var(--color-fg-muted);
      background: var(--color-bg);
      transition: all var(--duration-base);
      position: relative; z-index: 1;
    }
    .step-item.active .step-circle {
      border-color: var(--color-accent-2); color: var(--color-accent-2);
      box-shadow: 0 0 0 4px rgba(0,217,255,0.15);
    }
    .step-item.done .step-circle {
      background: var(--color-accent-2); border-color: var(--color-accent-2);
      color: #000;
    }
    .step-label {
      font-size: 10px; font-family: var(--font-mono);
      color: var(--color-fg-muted); white-space: nowrap;
    }
    .step-item.active .step-label { color: var(--color-accent-2); }
    .step-connector {
      flex: 2; height: 2px; background: var(--color-border);
      margin-top: -18px; transition: background var(--duration-base);
    }
    .step-connector.done { background: var(--color-accent-2); }

    /* ─── CARD ─── */
    .form-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      padding: 32px;
      margin-bottom: 20px;
    }
    .step-title {
      font-size: var(--text-xl); font-weight: 700;
      margin-bottom: 24px; letter-spacing: -0.02em;
    }
    .step-form { display: flex; flex-direction: column; gap: 0; }
    .field-group { display: flex; flex-direction: column; gap: 16px; margin-bottom: 28px; }
    .field-row { display: grid; grid-template-columns: 1fr 2fr; gap: 12px; }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field-label {
      font-size: var(--text-sm); font-weight: 500; color: var(--color-fg-muted);
    }
    .field-input {
      padding: 10px 14px;
      background: var(--color-bg);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      color: var(--color-fg);
      font-size: var(--text-sm);
      font-family: var(--font-sans);
      transition: border-color var(--duration-fast), box-shadow var(--duration-fast);
      outline: none;
    }
    .field-input:focus { border-color: var(--color-accent-2); box-shadow: 0 0 0 3px rgba(0,217,255,0.12); }
    .field-input.error { border-color: #ef4444; }
    .field-select { appearance: none; cursor: pointer; }
    .field-err { font-size: 11px; color: #ef4444; font-family: var(--font-mono); }

    .radio-group { display: flex; gap: 10px; flex-wrap: wrap; }
    .radio-option {
      display: flex; align-items: center; gap: 7px;
      padding: 8px 14px; border: 1px solid var(--color-border);
      border-radius: var(--radius-full); font-size: var(--text-sm);
      cursor: pointer; transition: all var(--duration-fast);
      color: var(--color-fg-muted);
    }
    .radio-option.selected {
      border-color: var(--color-accent-2); color: var(--color-accent-2);
      background: rgba(0,217,255,0.06);
    }
    .radio-option input { display: none; }

    .field-label--check { display: flex; align-items: center; gap: 10px; cursor: pointer; }
    .check-input {
      width: 16px; height: 16px; border: 1px solid var(--color-border);
      border-radius: 3px; cursor: pointer; accent-color: var(--color-accent-2);
    }

    /* ─── ACTIONS ─── */
    .step-actions { display: flex; gap: 12px; justify-content: flex-end; }
    .btn-next, .btn-submit {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 10px 22px; background: var(--color-accent-2); color: #000;
      border: none; border-radius: var(--radius-full); font-weight: 700;
      font-size: var(--text-sm); cursor: pointer;
      transition: opacity var(--duration-fast), transform var(--duration-fast);
    }
    .btn-next:hover, .btn-submit:hover { opacity: 0.85; transform: translateY(-1px); }
    .btn-back {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 10px 20px; border: 1px solid var(--color-border); color: var(--color-fg-muted);
      background: transparent; border-radius: var(--radius-full); font-size: var(--text-sm);
      cursor: pointer; transition: border-color var(--duration-fast), color var(--duration-fast);
    }
    .btn-back:hover { border-color: var(--color-fg); color: var(--color-fg); }

    /* ─── REVIEW ─── */
    .review-grid { display: flex; flex-direction: column; gap: 8px; margin-bottom: 28px; }
    .review-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--color-border); }
    .review-key { font-size: var(--text-sm); color: var(--color-fg-muted); font-family: var(--font-mono); }
    .review-val { font-size: var(--text-sm); font-weight: 600; color: var(--color-fg); }

    /* ─── SUCCESS ─── */
    .success-state { text-align: center; padding: 16px 0; }
    .checkmark-wrap { display: flex; justify-content: center; margin-bottom: 24px; }
    .checkmark { width: 72px; height: 72px; }
    .checkmark-circle {
      stroke: var(--color-accent-2); stroke-width: 2;
      stroke-dasharray: 166; stroke-dashoffset: 166;
      animation: dash-circle 0.7s ease forwards;
    }
    .checkmark-path {
      stroke: var(--color-accent-2); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round;
      stroke-dasharray: 48; stroke-dashoffset: 48;
      animation: dash-check 0.4s 0.5s ease forwards;
    }
    @keyframes dash-circle { to { stroke-dashoffset: 0; } }
    @keyframes dash-check  { to { stroke-dashoffset: 0; } }

    .success-title { font-size: var(--text-2xl); font-weight: 800; margin-bottom: 8px; }
    .success-sub   { color: var(--color-fg-muted); margin-bottom: 24px; }
    .success-data  { text-align: left; max-width: 360px; margin: 0 auto 24px; }
    .summary-row   { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--color-border); }
    .summary-key   { font-size: var(--text-sm); color: var(--color-fg-muted); font-family: var(--font-mono); }
    .summary-val   { font-size: var(--text-sm); font-weight: 600; }
    .btn-reset {
      padding: 10px 24px; background: transparent; border: 1px solid var(--color-border);
      border-radius: var(--radius-full); color: var(--color-fg-muted); font-size: var(--text-sm);
      cursor: pointer; transition: border-color var(--duration-fast), color var(--duration-fast);
    }
    .btn-reset:hover { border-color: var(--color-accent); color: var(--color-accent); }

    /* ─── STATE PANEL ─── */
    .state-panel {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 16px;
      font-family: var(--font-mono);
      font-size: 12px;
    }
    .state-panel__title {
      display: flex; align-items: center; gap: 6px;
      color: var(--color-accent); font-weight: 600; margin-bottom: 12px;
    }
    .state-line { display: flex; justify-content: space-between; padding: 4px 0; color: var(--color-fg-muted); }
    .sk { color: var(--color-accent-2); }
    .sv { color: var(--color-fg); }
    .sv.valid { color: #22c55e; }
  `]
})
export class FormsDemoComponent {
  private i18n = inject(I18nService);
  private fb   = inject(FormBuilder);

  lang         = computed(() => this.i18n.currentLang());
  currentStep  = signal(0);
  submitted    = signal(false);

  readonly steps = [
    { id: 0, labelPt: 'Pessoal',  labelEn: 'Personal'  },
    { id: 1, labelPt: 'Endereço', labelEn: 'Address'   },
    { id: 2, labelPt: 'Prefs',    labelEn: 'Prefs'     },
    { id: 3, labelPt: 'Revisão',  labelEn: 'Review'    }
  ];

  readonly levels = [
    { value: 'junior',  labelPt: 'Júnior',  labelEn: 'Junior'  },
    { value: 'pleno',   labelPt: 'Pleno',   labelEn: 'Mid'     },
    { value: 'senior',  labelPt: 'Sênior',  labelEn: 'Senior'  },
    { value: 'lead',    labelPt: 'Lead',    labelEn: 'Lead'    }
  ];

  stepForms: FormGroup[] = [
    this.fb.group({
      name:  ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      cpf:   ['', [cpfValidator]]
    }),
    this.fb.group({
      cep:    ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
      street: ['', Validators.required],
      number: ['', Validators.required],
      city:   ['', Validators.required]
    }),
    this.fb.group({
      area:       ['', Validators.required],
      level:      ['pleno'],
      newsletter: [false]
    })
  ];

  currentStepValid = computed(() => {
    const s = this.currentStep();
    if (s >= this.stepForms.length) return true;
    return this.stepForms[s].valid;
  });

  summaryEntries = computed(() => {
    const all = [
      ...Object.entries(this.stepForms[0].value),
      ...Object.entries(this.stepForms[1].value),
      ...Object.entries(this.stepForms[2].value)
    ];
    return all.filter(([, v]) => v !== '' && v !== null && v !== false)
              .map(([k, v]) => ({ key: k, value: String(v) }));
  });

  fieldError(form: FormGroup, field: string): boolean {
    const ctrl = form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  next(): void {
    const s = this.currentStep();
    if (s < this.stepForms.length) {
      this.stepForms[s].markAllAsTouched();
      if (!this.stepForms[s].valid) return;
    }
    this.currentStep.update(v => v + 1);
  }

  back(): void {
    this.currentStep.update(v => Math.max(0, v - 1));
  }

  submit(): void {
    this.submitted.set(true);
  }

  reset(): void {
    this.stepForms.forEach(f => f.reset());
    this.currentStep.set(0);
    this.submitted.set(false);
  }
}
