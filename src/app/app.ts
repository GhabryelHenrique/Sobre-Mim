import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Componente raiz da aplicação
 * Gerencia o roteamento entre Landing Page e Página de Aplicação
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
  styles: []
})
export class App {}
