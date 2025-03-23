import { Component } from '@angular/core';
import { AuthService } from "../../../core/services/auth.service";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Asegúrate de importar Router

@Component({
  selector: 'app-verify-email',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css'
})
export class VerifyEmailComponent {

  verifyForm: FormGroup;
  verificationCode = "";
  message = "";
  isLoading = false;

  constructor(
    private authService: AuthService, 
    private fb: FormBuilder,
    private router: Router  // Asegúrate de inyectar Router aquí
  ) {
    this.verifyForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      verificationCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  onSubmit() {
    if (this.verifyForm.invalid) return;

    this.isLoading = true;
    const { email, verificationCode } = this.verifyForm.value;

    this.authService.verifyEmail(email, verificationCode).subscribe(
      (response) => {
        // Redirigir al usuario a la página de inicio de sesión o a otra página después de la verificación
        this.router.navigate(['/login']);  // O la ruta que corresponda después de la verificación
      },
      (error) => {
        this.isLoading = false;
        this.message = 'Hubo un error al verificar el correo. Inténtalo nuevamente.';
        console.log('Error al verificar el correo', error);
      }
    );
  }
}
