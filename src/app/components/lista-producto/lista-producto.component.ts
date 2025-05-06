import { Component, Input, ViewChild, ViewContainerRef, ComponentRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Producto } from '../../services/producto.service';
import { CardProductoComponent } from '../card-producto/card-producto.component';

@Component({
  selector: 'app-lista-producto',
  imports: [CommonModule, CardProductoComponent],
  templateUrl: './lista-producto.component.html',
  styleUrl: './lista-producto.component.css'
})
export class ListaProductoComponent {
  @Input() titulo!: string | undefined;
  @Input() productos!: Producto[];
}