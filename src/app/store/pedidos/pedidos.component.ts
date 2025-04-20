import { Component } from '@angular/core';
import { CompraService } from '../../services/compra.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pedidos',
  imports: [CommonModule],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent {

  historial: any[] = [];

  constructor(private compraService: CompraService) { }

  ngOnInit(): void {
    this.compraService.obtenerHistorial().subscribe({
      next: (data) => {
        this.historial = data;
        console.log('Historial cargado:', data);
      },
      error: (err) => {
        console.error('Error al obtener el historial de compras', err);
      }
    });
  }

}
