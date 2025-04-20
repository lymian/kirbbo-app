import { Component, OnInit } from '@angular/core';
import { ProductoService, Producto } from '../../services/producto.service';
import { CommonModule } from '@angular/common';
import { Router , RouterModule} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [ CommonModule, RouterModule ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  productosDestacados: Producto[] = [];
  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.productoService.obtenerProductosRecomendados().subscribe({
      next: (data) => this.productosDestacados = data,
      error: (err) => console.error('Error al obtener productos recomendados', err)
    });
    
  }
}
