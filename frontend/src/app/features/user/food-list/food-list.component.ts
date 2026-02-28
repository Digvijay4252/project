import { Component, OnInit } from '@angular/core';
import { FoodService } from '../../../core/services/food.service';
import { Food } from '../../../core/models/api.models';

@Component({
  selector: 'app-food-list',
  templateUrl: './food-list.component.html',
  styleUrls: ['./food-list.component.css']
})
export class FoodListComponent implements OnInit {
  foods: Food[] = [];
  filters: any = { category: '', city: '', minPrice: '', maxPrice: '', minRating: '', maxDistanceKm: '' };
  loading = false;

  constructor(private foodService: FoodService) {}

  ngOnInit(): void {
    this.fetchFoods();
  }

  fetchFoods(): void {
    const payload: Record<string, string> = {};
    Object.keys(this.filters).forEach((key) => {
      if (this.filters[key] !== '') {
        payload[key] = this.filters[key];
      }
    });
    this.loading = true;
    this.foodService.listFoods(payload).subscribe({
      next: (res) => {
        this.foods = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
