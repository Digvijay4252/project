import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5001/api/users';

  constructor() { }

  getAllUsers() {
    const token = localStorage.getItem('token');
    return axios.get(`${this.apiUrl}/all`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getUsersByType(userType: string) {
    const token = localStorage.getItem('token');
    return axios.get(`${this.apiUrl}/type/${userType}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
