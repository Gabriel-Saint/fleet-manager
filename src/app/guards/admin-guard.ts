import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { Auth } from '../services/auth'

export const adminGuard: CanActivateFn = async () => {
  const auth = inject(Auth)
  const router = inject(Router)

  await auth.verificarSessao()

  if (!auth.isLoggedIn()) {
    router.navigate(['/login'])
    return false
  }

  if (!auth.isAdmin()) {
    router.navigate(['/veiculos'])
    return false
  }

  return true
}
