# Prompt para Claude Code: Portfólio Pessoal Angular — Ghabryel

> Cole este prompt completo no Claude Code (terminal, VS Code ou JetBrains).
> Execute em fases, validando os critérios de aceitação ao final de cada uma.

---

## CONTEXTO

Você vai construir o **portfólio pessoal de Ghabryel**, Senior Frontend/Full Stack Engineer brasileiro de Uberlândia/MG, candidato a **Google Developer Expert (GDE) em Angular**, Local Lead do NASA Space Apps Challenge Uberlândia e membro do Global Shapers Community (World Economic Forum).

O portfólio precisa ser **visualmente excepcional** (nível Awwwards Site of the Day), tecnicamente impressionante para recrutadores e para o comitê do GDE, e demonstrar profundidade em Angular moderno.

**Público-alvo:**
1. Comitê de avaliação Google Developer Expert
2. Recrutadores técnicos (FAANG e tier 1)
3. Comunidade dev brasileira e internacional
4. Organizadores de eventos e conferências

---

## RESTRIÇÕES IMPORTANTES

- **SEM BACKEND.** Aplicação 100% client-side / static.
- **Todos os dados devem vir de arquivos JSON estáticos** em `src/assets/data/`.
- **Deploy target:** Vercel, Netlify, Cloudflare Pages ou GitHub Pages (configurar build para output estático).
- **Sem variáveis de ambiente sensíveis.** Tudo público e versionável.
- **i18n bilíngue:** Português (default) e Inglês, alternável por botão. Use um serviço de tradução simples com signals lendo JSON (não precisa de `@angular/localize`).

---

## STACK TÉCNICA OBRIGATÓRIA

- **Angular 20+** (última versão estável) com:
  - Standalone Components em todo o projeto
  - Signals para estado (sem NgRx, sem RxJS para state)
  - Novo control flow: `@if`, `@for`, `@switch`, `@defer`
  - `inject()` ao invés de constructor injection
  - Lazy loading de rotas com `loadComponent`
  - SSG (Static Site Generation) via `@angular/ssr` com `prerender`
- **TailwindCSS 4** + CSS customizado para animações complexas
- **GSAP 3** (ScrollTrigger, SplitText, Flip) para animações avançadas
- **Three.js** puro para 3D/WebGL (sem wrappers pesados)
- **TypeScript strict mode**, ESLint + Prettier configurados
- **Lottie** (`lottie-web`) opcional para micro-animações específicas

---

## ARQUITETURA DO PROJETO

```
src/
├── app/
│   ├── core/
│   │   ├── services/
│   │   │   ├── theme.service.ts          # dark/light com signal
│   │   │   ├── i18n.service.ts            # pt/en com signal, lê JSON
│   │   │   ├── data.service.ts            # carrega JSONs estáticos
│   │   │   ├── animation.service.ts       # registra GSAP plugins, helpers
│   │   │   └── seo.service.ts             # meta tags dinâmicas
│   │   └── tokens/
│   ├── shared/
│   │   ├── components/
│   │   │   ├── magnetic-cursor/
│   │   │   ├── reveal-text/
│   │   │   ├── magnetic-button/
│   │   │   ├── noise-overlay/
│   │   │   ├── theme-toggle/
│   │   │   └── lang-switcher/
│   │   ├── directives/
│   │   │   ├── reveal-on-scroll.directive.ts
│   │   │   ├── parallax.directive.ts
│   │   │   └── magnetic.directive.ts
│   │   └── pipes/
│   │       └── translate.pipe.ts
│   ├── features/
│   │   ├── home/
│   │   ├── about/
│   │   ├── projects/
│   │   ├── community/
│   │   ├── articles/
│   │   ├── speaking/
│   │   └── contact/
│   ├── layout/
│   │   ├── header/
│   │   ├── footer/
│   │   └── page-transition/
│   └── app.routes.ts
├── assets/
│   ├── data/
│   │   ├── profile.json
│   │   ├── projects.json
│   │   ├── articles.json
│   │   ├── community.json
│   │   ├── speaking.json
│   │   ├── stack.json
│   │   ├── timeline.json
│   │   └── i18n/
│   │       ├── pt.json
│   │       └── en.json
│   ├── images/
│   ├── models/
│   └── lottie/
└── styles/
    ├── tokens.css
    ├── animations.css
    └── styles.css
```

---

## DADOS MOCKADOS (CRIAR TODOS OS JSONs)

Crie os seguintes arquivos em `src/assets/data/` com dados realistas baseados no perfil do Ghabryel. **Não use Lorem ipsum nem nomes genéricos.** Quando faltar informação real, use placeholders coerentes (ex.: `https://github.com/ghabryel` como URL provisória).

### `profile.json`
```json
{
  "name": "Ghabryel",
  "title": { "pt": "Engenheiro de Software Sênior", "en": "Senior Software Engineer" },
  "specialty": "Angular, TypeScript, Arquitetura Frontend",
  "location": "Uberlândia, MG — Brasil",
  "experience_years": 6,
  "bio": { "pt": "...", "en": "..." },
  "socials": {
    "github": "https://github.com/...",
    "linkedin": "https://linkedin.com/in/...",
    "medium": "https://medium.com/@...",
    "youtube": "https://youtube.com/@...",
    "twitter": "https://twitter.com/...",
    "email": "contato@..."
  },
  "certifications": ["Expert Angular Developer", "Advanced Angular Workshop"],
  "gde_status": { "pt": "Candidato a GDE em Angular", "en": "GDE Candidate in Angular" }
}
```

### `projects.json`
Pelo menos **6 projetos** mockados. Use os reais do histórico: **UberHub 2.0**, **NASA Space Apps Uberlândia tooling** (matchmaking API + Discord bot), **LoftA4**, **Zephyr**, **MEMO/EloThink**, e um projeto Angular open-source. Cada projeto:

```json
{
  "id": "uberhub-2",
  "slug": "uberhub-2",
  "title": "UberHub 2.0",
  "tagline": { "pt": "...", "en": "..." },
  "description": { "pt": "...", "en": "..." },
  "role": "Tech Lead / Architect",
  "year": 2025,
  "status": "in_development",
  "stack": ["Angular 21", "Python", "Django", "Google Gemini", "Brasil Cloud"],
  "highlights": [{ "pt": "...", "en": "..." }],
  "metrics": { "users": "500+", "performance": "Lighthouse 98", "components": "120+" },
  "links": { "live": "https://...", "github": "https://...", "case_study": "/projects/uberhub-2" },
  "cover_image": "/assets/images/projects/uberhub-cover.webp",
  "gallery": ["..."],
  "color_accent": "#FF6B35",
  "featured": true
}
```

### `articles.json`
Pelo menos **8 artigos** sobre Angular com título, subtítulo, plataforma (Medium / LinkedIn / dev.to), data, tempo de leitura, tags, link externo, thumbnail. Inclua os já planejados: **Angular 22**, **Angular Roadmap**, **Karma/Jasmine vs Jest/Vitest**, **Signals**, **Defer Views**, **Clean Architecture em Angular**.

### `community.json`
NASA Space Apps Uberlândia (Local Lead, edição 2025 com 9 venues), Global Shapers Community (representante do Uberlândia Hub, atuação em 21 hubs brasileiros), GDG Uberlândia (DevFest — maior das Américas). Cada item com role, descrição bilíngue, métricas (participantes, edições, alcance), imagens.

### `speaking.json`
Inclua a palestra paga para **Sicoob Credicitrus** sobre IA. Adicione outros eventos plausíveis (DevFest Uberlândia, Angular meetup, etc.). Cada item: evento, local, data, tema, link de slides/vídeo se houver.

### `stack.json`
Tecnologias agrupadas por categoria. Use ícones do Devicon ou simple-icons via CDN:
- **Core:** Angular, TypeScript, JavaScript, RxJS, Signals
- **Frontend:** React, TailwindCSS, GSAP, Three.js
- **Backend:** Node.js, Python, Django
- **Cloud/DevOps:** AWS, GCP, Docker, CI/CD
- **Tools:** Git, Figma, VS Code, JetBrains

Cada item: nome, ícone, proficiência (1-5), anos de experiência.

### `timeline.json`
Zup Innovation (Itaú Unibanco), Solutis Tecnologias (Santander), Algar Telecom, Angular Money Group. Cada item: empresa, role, período, conquistas-chave, stack usada.

### `i18n/pt.json` e `i18n/en.json`
Todas as strings de UI (labels, CTAs, seções, mensagens, navegação) em ambos idiomas, organizadas por feature.

---

## SEÇÕES DO SITE

### 1. Hero (Home)
- **Background WebGL:** gradient mesh animado com shader customizado (estilo Stripe) OU campo de partículas conectadas em Three.js reagindo ao mouse.
- **Tipografia massiva:** nome em variable font, tamanho `clamp(4rem, 12vw, 12rem)`, com reveal letra por letra via GSAP SplitText.
- **Subtítulo rotativo** entre roles (Angular Architect → GDE Candidate → Community Builder → Tech Speaker) com efeito typewriter ou scramble.
- **Status indicators:** mini-cards flutuantes ("Available for Speaking", "Open to Tech Lead roles", "Writing on Medium") com pulse sutil.
- **Cursor magnético** global.
- **Scroll indicator** customizado na base.

### 2. About
- Layout asymétrico (foto/avatar de um lado, bio do outro).
- **Avatar interativo:** foto com pixelização que se desfaz no hover OU cabeça low-poly 3D que segue o cursor com os olhos.
- **Timeline horizontal** scroll-driven (GSAP ScrollTrigger) com carreira.
- **Stack constellation:** cada tech é um nó, conectado por linhas. Hover destaca conexões. Use Canvas + force-directed simulation.

### 3. Projects
- **Bento grid asymétrico** (cards de tamanhos variados, estilo Apple/Linear).
- Cards com hover state rico: parallax interno, reveal de stack, micro-vídeo em loop se houver.
- **Filtros animados** por tecnologia/ano com GSAP Flip plugin.
- **Página de detalhe** (`/projects/:slug`):
  - Hero do projeto com cor accent do JSON
  - Scroll-driven storytelling (pinned sections, parallax)
  - Métricas animadas (números contam até o valor)
  - Galeria com lightbox custom
  - Stack badges
  - Links live demo, GitHub, case study
  - "Próximo projeto" na base

### 4. Community
- **Mapa interativo do Brasil/mundo** com pins animados (use D3 + TopoJSON ou Leaflet com tile minimalista). Pulse nos hubs ativos.
- Cards grandes para NASA Space Apps, Global Shapers, GDG Uberlândia com métricas.
- **Galeria de eventos** com marquee infinito horizontal (logos/fotos passando).

### 5. Articles
- Lista estilo blog moderno com filtros por plataforma e tags.
- Cards com hover revelando preview.
- Contador de artigos publicados com animação no scroll-in.
- Link externo para cada artigo.

### 6. Speaking
- Timeline vertical de palestras/workshops com filtro por ano.
- Cada item: evento, data, local, tema, links para slides/vídeo.
- CTA "Convide para palestrar" no final.

### 7. Contact
- Form **sem backend**: use `mailto:` com pré-preenchimento OU integre com **Formspree / Web3Forms / Formsubmit** (gratuitos, só precisam de URL pública do endpoint).
- Validação client-side com Reactive Forms + Signals.
- Estados visuais: idle, focus, validating, submitting, success, error.
- Sucesso anima um checkmark SVG desenhando.

---

## FEATURES TRANSVERSAIS

### Tema dark/light
- Toggle no header com **View Transitions API** criando ripple circular expandindo do botão.
- Persiste em `localStorage` via signal effect.
- Respeita `prefers-color-scheme` no primeiro load.
- Design tokens em CSS variables.

### Idioma pt/en
- Switch no header, persiste em `localStorage`.
- Service `I18nService` com signal `currentLang` e método `t(key)` retornando `computed()` da string.
- Pipe `translate`: `{{ 'home.hero.title' | translate }}`.
- Mudança instantânea sem reload.

### Page Transitions
- **View Transitions API nativa** do Angular Router (`withViewTransitions()`).
- Fallback gracioso em browsers sem suporte.
- Transição slide + fade customizada via CSS `::view-transition-*`.

### Custom Cursor
- Componente standalone montado no `AppComponent`.
- Dot pequeno (rápido) + ring grande (lento, lerp).
- Estados: default, hover-link, hover-button, hover-image (com label "view").
- Esconde em dispositivos touch (`@media (pointer: coarse)`).

### Loading Screen Inicial
- Tela enquanto bundle carrega.
- Nome se montando letra por letra + barra de progresso.
- Sai com efeito wipe para cima revelando o hero.

### Easter Eggs
- **Konami code** (↑↑↓↓←→←→BA) ativa modo "developer" com matrix rain de fundo por 10s.
- **Console message** ASCII art com nome + mensagem para devs + email + GitHub.
- **Cmd/Ctrl + K** abre command palette estilo Linear para navegação rápida.

### 404
- Página criativa: foguete perdido no espaço, jogo simples, ou tipografia gigante com glitch.
- Botões "voltar ao início" e "ver projetos".

### Performance & Accessibility
- Imagens WebP/AVIF, `loading="lazy"`, `decoding="async"`, dimensões explícitas (zero CLS).
- Fonts: `font-display: swap`, preload das críticas, subset latin.
- `@defer` em seções below-the-fold (Three.js, mapa, marquees).
- **Reduced motion:** toda animação respeita `prefers-reduced-motion: reduce`.
- Navegação 100% por teclado, focus visível custom, skip links.
- ARIA: labels, landmarks, live regions.
- Lighthouse > 95 em todas as categorias.

### SEO
- `@angular/ssr` com `prerender` em todas as rotas estáticas.
- Meta tags dinâmicas por rota via `SeoService` (title, description, OG, Twitter card).
- `sitemap.xml` e `robots.txt`.
- JSON-LD (Person, BreadcrumbList, Article).

---

## DESIGN SYSTEM

Tokens em `src/styles/tokens.css`:

### Cores
- Background: branco quase puro / preto quase puro (nunca `#000` ou `#fff` exatos).
- Foreground: tons opostos.
- Accent primary: cor vibrante (sugestão `#FF4500` ou `#00D9FF`).
- Accent secondary: complementar.
- Surface, border: variações sutis.
- Contraste mínimo 4.5:1.

### Tipografia
- Display: variable font sans (Inter Variable, Söhne, Geist).
- Body: mesma família ou serif elegante (Fraunces, Newsreader).
- Mono: JetBrains Mono ou Geist Mono para badges técnicos.
- Escala fluida com `clamp()`.

### Espaçamento
- Escala baseada em 8px com fluid spacing via `clamp()`.

### Animações
- Easings: `--ease-out-expo`, `--ease-in-out-cubic`, `--ease-bounce`.
- Durações: `--duration-fast: 200ms`, `--duration-base: 400ms`, `--duration-slow: 800ms`.

---

## EXECUÇÃO EM FASES

Execute em ordem, **commitando ao final de cada fase** com Conventional Commits.

### Fase 1: Setup
- `ng new portfolio --standalone --routing --style=css --ssr`
- Instalar Tailwind 4, GSAP, Three.js
- ESLint, Prettier, strict mode
- Estrutura de pastas
- Design tokens em `tokens.css`
- Commit: `chore: initial project setup with Angular 20, Tailwind 4, GSAP`

### Fase 2: Dados e i18n
- Criar todos os JSONs com conteúdo realista
- `DataService` (fetch + signals)
- `I18nService` + `TranslatePipe`
- `LangSwitcher`
- Commit: `feat: data layer with static JSON and bilingual i18n`

### Fase 3: Layout e tema
- Header (logo "G", nav, lang switcher, theme toggle)
- Footer minimalista
- `ThemeService` com View Transition
- `MagneticCursor` global
- `NoiseOverlay` sutil
- Commit: `feat: layout shell with theme toggle and magnetic cursor`

### Fase 4: Home (Hero)
- WebGL background (Three.js)
- Tipografia massiva com SplitText reveal
- Subtítulo rotativo
- Status cards flutuantes
- Scroll indicator
- Commit: `feat: hero section with WebGL background and animated typography`

### Fase 5: About
- Bio + avatar interativo
- Timeline horizontal scroll-driven
- Stack constellation
- Commit: `feat: about page with timeline and interactive stack visualization`

### Fase 6: Projects
- Bento grid com filtros animados
- Página de detalhe com scroll storytelling
- Métricas animadas
- Commit: `feat: projects showcase with bento grid and detailed case studies`

### Fase 7: Community, Articles, Speaking
- Mapa interativo
- Lista de artigos com filtros
- Timeline de palestras
- Commit: `feat: community, articles and speaking sections`

### Fase 8: Contact + 404 + Easter eggs
- Form (Formspree ou mailto)
- 404 criativa
- Konami, console message, command palette
- Commit: `feat: contact form, custom 404 and easter eggs`

### Fase 9: Polish
- SEO + JSON-LD
- Sitemap + robots
- Otimização de imagens
- Lighthouse audit
- Reduced motion
- Acessibilidade (testes com leitor de tela)
- Commit: `perf: SEO, accessibility and performance optimizations`

### Fase 10: Deploy
- Build SSG (prerender)
- README detalhado
- Configuração Vercel/Cloudflare (`vercel.json` ou `_redirects`)
- Commit: `chore: production build configuration and deploy setup`

---

## CRITÉRIOS DE ACEITAÇÃO

✅ Lighthouse > 95 em Performance, Accessibility, Best Practices, SEO (desktop)
✅ Lighthouse > 90 em Mobile
✅ Conteúdo essencial funciona sem JavaScript (graceful degradation via SSG)
✅ Funciona em Safari, Chrome, Firefox, Edge (últimas 2 versões)
✅ Responsivo de 320px a 4K
✅ `prefers-reduced-motion` desabilita animações pesadas
✅ Navegação 100% por teclado
✅ Bundle inicial < 200KB gzipped (excluindo Three.js defer-loaded)
✅ Build de produção sem warnings
✅ Zero erros no console em produção
✅ Todos os textos em PT e EN
✅ Dados em JSON, sem hardcode nos componentes

---

## ENTREGÁVEIS

1. Repositório Git com histórico limpo (Conventional Commits)
2. README com:
   - Stack e arquitetura
   - Como rodar localmente
   - Como adicionar projeto/artigo (editando JSON)
   - Como fazer deploy
3. Build de produção em `dist/`
4. Screenshots em `docs/screenshots/` de cada seção (light e dark)

---

## INSTRUÇÕES DE EXECUÇÃO

1. Confirme stack e estrutura antes de começar.
2. Execute cada fase em ordem, validando os critérios antes de avançar.
3. Após cada fase, rode `ng build` (sem erros) e `ng lint` (sem warnings).
4. Pergunte antes de adicionar bibliotecas fora da stack.
5. Se algum dado real for necessário (URLs sociais, GitHub username, email), **pergunte ao invés de inventar**.
6. **Nunca use Lorem ipsum ou nomes genéricos** — sempre conteúdo coerente com o perfil do Ghabryel.
7. Todos os dados de domínio (projetos, artigos, comunidades) devem estar em JSON, nunca hardcoded.

Comece pela Fase 1 e me mostre o resultado antes de avançar.
