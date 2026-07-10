import { Injectable, signal } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class Notificacao {
  readonly mensagem = signal<string | null>(null)
  private timeoutId?: ReturnType<typeof setTimeout>

  sucesso(texto: string): void {
    this.exibir(texto)
  }

  private exibir(texto: string): void {
    clearTimeout(this.timeoutId)
    this.mensagem.set(texto)
    this.timeoutId = setTimeout(() => this.mensagem.set(null), 3000)
  }
}
