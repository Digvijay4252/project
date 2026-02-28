import { Component, OnInit } from '@angular/core';
import { Food } from '../../../core/models/api.models';
import { AdminService } from '../../../core/services/admin.service';
import { FoodService } from '../../../core/services/food.service';

@Component({
  selector: 'app-admin-foods',
  templateUrl: './admin-foods.component.html',
  styleUrls: ['./admin-foods.component.css']
})
export class AdminFoodsComponent implements OnInit {
  foods: Food[] = [];
  form: any = { sellerId: '', storeId: '', name: '', description: '', category: '', price: 0, rating: 0, isAvailable: true };
  editingId: number | null = null;

  constructor(private adminService: AdminService, private foodService: FoodService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.adminService.listFoods().subscribe((res) => (this.foods = res.data));
  }

  save(): void {
    const request = this.editingId
      ? this.foodService.updateFood(this.editingId, this.form)
      : this.foodService.createFood(this.form);
    request.subscribe(() => {
      this.reset();
      this.load();
    });
  }

  edit(food: any): void {
    this.editingId = food.id;
    this.form = {
      sellerId: food.seller_id,
      storeId: food.store_id,
      name: food.name,
      description: food.description,
      category: food.category,
      price: food.price,
      rating: food.rating,
      isAvailable: food.is_available
    };
  }

  remove(id: number): void {
    this.foodService.deleteFood(id).subscribe(() => this.load());
  }

  reset(): void {
    this.editingId = null;
    this.form = { sellerId: '', storeId: '', name: '', description: '', category: '', price: 0, rating: 0, isAvailable: true };
  }
}
