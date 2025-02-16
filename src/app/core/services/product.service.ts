import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Product } from '../models/product.model'; 

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/products';
  private router = inject(Router)

  constructor() { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl); // Obtén los productos desde el backend
  }
}