import { Component, OnInit } from '@angular/core';
import { User } from '../../../core/models/api.models';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.listUsers().subscribe((res) => (this.users = res.data));
  }
}
