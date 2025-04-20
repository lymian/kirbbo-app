import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from './producto.service';

export interface CarritoItem {
  producto: Producto;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito = new BehaviorSubject<CarritoItem[]>(this.obtenerCarritoInicial());
  carrito$ = this.carrito.asObservable();

  private obtenerCarritoInicial(): CarritoItem[] {
    const carritoStr = localStorage.getItem('carrito');
    return carritoStr ? JSON.parse(carritoStr) : [];
  }

  agregarAlCarrito(producto: Producto, cantidad: number): string {
    const carrito = this.carrito.value;
    const itemExistente = carrito.find(item => item.producto.id === producto.id);

    if (itemExistente) {
      const nuevaCantidad = itemExistente.cantidad + cantidad;

      if (nuevaCantidad > producto.stock) {
        return `Solo hay ${producto.stock} unidades disponibles en stock ❌`;
      }

      itemExistente.cantidad = nuevaCantidad;
    } else {
      if (cantidad > producto.stock) {
        return `Solo hay ${producto.stock} unidades disponibles en stock ❌`;
      }

      carrito.push({ producto, cantidad });
    }

    this.actualizarCarrito(carrito);
    return 'Producto agregado al carrito ✅';
  }

  actualizarCarrito(carrito: CarritoItem[]): void {
    console.log('Carrito actualizado 01');
    localStorage.setItem('carrito', JSON.stringify(carrito));
    console.log(carrito);
    this.carrito.next(carrito); // Notifica a los suscriptores
  }

  obtenerCarrito(): CarritoItem[] {
    return this.carrito.value;
  }
}