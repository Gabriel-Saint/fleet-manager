import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http'
import { inject } from '@angular/core'
import { catchError, throwError } from 'rxjs'
import { MatSnackBar } from '@angular/material/snack-bar'

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar)

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const mensagem = error.status === 0
        ? 'Sem conexão com o servidor.'
        : 'Erro inesperado. Tente novamente.'

      snackBar.open(mensagem, 'Fechar', { duration: 4000 })
      return throwError(() => error)
    })
  )
}