import { Component, OnInit } from '@angular/core';
import { Order } from '../../../core/models/api.models';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-seller-orders',
  templateUrl: './seller-orders.component.html',
  styleUrls: ['./seller-orders.component.css']
})
export class SellerOrdersComponent implements OnInit {
  orders: Order[] = [];
  statuses = ['PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.orderService.listOrders().subscribe((res) => (this.orders = res.data));
  }

  update(order: Order, status: string): void {
    this.orderService.updateStatus(order.id, status).subscribe(() => this.load());
  }
}
