import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';


@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  get f() {
    return this.registerForm.controls;
  }

  constructor(private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        repeatPassword: ['', Validators.required],
        phone: ['', Validators.required],
        newsletter: [false],  // Para el checkbox de newsletter
        privacity: [false, Validators.requiredTrue], // Para el checkbox de política de privacidad
      },
      { validators: this.passwordsMatch } // Validación para verificar que las contraseñas coinciden
    );
  }

  // Validación personalizada para comprobar que las contraseñas coincidan
  passwordsMatch(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const repeatPassword = formGroup.get('repeatPassword')?.value;
    return password === repeatPassword ? null : { mismatch: true };
  }

  // Método para enviar los datos al backend usando el servicio
  submitRegister() {
    console.log("🟢 Estado del formulario:", this.registerForm.valid);
    console.log("✅ Datos enviados:", this.registerForm.value);
    console.log("🛑 Errores en los campos:", this.registerForm.errors);
  
    if (this.registerForm.invalid) {
      this.errorMessage = 'Verifica los campos del formulario.';
      console.warn("❌ El formulario tiene errores");
      return;
    }
  
    this.isLoading = true;
    this.authService.register(this.registerForm.value).subscribe(
      (response: any) => {
        console.log("🟢 Respuesta del backend:", response);
        this.successMessage = response.message;
        this.isLoading = false;
        this.router.navigate(['/verify-email']);
      },
      (error) => {
        console.error("🔴 Error al registrar:", error);
        this.errorMessage = error.error.message || 'Hubo un error al registrar el usuario';
        this.isLoading = false;
      }
    );
  }
  
}
