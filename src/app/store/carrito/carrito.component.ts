import { Component, OnInit } from '@angular/core';
import { CarritoItem, Producto } from '../../services/producto.service'; // Ajusta según tu ruta
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../services/carrito.service';
import Swal from 'sweetalert2';
import { ProductoService } from '../../services/producto.service';
import { Router, RouterLink } from '@angular/router';
import { CompraService } from '../../services/compra.service';
import { AuthClienteService } from '../../services/auth-cliente.service';
import { ListaProductoComponent } from '../../components/lista-producto/lista-producto.component';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  imports: [CommonModule, FormsModule, RouterLink, ListaProductoComponent],
})
export class CarritoComponent implements OnInit {
  carrito: CarritoItem[] = [];
  direccion: string = '';
  mensaje: string = '';
  productosDestacados: Producto[] = [];
  titulo: string = 'RECOMENDADOS';

  logeado: boolean = false;

  constructor(private carritoService: CarritoService,
    private productoService: ProductoService,
    private compraService: CompraService,
    private router: Router,
    private authClienteService: AuthClienteService) { }

  ngOnInit(): void {
    const carritoStorage = localStorage.getItem('carrito');
    this.carrito = carritoStorage ? JSON.parse(carritoStorage) : [];
    // Cargar productos destacados
    this.productoService.obtenerProductosRecomendados().subscribe(
      (productos: Producto[]) => {
        this.productosDestacados = productos;
      },
      (error) => {
        console.error('Error al cargar productos destacados', error);
      }
    );
    // Verificar si el usuario está logueado
    this.logeado = this.authClienteService.isLoggedIn();
  }

  calcularPrecioFinal(producto: Producto): number {
    if (producto.descuento) {
      return +(producto.precio * (1 - producto.descuento / 100)).toFixed(2);
    }
    return producto.precio;
  }

  calcularImporte(detalle: CarritoItem): number {
    return this.calcularPrecioFinal(detalle.producto) * (detalle as any).cantidad;
  }

  get total(): number {
    return this.carrito.reduce((sum, p: any) => sum + this.calcularImporte(p), 0);
  }

  editarCantidad(productoId: number, nuevaCantidad: number): void {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

    const item = carrito.find((p: any) => p.producto.id === productoId);
    if (item) {
      // Validar stock
      if (nuevaCantidad <= 0 || nuevaCantidad > item.producto.stock) {
        this.mensaje = 'Cantidad no válida.';
        return;
      }

      item.cantidad = nuevaCantidad;
      localStorage.setItem('carrito', JSON.stringify(carrito));
      this.mensaje = 'Cantidad actualizada.';
      this.carritoService.actualizarCarrito(carrito); // recargar datos actualizados
      this.carrito = carrito; // Actualiza el carrito en el componente
    }
    Swal.fire({
      icon: 'success',
      title: 'Cantidad actualizada',
      text: 'La cantidad del producto ha sido actualizada correctamente.',
      timer: 1500,
      showConfirmButton: false
    });
  }

  eliminarProducto(productoId: number): void {
    let carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

    carrito = carrito.filter((p: any) => p.producto.id !== productoId);

    localStorage.setItem('carrito', JSON.stringify(carrito));

    this.mensaje = 'Producto eliminado del carrito.';
    this.carritoService.actualizarCarrito(carrito); // recargar datos actualizados
    this.carrito = carrito; // Actualiza el carrito en el componente
    Swal.fire({
      icon: 'error',
      title: 'Producto eliminado',
      text: 'El producto ha sido eliminado del carrito.',
      timer: 1500,
      showConfirmButton: false
    });
  }

  guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }

  resetDireccion() {
    this.direccion = 'Av. Ejemplo 123';
  }
  calcularTotal(): number {
    return this.carrito.reduce((total: number, detalle: any) => {
      const precio = detalle.producto.precio;
      const descuento = detalle.producto.descuento || 0;
      const precioFinal = precio - (precio * descuento / 100);
      const importe = precioFinal * detalle.cantidad;
      return total + importe;
    }, 0);
  }

  procesarCompra() {
    console.log('Dirección de envío:', this.direccion);
    if (!this.direccion) {
      Swal.fire({
        icon: 'warning',
        title: 'Dirección requerida',
        text: 'Por favor, ingresa una dirección de envío.',
      });
      return;
    }

    if (this.carrito.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Carrito vacío',
        text: 'No hay productos en el carrito.',
      });
      return;
    }

    if (!this.logeado) {
      Swal.fire({
        icon: 'warning',
        title: 'Iniciar sesión',
        text: 'Debes iniciar sesión para realizar la compra.',
      });
      return;
    }
    this.compraService.realizarCompra(this.direccion).subscribe({
      next: (res) => {
        console.log('Compra realizada con éxito:', res);
        localStorage.removeItem('carrito'); // Limpiar carrito después de realizar la compra
        Swal.fire({
          icon: 'success',
          title: 'Compra exitosa',
          text: 'Gracias por tu compra.',
          timer: 2500,
          showConfirmButton: false
        });
        setTimeout(() => {
          window.location.reload(); // Recargar la página después de 2.5 segundos
        }, 2400);
      },
      error: (err) => {
        console.error('Error al realizar la compra:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un problema al procesar la compra.',
        });
      }
    });
  }
  imgError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/not-found.png'; // Ruta local a la imagen por defecto
  }
}
