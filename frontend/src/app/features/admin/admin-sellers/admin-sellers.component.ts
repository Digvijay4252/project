import { Component, OnInit } from '@angular/core';
import { User } from '../../../core/models/api.models';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-sellers',
  templateUrl: './admin-sellers.component.html',
  styleUrls: ['./admin-sellers.component.css']
})
export class AdminSellersComponent implements OnInit {
  sellers: User[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.adminService.listSellers().subscribe((res) => (this.sellers = res.data));
  }

  approve(sellerId: number): void {
    this.adminService.approveSeller(sellerId).subscribe(() => this.load());
  }

  block(sellerId: number): void {
    this.adminService.blockSeller(sellerId).subscribe(() => this.load());
  }

  canApprove(seller: User): boolean {
    return seller.seller_approval === 'PENDING' || seller.seller_approval === 'BLOCKED';
  }

  canBlock(seller: User): boolean {
    return seller.seller_approval === 'APPROVED';
  }
}
