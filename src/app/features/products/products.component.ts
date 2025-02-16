import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/product.service'; // Asegúrate de importar el servicio
import { Product } from '../../core/models/product.model'; // Asegúrate de importar el modelo de Producto
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,  // Si es un componente standalone
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductComponent implements OnInit {
  
  products: Product[] = [];  // Usamos un array normal para almacenar los productos

  constructor(
    private productService: ProductService, // Inyección de servicio
    private router: Router // Inyección del router
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        console.log(data)
      },
      error: (err) => {
        console.error('Error al obtener los productos', err);
      },
    });
  }
}