import { Routes } from '@angular/router';
import { AplicacaoComponent } from './aplicacao/aplicacao.component';

export const routes: Routes = [
  {
    path: '',
    title: 'Ghabryel Henrique | Engenheiro de Software Sênior',
    loadComponent: () => import('./sobre/sobre.component').then(m => m.SobreComponent)
  },
  {
    path: 'mentoria',
    title: 'Beyond the Framework | Mentoria Profissional',
    loadComponent: () => import('./landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'projetos',
    title: 'Projetos | Ghabryel Henrique',
    loadComponent: () => import('./projetos/projetos.component').then(m => m.ProjetosComponent)
  },
  {
    path: 'palestras',
    title: 'Palestras | Ghabryel Henrique',
    loadComponent: () => import('./palestras/palestras').then(m => m.PalestrasComponent)
  },
  {
    path: 'posts',
    title: 'Posts | Ghabryel Henrique',
    loadComponent: () => import('./posts/posts.component').then(m => m.PostsComponent)
  },
  {
    path: 'aplicacao',
    title: 'Aplicação | Beyond the Framework',
    component: AplicacaoComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
