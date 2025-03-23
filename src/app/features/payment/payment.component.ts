import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CheckoutService } from "../../core/services/checkout.service";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})

export class PaymentComponent {
  
  // message: string = '';
  // isLoading = false;
  // paymentForm: FormGroup;

  // constructor(private fb: FormBuilder, private checkoutService: CheckoutService) {  
  //   this.paymentForm = this.fb.group({
  //     id_order: ['', Validators.required],
  //     method: ['', Validators.required],
  //     id_transaction: ['', Validators.required],
  //     amount: ['', [Validators.required, Validators.min(0.01)]],
  //     status: ['', Validators.required]
  //   });
  // }

  // submitPayment() {
  //   if (this.paymentForm.invalid) {
  //     this.message = 'Por favor, completa todos los campos correctamente.';
  //     return;
  //   }

  //   this.isLoading = true;
  //   this.message = '';

  //   this.checkoutService.addPayment(this.paymentForm.value).subscribe({
  //     next: (response) => {
  //       this.message = 'Pago registrado con éxito!';
  //       this.paymentForm.reset();
  //     },
  //     error: (err) => {
  //       this.message = err.error.error || 'Error al procesar el pago.';
  //     },
  //     complete: () => {
  //       this.isLoading = false;
  //     }
  //   });
  // }
}