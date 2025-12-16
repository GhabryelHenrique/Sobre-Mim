import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-sobre',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent],
  templateUrl: './sobre.component.html',
  styleUrls: ['./sobre.component.scss']
})
export class SobreComponent {
  socialLinks = [
    {
      icon: 'fa-brands fa-youtube',
      text: 'Se inscreve no meu canal do YouTube',
      url: 'https://www.youtube.com/@NgGhab/',
      platform: 'youtube'
    },
    {
      icon: 'fa-brands fa-linkedin',
      text: 'Me siga no LinkedIn',
      url: 'https://www.linkedin.com/in/ghabryelhenrique/',
      platform: 'linkedin'
    },
    {
      icon: 'fa-brands fa-github',
      text: 'Veja meus projetos no GitHub',
      url: 'https://github.com/GhabryelHenrique',
      platform: 'github'
    },
    {
      icon: 'fa-solid fa-envelope',
      text: 'Entre em contato',
      url: 'mailto:contato@example.com',
      platform: 'email'
    }
  ];
}
