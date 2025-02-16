import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ProductComponent } from './features/products/products.component';

export const routes: Routes = [
    {path:'', component: HomeComponent},
    {path: 'products', component: ProductComponent},
];
