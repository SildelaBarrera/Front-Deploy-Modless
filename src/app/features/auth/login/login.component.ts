import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  submitLogin() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        console.log("🔑 Token recibido en el login:", response.token);
        localStorage.setItem('token', response.token);
        this.router.navigate(['/home']); // Redirige tras login exitoso
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Error al iniciar sesión.';
        this.isLoading = false;
      }
    });
  }

  onLoginSuccess(): void {
    const redirectUrl = sessionStorage.getItem('redirectUrl');

    if (redirectUrl) {
      console.log("Redirecting to: ", redirectUrl);  // Verifica si la URL se está obteniendo correctamente
      this.router.navigate([redirectUrl]);
      sessionStorage.removeItem('redirectUrl');
    } else {
      console.log("No redirect URL found, redirecting to home");
      this.router.navigate(['/home']);
    }
}
}
