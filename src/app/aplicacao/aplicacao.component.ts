import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/header/header.component';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';

/**
 * Componente de Aplicação para Mentoria
 *
 * Página de seleção e qualificação de candidatos
 * Formulário com 15 perguntas estratégicas para filtrar
 * e qualificar leads sérios
 */
@Component({
  selector: 'app-aplicacao',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './aplicacao.component.html',
  styleUrl: './aplicacao.component.scss'
})
export class AplicacaoComponent implements OnInit {
  applicationForm!: FormGroup;
  submitted = false;

  // Configurações do EmailJS
  // IMPORTANTE: Substitua esses valores pelas suas credenciais do EmailJS
  private readonly EMAILJS_SERVICE_ID = 'service_0859cbl';
  private readonly EMAILJS_TEMPLATE_ID = 'template_axcsp1q';
  private readonly EMAILJS_PUBLIC_KEY = 'STw83Xl7tvt9ybEqv';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Inicializa o formulário com todas as 15 perguntas
   * Validações estratégicas para filtrar candidatos não qualificados
   */
  private initForm(): void {
    this.applicationForm = this.fb.group({
      // BLOCO 1 - Identificação
      nomeCompleto: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      whatsapp: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],

      // BLOCO 2 - Contexto Profissional
      nivelAtual: ['', Validators.required],
      trabalhaAtualmente: ['', Validators.required],
      tempoExperiencia: ['', Validators.required],

      // BLOCO 3 - Contexto Técnico
      experienciaAngular: ['', Validators.required],
      descricaoProjeto: ['', [Validators.required, Validators.minLength(50)]],
      maiorDificuldade: ['', [Validators.required, Validators.minLength(50)]],

      // BLOCO 4 - Objetivo e Comprometimento
      objetivoTresMeses: ['', [Validators.required, Validators.minLength(50)]],
      tempoDisponivel: ['', Validators.required],
      aceitaFeedback: ['', Validators.required],

      // BLOCO 5 - Investimento
      cienteInvestimento: ['', Validators.required],
      condicoesInvestir: ['', Validators.required],

      // BLOCO 6 - Pergunta Final
      porqueDeveSerAceito: ['', [Validators.required, Validators.minLength(100)]]
    });
  }

  /**
   * Getter para facilitar acesso aos controles do formulário
   */
  get f() {
    return this.applicationForm.controls;
  }

  /**
   * Valida se o candidato passa nos filtros automáticos
   * Retorna true se for reprovação automática
   */
  isAutoReject(): boolean {
    const form = this.applicationForm.value;

    // Filtros de reprovação automática
    if (form.experienciaAngular === 'nunca') return true;
    if (form.aceitaFeedback === 'nao') return true;
    if (form.condicoesInvestir === 'nao') return true;
    if (form.tempoDisponivel === 'menos2h') return true;
    if (form.cienteInvestimento === 'nao') return true;

    return false;
  }

  /**
   * Submete o formulário
   * Em produção, enviaria para API/Google Forms/Email
   */
  onSubmit(): void {
    this.submitted = true;

    if (this.applicationForm.invalid) {
      // Scroll para o primeiro erro
      const firstError = document.querySelector('.form-control.ng-invalid');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Verificar filtros automáticos
    if (this.isAutoReject()) {
      Swal.fire({
        icon: 'warning',
        title: 'Perfil Não Alinhado',
        text: 'Infelizmente, seu perfil não está alinhado com os requisitos da mentoria no momento.',
        confirmButtonText: 'Entendi',
        confirmButtonColor: '#6366f1'
      });
      return;
    }

    // Enviar email via EmailJS
    this.sendEmail();
  }

  /**
   * Envia email com os dados do formulário via EmailJS
   */
  private async sendEmail(): Promise<void> {
    try {
      // Mostrar loading
      Swal.fire({
        title: 'Enviando...',
        text: 'Aguarde enquanto processamos sua aplicação.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const formData = this.applicationForm.value;

      // Preparar os dados para o template do EmailJS
      const templateParams = {
        to_email: 'ghabryelcode@gmail.com',
        from_name: formData.nomeCompleto,
        from_email: formData.email,
        whatsapp: formData.whatsapp,
        nivel_atual: this.getLabelNivelAtual(formData.nivelAtual),
        trabalha_atualmente: formData.trabalhaAtualmente === 'sim' ? 'Sim' : 'Não',
        tempo_experiencia: this.getLabelTempoExperiencia(formData.tempoExperiencia),
        experiencia_angular: this.getLabelExperienciaAngular(formData.experienciaAngular),
        descricao_projeto: formData.descricaoProjeto,
        maior_dificuldade: formData.maiorDificuldade,
        objetivo_tres_meses: formData.objetivoTresMeses,
        tempo_disponivel: this.getLabelTempoDisponivel(formData.tempoDisponivel),
        aceita_feedback: formData.aceitaFeedback === 'sim' ? 'Sim' : 'Não',
        ciente_investimento: formData.cienteInvestimento === 'sim' ? 'Sim' : 'Não',
        condicoes_investir: formData.condicoesInvestir === 'sim' ? 'Sim' : 'Não',
        porque_deve_ser_aceito: formData.porqueDeveSerAceito
      };

      // Enviar email via EmailJS
      await emailjs.send(
        this.EMAILJS_SERVICE_ID,
        this.EMAILJS_TEMPLATE_ID,
        templateParams,
        this.EMAILJS_PUBLIC_KEY
      );

      // Sucesso
      Swal.fire({
        icon: 'success',
        title: 'Aplicação Enviada!',
        text: 'Sua aplicação foi enviada com sucesso! Entraremos em contato em até 48h.',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#6366f1'
      });

      this.applicationForm.reset();
      this.submitted = false;

    } catch (error) {
      console.error('Erro ao enviar email:', error);

      // Erro
      Swal.fire({
        icon: 'error',
        title: 'Erro ao Enviar',
        text: 'Ocorreu um erro ao enviar sua aplicação. Por favor, tente novamente ou entre em contato diretamente.',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#6366f1'
      });
    }
  }

  /**
   * Métodos auxiliares para converter valores do form em labels legíveis
   */
  private getLabelNivelAtual(valor: string): string {
    const labels: { [key: string]: string } = {
      'junior': 'Júnior',
      'pleno': 'Pleno',
      'senior': 'Sênior',
      'estudante': 'Estudante'
    };
    return labels[valor] || valor;
  }

  private getLabelTempoExperiencia(valor: string): string {
    const labels: { [key: string]: string } = {
      'menos1ano': 'Menos de 1 ano',
      '1a3anos': '1 a 3 anos',
      '3a5anos': '3 a 5 anos',
      'mais5anos': 'Mais de 5 anos'
    };
    return labels[valor] || valor;
  }

  private getLabelExperienciaAngular(valor: string): string {
    const labels: { [key: string]: string } = {
      'nunca': 'Nunca usei',
      'basico': 'Básico (tutoriais, cursos)',
      'intermediario': 'Intermediário (já fiz projetos)',
      'avancado': 'Avançado (uso profissionalmente)'
    };
    return labels[valor] || valor;
  }

  private getLabelTempoDisponivel(valor: string): string {
    const labels: { [key: string]: string } = {
      'menos2h': 'Menos de 2h por semana',
      '2a5h': '2 a 5 horas por semana',
      '5a10h': '5 a 10 horas por semana',
      'mais10h': 'Mais de 10 horas por semana'
    };
    return labels[valor] || valor;
  }

  /**
   * Verifica se um campo específico tem erro
   */
  hasError(fieldName: string): boolean {
    const field = this.applicationForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.submitted));
  }

  /**
   * Retorna mensagem de erro para um campo
   */
  getErrorMessage(fieldName: string): string {
    const field = this.applicationForm.get(fieldName);

    if (!field) return '';

    if (field.hasError('required')) {
      return 'Este campo é obrigatório';
    }

    if (field.hasError('email')) {
      return 'Digite um e-mail válido';
    }

    if (field.hasError('minlength')) {
      const minLength = field.getError('minlength').requiredLength;
      return `Mínimo de ${minLength} caracteres`;
    }

    if (field.hasError('pattern')) {
      return 'Formato inválido (use apenas números com DDD)';
    }

    return '';
  }
}
