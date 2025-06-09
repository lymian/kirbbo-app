import { Component, Input, OnInit } from '@angular/core';
import { Producto } from '../../services/producto.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card-producto',
  imports: [CommonModule, RouterLink],
  templateUrl: './card-producto.component.html',
  styleUrl: './card-producto.component.css',
})
export class CardProductoComponent implements OnInit {
  @Input() producto!: Producto;
  imagenUrl: string = '';

  ngOnInit() {
    this.imagenUrl = `https://api.kirbbo.lymian.xyz/uploads/${this.producto.id}.png`;
  }

  imgAttempts = new WeakMap<HTMLImageElement, number>();

  imgError(event: Event) {
    const target = event.target as HTMLImageElement;
    const attempts = this.imgAttempts.get(target) ?? 0;

    if (attempts < 1) {
      this.imgAttempts.set(target, attempts + 1);
      target.src = 'assets/images/not-found.png';
    } else {
      console.warn('Falló carga de imagen y su respaldo:', target.src);
    }
  }
}
