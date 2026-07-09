import { Injectable, inject, signal } from '@angular/core'
import { Supabase } from './supabase'
import { from, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private supabase = inject(Supabase)

  usuarioLogado = signal<boolean>(false)

  constructor() {
    this.verificarSessao()
  }

  async verificarSessao() {
    const { data } = await this.supabase.client.auth.getSession()
    this.usuarioLogado.set(!!data.session)
  }

  login(email: string, senha: string): Observable<any> {
    return from(
      this.supabase.client.auth.signInWithPassword({ email, password: senha })
    )
  }

  cadastrar(email: string, senha: string): Observable<any> {
    return from(
      this.supabase.client.auth.signUp({ email, password: senha })
    )
  }

  logout(): Observable<any> {
    return from(this.supabase.client.auth.signOut())
  }

  async getToken(): Promise<string | null> {
    const { data } = await this.supabase.client.auth.getSession()
    return data.session?.access_token ?? null
  }

  isLoggedIn(): boolean {
    return this.usuarioLogado()
  }
}