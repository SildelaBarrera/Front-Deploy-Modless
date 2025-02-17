// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class CartService {
//   private apiUrl = 'http://localhost:3000/api/cart';  // Cambia según tu URL de backend

//   constructor(private http: HttpClient) {}

//   getCart(): Observable<any[]> {
//     return this.http.get<any[]>(this.apiUrl);
//   }

//   addToCart(id_variant: number, quantity: number): Observable<any> {
//     return this.http.post(this.apiUrl, { id_variant, quantity });
//   }

//   removeFromCart(id_variant: number): Observable<any> {
//     return this.http.delete(`${this.apiUrl}/${id_variant}`);
//   }

//   updateQuantity(id_variant: number, quantity: number): Observable<any> {
//     return this.http.put(`${this.apiUrl}/${id_variant}`, { quantity });
//   }
// }
