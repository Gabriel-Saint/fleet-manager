import { Injectable, inject } from '@angular/core'
import { Supabase } from './supabase'
import { from } from 'rxjs'
import { Veiculo as VeiculoModel } from '../models/veiculo'

@Injectable({
  providedIn: 'root'
})
export class Veiculo {
  private supabase = inject(Supabase)

  getAll() {
    return from(
      this.supabase.client
        .from('veiculos')
        .select('*')
        .order('created_at', { ascending: false })
    )
  }

  getById(id: string) {
    return from(
      this.supabase.client
        .from('veiculos')
        .select('*')
        .eq('id', id)
        .single()
    )
  }

  create(veiculo: VeiculoModel) {
    return from(
      this.supabase.client
        .from('veiculos')
        .insert(veiculo)
        .select()
        .single()
    )
  }

  update(id: string, veiculo: Partial<VeiculoModel>) {
    return from(
      this.supabase.client
        .from('veiculos')
        .update(veiculo)
        .eq('id', id)
        .select()
        .single()
    )
  }

  delete(id: string) {
    return from(
      this.supabase.client
        .from('veiculos')
        .delete()
        .eq('id', id)
    )
  }
}