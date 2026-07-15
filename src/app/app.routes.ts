import { Routes } from '@angular/router'
import { loadRemoteModule } from '@angular-architects/native-federation'
import { authGuard } from './guards/auth-guard'
import { adminGuard } from './guards/admin-guard'

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login')
      .then(c => c.Login)
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./components/cadastro/cadastro')
      .then(c => c.Cadastro)
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
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      loadRemoteModule({
        remoteEntry: 'http://localhost:4201/remoteEntry.json',
        exposedModule: './Admin',
      }).then(m => m.Admin)
  },
  {
    path: '',
    redirectTo: 'veiculos',
    pathMatch: 'full'
  }
]