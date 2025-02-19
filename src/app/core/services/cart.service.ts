import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000/api/cart';  // Cambia según tu URL de backend

  constructor(private http: HttpClient) {}

  getCart(id_user: number): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl +'/'+ id_user);
  }

  addToCart(cartData: { id_user: number; id_product: number; id_color: number; id_size: number; quantity: number }): Observable<any> {
    return this.http.post<any>(this.apiUrl, cartData);
  }

  removeFromCart(id_variant: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id_variant}`);
  }

  updateQuantity(id_cart: number, quantity: number): Observable<any> {
    return this.http.put(`http://localhost:3000/api/cart/update/${id_cart}`, { quantity });
  }
}
