import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-palestras',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './palestras.html',
  styleUrl: './palestras.scss',
})
export class PalestrasComponent {
  palestras = [
    {
      title: 'Decifrando a Carreira de TI: Carreiras Técnicas vs. Gestão',
      image: '/images/palestras/unitri.jpg',
      institution: 'Unitri - Faculdade',
      date: '17/02/2025',
      time: '19h',
      local: 'Unitri',
      description:
        'Palestra sobre as diferenças entre carreiras técnicas (frontend, backend, QA) e de gestão (tech lead, gerente de projetos, CTO), ajudando participantes a descobrir qual caminho combina mais com seu perfil e como se preparar para o mercado de trabalho.',
      topics: [
        'Entender as diferenças entre carreiras técnicas e de gestão',
        'Descobrir qual caminho combina mais com o seu perfil',
        'Aprender dicas práticas para se preparar para o mercado de trabalho',
        'Conhecer histórias inspiradoras de quem já trilhou esses caminhos',
      ],
      tags: ['Carreira', 'TI', 'Gestão', 'Desenvolvimento'],
      isGratuitous: true,
      eventPhotos: [
        '/images/palestras/unitri/CD3B0E1D-CBDA-47EE-A2DF-CF89A4A067F4.jpg',
        '/images/palestras/unitri/IMG_0719.PNG',
        '/images/palestras/unitri/IMG_0715.jpg',
        '/images/palestras/unitri/IMG_0716.jpg',
        '/images/palestras/unitri/IMG_0717.jpg',
      ],
    },
    {
      title: 'Build with AI - Imersão Gemini',
      subtitle: 'Desenvolva Aplicações com GenAI e Transforme sua Carreira',
      image: '/images/palestras/build-with-AI.jpg',
      institution: 'GDG Uberlândia',
      date: '12/07/2025',
      time: '08h às 12h',
      local: 'UNA - Sala de metodologias ativas',
      description:
        'Workshop prático sobre Inteligência Artificial Generativa com foco no Gemini, a plataforma de IA do Google. Uma imersão completa para desenvolvedores que querem aprender a criar aplicações com GenAI.',
      topics: [
        'Aprenda os fundamentos da GenAI e LLMs',
        'Desenvolva uma aplicação com Gemini',
        'Descubra como a IA pode impulsionar sua carreira',
      ],
      tags: ['IA', 'Gemini', 'GenAI', 'Google', 'Workshop'],
      isGratuitous: true,
      hasLimitedSeats: true,
      requirements: ['Leve seu notebook'],
      certificate: true,
      eventPhotos: [
        '/images/palestras/build-with-AI/66efca33-b9be-46de-8d89-172ec1fdd004.jpg',
        '/images/palestras/build-with-AI/fff717fe-b57a-4023-af53-b1082c032edb.jpg',
        '/images/palestras/build-with-AI/IMG_1346.jpg',
        '/images/palestras/build-with-AI/IMG_1347.jpg',
        '/images/palestras/build-with-AI/IMG_1348.jpg',
        '/images/palestras/build-with-AI/IMG_1349.jpg',
        '/images/palestras/build-with-AI/IMG_1350.jpg',
        '/images/palestras/build-with-AI/IMG_1351.jpg',
        '/images/palestras/build-with-AI/IMG_1352.jpg',
        '/images/palestras/build-with-AI/IMG_1353.jpg',
        '/images/palestras/build-with-AI/IMG_1354.jpg',
        '/images/palestras/build-with-AI/IMG_1355.jpg',
        '/images/palestras/build-with-AI/IMG_1356.jpg',
        '/images/palestras/build-with-AI/IMG_1357.jpg',
        '/images/palestras/build-with-AI/IMG_1358.jpg',
      ],
    },
  ];

  selectedPalestra: any = null;
  currentPhotoIndex = 0;

  openGallery(palestra: any) {
    if (palestra.eventPhotos && palestra.eventPhotos.length > 0) {
      this.selectedPalestra = palestra;
      this.currentPhotoIndex = 0;
    }
  }

  closeGallery() {
    this.selectedPalestra = null;
    this.currentPhotoIndex = 0;
  }

  nextPhoto() {
    if (this.selectedPalestra && this.selectedPalestra.eventPhotos) {
      this.currentPhotoIndex =
        (this.currentPhotoIndex + 1) % this.selectedPalestra.eventPhotos.length;
    }
  }

  prevPhoto() {
    if (this.selectedPalestra && this.selectedPalestra.eventPhotos) {
      this.currentPhotoIndex =
        this.currentPhotoIndex === 0
          ? this.selectedPalestra.eventPhotos.length - 1
          : this.currentPhotoIndex - 1;
    }
  }

  getCurrentPhoto() {
    return this.selectedPalestra?.eventPhotos[this.currentPhotoIndex];
  }
}
