// import { Component, OnInit } from '@angular/core';
// import { CartService } from '../../core/services/cart.service';  // Servicio para manejar el carrito
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-cart',
//   imports: [CommonModule, FormsModule],
//   templateUrl: './cart.component.html',
//   styleUrls: ['./cart.component.css']
// })
// export class CartComponent implements OnInit {
//   cartItems: any[] = [];
//   totalAmount: number = 0;

//   constructor(private cartService: CartService) {}

//   ngOnInit(): void {
//     this.loadCart();
//   }

//   loadCart(): void {
//     this.cartService.getCart().subscribe((items) => {
//       this.cartItems = items;
//       this.calculateTotal();
//     });
//   }

//   calculateTotal(): void {
//     this.totalAmount = this.cartItems.reduce((total, item) => {
//       return total + item.quantity * item.price;
//     }, 0);
//   }

//   removeItemFromCart(id_variant: number): void {
//     this.cartService.removeFromCart(id_variant).subscribe(() => {
//       this.loadCart();  // Recargar el carrito después de eliminar un artículo
//     });
//   }

//   updateQuantity(id_variant: number, quantity: number): void {
//     if (quantity < 1) {
//       quantity = 1;  // Asegurarse de que la cantidad no sea negativa
//     }
//     this.cartService.updateQuantity(id_variant, quantity).subscribe(() => {
//       this.loadCart();  // Recargar el carrito después de actualizar la cantidad
//     });
//   }
// }
