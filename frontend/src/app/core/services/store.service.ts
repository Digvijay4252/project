import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Store } from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private readonly baseUrl = `${environment.apiBaseUrl}/stores`;

  constructor(private http: HttpClient) {}

  getStoreById(id: number): Observable<ApiResponse<Store>> {
    return this.http.get<ApiResponse<Store>>(`${this.baseUrl}/${id}`);
  }

  getMyStore(): Observable<ApiResponse<Store>> {
    return this.http.get<ApiResponse<Store>>(`${this.baseUrl}/seller/me/profile`);
  }

  upsertMyStore(payload: any): Observable<ApiResponse<Store>> {
    return this.http.put<ApiResponse<Store>>(`${this.baseUrl}/seller/me/profile`, payload);
  }
}
