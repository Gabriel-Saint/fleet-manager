import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Veiculo as VeiculoService } from '../../services/veiculo'
import { Veiculo as VeiculoModel } from '../../models/veiculo'

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

  protected readonly veiculos = signal<VeiculoModel[]>([])
  protected readonly carregando = signal(true)
  protected readonly erro = signal('')
  protected readonly confirmandoId = signal<string | null>(null)

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

  protected confirmarExclusao(id: string): void {
    this.veiculoService.delete(id).subscribe({
      next: ({ error }) => {
        if (error) {
          this.erro.set('Erro ao deletar veículo')
          return
        }
        this.veiculos.update(lista => lista.filter(v => v.id !== id))
        this.confirmandoId.set(null)
      }
    })
  }
}