import { Component, OnInit, inject } from '@angular/core';
import { ProductService } from '../../core/services/product.service'; // Asegúrate de importar el servicio
import { Product } from '../../core/models/product.model'; // Asegúrate de importar el modelo de Producto
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,  // Si es un componente standalone
  imports: [CommonModule, RouterLink],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductComponent implements OnInit {
  
  products: Product[] = [];  // Usamos un array normal para almacenar los productos
  categoryTitle: string = 'Nueva colección'; // Título dinámico por defecto
  private route = inject(ActivatedRoute);

  constructor(
    private productService: ProductService, // Inyección de servicio
    private router: Router // Inyección del router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const category = params['category'];
      
      if (category) {
        this.categoryTitle = category; // Actualiza el título con la categoría
      } else {
        this.categoryTitle = 'Nueva colección'; // Título por defecto
      }

      this.fetchProducts(category);
    });
  }

  fetchProducts(category?: string) {
    this.productService.getProducts(category).subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Error al obtener los productos', err);
      },
    });
  }
}
