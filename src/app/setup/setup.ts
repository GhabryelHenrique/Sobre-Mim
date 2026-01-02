import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HeaderComponent } from '../shared/header/header.component';
import * as setupData from '../../../public/setup.json';

interface SetupItem {
  nome: string;
  categoria: 'hardware' | 'perifericos' | 'software' | 'acessorios';
  descricao: string;
  imagem?: string;
  link?: string;
  especificacoes?: string[];
}

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './setup.html',
  styleUrl: './setup.scss',
})
export class SetupComponent implements OnInit {
  setupItems: SetupItem[] = (setupData as any).default || [];
  hardwareItems: SetupItem[] = [];
  perifericosItems: SetupItem[] = [];
  softwareItems: SetupItem[] = [];
  acessoriosItems: SetupItem[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.hardwareItems = this.setupItems.filter((item) => item.categoria === 'hardware');
    this.perifericosItems = this.setupItems.filter((item) => item.categoria === 'perifericos');
    this.softwareItems = this.setupItems.filter((item) => item.categoria === 'software');
    this.acessoriosItems = this.setupItems.filter((item) => item.categoria === 'acessorios');
  }

  getCategoriaLabel(categoria: string): string {
    const labels: { [key: string]: string } = {
      hardware: 'Hardware',
      perifericos: 'Periféricos',
      software: 'Software & Ferramentas',
      acessorios: 'Acessórios',
    };
    return labels[categoria] || categoria;
  }

  getCategoriaDescription(categoria: string): string {
    const descriptions: { [key: string]: string } = {
      hardware: 'Componentes principais do meu computador para desenvolvimento e criação de conteúdo',
      perifericos: 'Dispositivos de entrada e saída que uso no dia a dia',
      software: 'Ferramentas e aplicativos essenciais para produtividade e desenvolvimento',
      acessorios: 'Itens complementares que melhoram minha experiência de trabalho',
    };
    return descriptions[categoria] || '';
  }

  getCategoriaBadge(categoria: string): string {
    const badges: { [key: string]: string } = {
      hardware: '💻 Hardware',
      perifericos: '⌨️ Periféricos',
      software: '🛠️ Software',
      acessorios: '🎧 Acessórios',
    };
    return badges[categoria] || categoria;
  }
}
