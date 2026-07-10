import { Injectable, inject } from '@angular/core'
import { Supabase } from './supabase'
import { Loading } from './loading'
import { from, finalize } from 'rxjs'
import { Veiculo as VeiculoModel } from '../models/veiculo'

@Injectable({
  providedIn: 'root'
})
export class Veiculo {
  private supabase = inject(Supabase)
  private loading = inject(Loading)

  getAll() {
    this.loading.mostrar()
    return from(
      this.supabase.client
        .from('veiculos')
        .select('*')
        .order('created_at', { ascending: false })
    ).pipe(finalize(() => this.loading.esconder()))
  }

  getById(id: string) {
    this.loading.mostrar()
    return from(
      this.supabase.client
        .from('veiculos')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(finalize(() => this.loading.esconder()))
  }

  create(veiculo: VeiculoModel) {
    this.loading.mostrar()
    return from(
      this.supabase.client
        .from('veiculos')
        .insert(veiculo)
        .select()
        .single()
    ).pipe(finalize(() => this.loading.esconder()))
  }

  update(id: string, veiculo: Partial<VeiculoModel>) {
    this.loading.mostrar()
    return from(
      this.supabase.client
        .from('veiculos')
        .update(veiculo)
        .eq('id', id)
        .select()
        .single()
    ).pipe(finalize(() => this.loading.esconder()))
  }

  delete(id: string) {
    this.loading.mostrar()
    return from(
      this.supabase.client
        .from('veiculos')
        .delete()
        .eq('id', id)
    ).pipe(finalize(() => this.loading.esconder()))
  }
}