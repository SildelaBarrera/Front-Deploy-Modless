import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckoutService } from '../../core/services/checkout.service';


@Component({
  selector: 'app-success',
  imports: [],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})

export class SuccessComponent implements OnInit {
  token: string | null = null;
  transactionId: string | null = '';
  totalPrice: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private checkoutService: CheckoutService
  ) {}

  ngOnInit(): void {
    this.transactionId = this.route.snapshot.queryParamMap.get('transactionId');
      this.totalPrice = Number(this.route.snapshot.queryParamMap.get('totalPrice'));
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      if (this.token) {
        this.confirmPayment();
      }
    });
  }

  confirmPayment(): void {
    if (this.token) {
      this.checkoutService.capturePayPalOrder(this.token).subscribe(
        (response) => {
          // Aquí puedes manejar la respuesta de la confirmación del pago
          console.log('Pago confirmado con éxito', response);
        },
        (error) => {
          console.error('Error al confirmar el pago', error);
        }
      );
    }
  }
    goToHome(): void {
      this.router.navigate(['/']);
    }
  }
