import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ProductComponent } from './features/products/products.component';
import { ProductDetailComponent } from './features/product-detail/product-detail.component';
import { CartComponent } from './features/cart/cart.component';
import { ShippingComponent } from './features/shipping/shipping.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { PaymentComponent } from './features/payment/payment.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { VerifyEmailComponent } from './features/auth/verify-email/verify-email.component';
import { LoginComponent } from './features/auth/login/login.component';
import { ProfileComponent } from './features/profile/profile.component';
import { AvisoComponent } from './features/footer-pages/aviso/aviso.component';
import { EnviosComponent } from './features/footer-pages/envios/envios.component';
import { PrivacidadComponent } from './features/footer-pages/privacidad/privacidad.component';
import { TerminosComponent } from './features/footer-pages/terminos/terminos.component';
import { ContactoComponent } from './features/sidebar-pages/contacto/contacto.component';
import { AboutComponent } from './features/sidebar-pages/about/about.component';
import { DevolucionComponent } from './features/footer-pages/devolucion/devolucion.component';
import { SuccessComponent } from './features/success/success.component';


export const routes: Routes = [
    {path:'', component: HomeComponent},
    {path: 'home', component: HomeComponent},
    {path: 'products', component: ProductComponent},
    {path: 'products/:id', component: ProductDetailComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'verify-email', component: VerifyEmailComponent },
    {path: 'login', component: LoginComponent },
    {path: 'profile', component: ProfileComponent },
    {path: 'cart', component: CartComponent},
    {path: 'shipping', component: ShippingComponent},
    {path: 'checkout', component: CheckoutComponent},
    {path: 'payment', component: PaymentComponent},
    {path: 'aviso', component: AvisoComponent},
    {path: 'envios', component: EnviosComponent},
    {path: 'privacidad', component: PrivacidadComponent},
    {path: 'terminos', component: TerminosComponent},
    {path: 'devolucion', component: DevolucionComponent},
    {path: 'contacto', component: ContactoComponent},
    {path: 'about', component: AboutComponent},
    {path: 'success', component: SuccessComponent },



];
