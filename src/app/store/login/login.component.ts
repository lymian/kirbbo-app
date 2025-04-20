import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthClienteService } from '../../services/auth-cliente.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  formulario: FormGroup;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthClienteService,
    private router: Router
  ) {
    this.formulario = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  iniciarSesion() {
    if (this.formulario.invalid) return;

    this.authService.login(this.formulario.value).subscribe({
      next: () => {
        Swal.fire({
          imageUrl: 'assets/images/hi.gif',
          imageHeight: 200,
          title: 'BIENVENIDO',
          timer: 2500,
          showConfirmButton: false,
          background: 'rgb(244, 204, 204)',
          customClass: {
            image: 'swal-image-on-top',
            popup: 'swal-custom-login'
          }
        });
        this.router.navigate(['/inicio']); // Ruta de inicio tras login
      },
      error: (err) => {
        this.error = err.message;
      },
    });
  }

}
