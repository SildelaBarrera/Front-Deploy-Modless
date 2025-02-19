import { Component, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart.service';  // Servicio para manejar el carrito
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalAmount: number = 0;
  id_user: number = 1; // ID de usuario predeterminado (puedes cambiarlo por el id real más adelante)

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  // Cargar el carrito del usuario
  loadCart(): void {
    this.cartService.getCart(this.id_user).subscribe((response: any) => {
      console.log("Respuesta del backend:", response);
  
      if (response && response.data && Array.isArray(response.data)) {
        this.cartItems = response.data;
        this.calculateTotal();
      } else if (Array.isArray(response)) {
        // Si por alguna razón la API devuelve directamente un array
        this.cartItems = response;
        this.calculateTotal();
      } else {
        console.error("Error: Respuesta inesperada del backend", response);
        this.cartItems = [];
      }
    }, error => {
      console.error("Error al cargar el carrito:", error);
    });
  }
  

  // Calcular el total del carrito
  calculateTotal(): void {
    if (!Array.isArray(this.cartItems)) {
      console.error("Error: this.cartItems no es un array válido", this.cartItems);
      return;
    }
  
    this.totalAmount = this.cartItems.reduce((total, item) => {
      return total + (Number(item.quantity) * Number(item.price));
    }, 0);
  }

  // Eliminar un artículo del carrito
  removeItemFromCart(id_variant: number): void {
    this.cartService.removeFromCart(id_variant).subscribe(() => {
      this.loadCart();  // Recargar el carrito después de eliminar un artículo
    });
  }

  // Actualizar la cantidad de un artículo
  updateQuantity(id_cart: number, quantity: number): void {
    if (quantity < 1) {
      quantity = 1;  // Asegurarse de que la cantidad no sea negativa
    }
    this.cartService.updateQuantity(id_cart, quantity).subscribe(() => {
      this.loadCart();  // Recargar el carrito después de actualizar la cantidad
    });
  }
}
