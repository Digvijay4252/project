import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  form = { fullName: '', email: '', password: '', role: 'USER' };
  loading = false;
  error = '';
  validationErrors: string[] = [];
  success = '';

  constructor(private authService: AuthService, private router: Router) {}

  private validateForm(): string[] {
    const errors: string[] = [];
    const fullName = this.form.fullName.trim();
    const email = this.form.email.trim();
    const password = this.form.password;

    if (fullName.length < 2) {
      errors.push('Full Name must be at least 2 characters.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Enter a valid email address.');
    }
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters.');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter.');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter.');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number.');
    }

    return errors;
  }

  onSubmit(): void {
    this.error = '';
    this.validationErrors = [];
    this.success = '';

    const clientErrors = this.validateForm();
    if (clientErrors.length > 0) {
      this.validationErrors = clientErrors;
      return;
    }

    this.loading = true;

    const request =
      this.form.role === 'SELLER'
        ? this.authService.registerSeller(this.form)
        : this.authService.registerUser(this.form);

    request.subscribe({
      next: (res) => {
        this.authService.persistSession(res.data.token, res.data.user);
        this.success = res.message;
        const route = res.data.user.role === 'SELLER' ? '/seller' : '/user';
        this.router.navigate([route]);
      },
      error: (err) => {
        const serverErrors = err?.error?.errors;
        if (Array.isArray(serverErrors) && serverErrors.length > 0) {
          this.validationErrors = serverErrors
            .map((e: { msg?: string }) => e?.msg)
            .filter((msg: string | undefined): msg is string => !!msg);
        } else {
          this.error = err?.error?.message || 'Registration failed';
        }
        this.loading = false;
      }
    });
  }
}
