import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
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
  selectedVariant: any = null;  
  id_user: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService

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
      console.log('Procesando variante:', variant);
  
      // Verificar si variant tiene id_color e id_size
      if (!variant.id_color || !variant.id_size) {
        console.error(`Faltan id_color o id_size en la variante:`, variant);
      }
  
      // Crear un mapa para agrupar variantes por color
      if (!colorMap[variant.color]) {
        colorMap[variant.color] = {
          color: variant.color,
          sizes: []
        };
      }
  
      // Asegúrate de incluir id_color y id_size
      colorMap[variant.color].sizes.push({
        id_variant: variant.id_variant,
        size: variant.size,
        stock: variant.stock,
        image: variant.image,
        id_color: variant.id_color,  // Asegúrate de incluir id_color
        id_size: variant.id_size     // Asegúrate de incluir id_size
      });
    });
  
    console.log('Mapeo de colores:', colorMap);
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
    console.log('Producto:', this.product);
    console.log('Color seleccionado:', this.selectedColor);
    console.log('Talla seleccionada:', this.selectedSize);
  
    // Buscar la id_variant correspondiente a la combinación seleccionada
    const selectedVariant = this.selectedColor.sizes
      .find((size: any) => size.size === this.selectedSize);
  
    if (!selectedVariant) {
      alert('Variante no encontrada');
      return;
    }
  
    // Crear el objeto con la información del producto a agregar
    const productToAdd = {
      id_user: 1,  // Aquí puedes usar el id del usuario si está autenticado
      id_product: this.product.id_product,
      id_color: selectedVariant.id_color,  // Ahora estamos usando el id_color
      id_size: selectedVariant.id_size,    // Ahora estamos usando el id_size
      quantity: 1
    };
  
    console.log('Producto a agregar al carrito:', productToAdd);
  
    // Llamar al servicio de carrito para agregar el producto
    this.cartService.addToCart(productToAdd).subscribe(
      (response) => {
        console.log('Producto agregado al carrito:', response);
        alert('Producto agregado al carrito.');
      },
      (error) => {
        console.error('Error al agregar el producto al carrito:', error);
        alert('Hubo un error al agregar el producto al carrito.');
      }
    );
  }
}