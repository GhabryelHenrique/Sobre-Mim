import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';

/**
 * Componente da Landing Page Principal
 * Primeira página de contato com potenciais alunos
 */
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, HeaderComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {}
