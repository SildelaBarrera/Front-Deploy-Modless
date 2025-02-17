import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ProductComponent } from './features/products/products.component';
import { ProductDetailComponent } from './features/product-detail/product-detail.component';
// import { CartComponent } from './features/cart/cart.component';

export const routes: Routes = [
    {path:'', component: HomeComponent},
    {path: 'products', component: ProductComponent},
    {path: 'products/:id', component: ProductDetailComponent},
    // {path: 'cart', component: CartComponent}

];
