import { Component, OnInit } from '@angular/core';
import { CarritoItem, Producto, ProductoService } from '../../services/producto.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-producto',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent implements OnInit {
  producto?: Producto;
  productosSimilares: Producto[] = [];
  mensaje = '';
  cssMensaje = '';

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.mensaje = '';
      this.cssMensaje = '';
      const id = Number(params.get('id'));

      this.productoService.obtenerProductoPorId(id).subscribe({
        next: (prod) => {
          this.producto = prod;

          // Obtener productos similares (misma categoría)
          if (prod.categoria?.id) {
            this.productoService.obtenerProductosPorCategoria(prod.categoria.id).subscribe({
              next: (data) => {
                this.productosSimilares = data.filter(p => p.id !== prod.id);
              },
              error: (err) => console.error('Error al obtener productos similares', err)
            });
          }

          // Desplazar al inicio de la página
          this.viewportScroller.scrollToPosition([0, 0]);
        },
        error: (err) => console.error('Error al obtener producto', err)
      });
    });
  }

  agregarAlCarrito(cantidadStr: string): void {
    const cantidad = parseInt(cantidadStr, 10);
    if (isNaN(cantidad) || cantidad <= 0) {
      this.mensaje = 'Ingrese una cantidad válida ❌';
      this.cssMensaje = 'text-danger ms-2 fw-bold';
      return;
    }

    if (this.producto) {
      const resultado = this.carritoService.agregarAlCarrito(this.producto, cantidad);
      this.mensaje = resultado;
      this.cssMensaje = resultado.includes('✅') ? 'text-success ms-2 fw-bold' : 'text-danger ms-2 fw-bold';
    } else {
      this.mensaje = 'Error: Producto no encontrado ❌';
      this.cssMensaje = 'text-danger ms-2 fw-bold';
    }
  }
  imgError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/not-found.png'; // Ruta local a la imagen por defecto
  }
}
