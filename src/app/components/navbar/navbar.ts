import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
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

  protected readonly marca = signal('FleetManager')
  protected readonly logado = this.auth.usuarioLogado

  protected sair(): void {
    this.auth.logout().subscribe({
      next: () => this.deslogarLocalmente(),
      error: () => this.deslogarLocalmente()
    })
  }

  private deslogarLocalmente(): void {
    this.auth.usuarioLogado.set(false)
    this.auth.isAdmin.set(false)
    this.router.navigate(['/login'])
  }
}
