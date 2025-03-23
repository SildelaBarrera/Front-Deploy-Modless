import { Component, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart.service';  
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  subtotal: number = 0;
  totalAmount: number = 0;
  discountCode: string = ''; 
  discountApplied: number = 0;
  discountError: boolean = false;
  id_user: number | null = null;  // Ahora el ID del usuario es dinámico

  constructor(private cartService: CartService, private authService: AuthService, public router: Router) {}

  ngOnInit(): void {
    this.id_user = this.authService.getUser()?.id_user || null;
    this.loadCart()
    console.log("ID del usuario logueado:", this.id_user);
  
    if (this.id_user) {
      console.log("Usuario logueado:", this.id_user);
      this.loadCart();
    } else {
      // Guardar la URL antes de redirigir
      sessionStorage.setItem('redirectUrl', this.router.url);
      this.router.navigate(['/login']);
    }
  }
  goToLogin(): void {
    if (this.router.url) {
      sessionStorage.setItem('redirectUrl', this.router.url);
    }
    this.router.navigate(['/login']);
  }
  // Cargar el carrito y calcular el subtotal
  loadCart(): void {
    if (!this.id_user) return;

    this.cartService.getCart(this.id_user).subscribe(
      (response: any) => {
        console.log("Respuesta del carrito:", response);
        if (response && response.data) {
          this.cartItems = response.data;
          this.calculateTotal();
        } else {
          this.cartItems = [];
          this.subtotal = 0;
          this.totalAmount = 0;
          this.discountApplied = 0;
        }
      },
      error => {
        console.error("Error al cargar el carrito:", error);
      }
    );
  }

  // Aplicar código de descuento
  // applyDiscount(): void {
  //   console.log('Código de descuento:', this.discountCode);
  //   console.log('ID del usuario:', this.id_user); // Asegúrate de tener el ID del usuario aquí
    
  //   this.cartService.applyDiscount(this.discountCode, this.id_user).subscribe(
  //     (response: any) => {
  //       if (response.error) {
  //         this.discountError = true;
  //         this.discountApplied = 0;
  //       } else {
  //         this.discountApplied = response.discountAmount;
  //         this.discountError = false;
  //         this.calculateTotal();
  //       }
  //     },
  //     error => {
  //       console.error("Error al aplicar el descuento", error);
  //       this.discountError = true;
  //     }
  //   );
  // }
  
// Calcular subtotal y total después de descuento
calculateTotal(): void {
  // Calculamos el subtotal con el precio y la cantidad de cada ítem
  this.subtotal = this.cartItems.reduce((total, item) => total + (item.quantity * item.price), 0);
  
  // Calculamos el total después de aplicar el descuento
  this.totalAmount = this.subtotal - this.discountApplied;
  
  console.log("Subtotal:", this.subtotal);
  console.log("Descuento aplicado:", this.discountApplied);
  console.log("Total con descuento:", this.totalAmount);
}


  // Actualizar cantidad
  updateQuantity(id_cart: number, quantity: number): void {
    if (quantity < 1) quantity = 1;
  
    const url = `/api/cart/update/${id_cart}`;
    console.log("URL de actualización del carrito:", url); // 👀 Verificar la URL generada
  
    this.cartService.updateQuantity(id_cart, quantity).subscribe(
      () => {
        this.loadCart();
      },
      (error) => {
        console.error("Error al actualizar la cantidad:", error);
      }
    );
  }

  // Eliminar producto del carrito
  removeItemFromCart(id_cart: number): void {
    this.cartService.removeFromCart(id_cart).subscribe(() => {
      this.loadCart();
    });
  }
}