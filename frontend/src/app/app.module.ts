import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { MapViewComponent } from './shared/components/map-view/map-view.component';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserDashboardComponent,
    FoodListComponent,
    FoodDetailComponent,
    StoreProfileComponent,
    SellerDashboardComponent,
    SellerFoodsComponent,
    SellerOrdersComponent,
    StoreSettingsComponent,
    AdminDashboardComponent,
    AdminUsersComponent,
    AdminSellersComponent,
    AdminFoodsComponent,
    AdminOrdersComponent,
    MapViewComponent
  ],
  imports: [BrowserModule, FormsModule, HttpClientModule, AppRoutingModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
