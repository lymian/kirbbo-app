import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

export interface RegistroRequest {
  username: string;
  password: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthClienteService {
  private apiUrl = 'http://68.211.176.134:81/kirbbo/auth';
  private nombreUsuarioSubject = new BehaviorSubject<string | null>(null);
  nombreUsuario$ = this.nombreUsuarioSubject.asObservable();

  constructor(private http: HttpClient) {
    const nombre = localStorage.getItem('username');
    if (nombre) {
      this.nombreUsuarioSubject.next(nombre);
    }
  }

  registrar(datos: RegistroRequest): Observable<any> {
    const url = `${this.apiUrl}/register`;
    return this.http.post(url, datos).pipe(
      catchError(this.manejarError)
    );
  }

  private manejarError(error: HttpErrorResponse) {
    console.log(error.error.mensaje);
    if (error.status === 400) {
      if (error.error?.mensaje) {
        // Mensajes personalizados como: "El correo ya está registrado"
        return throwError(() => error.error.mensaje);
      } else if (error.error?.errors) {
        // Errores de validación del modelo
        const mensajes = Object.values(error.error.errors).flat();
        return throwError(() => mensajes.join(' '));
      }
    }

    return throwError(() => 'Ocurrió un error inesperado.');
  }

  login(data: { username: string; password: string }): Observable<any> {
    const url = `${this.apiUrl}/login`; // Asegúrate de que `apiUrl` ya contenga `https://localhost:7161/kirbbo/auth`

    return this.http.post<any>(url, data).pipe(
      tap(response => {
        // Guardamos el token en localStorage (puedes cambiarlo a sessionStorage si prefieres)
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', data.username); // Guardar el nombre de usuario
        this.nombreUsuarioSubject.next(data.username);
      }),
      catchError((error: HttpErrorResponse) => {
        let mensaje = 'Ocurrió un error al iniciar sesión.';

        if (error.status === 401 && error.error?.mensaje) {
          mensaje = error.error.mensaje; // "Credenciales inválidas"
        }

        return throwError(() => new Error(mensaje));
      })
    );
  }
  getNombreUsuario(): string | null {
    return localStorage.getItem('username');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.clear(); // Limpiar el localStorage
    this.nombreUsuarioSubject.next(null);
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}