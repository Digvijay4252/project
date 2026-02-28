import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5001/api/auth';
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  signup(email: string, password: string, fullName: string, userType: string) {
    return axios.post(`${this.apiUrl}/signup`, {
      email,
      password,
      fullName,
      userType
    });
  }

  login(email: string, password: string) {
    return axios.post(`${this.apiUrl}/login`, {
      email,
      password
    });
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken() {
    return this.token || localStorage.getItem('token');
  }

  isLoggedIn() {
    return !!this.getToken();
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getProfile() {
    const token = this.getToken();
    return axios.get(`${this.apiUrl}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
