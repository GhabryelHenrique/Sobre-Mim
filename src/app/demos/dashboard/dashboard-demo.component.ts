import {
  Component, inject, signal, computed, effect, OnDestroy,
  ChangeDetectionStrategy, PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';

type Period = '7d' | '30d' | '90d';
type SortDir = 'asc' | 'desc';
interface SortState { col: string; dir: SortDir }

interface KPI {
  id: string;
  labelPt: string;
  labelEn: string;
  value: number;
  prevValue: number;
  prefix?: string;
  suffix?: string;
  color: string;
  icon: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  joined: string;
  revenue: number;
}

const USERS: User[] = [
  { id: 1,  name: 'Ana Costa',        email: 'ana@example.com',     role: 'Admin',     status: 'active',   joined: '2024-01-15', revenue: 4200 },
  { id: 2,  name: 'Bruno Melo',       email: 'bruno@example.com',   role: 'Developer', status: 'active',   joined: '2024-02-20', revenue: 3100 },
  { id: 3,  name: 'Carla Santos',     email: 'carla@example.com',   role: 'Designer',  status: 'pending',  joined: '2024-03-10', revenue: 0    },
  { id: 4,  name: 'Diego Alves',      email: 'diego@example.com',   role: 'Developer', status: 'active',   joined: '2024-01-05', revenue: 5800 },
  { id: 5,  name: 'Elisa Faria',      email: 'elisa@example.com',   role: 'Manager',   status: 'active',   joined: '2023-11-20', revenue: 9200 },
  { id: 6,  name: 'Felipe Lima',      email: 'felipe@example.com',  role: 'Developer', status: 'inactive', joined: '2024-04-01', revenue: 1200 },
  { id: 7,  name: 'Gabriela Pinto',   email: 'gabi@example.com',    role: 'Designer',  status: 'active',   joined: '2024-02-14', revenue: 3400 },
  { id: 8,  name: 'Henrique Torres',  email: 'henrique@example.com',role: 'Developer', status: 'active',   joined: '2023-12-01', revenue: 7100 },
  { id: 9,  name: 'Isabela Cruz',     email: 'isa@example.com',     role: 'Analyst',   status: 'active',   joined: '2024-03-25', revenue: 2900 },
  { id: 10, name: 'João Ribeiro',     email: 'joao@example.com',    role: 'Admin',     status: 'pending',  joined: '2024-05-01', revenue: 0    },
  { id: 11, name: 'Kamila Souza',     email: 'kamila@example.com',  role: 'Developer', status: 'active',   joined: '2024-01-30', revenue: 4600 },
  { id: 12, name: 'Lucas Oliveira',   email: 'lucas@example.com',   role: 'Manager',   status: 'active',   joined: '2023-10-15', revenue: 11200 },
];

function genBarData(period: Period): number[] {
  const len = period === '7d' ? 7 : period === '30d' ? 12 : 12;
  return Array.from({ length: len }, () => Math.floor(Math.random() * 80 + 20));
}

@Component({
  selector: 'app-dashboard-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
<div class="dash-page">

  <!-- ─── NAV ─── -->
  <nav class="dash-nav">
    <a routerLink="/demos" class="back-link">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
      {{ lang() === 'pt' ? 'Voltar' : 'Back' }}
    </a>
    <div class="dash-nav__title">
      <span class="dash-badge">Demo</span>
      <h1>{{ lang() === 'pt' ? 'Dashboard Analytics' : 'Analytics Dashboard' }}</h1>
    </div>
    <div class="period-tabs">
      @for (p of periods; track p.value) {
        <button class="period-tab" [class.active]="period() === p.value" (click)="setPeriod(p.value)">
          {{ p.label }}
        </button>
      }
    </div>
  </nav>

  <div class="dash-content">

    <!-- ─── KPI CARDS ─── -->
    <div class="kpi-grid">
      @for (kpi of kpis(); track kpi.id) {
        <div class="kpi-card" [style.--kpi-color]="kpi.color">
          <div class="kpi-header">
            <span class="kpi-icon">{{ kpi.icon }}</span>
            <span class="kpi-trend" [class.up]="kpiTrend(kpi) > 0" [class.down]="kpiTrend(kpi) < 0">
              {{ kpiTrend(kpi) > 0 ? '▲' : '▼' }} {{ Math.abs(kpiTrend(kpi)) }}%
            </span>
          </div>
          <div class="kpi-value">
            {{ kpi.prefix ?? '' }}{{ formatNum(kpi.value) }}{{ kpi.suffix ?? '' }}
          </div>
          <div class="kpi-label">{{ lang() === 'pt' ? kpi.labelPt : kpi.labelEn }}</div>
          <div class="kpi-bar">
            <div class="kpi-bar-fill" [style.width.%]="kpiProgress(kpi)"></div>
          </div>
        </div>
      }
    </div>

    <!-- ─── CHART + TABLE ─── -->
    <div class="dash-lower">

      <!-- Bar Chart -->
      <div class="chart-card">
        <div class="chart-card__header">
          <h2 class="chart-title">{{ lang() === 'pt' ? 'Receita por Período' : 'Revenue by Period' }}</h2>
          <span class="chart-hint">{{ lang() === 'pt' ? 'Atualiza em tempo real' : 'Updates in real time' }}</span>
        </div>

        <div class="chart-wrap">
          <svg class="bar-chart" [attr.viewBox]="'0 0 ' + chartW + ' ' + chartH" preserveAspectRatio="none">
            @for (bar of barData(); track $index; let i = $index) {
              <g>
                <rect
                  [attr.x]="barX(i)"
                  [attr.y]="chartH - barHeight(bar) - 24"
                  [attr.width]="barWidth()"
                  [attr.height]="barHeight(bar)"
                  [attr.fill]="hovBar() === i ? '#FF4500' : 'rgba(255,69,0,0.45)'"
                  rx="3"
                  class="bar-rect"
                  (mouseenter)="hovBar.set(i)"
                  (mouseleave)="hovBar.set(-1)"
                />
                @if (hovBar() === i) {
                  <text
                    [attr.x]="barX(i) + barWidth() / 2"
                    [attr.y]="chartH - barHeight(bar) - 28"
                    text-anchor="middle"
                    class="bar-tooltip"
                  >{{ bar }}k</text>
                }
                <text
                  [attr.x]="barX(i) + barWidth() / 2"
                  [attr.y]="chartH - 6"
                  text-anchor="middle"
                  class="bar-label"
                >{{ barLabel(i) }}</text>
              </g>
            }
          </svg>
        </div>
      </div>

      <!-- Data Table -->
      <div class="table-card">
        <div class="table-card__header">
          <h2 class="chart-title">{{ lang() === 'pt' ? 'Usuários' : 'Users' }}</h2>
          <span class="user-count">{{ sortedUsers().length }}</span>
        </div>

        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                @for (col of tableCols; track col.key) {
                  <th (click)="sortBy(col.key)" [class.sorted]="sort().col === col.key" class="sortable-th">
                    {{ lang() === 'pt' ? col.labelPt : col.labelEn }}
                    @if (sort().col === col.key) {
                      <span class="sort-icon">{{ sort().dir === 'asc' ? '↑' : '↓' }}</span>
                    }
                  </th>
                }
              </tr>
            </thead>
            <tbody>
              @for (user of sortedUsers(); track user.id) {
                <tr>
                  <td class="td-name">{{ user.name }}</td>
                  <td class="td-role">{{ user.role }}</td>
                  <td>
                    <span class="status-pill" [class]="'status-' + user.status">
                      {{ user.status }}
                    </span>
                  </td>
                  <td class="td-revenue">R$ {{ formatNum(user.revenue) }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </div>
</div>
  `,
  styles: [`
    .dash-page {
      background: var(--color-bg);
      min-height: 100vh;
      font-family: var(--font-sans);
    }

    /* ─── NAV ─── */
    .dash-nav {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 16px 24px;
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      position: sticky;
      top: 64px;
      z-index: 10;
      flex-wrap: wrap;
    }

    .back-link {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: var(--text-sm);
      color: var(--color-fg-muted);
      text-decoration: none;
      transition: color var(--duration-fast);
    }
    .back-link:hover { color: var(--color-fg); }

    .dash-nav__title {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
    }

    .dash-badge {
      padding: 2px 8px;
      background: rgba(255,69,0,0.12);
      border: 1px solid rgba(255,69,0,0.3);
      border-radius: var(--radius-full);
      font-size: 10px;
      font-family: var(--font-mono);
      color: var(--color-accent);
      font-weight: 600;
    }

    .dash-nav__title h1 {
      font-size: var(--text-base);
      font-weight: 700;
    }

    .period-tabs {
      display: flex;
      gap: 4px;
    }

    .period-tab {
      padding: 5px 14px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-full);
      background: transparent;
      color: var(--color-fg-muted);
      font-size: var(--text-sm);
      font-family: var(--font-sans);
      cursor: pointer;
      transition: all var(--duration-fast);
    }
    .period-tab.active {
      background: var(--color-accent);
      border-color: var(--color-accent);
      color: #fff;
      font-weight: 600;
    }

    /* ─── CONTENT ─── */
    .dash-content {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    /* ─── KPI ─── */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }
    @media (max-width: 1100px) { .kpi-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 600px)  { .kpi-grid { grid-template-columns: 1fr; } }

    .kpi-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      padding: 20px;
      transition: border-color var(--duration-base), transform 0.3s var(--ease-out-expo);
    }
    .kpi-card:hover {
      border-color: var(--kpi-color, var(--color-accent));
      transform: translateY(-3px);
    }

    .kpi-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .kpi-icon { font-size: 1.5rem; }
    .kpi-trend {
      font-size: 11px;
      font-family: var(--font-mono);
      font-weight: 600;
      padding: 2px 7px;
      border-radius: var(--radius-full);
      background: rgba(255,255,255,0.06);
    }
    .kpi-trend.up   { color: #22c55e; background: rgba(34,197,94,0.1); }
    .kpi-trend.down { color: #ef4444; background: rgba(239,68,68,0.1); }

    .kpi-value {
      font-size: clamp(1.6rem, 3vw, 2.2rem);
      font-weight: 800;
      font-family: var(--font-mono);
      color: var(--kpi-color, var(--color-accent));
      letter-spacing: -0.03em;
      line-height: 1;
      margin-bottom: 6px;
    }
    .kpi-label {
      font-size: var(--text-sm);
      color: var(--color-fg-muted);
      margin-bottom: 14px;
    }
    .kpi-bar {
      height: 3px;
      background: rgba(255,255,255,0.06);
      border-radius: 2px;
      overflow: hidden;
    }
    .kpi-bar-fill {
      height: 100%;
      background: var(--kpi-color, var(--color-accent));
      border-radius: 2px;
      transition: width 0.8s var(--ease-out-expo);
    }

    /* ─── LOWER ─── */
    .dash-lower {
      display: grid;
      grid-template-columns: 1fr 1.4fr;
      gap: 20px;
    }
    @media (max-width: 1024px) { .dash-lower { grid-template-columns: 1fr; } }

    /* ─── CHART ─── */
    .chart-card, .table-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      padding: 20px;
    }

    .chart-card__header, .table-card__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .chart-title {
      font-size: var(--text-base);
      font-weight: 700;
    }
    .chart-hint {
      font-size: 11px;
      font-family: var(--font-mono);
      color: var(--color-accent);
      animation: pulse-glow 2s ease-in-out infinite;
    }

    .chart-wrap { width: 100%; }
    .bar-chart { width: 100%; height: 200px; display: block; }

    .bar-rect { transition: fill 0.2s; cursor: pointer; }
    .bar-tooltip {
      font-size: 11px;
      font-family: var(--font-mono);
      fill: var(--color-fg);
      font-weight: 600;
    }
    .bar-label {
      font-size: 10px;
      font-family: var(--font-mono);
      fill: var(--color-fg-muted);
    }

    /* ─── TABLE ─── */
    .user-count {
      padding: 2px 9px;
      background: rgba(255,69,0,0.1);
      border-radius: var(--radius-full);
      font-size: var(--text-sm);
      font-family: var(--font-mono);
      color: var(--color-accent);
      font-weight: 600;
    }

    .table-wrap { overflow-x: auto; }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: var(--text-sm);
    }

    .data-table thead th {
      text-align: left;
      padding: 8px 12px;
      color: var(--color-fg-muted);
      font-size: 11px;
      font-family: var(--font-mono);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      border-bottom: 1px solid var(--color-border);
    }

    .sortable-th {
      cursor: pointer;
      user-select: none;
      transition: color var(--duration-fast);
    }
    .sortable-th:hover, .sortable-th.sorted { color: var(--color-accent); }

    .sort-icon { margin-left: 4px; }

    .data-table tbody tr {
      border-bottom: 1px solid rgba(255,255,255,0.04);
      transition: background var(--duration-fast);
    }
    .data-table tbody tr:hover { background: rgba(255,255,255,0.03); }

    .data-table td {
      padding: 10px 12px;
      color: var(--color-fg-muted);
    }
    .td-name { color: var(--color-fg); font-weight: 500; white-space: nowrap; }
    .td-role { font-family: var(--font-mono); font-size: 11px; }
    .td-revenue { font-family: var(--font-mono); font-weight: 600; color: var(--color-fg); }

    .status-pill {
      display: inline-block;
      padding: 2px 8px;
      border-radius: var(--radius-full);
      font-size: 10px;
      font-weight: 600;
      font-family: var(--font-mono);
    }
    .status-active   { background: rgba(34,197,94,0.12);  color: #22c55e; }
    .status-inactive { background: rgba(239,68,68,0.12);  color: #ef4444; }
    .status-pending  { background: rgba(234,179,8,0.12);  color: #eab308; }
  `]
})
export class DashboardDemoComponent implements OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private i18n       = inject(I18nService);

  lang    = computed(() => this.i18n.currentLang());
  period  = signal<Period>('30d');
  hovBar  = signal(-1);
  sort    = signal<SortState>({ col: 'revenue', dir: 'desc' });

  readonly Math = Math;
  readonly chartW = 600;
  readonly chartH = 200;
  readonly periods = [
    { value: '7d'  as Period, label: '7D'  },
    { value: '30d' as Period, label: '30D' },
    { value: '90d' as Period, label: '90D' }
  ];
  readonly tableCols = [
    { key: 'name',    labelPt: 'Nome',    labelEn: 'Name'    },
    { key: 'role',    labelPt: 'Cargo',   labelEn: 'Role'    },
    { key: 'status',  labelPt: 'Status',  labelEn: 'Status'  },
    { key: 'revenue', labelPt: 'Receita', labelEn: 'Revenue' }
  ];

  private baseKpis = signal([
    { id: 'users',    labelPt: 'Usuários Ativos',  labelEn: 'Active Users',    value: 1248, prevValue: 1100, color: '#FF4500', icon: '👥' },
    { id: 'revenue',  labelPt: 'Receita (R$)',      labelEn: 'Revenue (R$)',    value: 54200, prevValue: 48000, prefix: 'R$ ', color: '#00D9FF', icon: '💰' },
    { id: 'conv',     labelPt: 'Conversão',          labelEn: 'Conversion',      value: 3.7,  prevValue: 3.2,  suffix: '%', color: '#7C3AED', icon: '📈' },
    { id: 'tickets',  labelPt: 'Tickets Abertos',    labelEn: 'Open Tickets',    value: 23,   prevValue: 31,  color: '#D97706', icon: '🎫' },
  ] as KPI[]);

  kpis = computed(() => this.baseKpis());
  barData = signal<number[]>(genBarData('30d'));

  sortedUsers = computed(() => {
    const { col, dir } = this.sort();
    return [...USERS].sort((a, b) => {
      const av = a[col as keyof User];
      const bv = b[col as keyof User];
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return dir === 'asc' ? cmp : -cmp;
    });
  });

  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    effect(() => {
      this.barData.set(genBarData(this.period()));
    });

    if (isPlatformBrowser(this.platformId)) {
      this.intervalId = setInterval(() => {
        this.baseKpis.update(kpis => kpis.map(k => ({
          ...k,
          prevValue: k.value,
          value: k.id === 'conv'
            ? Math.round((k.value + (Math.random() - 0.5) * 0.4) * 10) / 10
            : Math.round(k.value + (Math.random() - 0.5) * k.value * 0.03)
        })));
        this.barData.update(d => d.map(v => Math.max(10, Math.min(100, v + Math.floor((Math.random() - 0.5) * 15)))));
      }, 2000);
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId !== null) clearInterval(this.intervalId);
  }

  setPeriod(p: Period): void { this.period.set(p); }

  sortBy(col: string): void {
    this.sort.update(s => s.col === col
      ? { col, dir: s.dir === 'asc' ? 'desc' : 'asc' }
      : { col, dir: 'desc' }
    );
  }

  kpiTrend(kpi: KPI): number {
    if (!kpi.prevValue) return 0;
    return Math.round((kpi.value - kpi.prevValue) / kpi.prevValue * 100);
  }

  kpiProgress(kpi: KPI): number {
    const maxes: Record<string, number> = { users: 2000, revenue: 100000, conv: 10, tickets: 50 };
    return Math.min((kpi.value / (maxes[kpi.id] ?? 1000)) * 100, 100);
  }

  formatNum(n: number): string {
    if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'k';
    return n.toString();
  }

  barWidth(): number {
    const bars = this.barData().length;
    return Math.floor((this.chartW - (bars + 1) * 6) / bars);
  }

  barX(i: number): number {
    return 6 + i * (this.barWidth() + 6);
  }

  barHeight(val: number): number {
    return Math.round((val / 100) * (this.chartH - 40));
  }

  barLabel(i: number): string {
    const p = this.period();
    if (p === '7d') return ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'][i] ?? '';
    return `${i + 1}`;
  }
}
