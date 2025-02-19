import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CheckoutService } from '../../core/services/checkout.service';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-shipping',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './shipping.component.html',
  styleUrl: './shipping.component.css'
})
export class ShippingComponent implements OnInit {

  shippingForm: FormGroup;
  isSubmitting: boolean = false;  // Para controlar el estado de envío
  errorMessage: string = ''; 

  constructor(private fb: FormBuilder,
    private checkoutService: CheckoutService,
    private router: Router
  ) {
    this.shippingForm = this.fb.group({  // Inicializamos shippingForm en el constructor
      name: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      province: ['', Validators.required],
      postal_code: ['', Validators.required],
      country: ['', Validators.required],
      phone: ['', Validators.required]
    });
  }
  ngOnInit(): void {

  }

  // Método que se ejecuta al enviar el formulario
  onSubmit(): void {
    if (this.shippingForm.invalid) {
      return; // Si el formulario es inválido, no hacer nada
    }
    const id_user = 1;
    const shippingData = { ...this.shippingForm.value, id_user };

    this.checkoutService.submitShippingData(shippingData).subscribe(
      response => {
        // Si todo va bien, redirigir al usuario a la página de confirmación
        this.router.navigate(['/order-confirmation']);
      },
      error => {
        // Mostrar mensaje de error si falla la solicitud
        console.error('Error al enviar los datos de envío:', error);
      }
    );
  }
}