import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  fullName: string = '';
  userType: string = 'user';
  loading: boolean = false;
  error: string = '';
  success: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  signup() {
    if (!this.email || !this.password || !this.confirmPassword || !this.fullName) {
      this.error = 'Please fill in all fields';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.authService.signup(this.email, this.password, this.fullName, this.userType)
      .then((response: any) => {
        this.authService.setToken(response.data.token);
        this.authService.setUser(response.data.user);
        this.success = 'Account created successfully!';
        
        setTimeout(() => {
          if (this.userType === 'seller') {
            this.router.navigate(['/seller-dashboard']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        }, 1000);
      })
      .catch((error: any) => {
        this.error = error.response?.data?.message || 'Signup failed';
        this.loading = false;
      });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
