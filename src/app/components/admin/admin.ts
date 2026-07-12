import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core'
import { DatePipe } from '@angular/common'
import { Admin as AdminService } from '../../services/admin'
import { Auth } from '../../services/auth'
import { Notificacao } from '../../services/notificacao'
import { UsuarioAdmin } from '../../models/usuario-admin'

@Component({
  selector: 'app-admin',
  imports: [DatePipe],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Admin implements OnInit {
  private adminService = inject(AdminService)
  private auth = inject(Auth)
  private notificacao = inject(Notificacao)

  protected readonly usuarios = signal<UsuarioAdmin[]>([])
  protected readonly carregando = signal(true)
  protected readonly erro = signal('')
  protected readonly meuId = this.auth.usuarioId

  // Totais derivados da lista — recalculados sozinhos
  protected readonly totalUsuarios = computed(() => this.usuarios().length)
  protected readonly totalVeiculos = computed(() =>
    this.usuarios().reduce((soma, u) => soma + Number(u.total_veiculos), 0)
  )

  ngOnInit(): void {
    this.carregarUsuarios()
  }

  private carregarUsuarios(): void {
    this.carregando.set(true)
    this.adminService.listarUsuarios().subscribe({
      next: ({ data, error }) => {
        if (error) {
          this.erro.set('Erro ao carregar usuários')
          this.carregando.set(false)
          return
        }
        this.usuarios.set((data ?? []) as UsuarioAdmin[])
        this.carregando.set(false)
      }
    })
  }

  protected alterarRole(usuario: UsuarioAdmin, novoRole: 'user' | 'admin'): void {
    this.adminService.alterarRole(usuario.id, novoRole).subscribe({
      next: ({ error }) => {
        if (error) {
          this.erro.set(`Não foi possível alterar o papel de ${usuario.email}`)
          return
        }
        this.usuarios.update(lista =>
          lista.map(u => u.id === usuario.id ? { ...u, role: novoRole } : u)
        )
        const virou = novoRole === 'admin' ? 'admin' : 'usuário comum'
        this.notificacao.sucesso(`${usuario.email} agora é ${virou}`)
      }
    })
  }
}
