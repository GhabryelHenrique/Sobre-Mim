import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import * as livros from '../../../public/livros.json';
interface Livro {
  titulo: string;
  autor: string;
  descricao: string;
  imagemCapa: string;
  linkAmazon: string;
  nivel: 'iniciante' | 'junior' | 'pleno' | 'senior' | 'empreendedorismo';
}

@Component({
  selector: 'app-livros',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './livros.component.html',
  styleUrl: './livros.component.scss',
})
export class LivrosComponent implements OnInit {
  affiliateId = 'ghabryeldev-20';
  affiliateLink = 'https://amzn.to/3KRPI5K';
  livros: Livro[] = (livros as any).default;
  livrosIniciantes: Livro[] = [];
  livrosJuniores: Livro[] = [];
  livrosPlenos: Livro[] = [];
  livrosSeniores: Livro[] = [];
  livrosEmpreendedorismo: Livro[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    console.log('Livros carregados:', this.livros);
    console.log('Total de livros:', this.livros.length);

    this.livrosIniciantes = this.livros.filter((livro) => livro.nivel === 'iniciante');
    this.livrosJuniores = this.livros.filter((livro) => livro.nivel === 'junior');
    this.livrosPlenos = this.livros.filter((livro) => livro.nivel === 'pleno');
    this.livrosSeniores = this.livros.filter((livro) => livro.nivel === 'senior');
    this.livrosEmpreendedorismo = this.livros.filter((livro) => livro.nivel === 'empreendedorismo');

    console.log('Iniciantes:', this.livrosIniciantes.length, this.livrosIniciantes);
    console.log('Juniores:', this.livrosJuniores.length, this.livrosJuniores);
    console.log('Plenos:', this.livrosPlenos.length, this.livrosPlenos);
    console.log('Seniores:', this.livrosSeniores.length, this.livrosSeniores);
    console.log(
      'Empreendedorismo:',
      this.livrosEmpreendedorismo.length,
      this.livrosEmpreendedorismo
    );
  }

  getNivelLabel(nivel: string): string {
    const labels: { [key: string]: string } = {
      iniciante: 'Iniciantes',
      junior: 'Desenvolvedores Júnior',
      pleno: 'Desenvolvedores Pleno',
      senior: 'Desenvolvedores Sênior',
      empreendedorismo: 'Empreendedorismo',
    };
    return labels[nivel] || nivel;
  }

  getNivelDescription(nivel: string): string {
    const descriptions: { [key: string]: string } = {
      iniciante: 'Livros fundamentais para quem está começando a jornada na programação',
      junior: 'Aprimore suas habilidades e aprenda padrões essenciais de desenvolvimento',
      pleno: 'Evolua para arquiteturas complexas e design de sistemas distribuídos',
      senior: 'Domine sistemas complexos, liderança técnica e decisões arquiteturais',
      empreendedorismo: 'Desenvolva habilidades para criar, gerir e escalar negócios de tecnologia',
    };
    return descriptions[nivel] || '';
  }

  getNivelBadge(nivel: string): string {
    const badges: { [key: string]: string } = {
      iniciante: '📚 Fundamentos',
      junior: '🚀 Evolução',
      pleno: '🏗️ Arquitetura',
      senior: '⚡ Maestria',
      empreendedorismo: '💼 Negócios',
    };
    return badges[nivel] || nivel;
  }
}
