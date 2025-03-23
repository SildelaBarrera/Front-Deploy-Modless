import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../core/services/profile.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { OrderDetail } from '../../core/models/order-details.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  
  userProfile: any = {
    id_user: null,
    email: '',
    name: '',
    phone: '',
    role: '',
    addresses: [],
    orders: []
  };

  errorMessage: string = '';
  isLoading: boolean = false;
  orderDetails: OrderDetail[] = [];

  constructor(
    private profileService: ProfileService, 
    private checkoutService: CheckoutService
  ) {}

  ngOnInit(): void {
    console.log("ngOnInit ha sido llamado.");
  
    this.getUserProfile();
  }
  
  getUserProfile(): void {
    this.isLoading = true;
    this.profileService.getProfile().subscribe(
      (data) => {
        console.log("Datos del perfil recibidos:", data);
        if (data) {
          this.userProfile = data;

          // 🔹 Filtrar direcciones duplicadas
          this.userProfile.addresses = this.userProfile.addresses.filter(
            (address: any, index: number, self: any[]) =>
              index === self.findIndex(
                (a: any) =>
                  a.address === address.address &&
                  a.city === address.city &&
                  a.postal_code === address.postal_code
              )
          );

          console.log("Órdenes del usuario:", this.userProfile.orders);
          if (this.userProfile.orders && this.userProfile.orders.length > 0) {
            const orderId = this.userProfile.orders[0].id;
            this.loadOrderDetails(orderId);
          } else {
            console.error('No se encontró ninguna orden para mostrar');
          }
        } else {
          this.errorMessage = 'No se encontró información del perfil';
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al cargar el perfil:', error);
        this.errorMessage = 'Error al cargar el perfil';
        this.isLoading = false;
      }
    );
  }

  loadOrderDetails(orderId: number): void {
    if (!orderId) {
      console.error('No se ha proporcionado un ID válido para la orden.');
      return;
    }

    this.checkoutService.getOrderDetails(orderId).subscribe(
      (data) => {
        console.log('Detalles de la orden:', data);
      },
      (error) => {
        console.error('Error al obtener detalles de la orden:', error);
      }
    );
  } 
}
