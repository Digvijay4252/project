import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { UserDashboardComponent } from './features/user/user-dashboard/user-dashboard.component';
import { FoodListComponent } from './features/user/food-list/food-list.component';
import { FoodDetailComponent } from './features/user/food-detail/food-detail.component';
import { StoreProfileComponent } from './features/user/store-profile/store-profile.component';
import { SellerDashboardComponent } from './features/seller/seller-dashboard/seller-dashboard.component';
import { SellerFoodsComponent } from './features/seller/seller-foods/seller-foods.component';
import { SellerOrdersComponent } from './features/seller/seller-orders/seller-orders.component';
import { StoreSettingsComponent } from './features/seller/store-settings/store-settings.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './features/admin/admin-users/admin-users.component';
import { AdminSellersComponent } from './features/admin/admin-sellers/admin-sellers.component';
import { AdminFoodsComponent } from './features/admin/admin-foods/admin-foods.component';
import { AdminOrdersComponent } from './features/admin/admin-orders/admin-orders.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  {
    path: 'user',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['USER'] },
    children: [
      { path: '', component: UserDashboardComponent },
      { path: 'foods', component: FoodListComponent },
      { path: 'foods/:id', component: FoodDetailComponent },
      { path: 'stores/:id', component: StoreProfileComponent }
    ]
  },
  {
    path: 'seller',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['SELLER'] },
    children: [
      { path: '', component: SellerDashboardComponent },
      { path: 'foods', component: SellerFoodsComponent },
      { path: 'orders', component: SellerOrdersComponent },
      { path: 'store', component: StoreSettingsComponent }
    ]
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] },
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'sellers', component: AdminSellersComponent },
      { path: 'foods', component: AdminFoodsComponent },
      { path: 'orders', component: AdminOrdersComponent }
    ]
  },
  { path: '**', redirectTo: 'auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
