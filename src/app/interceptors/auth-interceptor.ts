import { HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { from, switchMap } from 'rxjs'
import { Auth } from '../services/auth'
//interceptor pronto para futuro crescimento da aplicação
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth)

  return from(auth.getToken()).pipe(
    switchMap(token => {
      const reqComToken = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req
      return next(reqComToken)
    })
  )
}