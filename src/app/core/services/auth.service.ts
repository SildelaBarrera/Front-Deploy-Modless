import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router'


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private inactivityTimer: any;

  constructor(private http: HttpClient, private router:Router) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  getUser() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('📍 Usuario recuperado de localStorage:', user); // Verifica el valor de localStorage
    return user;
  }

  // Método para registrar un usuario
  register(userData: any) {
    console.log("📤 Enviando datos al backend:", userData);
    return this.http.post('http://localhost:3000/api/auth/register', userData);
  }

  verifyEmail(email: string, verificationCode: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-email`, { email, verificationCode });
  }
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token && response.user) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
  
          // Redirigir al usuario según `redirectUrl` o al home
          const redirectUrl = sessionStorage.getItem('redirectUrl') || '/home';
          this.router.navigateByUrl(redirectUrl);
          sessionStorage.removeItem('redirectUrl');
        }
      })
    );
  }
  getToken(): string | null {
    // Suponiendo que el token se guarda en localStorage
    return localStorage.getItem('auth_token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/home']);
    this.clearInactivityTimer();  // Detener temporizador al cerrar sesión
  }

  // Método para reiniciar el temporizador de inactividad
  resetInactivityTimer(): void {
    this.clearInactivityTimer(); // Eliminar cualquier temporizador existente

    this.inactivityTimer = setTimeout(() => {
      console.warn('Sesión expirada por inactividad');
      this.logout();
    }, 10 * 60 * 1000); // 10 minutos (600,000 ms)
  }

  // Método para eliminar el temporizador
  clearInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
  }
}
