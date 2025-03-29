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
    // Aquí puedes capturar cualquier parámetro de la URL si es necesario
    // const transactionId = this.route.snapshot.queryParamMap.get('transactionId');
    // const totalPrice = this.route.snapshot.queryParamMap.get('totalPrice');
    
    // console.log('Transacción ID:', transactionId);
    // console.log('Precio Total:', totalPrice);
    
    // Aquí puedes agregar lógica adicional si es necesario
    // Pero si solo quieres mostrar el mensaje, no hace falta hacer más
  }


    goToHome(): void {
      this.router.navigate(['/']);
    }
  }
