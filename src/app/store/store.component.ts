import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../services/carrito.service';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthClienteService } from '../services/auth-cliente.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrl: './store.component.css',
  imports: [RouterOutlet, RouterModule, CommonModule],
})
export class StoreComponent implements OnInit {
  totalProductos: number = 0;
  nombreUsuario: string | null = null;
  constructor(private carritoService: CarritoService, private router: Router, private authService: AuthClienteService) { }

  ngOnInit(): void {
    this.authService.nombreUsuario$.subscribe(nombre => {
      this.nombreUsuario = nombre;
    });
    // Suscribirse a los cambios en el carrito
    this.carritoService.carrito$.subscribe(carrito => {
      console.log('Carrito actualizado 02');
      this.totalProductos = carrito.length;
    });


  }
  logout() {
    Swal.fire({
      icon: 'success',
      title: 'Sesión cerrada',
      text: 'Has cerrado sesión correctamente.',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });

    // Espera a que finalice el timer para cerrar sesión y redirigir
    setTimeout(() => {
      this.authService.logout();
      this.router.navigate(['/inicio']); // o a donde quieras redirigir
    }, 2000);
  }
}