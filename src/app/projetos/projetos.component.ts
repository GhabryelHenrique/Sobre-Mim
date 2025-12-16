import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';

interface Projeto {
  nome: string;
  descricao: string;
  textoCompleto: string;
  pilares: string[];
  ctaText: string;
  ctaLink: string;
  icone?: string;
  imagemUrl?: string;
}

@Component({
  selector: 'app-projetos',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent],
  templateUrl: './projetos.component.html',
  styleUrls: ['./projetos.component.scss']
})
export class ProjetosComponent {
  projetos: Projeto[] = [
    {
      nome: 'NASA Space Apps Challenge',
      descricao: 'Hackathon global de inovação',
      textoCompleto: `O NASA Space Apps Challenge é um hackathon global organizado pela NASA, focado em resolver
      problemas reais usando dados abertos. Atuei diretamente na organização e desenvolvimento de soluções,
      lidando com trabalho em equipe sob pressão, construção rápida de soluções e uso de tecnologia para impacto real.`,
      pilares: [
        'Engenharia sob pressão',
        'Colaboração em time',
        'Produto com propósito',
        'Tecnologia aplicada a problemas reais'
      ],
      ctaText: 'Ver iniciativa',
      ctaLink: 'https://www.nasaspaceappsuberlandia.com.br/',
      imagemUrl: '/images/nasa-spaceapps-logo.png'
    },
    {
      nome: 'Beyond the Framework',
      descricao: 'Mentoria técnica em desenvolvimento web e carreira',
      textoCompleto: `Beyond the Framework é uma mentoria técnica focada em desenvolvedores que querem sair da superficialidade
      e dominar tecnologias modernas, arquitetura e fundamentos de engenharia frontend.
      Não é curso. É acompanhamento, confronto técnico e desenvolvimento de pensamento sênior.`,
      pilares: [
        'Tecnologias modernas',
        'Arquitetura frontend',
        'Código com intenção',
        'Carreira e tomada de decisão'
      ],
      ctaText: 'Conhecer a mentoria',
      ctaLink: '/mentoria',
      icone: '🎯'
    }
  ];
}
