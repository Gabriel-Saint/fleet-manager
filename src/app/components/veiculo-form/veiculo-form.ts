import { ChangeDetectionStrategy, Component, inject, signal, input, effect } from '@angular/core'
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { Veiculo as VeiculoService } from '../../services/veiculo'
import { Auth } from '../../services/auth'
import { placaValidator } from '../../validators/placa'
import { chassiValidator } from '../../validators/chassi'
import { renavamValidator } from '../../validators/renavam'

@Component({
  selector: 'app-veiculo-form',
  imports: [ReactiveFormsModule],
  templateUrl: './veiculo-form.html',
  styleUrl: './veiculo-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VeiculoForm {
  private veiculoService = inject(VeiculoService)
  private auth = inject(Auth)
  private router = inject(Router)

  protected readonly erro = signal('')
  protected readonly salvando = signal(false)
  protected readonly editando = signal(false)

  id = input<string>()

  protected readonly form = new FormGroup({
    placa: new FormControl('', [Validators.required, placaValidator]),
    chassi: new FormControl('', [Validators.required, chassiValidator]),
    renavam: new FormControl('', [Validators.required, renavamValidator]),
    marca: new FormControl('', [Validators.required]),
    modelo: new FormControl('', [Validators.required]),
    ano: new FormControl<number | null>(null, [Validators.required])
  })

  constructor() {
    effect(() => {
      const veiculoId = this.id()
      if (veiculoId) {
        this.editando.set(true)
        this.carregarVeiculo(veiculoId)
      }
    })
  }

  private carregarVeiculo(id: string): void {
    this.veiculoService.getById(id).subscribe({
      next: ({ data, error }) => {
        if (error || !data) {
          this.erro.set('Erro ao carregar veículo')
          return
        }
        this.form.patchValue(data)
      }
    })
  }

  protected async salvar(): Promise<void> {
    if (this.form.invalid) return

    this.salvando.set(true)

    const dados = {
      ...this.form.value,
      placa: this.form.value.placa?.toUpperCase().trim(),
      chassi: this.form.value.chassi?.toUpperCase().trim()
    }
    const veiculoId = this.id()

    if (this.editando() && veiculoId) {
      this.atualizarVeiculo(veiculoId, dados)
    } else {
      await this.criarVeiculo(dados)
    }
  }

  private async criarVeiculo(dados: any): Promise<void> {
    const { data: sessao } = await this.auth.getSession()
    const userId = sessao.session?.user.id

    if (!userId) {
      this.erro.set('Usuário não autenticado')
      this.salvando.set(false)
      return
    }

    this.veiculoService.create({ ...dados, user_id: userId }).subscribe({
      next: ({ error }) => {
        this.salvando.set(false)
        if (error) {
          this.erro.set('Erro ao criar veículo')
          return
        }
        this.router.navigate(['/veiculos'])
      }
    })
  }

  private atualizarVeiculo(id: string, dados: any): void {
    this.veiculoService.update(id, dados).subscribe({
      next: ({ error }) => {
        this.salvando.set(false)
        if (error) {
          this.erro.set('Erro ao atualizar veículo')
          return
        }
        this.router.navigate(['/veiculos'])
      }
    })
  }

  protected cancelar(): void {
    this.router.navigate(['/veiculos'])
  }
}