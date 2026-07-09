import { Routes } from '@angular/router'
import { authGuard } from './guards/auth-guard'

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login')
      .then(c => c.Login)
  },
  {
    path: 'veiculos',
    canActivate: [authGuard],
    loadComponent: () => import('./components/veiculo-list/veiculo-list')
      .then(c => c.VeiculoList)
  },
  {
    path: 'veiculos/novo',
    canActivate: [authGuard],
    loadComponent: () => import('./components/veiculo-form/veiculo-form')
      .then(c => c.VeiculoForm)
  },
  {
    path: 'veiculos/:id/editar',
    canActivate: [authGuard],
    loadComponent: () => import('./components/veiculo-form/veiculo-form')
      .then(c => c.VeiculoForm)
  },
  {
    path: '',
    redirectTo: 'veiculos',
    pathMatch: 'full'
  }
]