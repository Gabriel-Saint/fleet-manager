import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { Auth } from '../services/auth'

export const authGuard: CanActivateFn = async () => {
  const auth = inject(Auth)
  const router = inject(Router)

  await auth.verificarSessao()

  if (auth.isLoggedIn()) {
    return true
  }

  router.navigate(['/login'])
  return false
}