import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core'
import { provideRouter, withComponentInputBinding } from '@angular/router'
import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { provideAnimations } from '@angular/platform-browser/animations'

import { routes } from './app.routes'
import { authInterceptor } from './interceptors/auth-interceptor'
import { errorInterceptor } from './interceptors/error-interceptor'
import { loadingInterceptor } from './interceptors/loading-interceptor'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(), // TODO: deprecated na v20.2, mas Angular Material ainda depende disso internamente. Trocar quando o Material migrar pro animate.enter/leave (antes da v23).
    provideHttpClient(
      withInterceptors([authInterceptor, loadingInterceptor, errorInterceptor])
    )
  ]
}