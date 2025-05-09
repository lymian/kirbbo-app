import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductoService, Producto, Categoria } from '../../services/producto.service';
import { ActivatedRoute } from '@angular/router';
import { ListaProductoComponent } from '../../components/lista-producto/lista-producto.component';

@Component({
  selector: 'app-productos',
  imports: [CommonModule, RouterModule, ListaProductoComponent],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit {
  categorias: Categoria[] = [];
  productos: Producto[] = [];
  categoriaSeleccionada: Categoria | null = null;
  titulo: string = 'TODOS LOS PRODUCTOS';

  constructor(
    private productoService: ProductoService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.cargarCategoriasYProductos();
  }

  cargarCategoriasYProductos(): void {
    this.productoService.obtenerCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;

        this.route.paramMap.subscribe(params => {
          const idCategoria = params.get('id');
          if (idCategoria) {
            const id = +idCategoria;
            this.categoriaSeleccionada = categorias.find(c => c.id === id) || null;
            this.cargarProductosPorCategoria(id);
            this.titulo = this.categoriaSeleccionada?.nombre?.toUpperCase() || 'TODOS LOS PRODUCTOS';
          } else {
            this.categoriaSeleccionada = null;
            this.cargarProductos();
          }
        });
      },
      error: (err) => console.error('Error al obtener categorías', err)
    });
  }

  cargarCategorias(): void {
    this.productoService.obtenerCategorias().subscribe({
      next: (data) => this.categorias = data,
      error: (err) => console.error('Error al obtener categorias', err)
    });
  }

  cargarProductos(): void {
    this.productoService.obtenerProductos().subscribe({
      next: (data) => this.productos = data,
      error: (err) => console.error('Error al obtener productos', err)
    });
  }

  cargarProductosPorCategoria(id: number): void {
    this.productoService.obtenerProductosPorCategoria(id).subscribe({
      next: (data) => this.productos = data,
      error: (err) => console.error('Error al obtener productos por categoría', err)
    });
  }
  imgError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/not-found.png'; // Ruta local a la imagen por defecto
  }
}