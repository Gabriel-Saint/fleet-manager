import { Injectable, inject } from '@angular/core'
import { from, finalize } from 'rxjs'
import { Supabase } from './supabase'
import { Loading } from './loading'

@Injectable({
  providedIn: 'root'
})
export class Admin {
  private supabase = inject(Supabase)
  private loading = inject(Loading)

  listarUsuarios() {
    this.loading.mostrar()
    return from(
      this.supabase.client.rpc('admin_listar_usuarios')
    ).pipe(finalize(() => this.loading.esconder()))
  }

  alterarRole(id: string, role: 'user' | 'admin') {
    this.loading.mostrar()
    return from(
      this.supabase.client
        .from('profiles')
        .update({ role })
        .eq('id', id)
        .select()
        .single()
    ).pipe(finalize(() => this.loading.esconder()))
  }
}
