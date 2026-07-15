import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminService, PayScheduleDto } from '../../services/admin.service';
import { Shop } from '../shop-details/shop-details.component';
import { AppRoutes } from '../../shared/appRoutes';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink,FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  shopsList: Shop[] = [];
  OldshopsList: Shop[] = [];
  AppRoutes =AppRoutes;
  constructor(
    private adminService: AdminService,
    private router: Router
  ) {
    this.loadeveryShop();
    this.loadLatestPayments();
  }

  loadeveryShop(): void {
    this.adminService.getEveryShop().subscribe(
      (data) => {
        this.shopsList = data;
        this.OldshopsList = this.shopsList;
      },
    );
  }

  latestPayments: { [shopId: number]: PayScheduleDto } = {};
  loadLatestPayments(): void {
    this.adminService.getLatestPaySchedulePerShop().subscribe(
      (data) => {
        this.latestPayments = {};
        for (const payment of data) {
          this.latestPayments[payment.shopId] = payment;
        }
      },
    );
  }
  isPaidThisMonth(shopId: number): boolean {
    const payment = this.latestPayments[shopId];
    if (!payment) return false;
    const payDate = new Date(payment.payDate);
    const now = new Date();
    return payDate.getFullYear() === now.getFullYear() && payDate.getMonth() === now.getMonth();
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text)
    .then(() => {
    })
    .catch(err => {
    });
    setTimeout(() => {
    }, 3000);
  }

  openedShop!: Shop;
  modalVisible:boolean = false; 
  showModal(shopId:number){
    this.subcsription.shopId = shopId;
      var shop = this.shopsList.find(x=>x.id== this.subcsription.shopId);
      if(shop){
        this.openedShop = shop;
      }
    this.modalVisible = true;
  }
  hideModal(){
    this.subcsription.shopId =0;
    this.modalVisible =false;
  }
  subcsription:SubscriptionObj={
    shopId :0,
    subscription :'',
  }
  addSubscription(subName:string){
    this.subcsription.subscription = subName;
    this.openedShop.subscription = subName;
    this.adminService.ChangeSubscription(this.subcsription).subscribe(
      (resp)=>{
        this.hideModal();
      }
    )
  }
  shopSearchText: string = '';
  searchShop() {
    const text = this.shopSearchText.toLowerCase();
    this.shopsList=[];
    setTimeout(() => {
      this.shopsList = this.OldshopsList;
      this.shopsList = this.shopsList.filter(x =>
        x.name?.toLowerCase().includes(text)
      );
    }, 1);
  }
  revertShopSearch(){
    this.shopsList = this.OldshopsList;
  }
}
export interface SubscriptionObj{
  shopId:number;
  subscription:string;
}