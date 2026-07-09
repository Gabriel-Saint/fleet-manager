import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { Auth } from '../../services/auth'

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
  private auth = inject(Auth)
  private router = inject(Router)

  protected readonly erro = signal('')

  protected readonly form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [Validators.required, Validators.minLength(6)])
  })

  protected entrar(): void {
    if (this.form.invalid) return

    const { email, senha } = this.form.value

    this.auth.login(email!, senha!).subscribe({
      next: ({ error }) => {
        if (error) {
          this.erro.set('E-mail ou senha inválidos')
          return
        }
        this.auth.usuarioLogado.set(true)
        this.router.navigate(['/veiculos'])
      }
    })
  }
}