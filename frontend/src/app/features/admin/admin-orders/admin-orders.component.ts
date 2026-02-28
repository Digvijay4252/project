import { Component, OnInit } from '@angular/core';
import { Order } from '../../../core/models/api.models';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.listOrders().subscribe((res) => (this.orders = res.data));
  }
}
