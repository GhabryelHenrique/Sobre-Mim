import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-sobre',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent],
  templateUrl: './sobre.component.html',
  styleUrls: ['./sobre.component.scss'],
})
export class SobreComponent {
  socialLinks = [
    {
      icon: 'fa-brands fa-youtube',
      text: 'Se inscreve no meu canal do YouTube',
      url: 'https://www.youtube.com/@NgGhab/',
      platform: 'youtube',
    },
    {
      icon: 'fa-brands fa-linkedin',
      text: 'Me siga no LinkedIn',
      url: 'https://www.linkedin.com/in/ghabryelhenrique/',
      platform: 'linkedin',
    },
    {
      icon: 'fa-brands fa-github',
      text: 'Veja meus projetos no GitHub',
      url: 'https://github.com/GhabryelHenrique',
      platform: 'github',
    },
    {
      icon: 'fa-solid fa-envelope',
      text: 'Entre em contato',
      url: 'mailto:contato@example.com',
      platform: 'email',
    },
  ];

  experiences = [
    {
      company: 'Solutis Tecnologias',
      logo: '/images/empresas/solutis.png',
      position: 'Sênior Software Engineer',
      period: 'novembro de 2025 - Present (2 meses)',
      location: 'Brasil',
      description: [
        'Atuo como engenheiro responsável pela evolução e confiabilidade do sistema global de Controle de Acesso de Facilities do Santander, plataforma crítica que gerencia a autorização e segurança física de colaboradores, fornecedores e visitantes em unidades do banco no Brasil e em operações internacionais.',
        'No dia a dia, entrego soluções que reduzem riscos operacionais, aumentam a rastreabilidade e garantem conformidade com padrões de segurança corporativa. Trabalho com arquitetura escalável, integração entre serviços, melhoria contínua de performance e automação de processos de acesso global.',
      ],
      highlights: [
        'Modernização e estabilização de módulos críticos do sistema de acesso físico',
        'Implementação de melhorias arquiteturais para aumentar confiabilidade e tempo de resposta',
        'Desenvolvimento de integrações seguras entre serviços internos e plataformas globais do banco',
        'Redução de falhas operacionais por meio de automação, testes e observabilidade',
        'Suporte técnico de alto nível para times de segurança e operação em ambiente corporativo de grande escala',
      ],
    },
    {
      company: 'Zup Innovation',
      logo: '/images/empresas/zup.png',
      position: 'Desenvolvedor Frontend II',
      period: 'março de 2024 - setembro de 2025 (1 ano 7 meses)',
      location: 'Uberlândia, Minas Gerais, Brasil',
      description: [
        'Atuando como Desenvolvedor Frontend Sênior na modernização do sistema bancário, liderei o desenvolvimento de módulos em uma arquitetura de microfrontends com Angular 17 e Standalone Components.',
        'Fui responsável por criar soluções de alta performance web, com foco em Core Web Vitals, e garantir a acessibilidade (WCAG). Utilizei RxJS para gerenciamento de estado complexo e participei ativamente de code reviews e mentorias técnicas para a equipe, seguindo as Metodologias Ágeis (Scrum).',
      ],
      highlights: [],
    },
    {
      company: 'Algar Telecom',
      logo: '/images/empresas/algar.png',
      position: 'Analista de tecnologia',
      period: 'janeiro de 2024 - abril de 2024 (4 meses)',
      location: 'Uberlândia, Minas Gerais, Brasil',
      description: [
        'Desenvolvimento e manutenção de plataformas de telecomunicações, com foco principal em Java e middleware orientado a mensagens.',
        'As responsabilidades incluem automatizar processos como migrações de planos móveis usando Python, convertendo scripts PL/SQL, garantindo transições suaves e minimizando o tempo de inatividade.',
        'Além disso, a função envolve solução de problemas e otimização de sistemas existentes para melhor desempenho e escalabilidade. Uma responsabilidade fundamental é orientar e treinar novos estagiários, fornecer orientação técnica e apoiar sua integração para ajudá-los a integrar-se rapidamente à equipe e contribuir para projetos em andamento.',
      ],
      highlights: [],
    },
    {
      company: 'Angular Money Group',
      logo: '/images/empresas/amg.png',
      position: 'Engenheiro de Software Full Stack III',
      period: 'janeiro de 2021 - janeiro de 2024 (3 anos)',
      location: 'Uberlândia, Minas Gerais, Brazil',
      description: [
        'Desenvolvimento e manutenção de projetos Internos como um sistema de gestão de fluxo de caixa e fluxo de estoque para pequenos e grande negócios utilizando NodeJS com express e MongoDB para backend e Angular como Front-End e testes unitários com Karma e Jasmine.',
        'Desenvolvimento e manutenção de projetos de projetos externos como sistema de logística para transportadoras marítimas, desenvolvimento de ficha de cadastro para pessoas do setor bancário e utilizando a metodologia SCRUM para realizar o desenvolvimento, para devops foi utilizado o Azure DevOps para realizar as atividades e Angular como framework Front-End.',
        'Gestão de equipes de desenvolvimento dar suporte a desenvolvedores juniors, corrigindo bugs e fazendo code review para aprimorar e capacitar a equipe.',
      ],
      highlights: [],
    },
  ];

  volunteer = [
    {
      organization: 'Global Shapers Community Uberlândia',
      logo: '/images/voluntário/gsc.png',
      position: 'Global Shaper',
      period: 'mar de 2025 - até o momento',
      category: 'Direitos civis e ações sociais',
      description:
        'Como membro da Global Shapers Community, iniciativa do Fórum Econômico Mundial, atuo junto a jovens líderes globais para catalisar mudanças locais com alcance internacional. Nosso hub Uberlândia foca em combate à desigualdade, inovação cívica, combinando ação prática com advocacy em fóruns de impacto. Acredito no poder da juventude para reimaginar sistemas e construir futuros mais justos e sustentáveis.',
    },
    {
      organization: 'UberHub',
      logo: '/images/voluntário/uberhub.png',
      position: 'Membro do Ecossistema',
      period: 'jan de 2023 - até o momento',
      category: 'Ciência e tecnologia',
      description:
        'Como voluntário no Uberhub, o principal ecossistema de inovação e empreendedorismo de Uberlândia, atuei ativamente no fortalecimento da comunidade local. Minhas contribuições incluíram o apoio na organização e execução de eventos, workshops e meetups que conectam startups, empresas, investidores e talentos. Fiz parte de um time dedicado a fomentar a cultura de inovação, facilitar o networking entre os membros e divulgar oportunidades que aceleram o desenvolvimento tecnológico e de negócios na região.',
    },
    {
      organization: 'Nasa Space Apps',
      logo: '/images/voluntário/nasaSpaceApps.png',
      position: 'CTO',
      period: 'ago de 2025 - até o momento',
      category: 'Ciência e tecnologia',
      description:
        'Atuei no desenvolvimento tecnológico do hackathon, contribuindo para a criação do site de inscrição dos participantes e para o sistema de matchmaking, que conectava pessoas com habilidades complementares para a formação de equipes. Esse trabalho possibilitou maior engajamento, organização e colaboração entre os inscritos, potencializando a experiência e os resultados do evento.',
    },
  ];
}
