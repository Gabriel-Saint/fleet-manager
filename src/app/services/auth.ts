import { Injectable, inject, signal } from '@angular/core'
import { Supabase } from './supabase'
import { from, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private supabase = inject(Supabase)

  usuarioLogado = signal<boolean>(false)
  isAdmin = signal<boolean>(false)
  usuarioId = signal<string | null>(null)

  constructor() {
    this.verificarSessao()
  }

  async verificarSessao() {
    const { data } = await this.supabase.client.auth.getSession()
    const logado = !!data.session
    this.usuarioLogado.set(logado)
    this.usuarioId.set(data.session?.user.id ?? null)

    if (logado) {
      const { data: ehAdmin } = await this.supabase.client.rpc('is_admin')
      this.isAdmin.set(ehAdmin === true)
    } else {
      this.isAdmin.set(false)
    }
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

  async getSession() {
    return await this.supabase.client.auth.getSession()
  }

  isLoggedIn(): boolean {
    return this.usuarioLogado()
  }
}