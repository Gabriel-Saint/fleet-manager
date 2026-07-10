import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Veiculo as VeiculoService } from '../../services/veiculo'
import { Veiculo as VeiculoModel } from '../../models/veiculo'
import { Notificacao } from '../../services/notificacao'

@Component({
  selector: 'app-veiculo-list',
  imports: [],
  templateUrl: './veiculo-list.html',
  styleUrl: './veiculo-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VeiculoList implements OnInit {
  private veiculoService = inject(VeiculoService)
  private router = inject(Router)
  private notificacao = inject(Notificacao)

  protected readonly veiculos = signal<VeiculoModel[]>([])
  protected readonly carregando = signal(true)
  protected readonly erro = signal('')
  protected readonly confirmandoId = signal<string | null>(null)

  // Paginação (client-side)
  protected readonly tamanhosDisponiveis = [5, 10, 20] as const
  protected readonly tamanhoPagina = signal(10)
  protected readonly pagina = signal(1)

  protected readonly totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.veiculos().length / this.tamanhoPagina()))
  )

  protected readonly veiculosPagina = computed(() => {
    const inicio = (this.pagina() - 1) * this.tamanhoPagina()
    return this.veiculos().slice(inicio, inicio + this.tamanhoPagina())
  })

  ngOnInit(): void {
    this.carregarVeiculos()
  }

  private carregarVeiculos(): void {
    this.carregando.set(true)

    this.veiculoService.getAll().subscribe({
      next: ({ data, error }) => {
        if (error) {
          this.erro.set('Erro ao carregar veículos')
          this.carregando.set(false)
          return
        }
        this.veiculos.set(data ?? [])
        this.carregando.set(false)
      }
    })
  }

  protected novoVeiculo(): void {
    this.router.navigate(['/veiculos/novo'])
  }

  protected editarVeiculo(id: string): void {
    this.router.navigate(['/veiculos', id, 'editar'])
  }

  protected pedirConfirmacao(id: string): void {
    this.confirmandoId.set(id)
  }

  protected cancelarExclusao(): void {
    this.confirmandoId.set(null)
  }

  protected paginaAnterior(): void {
    if (this.pagina() > 1) this.pagina.update(p => p - 1)
  }

  protected proximaPagina(): void {
    if (this.pagina() < this.totalPaginas()) this.pagina.update(p => p + 1)
  }

  protected mudarTamanho(event: Event): void {
    const valor = Number((event.target as HTMLSelectElement).value)
    this.tamanhoPagina.set(valor)
    this.pagina.set(1) // volta pra primeira página ao trocar o tamanho
  }

  protected confirmarExclusao(id: string): void {
    this.veiculoService.delete(id).subscribe({
      next: ({ error }) => {
        if (error) {
          this.erro.set('Erro ao deletar veículo')
          return
        }
        this.veiculos.update(lista => lista.filter(v => v.id !== id))
        this.confirmandoId.set(null)
        // se a página atual ficou vazia após excluir, recua para a última válida
        if (this.pagina() > this.totalPaginas()) this.pagina.set(this.totalPaginas())
        this.notificacao.sucesso('Veículo excluído com sucesso')
      }
    })
  }
}