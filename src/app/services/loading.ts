import { Injectable, signal } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class Loading {
  loading = signal(false)
  private ativos = 0

  constructor() {
    window.addEventListener('fm:loading', (evento) => {
      const ligado = (evento as CustomEvent<boolean>).detail
      ligado ? this.mostrar() : this.esconder()
    })
  }

  mostrar() {
    this.ativos++
    this.loading.set(true)
  }

  esconder() {
    this.ativos--
    if (this.ativos <= 0) {
      this.loading.set(false)
    }
  }
}