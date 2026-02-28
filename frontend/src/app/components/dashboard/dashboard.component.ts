import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: any = null;
  users: any[] = [];
  sellers: any[] = [];
  loading: boolean = false;
  activeTab: string = 'overview';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAllUsers()
      .then((response: any) => {
        this.users = response.data.users;
        this.sellers = this.users.filter(u => u.user_type === 'seller');
        this.loading = false;
      })
      .catch((error: any) => {
        console.error('Error loading users:', error);
        this.loading = false;
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
