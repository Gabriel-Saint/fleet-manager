import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core'
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router'
import { Veiculo as VeiculoService } from '../../services/veiculo'
import { Auth } from '../../services/auth'

@Component({
  selector: 'app-veiculo-form',
  imports: [ReactiveFormsModule],
  templateUrl: './veiculo-form.html',
  styleUrl: './veiculo-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VeiculoForm implements OnInit {
  private veiculoService = inject(VeiculoService)
  private auth = inject(Auth)
  private router = inject(Router)
  private route = inject(ActivatedRoute)

  protected readonly erro = signal('')
  protected readonly salvando = signal(false)
  protected readonly editando = signal(false)

  private veiculoId: string | null = null

  protected readonly form = new FormGroup({
    placa: new FormControl('', [Validators.required]),
    chassi: new FormControl('', [Validators.required]),
    renavam: new FormControl('', [Validators.required]),
    marca: new FormControl('', [Validators.required]),
    modelo: new FormControl('', [Validators.required]),
    ano: new FormControl<number | null>(null, [Validators.required])
  })

  ngOnInit(): void {
    this.veiculoId = this.route.snapshot.paramMap.get('id')

    if (this.veiculoId) {
      this.editando.set(true)
      this.carregarVeiculo(this.veiculoId)
    }
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

    const dados = this.form.value

    if (this.editando() && this.veiculoId) {
      this.atualizarVeiculo(this.veiculoId, dados)
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