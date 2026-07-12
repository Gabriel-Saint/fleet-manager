import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { Auth } from '../../services/auth'
import { camposIguaisValidator } from '../../validators/campos-iguais'

@Component({
  selector: 'app-cadastro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Cadastro {
  private auth = inject(Auth)

  protected readonly erro = signal('')
  protected readonly sucesso = signal(false)
  protected readonly salvando = signal(false)
  protected readonly mostrarSenha = signal(false)
  protected readonly mostrarConfirmar = signal(false)

  protected alternarSenha(): void {
    this.mostrarSenha.update(v => !v)
  }

  protected alternarConfirmar(): void {
    this.mostrarConfirmar.update(v => !v)
  }

  protected readonly form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmarSenha: new FormControl('', [Validators.required])
  }, { validators: camposIguaisValidator('senha', 'confirmarSenha') })

  protected cadastrar(): void {
    if (this.form.invalid) return

    this.salvando.set(true)
    const { email, senha } = this.form.value

    this.auth.cadastrar(email!, senha!).subscribe({
      next: ({ error }) => {
        this.salvando.set(false)
        if (error) {
          this.erro.set('Erro ao cadastrar: ' + error.message)
          return
        }
        this.sucesso.set(true)
      }
    })
  }
}
