import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Signal para gerenciar o estado do tema
  theme = signal<Theme>(this.getInitialTheme());

  constructor() {
    // Effect para aplicar o tema quando ele mudar
    effect(() => {
      const currentTheme = this.theme();
      this.applyTheme(currentTheme);
      this.saveTheme(currentTheme);
    });
  }

  /**
   * Alterna entre dark e light theme
   */
  toggleTheme(): void {
    this.theme.update(current => current === 'dark' ? 'light' : 'dark');
  }

  /**
   * Define um tema específico
   */
  setTheme(theme: Theme): void {
    this.theme.set(theme);
  }

  /**
   * Obtém o tema inicial do localStorage ou usa dark como padrão
   */
  private getInitialTheme(): Theme {
    if (typeof window === 'undefined') {
      return 'dark';
    }

    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }

    // Verifica preferência do sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  /**
   * Aplica o tema ao documento
   */
  private applyTheme(theme: Theme): void {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;
    root.setAttribute('data-theme', theme);

    // Remove a classe anterior e adiciona a nova
    root.classList.remove('theme-dark', 'theme-light');
    root.classList.add(`theme-${theme}`);
  }

  /**
   * Salva o tema no localStorage
   */
  private saveTheme(theme: Theme): void {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.setItem('theme', theme);
  }
}
