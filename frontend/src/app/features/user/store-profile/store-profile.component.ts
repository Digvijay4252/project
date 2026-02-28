import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '../../../core/models/api.models';
import { StoreService } from '../../../core/services/store.service';

@Component({
  selector: 'app-store-profile',
  templateUrl: './store-profile.component.html',
  styleUrls: ['./store-profile.component.css']
})
export class StoreProfileComponent implements OnInit {
  store?: Store;

  constructor(private route: ActivatedRoute, private storeService: StoreService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.storeService.getStoreById(id).subscribe((res) => {
      this.store = res.data;
    });
  }
}
