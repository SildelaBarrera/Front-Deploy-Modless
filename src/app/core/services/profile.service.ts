import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment_prod } from '../../../../src/environments/environment.prod'
import { environment } from '../../../../src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  // private apiUrl = 'http://localhost:3000/api/profile';
  private apiUrl = `${environment.apiUrl}/profile`;

  constructor(private http: HttpClient) { }

  getProfile(): Observable<any> {
    const token = localStorage.getItem('token'); // Obtener token del almacenamiento local
    console.log("Token almacenado:", localStorage.getItem('token'));
    if (!token) {
      console.error('⚠️ No se encontró el token en localStorage');
      return new Observable(observer => {
        observer.error({ message: 'No autenticado' });
        observer.complete();
      });
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Agregar el token correctamente
      'Content-Type': 'application/json' // Especificar el tipo de contenido
    });

    return this.http.get<any>(this.apiUrl, { headers });
  }

  updateProfile(profileData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put(this.apiUrl, profileData, { headers });
  }
}
