import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  product: any;
  selectedColor: any = null;
  selectedSize: any = null;
  selectedImage: string = '';
  quantity: number = 1;
  cart: any[] = []; // 🛒 Carrito donde guardamos los productos

  isCharacteristicsVisible: boolean = false;
  isGuideVisible: boolean = false;
  isEnvioVisible: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');

    if (productId) {
      this.productService.getProductById(+productId).subscribe(
        (response) => {
          if (response.data && Array.isArray(response.data) && response.data.length > 0) {
            this.product = {
              id_product: response.data[0].id_product,
              name: response.data[0].name,
              price: response.data[0].price,
              description: response.data[0].description,
              composition: response.data[0].composition,
              garment_care: response.data[0].garment_care,
              entrega: response.data[0].entrega,

              colors: this.groupByColor(response.data) // Agrupa por color
            };

            this.selectedColor = this.product.colors[0]; // Selecciona el primer color
            this.selectedImage = this.selectedColor.sizes[0]?.image || ''; // Imagen de la primera talla
            console.log('Producto cargado correctamente:', this.product);

            // Cargar el carrito desde localStorage al iniciar
            this.loadCart();
          } else {
            console.error('No se encontraron datos para el producto.');
          }
        },
        (error) => {
          console.error('Error al obtener el producto:', error);
        }
      );
    }
  }
  toggleCharacteristics() {
    this.isCharacteristicsVisible = !this.isCharacteristicsVisible;
  }
  toggleGuide(){
    this.isGuideVisible = !this.isGuideVisible
  }
  toggleEnvio(){
    this.isEnvioVisible = !this.isEnvioVisible
  }
  groupByColor(data: any[]) {
    const colorMap: { [key: string]: any } = {};
  
    data.forEach((variant) => {
      if (!colorMap[variant.color]) {
        colorMap[variant.color] = {
          id_color: variant.id_color, // Agregar id_color
          color: variant.color,
          sizes: []
        };
      }
      colorMap[variant.color].sizes.push({
        id_size: variant.id_size, // Agregar id_size
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

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (!this.selectedColor || !this.selectedSize) {
      alert('Por favor, selecciona un color y una talla antes de comprar.');
      return;
    }
  
    const selectedVariant = {
      id_user: 22, // ⚠️ Reemplazar con el ID real del usuario
      id_product: this.product.id_product,
      id_color: this.selectedColor.id_color, // 🔹 Extraemos solo el ID del color
      id_size: this.selectedSize, // 🔹 Ya es un número correctamente
      quantity: this.quantity
    };
  
    console.log('✅ Enviando al carrito:', selectedVariant);
  
    this.cartService.addToCart(selectedVariant).subscribe(
      (response) => {
        console.log('🛒 Producto añadido al carrito:', response);
        alert(`${selectedVariant.quantity} unidad(es) de ${this.product.name} añadidas al carrito.`);
        this.loadCart(); // Recargar el carrito
      },
      (error) => {
        console.error('❌ Error al añadir al carrito:', error);
      }
    );
  }
  
  // Cargar el carrito desde localStorage al iniciar
  private loadCart() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cart = JSON.parse(storedCart);
    }
  }
}
