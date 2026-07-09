import { Injectable, signal } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class Loading {
  loading = signal(false)
  private ativos = 0

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