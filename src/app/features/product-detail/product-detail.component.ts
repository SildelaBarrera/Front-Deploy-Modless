import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  product: any;
  selectedColor: any = null;
  selectedSize: string = '';
  selectedImage: string = '';
  
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
  
    if (productId) {
      this.productService.getProductById(+productId).subscribe((response) => {
  
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          this.product = {
            id_product: response.data[0].id_product,
            name: response.data[0].name,
            price: response.data[0].price,
            colors: this.groupByColor(response.data) // Agrupa por color
          };
  
          this.selectedColor = this.product.colors[0];  // Selecciona el primer color
          this.selectedImage = this.selectedColor.sizes[0]?.image || ''; // Imagen de la primera talla
          console.log('Producto cargado correctamente:', this.product);
        } else {
          console.error('No se encontraron datos para el producto.');
        }
      }, (error) => {
        console.error('Error al obtener el producto:', error);
      });
    }
  }
  groupByColor(data: any[]) {
    const colorMap: { [key: string]: any } = {};

    data.forEach((variant) => {
      if (!colorMap[variant.color]) {
        colorMap[variant.color] = {
          color: variant.color,
          sizes: []
        };
      }
      colorMap[variant.color].sizes.push({
        size: variant.size,
        stock: variant.stock,
        image: variant.image
      });
    });

    return Object.values(colorMap);
  }

  // Cambiar la imagen al seleccionar una talla
  updateImage() {
    const selectedVariant = this.selectedColor.sizes.find(
      (s: any) => s.size === this.selectedSize
    );
    this.selectedImage = selectedVariant ? selectedVariant.image : this.selectedColor.sizes[0]?.image;
  }

  addToCart() {
    if (!this.selectedColor || !this.selectedSize) {
      alert('Por favor, selecciona un color y una talla antes de comprar.');
      return;
    }

    const selectedVariant = {
      productId: this.product.id_product,
      name: this.product.name,
      price: this.product.price,
      color: this.selectedColor.color,
      size: this.selectedSize,
      image: this.selectedImage
    };

    console.log('Producto agregado al carrito:', selectedVariant);
    alert('Producto agregado al carrito.');
  }
}