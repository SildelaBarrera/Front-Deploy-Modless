import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-contacto',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {
  contactoForm: FormGroup;
  mensajeEnviado: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactoForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mensaje: ['', Validators.required]
    });
  }

  enviarFormulario() {
    if (this.contactoForm.valid) {
      this.http.post('http://localhost:5000/api/contact/send-email', this.contactoForm.value)
        .subscribe({
          next: (response: any) => {
            this.mensajeEnviado = response.message;
            this.contactoForm.reset();
          },
          error: (error) => {
            this.mensajeEnviado = "Error al enviar el mensaje.";
            console.error('Error:', error);
          }
        });
    }
  }
}
