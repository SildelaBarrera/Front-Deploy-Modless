import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Product } from '../models/product.model'; 
import { environment_prod } from '../../../../src/environments/environment.prod'
import { environment } from '../../../../src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);
  // private apiUrl = 'http://localhost:3000/api/products';
  private apiUrl = `${environment.apiUrl}/products`;
  private router = inject(Router)

  constructor() { }

  getProducts(category?: string): Observable<Product[]> {
    let params = new HttpParams();
    if(category){
      params = params.set('category', category)
    }
    return this.http.get<Product[]>(this.apiUrl, { params }); 
  }

  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

}