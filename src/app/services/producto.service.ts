import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface Categoria {
  id: number;
  nombre: string;
}

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  descuento?: number;
  estado: boolean;
  categoria?: Categoria;
}
export interface Categoria {
  id: number;
  nombre: string;
}
export interface CarritoItem {
  producto: Producto;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://68.211.176.134:81/kirbbo/'; // Cambia el puerto si es distinto

  constructor(private http: HttpClient) { }

  obtenerProductosRecomendados(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}productos/listar/recomendados`);
  }
  obtenerCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}categorias`);
  }
  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}productos/listar/estado/true`);
  }
  obtenerProductosPorCategoria(id: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}productos/listar/habilitados/${id}`);
  }
  obtenerProductoPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}productos/${id}`);
  }

}
