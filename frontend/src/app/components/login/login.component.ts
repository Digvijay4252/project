import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  userType: string = 'user';
  loading: boolean = false;
  error: string = '';
  success: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    if (!this.email || !this.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.authService.login(this.email, this.password)
      .then((response: any) => {
        this.authService.setToken(response.data.token);
        this.authService.setUser(response.data.user);
        this.success = 'Login successful!';
        
        setTimeout(() => {
          if (response.data.user.userType === 'seller') {
            this.router.navigate(['/seller-dashboard']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        }, 1000);
      })
      .catch((error: any) => {
        this.error = error.response?.data?.message || 'Login failed';
        this.loading = false;
      });
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }
}
