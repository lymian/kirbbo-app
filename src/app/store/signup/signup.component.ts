import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthClienteService } from '../../services/auth-cliente.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [RouterLink, CommonModule,
    ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {

  formRegistro!: FormGroup;
  mensajeError: string = '';

  constructor(private fb: FormBuilder, private authService: AuthClienteService, private router: Router) { }

  ngOnInit(): void {
    this.formRegistro = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      username: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9,15}$/)]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', Validators.required],
      direccion: [''] // no se envía al backend
    });
  }

  registrarUsuario(): void {
    this.mensajeError = '';

    if (this.formRegistro.invalid) {
      this.mensajeError = 'Por favor complete todos los campos requeridos.';
      return;
    }

    const { password, confirmarPassword } = this.formRegistro.value;
    if (password !== confirmarPassword) {
      this.mensajeError = 'Las contraseñas no coinciden.';
      return;
    }

    const datos = {
      nombre: this.formRegistro.value.nombre,
      apellido: this.formRegistro.value.apellido,
      username: this.formRegistro.value.username,
      telefono: this.formRegistro.value.telefono,
      correo: this.formRegistro.value.correo,
      password: this.formRegistro.value.password
    };

    this.authService.registrar(datos).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: 'Iniciando sesión...',
          timer: 2000,
          showConfirmButton: false
        });

        // Intentar login luego de un breve delay
        setTimeout(() => {
          const credenciales = {
            username: datos.username,
            password: datos.password
          };

          this.authService.login(credenciales).subscribe({
            next: () => {
              this.router.navigate(['/inicio']); // Redirección automática
            },
            error: () => {
              this.mensajeError = 'Se registró el usuario, pero no se pudo iniciar sesión automáticamente.';
            }
          });
        }, 2000);

        this.formRegistro.reset();
      },
      error: (err) => {
        console.log('error desde el componente:' + err);
        if (err) {
          this.mensajeError = err;
        } else if (err.error?.errors) {
          const errores = Object.values(err.error.errors).flat();
          this.mensajeError = errores.join(', ');
        } else {
          this.mensajeError = 'Ocurrió un error inesperado.';
        }
      }
    });
  }

}
