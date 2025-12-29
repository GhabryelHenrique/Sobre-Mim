import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/header/header.component';

interface Post {
  titulo: string;
  descricao: string;
  dataPublicacao: string;
  url: string;
  imagemCapa?: string;
  categorias: string[];
}

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent {
  posts: Post[] = [
    {
      titulo: 'Angular 21: A Nova Era do Framework Mais Amado do Google',
      descricao: 'Uma análise completa das novidades, features experimentais e o futuro do Angular',
      dataPublicacao: 'Dezembro 27, 2025',
      url: 'https://ghabryel.medium.com/angular-21-a-nova-era-do-framework-mais-amado-do-google-91034bf22fbb',
      imagemCapa: 'https://cdn-images-1.medium.com/max/860/0*YXiyvkjfkoWqRcSt',
      categorias: ['web-development', 'angular', 'accessibility', 'typescript', 'frontend']
    },
    {
      titulo: 'Clean Architecture no Angular: Princípios, Implementação e Trade-offs',
      descricao: 'Aplicando separação de responsabilidades para construir sistemas testáveis e manuteníveis',
      dataPublicacao: 'Dezembro 23, 2025',
      url: 'https://ghabryel.medium.com/clean-architecture-no-angular-princípios-implementação-e-trade-offs-aa3b449b8926',
      imagemCapa: 'https://cdn-images-1.medium.com/max/1024/1*7d62HhJPNdYUhuadY5HToA.png',
      categorias: ['clean-code', 'clean-architecture', 'angular', 'front-end-development', 'web-development']
    },
    {
      titulo: 'Defer Views: Granular Lazy Loading in Angular',
      descricao: 'Master @defer for intelligent loading, advanced triggers, strategic prefetching, and Core Web Vitals optimization',
      dataPublicacao: 'Dezembro 23, 2025',
      url: 'https://ghabryel.medium.com/defer-views-granular-lazy-loading-in-angular-f72fc40bff60',
      imagemCapa: 'https://cdn-images-1.medium.com/max/1024/1*SzLIiJaBm0Ki-VwRXj77bA.png',
      categorias: ['web-development', 'google', 'web', 'angular']
    },
    {
      titulo: 'Angular Control Flow: @if, @for, @switch',
      descricao: 'Domine a nova sintaxe de template que está revolucionando a forma como escrevemos Angular',
      dataPublicacao: 'Dezembro 12, 2025',
      url: 'https://ghabryel.medium.com/angular-control-flow-if-for-switch-fb23f24832fb',
      imagemCapa: 'https://cdn-images-1.medium.com/max/1024/1*adgeuifi1Iv9EUq5Pw3hXA.jpeg',
      categorias: ['google', 'front-end-development', 'architecture', 'web-development', 'angular']
    },
    {
      titulo: 'Nx Monorepo para Aplicações Angular Enterprise: O Guia Completo',
      descricao: 'Domine workspace setup, affected commands, caching inteligente e CI/CD para escalar suas aplicações Angular',
      dataPublicacao: 'Dezembro 10, 2025',
      url: 'https://ghabryel.medium.com/nx-monorepo-para-aplicações-angular-enterprise-o-guia-completo-361d17c886b0',
      categorias: ['angular', 'nx', 'monorepo', 'enterprise', 'devops']
    },
    {
      titulo: 'Angular Signals: O Guia Definitivo para Reatividade de Alta Performance',
      descricao: 'Uma imersão profunda no sistema de reatividade que está transformando o Angular',
      dataPublicacao: 'Dezembro 7, 2025',
      url: 'https://ghabryel.medium.com/angular-signals-o-guia-definitivo-para-reatividade-de-alta-performance-2f4cabed63a6',
      categorias: ['angular', 'signals', 'reatividade', 'performance', 'web-development']
    },
    {
      titulo: 'Como Criar uma Biblioteca Angular e Publicar no NPM: Guia Completo',
      descricao: 'Você já se pegou copiando e colando os mesmos componentes entre projetos Angular? Ou desejou compartilhar aquele conjunto incrível de componentes?',
      dataPublicacao: 'Dezembro 1, 2025',
      url: 'https://ghabryel.medium.com/como-criar-uma-biblioteca-angular-e-publicar-no-npm-guia-completo-6dfbe01ea093',
      categorias: ['angular', 'npm', 'library', 'open-source', 'web-development']
    },
    {
      titulo: 'Do Zero à Plataforma de IA Multi-Agente',
      descricao: 'Um Guia Completo com Gemini, NestJS e Angular',
      dataPublicacao: 'Junho 28, 2024',
      url: 'https://ghabryel.medium.com/do-zero-à-plataforma-de-ia-multi-agente-63b9ccff5032',
      categorias: ['ai', 'gemini', 'nestjs', 'angular', 'multi-agent']
    },
    {
      titulo: 'Produtividade 24/7: Como Utilizar Agents de IA para Otimizar Tarefas e Atendimento ao Cliente',
      descricao: 'Imagine poder contar com uma equipe virtual altamente eficiente trabalhando 24 horas por dia sem interrupções, realizando desde tarefas complexas até atendimento ao cliente',
      dataPublicacao: 'Junho 18, 2024',
      url: 'https://ghabryel.medium.com/produtividade-24-7-como-utilizar-agents-de-ia-para-otimizar-tarefas-e-atendimento-ao-cliente-8c0678c1dfae',
      categorias: ['ai', 'productivity', 'automation', 'customer-service', 'agents']
    }
  ];

  abrirPost(url: string): void {
    window.open(url, '_blank');
  }
}
