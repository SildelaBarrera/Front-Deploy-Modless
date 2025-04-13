import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment_prod } from '../../../../src/environments/environment.prod'
import { environment } from '../../../../src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // private apiUrl = 'http://localhost:3000/api/cart';  // Cambia según tu URL de backend
  private apiUrl  = `${environment_prod.apiUrl}/cart`;

  constructor(private http: HttpClient) {}

  getCart(id_user: number, discountCode: string = ''): Observable<any> {
    
    // let url = `http://localhost:3000/api/cart/${id_user}`;
    let url = `${this.apiUrl}/${id_user}`
    console.log("URL del carrito:", url);
    if (discountCode) {
      url += `?discount_code=${discountCode}`;
    }
    return this.http.get<any>(url);
  }


  addToCart(cartData: { id_user: number; id_product: number; id_color: number; id_size: number; quantity: number }): Observable<any> {
    return this.http.post<any>(this.apiUrl, cartData);
  }

  removeFromCart(id_variant: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id_variant}`);
  }

  updateQuantity(id_cart: number, quantity: number): Observable<any> {
    // let url = `http://localhost:3000/api/cart/update/${id_cart}`
    let url = `${this.apiUrl}/${id_cart}`
    console.log("URL de actualización:", url); // Verificar en la consola
    return this.http.put<any>(url, { quantity });
  }

  applyDiscount(userId: number, discount_code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/discount`, { id_user: userId, discount_code: discount_code });
  }

  clearCart(user_id: number) {
    return this.http.delete(`${this.apiUrl}/clear/${user_id}`);
  }
}
