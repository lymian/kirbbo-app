import { Component, OnInit } from '@angular/core';
import { ProductoService, Producto } from '../../services/producto.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ListaProductoComponent } from '../../components/lista-producto/lista-producto.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, ListaProductoComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  productosDestacados: Producto[] = [];
  constructor(private productoService: ProductoService) { }
  titulo: string = 'PRODUCTOS DESTACADOS';

  ngOnInit(): void {
    this.productoService.obtenerProductosRecomendados().subscribe({
      next: (data) => this.productosDestacados = data,
      error: (err) => console.error('Error al obtener productos recomendados', err)
    });
    console.log(this.productosDestacados);
  }
  imgError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/not-found.png'; // Ruta local a la imagen por defecto
  }
}
