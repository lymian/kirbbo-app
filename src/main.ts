import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/auth.interceptor'; // Asegúrate de que la ruta sea correcta

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])) // Usa la función interceptora
  ]
}).catch(err => console.error(err));