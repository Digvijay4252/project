import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, User } from '../models/api.models';

interface AuthPayload {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = `${environment.apiBaseUrl}/auth`;
  private readonly tokenKey = 'food_token';
  private readonly userKey = 'food_user';

  constructor(private http: HttpClient) {}

  registerUser(payload: { fullName: string; email: string; password: string }): Observable<ApiResponse<AuthPayload>> {
    return this.http.post<ApiResponse<AuthPayload>>(`${this.baseUrl}/register/user`, payload);
  }

  registerSeller(payload: { fullName: string; email: string; password: string }): Observable<ApiResponse<AuthPayload>> {
    return this.http.post<ApiResponse<AuthPayload>>(`${this.baseUrl}/register/seller`, payload);
  }

  login(payload: { email: string; password: string }): Observable<ApiResponse<AuthPayload>> {
    return this.http.post<ApiResponse<AuthPayload>>(`${this.baseUrl}/login`, payload);
  }

  persistSession(token: string, user: User): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): User | null {
    const value = localStorage.getItem(this.userKey);
    return value ? (JSON.parse(value) as User) : null;
  }

  getUserRole(): string {
    return this.getUser()?.role || '';
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }
}
