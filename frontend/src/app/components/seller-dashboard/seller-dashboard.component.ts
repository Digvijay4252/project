import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-seller-dashboard',
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.css']
})
export class SellerDashboardComponent implements OnInit {
  user: any = null;
  allUsers: any[] = [];
  loading: boolean = false;
  activeTab: string = 'overview';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    if (!this.user || this.user.userType !== 'seller') {
      this.router.navigate(['/login']);
      return;
    }
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAllUsers()
      .then((response: any) => {
        this.allUsers = response.data.users;
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
