import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface DetalleCompra {
  productoId: number;
  cantidad: number;
}

interface Pedido {
  boletaId: number;
  nombreCliente: string;
  apellidoCliente: string;
  fechaEmision: string;
  total: number;
  detalles: DetalleCompra[];
  direccion: string;
  estado: number;
}

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private apiUrl = 'https://localhost:44356/kirbbo/compra';

  constructor(private http: HttpClient) { }

  realizarCompra(direccion: string): Observable<any> {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

    const detalles: DetalleCompra[] = carrito.map((item: any) => ({
      productoId: item.producto.id,
      cantidad: item.cantidad
    }));

    const body = {
      direccion: direccion,
      detalles: detalles
    };

    return this.http.post(this.apiUrl, body);
  }

  // 🔽 Nuevo método para historial
  obtenerHistorial(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/historial`);
  }
}
