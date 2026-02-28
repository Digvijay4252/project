import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Food } from '../../../core/models/api.models';
import { FoodService } from '../../../core/services/food.service';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-food-detail',
  templateUrl: './food-detail.component.html',
  styleUrls: ['./food-detail.component.css']
})
export class FoodDetailComponent implements OnInit {
  food?: Food;
  quantity = 1;
  message = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private foodService: FoodService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.foodService.getFoodById(id).subscribe((res) => {
      this.food = res.data;
    });
  }

  placeOrder(): void {
    if (!this.food) {
      return;
    }
    const payload = {
      storeId: this.food.store_id,
      items: [{ foodId: this.food.id, quantity: this.quantity }]
    };
    this.orderService.placeOrder(payload).subscribe({
      next: () => {
        this.message = 'Order placed successfully.';
      },
      error: (err) => {
        this.message = err?.error?.message || 'Order failed';
      }
    });
  }

  goStore(): void {
    if (this.food) {
      this.router.navigate(['/user/stores', this.food.store_id]);
    }
  }
}
