import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form = { email: '', password: '' };
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.loading = true;
    this.error = '';
    this.authService.login(this.form).subscribe({
      next: (res) => {
        this.authService.persistSession(res.data.token, res.data.user);
        const role = res.data.user.role;
        const route = role === 'ADMIN' ? '/admin' : role === 'SELLER' ? '/seller' : '/user';
        this.router.navigate([route]);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Login failed';
        this.loading = false;
      }
    });
  }
}
