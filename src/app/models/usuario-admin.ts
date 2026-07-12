export interface UsuarioAdmin {
  id: string
  email: string
  role: 'user' | 'admin'
  created_at: string
  total_veiculos: number
}
