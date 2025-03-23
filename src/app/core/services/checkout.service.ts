import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { OrderDetailsResponse } from '../models/order-details.model'; 

@Injectable({
  providedIn: 'root'
})

export class CheckoutService {
  
  private apiUrl = 'http://localhost:3000/api/orders';  // Ajusta la URL de la API a tu configuración

  constructor(private http: HttpClient, private authService: AuthService) { }
  
  // Método para obtener la última dirección de envío del usuario
  getLastShippingAddress(id_user: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/shipping/address/${id_user}`);
  }

  submitShippingData(shippingData: any): Observable<any> {
    console.log('shippinData en servicio:' , shippingData)
    const token = localStorage.getItem('token');
    console.log('Token en servicio:', token);
    if (!token) {
      return new Observable(observer => {
        observer.error('Token no encontrado');
      });
    }
    // Si el token está presente, lo incluimos en los encabezados
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log('Encabezados enviados:', headers);
    return this.http.post<any>(this.apiUrl + '/shipping', shippingData, { headers });
  }

  getShippingCost(requestBody: { id_user: number, subtotal: number, delivery_type: string })  {
    console.log("📤 Enviando solicitud de costo de envío con:")
    
    return this.http.post<any>(`${this.apiUrl}/shipping-cost`, requestBody);  
}

  getAddress(userId: number): Observable<any> {
    return this.http.get(`http://localhost:3000/api/orders/address/${userId}`);
  }

  createOrder(orderData: any) {
    const token = localStorage.getItem('token'); // Obtener token
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}` // 🔥 Enviar token en los headers
    });
  
    return this.http.post(`${this.apiUrl}/create`, orderData, { headers, withCredentials: true });
  }
  getOrderDetails(orderId: number): Observable<OrderDetailsResponse> {
    return this.http.get<OrderDetailsResponse>(`${this.apiUrl}/order-details/${orderId}`, { withCredentials: true });
  }

  getOrdersByUser(userId: number): Observable<any> {
    return this.http.get(this.apiUrl + '/user/:'+ userId);
  }

  addPayment(paymentData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/add`, paymentData, { headers });
  }

  getPaymentsByOrder(orderId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/payment/${orderId}`);
  }

  createPayPalOrder(order: { totalPrice: number }) {
    return this.http.post<any>('http://localhost:3000/api/orders/create-order', order, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 🔹 Capturar pago (GET en lugar de POST)
  capturePayPalOrder(orderID: string): Observable<any> {
    // Enviar el token en el cuerpo de la solicitud (en lugar de en la URL)
    return this.http.post(`${this.apiUrl}/capture-order`, { token: orderID });
  }
  
}