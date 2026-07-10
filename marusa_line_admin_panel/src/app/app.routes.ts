import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ShopDetailsComponent } from './pages/shop-details/shop-details.component';
import { AddShopComponent } from './pages/add-shop/add-shop.component';
import { UsersComponent } from './pages/users/users.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
    { path:'login', component: LoginComponent},
    { path:'home', component: HomeComponent, canActivate:[authGuard]},
    { path:'shop-details/:id', component: ShopDetailsComponent, canActivate:[authGuard]},
    { path:'add-shop', component: AddShopComponent, canActivate:[authGuard]},
    { path:'users', component: UsersComponent, canActivate:[authGuard]},
    { path: '', component: HomeComponent, canActivate:[authGuard] },
    { path: '**', component: HomeComponent, canActivate:[authGuard] }
];
