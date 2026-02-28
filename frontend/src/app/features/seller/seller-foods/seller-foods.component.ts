import { Component, OnInit } from '@angular/core';
import { Food } from '../../../core/models/api.models';
import { FoodService } from '../../../core/services/food.service';

@Component({
  selector: 'app-seller-foods',
  templateUrl: './seller-foods.component.html',
  styleUrls: ['./seller-foods.component.css']
})
export class SellerFoodsComponent implements OnInit {
  foods: Food[] = [];
  form: any = {
    name: '',
    description: '',
    category: '',
    price: 0,
    rating: 0,
    isAvailable: true
  };
  editingId: number | null = null;

  constructor(private foodService: FoodService) {}

  ngOnInit(): void {
    this.loadFoods();
  }

  loadFoods(): void {
    this.foodService.listFoods({ mine: true }).subscribe((res) => {
      this.foods = res.data;
    });
  }

  saveFood(): void {
    const request = this.editingId
      ? this.foodService.updateFood(this.editingId, this.form)
      : this.foodService.createFood(this.form);
    request.subscribe(() => {
      this.resetForm();
      this.loadFoods();
    });
  }

  edit(food: Food): void {
    this.editingId = food.id;
    this.form = {
      name: food.name,
      description: food.description,
      category: food.category,
      price: food.price,
      rating: food.rating,
      isAvailable: food.is_available
    };
  }

  remove(id: number): void {
    this.foodService.deleteFood(id).subscribe(() => this.loadFoods());
  }

  resetForm(): void {
    this.editingId = null;
    this.form = { name: '', description: '', category: '', price: 0, rating: 0, isAvailable: true };
  }
}
