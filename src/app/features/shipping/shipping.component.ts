import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CheckoutService } from '../../core/services/checkout.service';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-shipping',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.css']
})
export class ShippingComponent implements OnInit {
  
  shippingForm: FormGroup;
  isSubmitting: boolean = false;
  availableCountries: string[] = ["España", "Portugal", "Francia", "Belgica", "Luxemburgo", "Polonia",
    "Italia", "Alemania", "Austria", 
  ];
  selectedCountry: string = "España"; // Por defecto España

  regionsByCountry: { [key: string]: string[] } = {
    "España": ["Andalucía","Aragón","Asturias","Baleares",
    "Canarias","Cantabria","Castilla-La Mancha","Castilla y León","Cataluña",
    "Extremadura","Galicia","Madrid","Murcia","Navarra",
    "La Rioja", "País Vasco","Valencia"
  ],
  };

  // filteredRegions: string[] = [];
  errorMessage: string = '';
  userAddress: any;  // Variable para almacenar la dirección del usuario

  constructor(
    private fb: FormBuilder,
    private checkoutService: CheckoutService,
    private authService: AuthService,
    private router: Router
  ) {
    this.shippingForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      province: ['', Validators.required],
      country: [this.selectedCountry, Validators.required],
      community:  [""],
      postal_code: ['', Validators.required],
      phone: ['', Validators.required],
    });
  }
  // updateRegions() {
  //   const selectedCountry = this.shippingForm.get('country')?.value;
  //   this.filteredRegions = this.regionsByCountry[selectedCountry] || [];
  //   this.shippingForm.get('community')?.setValue('');  // Resetear selección
  // }
  onCountryChange(event: any) {
    this.selectedCountry = event.target.value;
    
    // Si el país NO es España, vaciar el campo community
    if (this.selectedCountry !== "España") {
      this.shippingForm.controls['community'].setValue(""); 
    }
  }

  ngOnInit(): void {
    this.loadUserAddress();  // Cargar la última dirección del usuario cuando se inicie el componente
  }

  // Cargar la última dirección del usuario desde el backend
  loadUserAddress(): void {
    const user = this.authService.getUser();  // Obtener el usuario desde el servicio de autenticación

    if (user && user.id_user) {
      // Llamar al servicio para obtener la dirección
      this.checkoutService.getLastShippingAddress(user.id_user).subscribe(
        (response) => {
          if (response.error) {
            this.errorMessage = response.message;
          } else {
            this.userAddress = response.address;
            this.populateForm(this.userAddress);  // Poblamos el formulario con los datos de la dirección
          }
        },
        (error) => {
          console.error('Error al obtener la dirección del usuario:', error);
          this.errorMessage = 'Hubo un error al obtener la dirección.';
        }
      );
    } else {
      this.errorMessage = 'No se pudo obtener el usuario.';
    }
  }

  // Poblamos el formulario con la dirección del usuario
  populateForm(address: any): void {
    this.shippingForm.patchValue({
      name: address.name,
      address: address.address,
      city: address.city,
      province: address.province,
      country: address.country,
      community:address.community,
      postal_code: address.postal_code,
      phone: address.phone
    });

    // Si el país seleccionado está en la lista de países, no es necesario manejar el costo de envío
    // ya que el backend lo calculará y lo enviará como parte del proceso de checkout.
  }

  // Método que se ejecuta al enviar el formulario
  onSubmit(): void {
    if (this.shippingForm.valid) {
      const formData = this.shippingForm.value;

      // Obtener el usuario desde el servicio de autenticación
      const user = this.authService.getUser();

      if (user && user.id_user) {
        formData.id_user = user.id_user;  // Agregar el id_user al formData

        // Aquí envías el formulario al backend para guardar la dirección
        this.checkoutService.submitShippingData(formData).subscribe(
          (response) => {
            if (!response.error) {
              // Si la respuesta es exitosa, redirigimos a la página de checkout
              this.router.navigate(['/checkout']);
            } else {
              this.errorMessage = response.message;
            }
          },
          (error) => {
            console.error('Error al enviar la dirección de envío', error);
            this.errorMessage = 'Hubo un error al procesar tu solicitud.';
          }
        );
      } else {
        this.errorMessage = 'El usuario no está autenticado o no se ha encontrado el id_user.';
      }
    } else {
      this.errorMessage = 'Por favor, complete todos los campos correctamente.';
    }
  }
}
