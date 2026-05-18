import {
  Component, inject, signal, computed, effect, linkedSignal,
  ChangeDetectionStrategy, PLATFORM_ID, OnInit
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../core/services/i18n.service';

type Status = 'todo' | 'progress' | 'done';
type Priority = 'low' | 'medium' | 'high';

interface Task {
  id: number;
  title: string;
  status: Status;
  priority: Priority;
  createdAt: number;
}

let nextId = 100;

const SEED: Task[] = [
  { id: 1, title: 'Configurar Angular 21 com Signals',          status: 'done',     priority: 'high',   createdAt: Date.now() - 86400000 * 3 },
  { id: 2, title: 'Implementar design system com CSS tokens',   status: 'done',     priority: 'high',   createdAt: Date.now() - 86400000 * 2 },
  { id: 3, title: 'Criar componente de hero com Three.js',      status: 'progress', priority: 'high',   createdAt: Date.now() - 86400000 },
  { id: 4, title: 'Adicionar i18n PT/EN com HttpClient',        status: 'progress', priority: 'medium', createdAt: Date.now() - 3600000 * 5 },
  { id: 5, title: 'Construir seção de projetos bento grid',     status: 'todo',     priority: 'medium', createdAt: Date.now() - 3600000 * 2 },
  { id: 6, title: 'Integrar GSAP ScrollTrigger na timeline',    status: 'todo',     priority: 'high',   createdAt: Date.now() - 3600000 },
  { id: 7, title: 'Otimizar performance com @defer',            status: 'todo',     priority: 'low',    createdAt: Date.now() - 1800000 },
  { id: 8, title: 'Escrever artigo sobre Angular Signals',      status: 'todo',     priority: 'low',    createdAt: Date.now() - 900000 },
];

@Component({
  selector: 'app-state-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, FormsModule],
  template: `
<div class="state-page">

  <!-- ─── NAV ─── -->
  <nav class="state-nav">
    <a routerLink="/demos" class="back-link">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
      {{ lang() === 'pt' ? 'Voltar' : 'Back' }}
    </a>
    <div class="state-nav__title">
      <span class="demo-badge">Demo</span>
      <h1>{{ lang() === 'pt' ? 'Gerenciamento de Estado' : 'State Management' }}</h1>
    </div>
    <div class="nav-stats">
      <span class="ns-item"><span class="ns-dot dot-todo"></span>{{ todoTasks().length }}</span>
      <span class="ns-item"><span class="ns-dot dot-progress"></span>{{ progressTasks().length }}</span>
      <span class="ns-item"><span class="ns-dot dot-done"></span>{{ doneTasks().length }}</span>
    </div>
  </nav>

  <div class="state-content">

    <!-- ─── ADD TASK ─── -->
    <div class="add-row">
      <input class="add-input" [(ngModel)]="newTitle"
             [placeholder]="lang() === 'pt' ? 'Nova tarefa... (Enter para adicionar)' : 'New task... (Enter to add)'"
             (keydown.enter)="addTask()" />
      <div class="priority-select">
        @for (p of priorities; track p.value) {
          <button class="prio-btn" [class.active]="newPriority === p.value"
                  [style.--p-color]="p.color"
                  (click)="newPriority = p.value">
            {{ lang() === 'pt' ? p.labelPt : p.labelEn }}
          </button>
        }
      </div>
      <button class="btn-add" (click)="addTask()" [disabled]="!newTitle.trim()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
        {{ lang() === 'pt' ? 'Adicionar' : 'Add' }}
      </button>
    </div>

    <!-- ─── PROGRESS BAR ─── */
    <div class="progress-wrap">
      <div class="progress-bar">
        <div class="progress-fill" [style.width.%]="donePercent()"></div>
      </div>
      <span class="progress-label">{{ donePercent() }}% {{ lang() === 'pt' ? 'concluído' : 'complete' }} · {{ tasks().length }} {{ lang() === 'pt' ? 'tarefas' : 'tasks' }}</span>
    </div>

    <!-- ─── KANBAN ─── -->
    <div class="kanban">

      <!-- TODO -->
      <div class="kanban-col">
        <div class="col-header col-header--todo">
          <span class="col-dot"></span>
          <span class="col-title">{{ lang() === 'pt' ? 'A Fazer' : 'Todo' }}</span>
          <span class="col-count">{{ todoTasks().length }}</span>
        </div>
        <div class="col-cards">
          @for (task of todoTasks(); track task.id) {
            <div class="task-card" [class.selected]="selected()?.id === task.id"
                 (click)="select(task)">
              <div class="tc-top">
                <span class="prio-chip" [class]="'prio-' + task.priority">
                  {{ lang() === 'pt' ? prioLabelPt(task.priority) : prioLabelEn(task.priority) }}
                </span>
                <button class="tc-del" (click)="deleteTask(task.id, $event)" aria-label="Delete">×</button>
              </div>
              <p class="tc-title">{{ task.title }}</p>
              <div class="tc-actions">
                <button class="tc-move" (click)="moveTask(task.id, 'progress', $event)">
                  {{ lang() === 'pt' ? 'Iniciar →' : 'Start →' }}
                </button>
              </div>
            </div>
          }
          @if (todoTasks().length === 0) {
            <div class="col-empty">{{ lang() === 'pt' ? 'Sem tarefas' : 'No tasks' }}</div>
          }
        </div>
      </div>

      <!-- IN PROGRESS -->
      <div class="kanban-col">
        <div class="col-header col-header--progress">
          <span class="col-dot"></span>
          <span class="col-title">{{ lang() === 'pt' ? 'Em Progresso' : 'In Progress' }}</span>
          <span class="col-count">{{ progressTasks().length }}</span>
        </div>
        <div class="col-cards">
          @for (task of progressTasks(); track task.id) {
            <div class="task-card" [class.selected]="selected()?.id === task.id"
                 (click)="select(task)">
              <div class="tc-top">
                <span class="prio-chip" [class]="'prio-' + task.priority">
                  {{ lang() === 'pt' ? prioLabelPt(task.priority) : prioLabelEn(task.priority) }}
                </span>
                <button class="tc-del" (click)="deleteTask(task.id, $event)" aria-label="Delete">×</button>
              </div>
              <p class="tc-title">{{ task.title }}</p>
              <div class="tc-actions">
                <button class="tc-move tc-move--back" (click)="moveTask(task.id, 'todo', $event)">← {{ lang() === 'pt' ? 'Voltar' : 'Back' }}</button>
                <button class="tc-move" (click)="moveTask(task.id, 'done', $event)">{{ lang() === 'pt' ? 'Concluir →' : 'Done →' }}</button>
              </div>
            </div>
          }
          @if (progressTasks().length === 0) {
            <div class="col-empty">{{ lang() === 'pt' ? 'Sem tarefas' : 'No tasks' }}</div>
          }
        </div>
      </div>

      <!-- DONE -->
      <div class="kanban-col">
        <div class="col-header col-header--done">
          <span class="col-dot"></span>
          <span class="col-title">{{ lang() === 'pt' ? 'Concluído' : 'Done' }}</span>
          <span class="col-count">{{ doneTasks().length }}</span>
        </div>
        <div class="col-cards">
          @for (task of doneTasks(); track task.id) {
            <div class="task-card task-card--done" [class.selected]="selected()?.id === task.id"
                 (click)="select(task)">
              <div class="tc-top">
                <span class="tc-check">✓</span>
                <button class="tc-del" (click)="deleteTask(task.id, $event)" aria-label="Delete">×</button>
              </div>
              <p class="tc-title tc-title--done">{{ task.title }}</p>
              <div class="tc-actions">
                <button class="tc-move tc-move--back" (click)="moveTask(task.id, 'progress', $event)">← {{ lang() === 'pt' ? 'Reabrir' : 'Reopen' }}</button>
              </div>
            </div>
          }
          @if (doneTasks().length === 0) {
            <div class="col-empty">{{ lang() === 'pt' ? 'Nenhum concluído' : 'Nothing done yet' }}</div>
          }
        </div>
      </div>

    </div>

    <!-- ─── SIGNAL PANEL ─── -->
    <div class="sig-panel">
      <div class="sig-panel__title">
        <span class="sig-dot"></span> Signal State (live)
      </div>
      <div class="sig-grid">
        <div class="sig-cell"><span class="sck">tasks().length</span><span class="scv">{{ tasks().length }}</span></div>
        <div class="sig-cell"><span class="sck">todoTasks().length</span><span class="scv">{{ todoTasks().length }}</span></div>
        <div class="sig-cell"><span class="sck">progressTasks().length</span><span class="scv">{{ progressTasks().length }}</span></div>
        <div class="sig-cell"><span class="sck">doneTasks().length</span><span class="scv">{{ doneTasks().length }}</span></div>
        <div class="sig-cell"><span class="sck">donePercent()</span><span class="scv accent">{{ donePercent() }}%</span></div>
        <div class="sig-cell"><span class="sck">selected()?.id</span><span class="scv">{{ selected()?.id ?? 'null' }}</span></div>
      </div>
    </div>

  </div>
</div>
  `,
  styles: [`
    .state-page { background: var(--color-bg); min-height: 100vh; font-family: var(--font-sans); }

    .state-nav {
      display: flex; align-items: center; gap: 16px;
      padding: 14px 24px; background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      position: sticky; top: 64px; z-index: 10; flex-wrap: wrap;
    }
    .back-link { display: flex; align-items: center; gap: 6px; font-size: var(--text-sm); color: var(--color-fg-muted); text-decoration: none; transition: color var(--duration-fast); }
    .back-link:hover { color: var(--color-fg); }
    .state-nav__title { display: flex; align-items: center; gap: 10px; flex: 1; }
    .state-nav__title h1 { font-size: var(--text-base); font-weight: 700; }
    .demo-badge { padding: 2px 8px; background: rgba(124,58,237,0.12); border: 1px solid rgba(124,58,237,0.3); border-radius: var(--radius-full); font-size: 10px; font-family: var(--font-mono); color: #7C3AED; font-weight: 600; }

    .nav-stats { display: flex; gap: 12px; }
    .ns-item { display: flex; align-items: center; gap: 5px; font-size: var(--text-sm); font-family: var(--font-mono); color: var(--color-fg-muted); }
    .ns-dot { width: 8px; height: 8px; border-radius: 50%; }
    .dot-todo     { background: #64748B; }
    .dot-progress { background: #D97706; }
    .dot-done     { background: #22c55e; }

    .state-content { padding: 24px; max-width: 1300px; margin: 0 auto; }

    /* ─── ADD ROW ─── */
    .add-row { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
    .add-input {
      flex: 1; min-width: 200px; padding: 10px 14px;
      background: var(--color-surface); border: 1px solid var(--color-border);
      border-radius: var(--radius-md); color: var(--color-fg); font-size: var(--text-sm);
      font-family: var(--font-sans); outline: none;
      transition: border-color var(--duration-fast);
    }
    .add-input:focus { border-color: #7C3AED; }
    .priority-select { display: flex; gap: 4px; }
    .prio-btn {
      padding: 6px 12px; border: 1px solid var(--color-border); border-radius: var(--radius-full);
      background: transparent; color: var(--color-fg-muted); font-size: 11px; font-family: var(--font-mono);
      cursor: pointer; transition: all var(--duration-fast);
    }
    .prio-btn.active { background: var(--p-color); border-color: var(--p-color); color: #fff; font-weight: 600; }
    .btn-add {
      display: inline-flex; align-items: center; gap: 6px; padding: 10px 18px;
      background: #7C3AED; border: none; border-radius: var(--radius-full); color: #fff;
      font-size: var(--text-sm); font-weight: 600; cursor: pointer;
      transition: opacity var(--duration-fast); white-space: nowrap;
    }
    .btn-add:disabled { opacity: 0.4; cursor: not-allowed; }
    .btn-add:not(:disabled):hover { opacity: 0.85; }

    /* ─── PROGRESS ─── */
    .progress-wrap { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
    .progress-bar { flex: 1; height: 6px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, #7C3AED, #22c55e); border-radius: 3px; transition: width 0.5s var(--ease-out-expo); }
    .progress-label { font-size: 12px; font-family: var(--font-mono); color: var(--color-fg-muted); white-space: nowrap; }

    /* ─── KANBAN ─── */
    .kanban { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
    @media (max-width: 900px) { .kanban { grid-template-columns: 1fr; } }

    .kanban-col { display: flex; flex-direction: column; gap: 8px; }
    .col-header {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 14px; border-radius: var(--radius-lg);
      font-size: var(--text-sm); font-weight: 600;
    }
    .col-header--todo     { background: rgba(100,116,139,0.1); }
    .col-header--progress { background: rgba(217,119,6,0.1);   }
    .col-header--done     { background: rgba(34,197,94,0.1);   }
    .col-dot { width: 8px; height: 8px; border-radius: 50%; }
    .col-header--todo     .col-dot { background: #64748B; }
    .col-header--progress .col-dot { background: #D97706; }
    .col-header--done     .col-dot { background: #22c55e; }
    .col-title { flex: 1; }
    .col-count {
      padding: 1px 7px; background: rgba(255,255,255,0.07); border-radius: var(--radius-full);
      font-size: 11px; font-family: var(--font-mono);
    }
    .col-cards { display: flex; flex-direction: column; gap: 8px; }
    .col-empty { padding: 20px; text-align: center; color: var(--color-fg-muted); font-size: var(--text-sm); border: 1px dashed var(--color-border); border-radius: var(--radius-lg); }

    .task-card {
      background: var(--color-surface); border: 1px solid var(--color-border);
      border-radius: var(--radius-lg); padding: 14px;
      cursor: pointer; transition: border-color var(--duration-fast), transform 0.25s var(--ease-out-expo);
    }
    .task-card:hover { border-color: rgba(255,255,255,0.2); transform: translateY(-2px); }
    .task-card.selected { border-color: #7C3AED; box-shadow: 0 0 0 2px rgba(124,58,237,0.15); }
    .task-card--done { opacity: 0.65; }

    .tc-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .prio-chip { padding: 2px 8px; border-radius: var(--radius-full); font-size: 9px; font-family: var(--font-mono); font-weight: 700; }
    .prio-high   { background: rgba(239,68,68,0.15);   color: #ef4444; }
    .prio-medium { background: rgba(234,179,8,0.15);   color: #eab308; }
    .prio-low    { background: rgba(100,116,139,0.15); color: #94a3b8; }
    .tc-check { font-size: 14px; color: #22c55e; }
    .tc-del {
      padding: 2px 6px; background: transparent; border: none;
      color: var(--color-fg-muted); cursor: pointer; font-size: 16px; line-height: 1;
      border-radius: 3px; transition: color var(--duration-fast), background var(--duration-fast);
    }
    .tc-del:hover { color: #ef4444; background: rgba(239,68,68,0.1); }

    .tc-title { font-size: var(--text-sm); line-height: 1.5; margin-bottom: 10px; color: var(--color-fg); }
    .tc-title--done { text-decoration: line-through; }

    .tc-actions { display: flex; gap: 6px; justify-content: flex-end; }
    .tc-move {
      padding: 4px 10px; background: transparent; border: 1px solid var(--color-border);
      border-radius: var(--radius-full); color: var(--color-fg-muted); font-size: 10px;
      font-family: var(--font-mono); cursor: pointer;
      transition: border-color var(--duration-fast), color var(--duration-fast);
    }
    .tc-move:hover { border-color: #22c55e; color: #22c55e; }
    .tc-move--back:hover { border-color: #64748B; color: #94a3b8; }

    /* ─── SIGNAL PANEL ─── */
    .sig-panel {
      background: var(--color-surface); border: 1px solid var(--color-border);
      border-radius: var(--radius-lg); padding: 16px; font-family: var(--font-mono); font-size: 12px;
    }
    .sig-panel__title {
      display: flex; align-items: center; gap: 8px;
      color: #7C3AED; font-weight: 600; margin-bottom: 12px;
    }
    .sig-dot { width: 8px; height: 8px; border-radius: 50%; background: #7C3AED; animation: pulse-glow 2s ease-in-out infinite; }
    .sig-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
    @media (max-width: 600px) { .sig-grid { grid-template-columns: repeat(2, 1fr); } }
    .sig-cell { padding: 8px 10px; background: var(--color-bg); border-radius: var(--radius-md); display: flex; flex-direction: column; gap: 4px; }
    .sck { color: var(--color-accent-2); font-size: 10px; }
    .scv { color: var(--color-fg); font-weight: 600; }
    .scv.accent { color: #7C3AED; }
  `]
})
export class StateDemoComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private i18n       = inject(I18nService);

  lang = computed(() => this.i18n.currentLang());

  tasks = signal<Task[]>([...SEED]);
  newTitle    = '';
  newPriority: Priority = 'medium';

  todoTasks     = computed(() => this.tasks().filter(t => t.status === 'todo').sort((a, b) => b.createdAt - a.createdAt));
  progressTasks = computed(() => this.tasks().filter(t => t.status === 'progress').sort((a, b) => b.createdAt - a.createdAt));
  doneTasks     = computed(() => this.tasks().filter(t => t.status === 'done').sort((a, b) => b.createdAt - a.createdAt));
  donePercent   = computed(() => {
    const total = this.tasks().length;
    if (!total) return 0;
    return Math.round((this.doneTasks().length / total) * 100);
  });

  selected = linkedSignal<Task | null>(() => null);

  readonly priorities = [
    { value: 'high'   as Priority, labelPt: 'Alta',  labelEn: 'High',  color: '#ef4444' },
    { value: 'medium' as Priority, labelPt: 'Média', labelEn: 'Med',   color: '#eab308' },
    { value: 'low'    as Priority, labelPt: 'Baixa', labelEn: 'Low',   color: '#64748B' }
  ];

  constructor() {
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        try {
          localStorage.setItem('demo-tasks', JSON.stringify(this.tasks()));
        } catch {}
      }
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const saved = localStorage.getItem('demo-tasks');
        if (saved) this.tasks.set(JSON.parse(saved) as Task[]);
      } catch {}
    }
  }

  addTask(): void {
    const title = this.newTitle.trim();
    if (!title) return;
    this.tasks.update(ts => [...ts, {
      id: ++nextId,
      title,
      status: 'todo',
      priority: this.newPriority,
      createdAt: Date.now()
    }]);
    this.newTitle = '';
  }

  moveTask(id: number, status: Status, e: Event): void {
    e.stopPropagation();
    this.tasks.update(ts => ts.map(t => t.id === id ? { ...t, status } : t));
  }

  deleteTask(id: number, e: Event): void {
    e.stopPropagation();
    this.tasks.update(ts => ts.filter(t => t.id !== id));
    if (this.selected()?.id === id) this.selected.set(null);
  }

  select(task: Task): void {
    this.selected.set(this.selected()?.id === task.id ? null : task);
  }

  prioLabelPt(p: Priority): string { return { high: 'Alta', medium: 'Média', low: 'Baixa' }[p]; }
  prioLabelEn(p: Priority): string { return { high: 'High', medium: 'Med',   low: 'Low'   }[p]; }
}
