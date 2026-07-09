import { HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { finalize } from 'rxjs'
import { Loading } from '../services/loading'

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(Loading)
  loadingService.mostrar()

  return next(req).pipe(
    finalize(() => loadingService.esconder())
  )
}