import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Ghabryel Henrique | Senior Software Engineer & Angular GDE Candidate',
    loadComponent: () => import('./sobre/sobre.component').then(m => m.SobreComponent)
  },
  {
    path: 'mentoria',
    title: 'Beyond the Framework | Mentoria Técnica — Ghabryel Henrique',
    loadComponent: () => import('./landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'projetos',
    title: 'Projetos | Ghabryel Henrique',
    loadComponent: () => import('./projetos/projetos.component').then(m => m.ProjetosComponent)
  },
  {
    path: 'projetos/:slug',
    title: 'Projeto | Ghabryel Henrique',
    loadComponent: () => import('./projetos/projetos-detail.component').then(m => m.ProjetosDetailComponent)
  },
  {
    path: 'palestras',
    title: 'Palestras & Workshops | Ghabryel Henrique',
    loadComponent: () => import('./palestras/palestras').then(m => m.PalestrasComponent)
  },
  {
    path: 'posts',
    title: 'Artigos | Ghabryel Henrique',
    loadComponent: () => import('./posts/posts.component').then(m => m.PostsComponent)
  },
  {
    path: 'livros',
    title: 'Livros Recomendados | Ghabryel Henrique',
    loadComponent: () => import('./livros/livros.component').then(m => m.LivrosComponent)
  },
  {
    path: 'setup',
    title: 'Setup do Dev | Ghabryel Henrique',
    loadComponent: () => import('./setup/setup').then(m => m.SetupComponent)
  },
  {
    path: 'comunidade',
    title: 'Comunidade | Ghabryel Henrique',
    loadComponent: () => import('./features/community/community.component').then(m => m.CommunityComponent)
  },
  {
    path: 'contato',
    title: 'Contato | Ghabryel Henrique',
    loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'aplicacao',
    title: 'Aplicação | Beyond the Framework',
    loadComponent: () => import('./aplicacao/aplicacao.component').then(m => m.AplicacaoComponent)
  },
  {
    path: '**',
    title: '404 | Ghabryel Henrique',
    loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
