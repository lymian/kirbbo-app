import { Routes } from '@angular/router';
import { HomeComponent } from './store/home/home.component';
import { StoreComponent } from './store/store.component';
import { ProductosComponent } from './store/productos/productos.component';
import { ProductoComponent } from './store/producto/producto.component';
import { CarritoComponent } from './store/carrito/carrito.component';
import { LoginComponent } from './store/login/login.component';
import { SignupComponent } from './store/signup/signup.component';
import { PedidosComponent } from './store/pedidos/pedidos.component';


export const routes: Routes = [
    {
        path: '', redirectTo: 'inicio', pathMatch: 'full'
    },
    {
        path: 'inicio', component: StoreComponent, children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'productos', component: ProductosComponent },
            { path: 'productos/categoria/:id', component: ProductosComponent },
            { path: 'producto/:id', component: ProductoComponent },
            { path: 'carrito', component: CarritoComponent },
            { path: 'login', component: LoginComponent },
            { path: 'signup', component: SignupComponent },
            { path: 'pedidos', component: PedidosComponent },]
    },
];
