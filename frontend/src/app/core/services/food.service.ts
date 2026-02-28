import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Food } from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private readonly baseUrl = `${environment.apiBaseUrl}/foods`;

  constructor(private http: HttpClient) {}

  listFoods(filters: Record<string, string | number | boolean> = {}): Observable<ApiResponse<Food[]>> {
    let params = new HttpParams();
    Object.keys(filters).forEach((key) => {
      params = params.set(key, String(filters[key]));
    });
    return this.http.get<ApiResponse<Food[]>>(this.baseUrl, { params });
  }

  getFoodById(id: number): Observable<ApiResponse<Food>> {
    return this.http.get<ApiResponse<Food>>(`${this.baseUrl}/${id}`);
  }

  createFood(payload: any): Observable<ApiResponse<Food>> {
    return this.http.post<ApiResponse<Food>>(this.baseUrl, payload);
  }

  updateFood(id: number, payload: any): Observable<ApiResponse<Food>> {
    return this.http.put<ApiResponse<Food>>(`${this.baseUrl}/${id}`, payload);
  }

  deleteFood(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }
}
