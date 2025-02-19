import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private apiUrl = 'http://localhost:3000/api/checkout/shipping';  // Ajusta la URL de la API a tu configuración

  constructor(private http: HttpClient) { }

  submitShippingData(shippingData: any): Observable<any> {
    console.log('shippinData en servicio:' , shippingData)
    return this.http.post<any>(this.apiUrl, shippingData);
  }
}