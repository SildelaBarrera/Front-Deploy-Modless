import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckoutService } from '../../core/services/checkout.service';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { OrderItem } from '../../core/models/order.model';
import { ShippingService } from '../../core/services/shipping.service';

declare var paypal: any;

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {

  user_id: number | null = null;
  selectedAddress: any = null;
  addressId: number = 0;
  cartItems: any[] = [];
  totalPrice: number = 0;
  shippingCost: number = 0;
  discountAmount: number = 0;
  discount_code: string = '';
  subtotal: number = 0;
  shippingMethod: string = "domicilio";
  orderId: number | null = null;
  isHomeDeliveryAvailable: boolean = true;
  isPickupPointAvailable: boolean = true;  // "domicilio" o "punto_pack"

  order = {
    user_id: null,
    total: 0,
    id_address: '',
    shipping_method: this.shippingMethod,
    items: [] as OrderItem[]
  };

  constructor(
    private checkoutService: CheckoutService,
    private cartService: CartService,
    private authService: AuthService,
    private shippingService: ShippingService
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (user && user.id_user) {
      this.user_id = user.id_user;
      this.loadAddress();
      this.loadCartItems();
      setTimeout(() => {
        this.updateShippingCost();
      }, 500);
    } else {
      console.warn("⚠️ No se encontró usuario autenticado.");
    }
  }

  ngAfterViewInit() {
    this.loadPayPalButton();
  }

  loadPayPalButton() {
    if (!(window as any).paypal) {
      console.error("❌ No se pudo cargar el SDK de PayPal.");
      return;
    }
  
    paypal.Buttons({
      createOrder: async () => {
        try {
          console.log("📦 Creando orden en PayPal...");
          const response = await this.checkoutService.createPayPalOrder({
            totalPrice: this.totalPrice
          }).toPromise();
    
          console.log("✅ Orden creada en PayPal:", response);
          return response.id;
        } catch (error) {
          console.error("❌ Error al crear la orden en PayPal:", error);
          alert("Hubo un problema al procesar el pago.");
        }
      },
      onApprove: async (data: any) => { // ✅ CORREGIDO
        try {
          console.log("💰 Capturando pago con OrderID:", data.orderID);
    
          // Capturar el pago en PayPal
          const captureData = {
            orderID: data.orderID,
            token: data.facilitatorAccessToken,
            user_id: this.user_id
          };
    
          const res = await this.checkoutService.capturePayPalOrder(captureData).toPromise();
          console.log("✅ Pago capturado:", res);
    
          // 🔥 Guardar la orden en la base de datos
          this.saveOrderToDatabase();
    
          // Redirigir al usuario a la página de éxito
          window.location.href = "/success";
        } catch (error) {
          console.error("❌ Error al capturar el pago:", error);
          alert("Hubo un error al confirmar el pago.");
        }
      },
      onError: (err: any) => {
        console.error("❌ Error en PayPal:", err);
        alert("Ocurrió un error con PayPal, inténtalo de nuevo.");
      }
    }).render('#paypal-button-container');
  }
  
  
  onShippingMethodChange(event: any) {
    this.shippingMethod = event.target.value;
    this.shippingService.updateShippingMethod(this.shippingMethod);
    console.log("🚚 Método de envío seleccionado:", this.shippingMethod);
  
    // 🔥 Asegurar que el costo de envío se actualiza
    this.updateShippingCost();
  }

  loadAddress() {
    console.log("📍 Llamando a getLastShippingAddress...");
    if (this.user_id === null) return;
    console.log(this.user_id);
  
    this.checkoutService.getLastShippingAddress(this.user_id).subscribe({
      next: (res) => {
        console.log("📍 Respuesta del backend:", res); 
        if (res && res.address) { 
          console.log("✅ Dirección recibida:", res.address);
          this.selectedAddress = res.address;

           this.addressId = res.address.id_address;
           console.log ('Id de la dirección:', this.addressId)

          this.updateShippingOptions(); // 🔥 Actualizar opciones de envío aquí
        } else {
          console.warn("⚠️ No se encontró dirección.");
        }
      },
      error: (err) => {
        console.error("❌ Error al obtener la dirección:", err);
      }
    });
  }
  

  updateShippingOptions() {
    if (!this.selectedAddress || !this.selectedAddress.country || !this.selectedAddress.community) return;
  
    const country = this.selectedAddress.country.toUpperCase();
    const community = this.selectedAddress.community.toUpperCase();
  
    // 🚫 Bloquear Punto Pack en Canarias y Baleares
    this.isPickupPointAvailable = !(community === 'CANARIAS' || community === 'BALEARES');
  
    // 🚫 Bloquear Envío a domicilio fuera de España
    this.isHomeDeliveryAvailable = (country === 'ESPAÑA');
  
    // ⚠️ Si Punto Pack está bloqueado y el usuario lo tenía seleccionado, forzar a "domicilio"
    if (!this.isPickupPointAvailable && this.shippingMethod === 'pickup_point') {
      this.shippingMethod = 'domicilio';
      this.shippingService.updateShippingMethod(this.shippingMethod);
    }
  
    console.log("🛠️ Opciones de envío actualizadas - Domicilio:", this.isHomeDeliveryAvailable, "| Punto Pack:", this.isPickupPointAvailable);
  }

  loadCartItems() {
    if (!this.user_id) return;
    this.cartService.getCart(this.user_id).subscribe({
      next: (res) => {
        if (res && res.data) {
          this.cartItems = res.data;
          this.subtotal = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          this.calculateTotal();
          this.updateShippingCost();
        }
      },
      error: (err) => console.error("❌ Error al obtener el carrito:", err.message)
    });
  }

  applyDiscount(discount_code: string) {
    if (!this.user_id) return;

    this.cartService.applyDiscount(this.user_id!, this.discount_code).subscribe({
      next: (res) => {
        if (!res.error) {
          this.discountAmount = res.discountAmount;
          this.subtotal = res.subtotalWithDiscount;
          this.calculateTotal();
        }
      },
      error: (err) => console.error("❌ Error al aplicar el descuento:", err)
    });
  }

  updateShippingCost() {
    if (!this.user_id) return;
  
    const requestBody = {
      id_user: this.user_id,
      subtotal: this.subtotal,
      delivery_type: this.shippingMethod // Usamos el método de envío seleccionado
    };
  
    this.checkoutService.getShippingCost(requestBody).subscribe({
      next: (res) => {
        if (!res.error) {
          this.shippingCost = res.shippingCost;
          this.calculateTotal(); // Actualizar total con el nuevo costo de envío
          console.log("💰 Costo de envío actualizado:", this.shippingCost);
        } else {
          console.warn("⚠️ No se pudo actualizar el costo de envío.");
        }
      },
      error: (err) => {
        console.error("❌ Error al obtener el costo de envío:", err);
      }
    });
  }

  calculateTotal() {
    const subtotal = Number(this.subtotal) || 0;
    const discount = Number(this.discountAmount) || 0;
    const shipping = Number(this.shippingCost) || 0;
    this.totalPrice = (subtotal - discount) + shipping;

    if (isNaN(this.totalPrice) || this.totalPrice <= 0) {
      console.error("❌ El precio total no es válido.");
      return; // Si el total no es válido, no enviar la orden
    }
  }

  saveOrderToDatabase() {  
    if (!this.user_id || !this.selectedAddress || this.cartItems.length === 0) {
        console.warn("⚠️ Datos incompletos para guardar la orden.");
        return;
    }

    const orderData = {
        user_id: this.user_id,
        totalPrice: this.totalPrice, // Total de la orden
        id_address: this.addressId,
        shipping_method: this.shippingMethod,
        items: this.cartItems.map(item => ({
            variant_id: item.id_variant,
            quantity: item.quantity,
            subtotal: parseFloat(item.price) * item.quantity
        }))
    };

    console.log("📦 Datos enviados a saveOrder:", JSON.stringify(orderData, null, 2));

    this.checkoutService.saveOrder(orderData).subscribe({
        next: (res) => {
            console.log("✅ Orden guardada en la base de datos:", res);
        },
        error: (err) => {
            console.error("❌ Error al guardar la orden en la base de datos:", err);
        }
    });
}

}
