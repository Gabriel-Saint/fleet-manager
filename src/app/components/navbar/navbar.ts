import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { Auth } from '../../services/auth'

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Navbar {
  private auth = inject(Auth)
  private router = inject(Router)

  protected readonly logado = this.auth.usuarioLogado

  protected sair(): void {
    this.auth.logout().subscribe({
      next: () => {
        this.auth.usuarioLogado.set(false)
        this.router.navigate(['/login'])
      }
    })
  }
}
