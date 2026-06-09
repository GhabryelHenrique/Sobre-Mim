import {
  Component, inject, signal, computed, afterNextRender,
  ChangeDetectionStrategy, ElementRef, OnDestroy, PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';

type TileLayer = 'dark' | 'light' | 'satellite';

interface MapMarker {
  id: number;
  city: string;
  state: string;
  lat: number;
  lng: number;
  descPt: string;
  descEn: string;
  color: string;
  icon: string;
}

const MARKERS: MapMarker[] = [
  { id: 1, city: 'Uberlândia', state: 'MG', lat: -18.9113, lng: -48.2622, descPt: 'Minha cidade natal. Sede do GDG Uberlândia e NASA Space Apps Local Lead.', descEn: 'My hometown. Home of GDG Uberlândia and NASA Space Apps Local Lead.', color: '#DD0031', icon: '🏠' },
  { id: 2, city: 'São Paulo',  state: 'SP', lat: -23.5505, lng: -46.6333, descPt: 'Maior hub tech do Brasil. GDG São Paulo, eventos e oportunidades.', descEn: 'Brazil\'s biggest tech hub. GDG São Paulo, events and opportunities.', color: '#00D9FF', icon: '🏙️' },
  { id: 3, city: 'Belo Horizonte', state: 'MG', lat: -19.9167, lng: -43.9345, descPt: 'Capital de Minas Gerais. Grande comunidade Angular e Google.', descEn: 'Minas Gerais capital. Large Angular and Google community.', color: '#7C3AED', icon: '⛰️' },
  { id: 4, city: 'Rio de Janeiro', state: 'RJ', lat: -22.9068, lng: -43.1729, descPt: 'Cidade maravilhosa. Palco de grandes conferências de tecnologia.', descEn: 'Marvelous city. Stage for major tech conferences.', color: '#059669', icon: '🏖️' },
  { id: 5, city: 'Brasília', state: 'DF', lat: -15.7801, lng: -47.9292, descPt: 'Capital federal. Comunidade tech ativa e eventos nacionais.', descEn: 'Federal capital. Active tech community and national events.', color: '#D97706', icon: '🏛️' },
];

@Component({
  selector: 'app-maps-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
<div class="maps-page">

  <!-- ─── NAV ─── -->
  <nav class="maps-nav">
    <a routerLink="/demos" class="back-link">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
      {{ lang() === 'pt' ? 'Voltar' : 'Back' }}
    </a>
    <div class="maps-nav__title">
      <span class="demo-badge">Demo</span>
      <h1>{{ lang() === 'pt' ? 'Mapas Interativos' : 'Interactive Maps' }}</h1>
    </div>

    <!-- Tile layer switcher -->
    <div class="tile-tabs">
      @for (t of tileLayers; track t.value) {
        <button class="tile-tab" [class.active]="activeLayer() === t.value"
                (click)="switchLayer(t.value)">
          {{ t.label }}
        </button>
      }
    </div>
  </nav>

  <div class="maps-layout">

    <!-- ─── SIDEBAR ─── -->
    <aside class="maps-sidebar">
      <h2 class="sidebar-title">
        {{ lang() === 'pt' ? 'Cidades' : 'Cities' }}
        <span class="sidebar-count">{{ markers.length }}</span>
      </h2>
      <div class="marker-list">
        @for (m of markers; track m.id) {
          <button class="marker-item" [class.active]="activeMarker()?.id === m.id"
                  [style.--m-color]="m.color" (click)="flyToMarker(m)">
            <span class="mi-icon">{{ m.icon }}</span>
            <div class="mi-body">
              <span class="mi-city">{{ m.city }}</span>
              <span class="mi-state">{{ m.state }}</span>
            </div>
            <svg class="mi-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        }
      </div>

      @if (activeMarker()) {
        <div class="marker-detail" [style.--m-color]="activeMarker()!.color">
          <div class="md-header">
            <span class="md-icon">{{ activeMarker()!.icon }}</span>
            <div>
              <h3 class="md-city">{{ activeMarker()!.city }}</h3>
              <span class="md-state">{{ activeMarker()!.state }}</span>
            </div>
          </div>
          <p class="md-desc">
            {{ lang() === 'pt' ? activeMarker()!.descPt : activeMarker()!.descEn }}
          </p>
          <div class="md-coords">
            <span>{{ activeMarker()!.lat.toFixed(4) }}°</span>
            <span>{{ activeMarker()!.lng.toFixed(4) }}°</span>
          </div>
        </div>
      }
    </aside>

    <!-- ─── MAP ─── -->
    <div class="map-container">
      @defer (on immediate) {
        <div #mapEl class="map-el" role="region" aria-label="Mapa interativo do Brasil"></div>
      } @loading {
        <div class="map-loading">
          <span>{{ lang() === 'pt' ? 'Carregando mapa...' : 'Loading map...' }}</span>
        </div>
      }
    </div>

  </div>
</div>
  `,
  styles: [`
    .maps-page { background: var(--color-bg); min-height: 100vh; display: flex; flex-direction: column; font-family: var(--font-sans); }

    .maps-nav {
      display: flex; align-items: center; gap: 16px;
      padding: 14px 24px; background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      position: sticky; top: 64px; z-index: 1000; flex-wrap: wrap;
    }
    .back-link { display: flex; align-items: center; gap: 6px; font-size: var(--text-sm); color: var(--color-fg-muted); text-decoration: none; transition: color var(--duration-fast); }
    .back-link:hover { color: var(--color-fg); }
    .maps-nav__title { display: flex; align-items: center; gap: 10px; flex: 1; }
    .maps-nav__title h1 { font-size: var(--text-base); font-weight: 700; }
    .demo-badge { padding: 2px 8px; background: rgba(5,150,105,0.12); border: 1px solid rgba(5,150,105,0.3); border-radius: var(--radius-full); font-size: 10px; font-family: var(--font-mono); color: #059669; font-weight: 600; }

    .tile-tabs { display: flex; gap: 4px; }
    .tile-tab {
      padding: 5px 14px; border: 1px solid var(--color-border); border-radius: var(--radius-full);
      background: transparent; color: var(--color-fg-muted); font-size: var(--text-sm);
      font-family: var(--font-sans); cursor: pointer; transition: all var(--duration-fast);
    }
    .tile-tab.active { background: #059669; border-color: #059669; color: #fff; font-weight: 600; }

    .maps-layout {
      display: grid;
      grid-template-columns: 300px 1fr;
      flex: 1;
      min-height: calc(100vh - 130px);
    }
    @media (max-width: 768px) { .maps-layout { grid-template-columns: 1fr; } }

    /* ─── SIDEBAR ─── */
    .maps-sidebar {
      background: var(--color-surface); border-right: 1px solid var(--color-border);
      padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px;
    }
    .sidebar-title { font-size: var(--text-base); font-weight: 700; display: flex; align-items: center; gap: 8px; }
    .sidebar-count {
      padding: 1px 8px; background: rgba(5,150,105,0.1); border-radius: var(--radius-full);
      font-size: 11px; font-family: var(--font-mono); color: #059669;
    }

    .marker-list { display: flex; flex-direction: column; gap: 4px; }
    .marker-item {
      display: flex; align-items: center; gap: 10px; padding: 10px 12px;
      background: transparent; border: 1px solid var(--color-border); border-radius: var(--radius-lg);
      cursor: pointer; text-align: left; width: 100%;
      transition: border-color var(--duration-fast), background var(--duration-fast);
    }
    .marker-item:hover { border-color: var(--m-color, #059669); background: rgba(255,255,255,0.03); }
    .marker-item.active { border-color: var(--m-color, #059669); background: color-mix(in srgb, var(--m-color) 8%, transparent); }
    .mi-icon { font-size: 1.2rem; }
    .mi-body { flex: 1; display: flex; flex-direction: column; gap: 1px; }
    .mi-city { font-size: var(--text-sm); font-weight: 600; color: var(--color-fg); }
    .mi-state { font-size: 10px; font-family: var(--font-mono); color: var(--color-fg-muted); }
    .mi-arrow { color: var(--color-fg-muted); transition: transform var(--duration-fast); }
    .marker-item:hover .mi-arrow { transform: translateX(3px); color: var(--m-color); }

    .marker-detail {
      background: var(--color-bg); border: 1px solid var(--m-color, #059669);
      border-radius: var(--radius-lg); padding: 16px;
      border-left: 3px solid var(--m-color, #059669);
    }
    .md-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
    .md-icon { font-size: 1.5rem; }
    .md-city { font-size: var(--text-base); font-weight: 700; }
    .md-state { font-size: 11px; font-family: var(--font-mono); color: var(--color-fg-muted); }
    .md-desc { font-size: var(--text-sm); color: var(--color-fg-muted); line-height: 1.6; margin-bottom: 10px; }
    .md-coords { display: flex; gap: 12px; font-size: 10px; font-family: var(--font-mono); color: var(--m-color); }

    /* ─── MAP ─── */
    .map-container { position: relative; }
    .map-el { width: 100%; height: 100%; min-height: 500px; }
    .map-loading {
      display: flex; align-items: center; justify-content: center;
      height: 100%; color: var(--color-fg-muted); font-family: var(--font-mono);
    }

    /* Override leaflet default styles for dark theme */
    :global(.leaflet-container) { background: #1a1a1a; font-family: var(--font-sans); }
    :global(.leaflet-popup-content-wrapper) {
      background: var(--color-surface, #1a1a1a) !important;
      color: var(--color-fg, #f0f0f0) !important;
      border: 1px solid rgba(255,255,255,0.1) !important;
      border-radius: 8px !important;
      box-shadow: 0 8px 24px rgba(0,0,0,0.5) !important;
    }
    :global(.leaflet-popup-tip) { background: var(--color-surface, #1a1a1a) !important; }
    :global(.leaflet-control-zoom a) {
      background: var(--color-surface, #1a1a1a) !important;
      color: var(--color-fg, #f0f0f0) !important;
      border-color: rgba(255,255,255,0.1) !important;
    }
  `]
})
export class MapsDemoComponent implements OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private el         = inject(ElementRef);
  private i18n       = inject(I18nService);

  lang          = computed(() => this.i18n.currentLang());
  activeLayer   = signal<TileLayer>('dark');
  activeMarker  = signal<MapMarker | null>(null);

  readonly markers = MARKERS;
  readonly tileLayers: Array<{ value: TileLayer; label: string }> = [
    { value: 'dark',      label: 'Dark'      },
    { value: 'light',     label: 'Light'     },
    { value: 'satellite', label: 'Satellite' }
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private map: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private tileLayerRef: any = null;
  private leaflet: typeof import('leaflet') | null = null;

  private readonly TILES: Record<TileLayer, string> = {
    dark:      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    light:     'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  };

  constructor() {
    afterNextRender(async () => {
      if (!isPlatformBrowser(this.platformId)) return;
      await this.initMap();
    });
  }

  private async initMap(): Promise<void> {
    const L = await import('leaflet');
    this.leaflet = L;

    const mapEl = this.el.nativeElement.querySelector('.map-el') as HTMLElement;
    if (!mapEl) return;

    // Fix Leaflet default icon path issue with bundlers
    delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)['_getIconUrl'];
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });

    this.map = L.map(mapEl, {
      center: [-15.0, -50.0],
      zoom: 4,
      zoomControl: true,
      attributionControl: false,
    });

    this.tileLayerRef = L.tileLayer(this.TILES[this.activeLayer()], { maxZoom: 18 }).addTo(this.map);

    // Add markers
    for (const m of MARKERS) {
      const icon = L.divIcon({
        html: `<div style="background:${m.color};width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid rgba(255,255,255,0.6);display:flex;align-items:center;justify-content:center;">
                 <span style="transform:rotate(45deg);font-size:12px">${m.icon}</span>
               </div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        className: ''
      });

      const popup = L.popup({ closeButton: false }).setContent(
        `<div style="padding:4px 2px">
           <strong style="font-size:14px">${m.city}</strong>
           <span style="font-size:11px;opacity:0.6;margin-left:6px">${m.state}</span>
           <p style="margin:6px 0 0;font-size:12px;opacity:0.8;max-width:200px">${m.descPt}</p>
         </div>`
      );

      L.marker([m.lat, m.lng], { icon })
        .bindPopup(popup)
        .on('click', () => this.activeMarker.set(m))
        .addTo(this.map);
    }

    // Handle resize
    const ro = new ResizeObserver(() => this.map?.invalidateSize());
    ro.observe(mapEl);
  }

  flyToMarker(m: MapMarker): void {
    this.activeMarker.set(m);
    if (this.map) {
      this.map.flyTo([m.lat, m.lng], 10, { duration: 1.2 });
    }
  }

  switchLayer(layer: TileLayer): void {
    this.activeLayer.set(layer);
    if (this.map && this.tileLayerRef && this.leaflet) {
      this.map.removeLayer(this.tileLayerRef);
      this.tileLayerRef = this.leaflet.tileLayer(this.TILES[layer], { maxZoom: 18 }).addTo(this.map);
    }
  }

  ngOnDestroy(): void {
    this.map?.remove();
    this.map = null;
  }
}
