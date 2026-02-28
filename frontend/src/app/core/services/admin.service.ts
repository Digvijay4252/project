import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Food, Order, Store, User } from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly baseUrl = `${environment.apiBaseUrl}/admin`;

  constructor(private http: HttpClient) {}

  listUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.baseUrl}/users`);
  }

  listSellers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.baseUrl}/sellers`);
  }

  listFoods(): Observable<ApiResponse<Food[]>> {
    return this.http.get<ApiResponse<Food[]>>(`${this.baseUrl}/foods`);
  }

  listOrders(): Observable<ApiResponse<Order[]>> {
    return this.http.get<ApiResponse<Order[]>>(`${this.baseUrl}/orders`);
  }

  listStores(): Observable<ApiResponse<Store[]>> {
    return this.http.get<ApiResponse<Store[]>>(`${this.baseUrl}/stores`);
  }

  approveSeller(sellerId: number): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${this.baseUrl}/sellers/${sellerId}/approve`, {});
  }

  blockSeller(sellerId: number): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${this.baseUrl}/sellers/${sellerId}/block`, {});
  }
}
