import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { KeycloakService } from './utils/keycloak/keycloak.service';
import { keycloakHttpInterceptor } from './utils/http/keycloak-http.interceptor';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([keycloakHttpInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAppInitializer(() => {
      const initFn = ((key: KeycloakService) => {
        return () => key.init();
      })(inject(KeycloakService));
      return initFn();
    }),
    importProvidersFrom(FontAwesomeModule),
  ],
};
