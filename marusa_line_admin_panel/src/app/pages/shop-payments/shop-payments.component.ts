import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { AdminService, PayScheduleDto } from '../../services/admin.service';
import { Shop } from '../shop-details/shop-details.component';
import { extractErrorMessage } from '../../shared/http-error.util';

const MONTH_NAMES = [
  'იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი',
  'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'
];

@Component({
  selector: 'app-shop-payments',
  imports: [CommonModule, FormsModule],
  templateUrl: './shop-payments.component.html',
  styleUrl: './shop-payments.component.scss'
})
export class ShopPaymentsComponent {

  constructor(private service: AdminService, private route: ActivatedRoute) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.shopId = Number(id);
      this.loadShop();
      this.loadPayments();
    }
  }

  shopId: number = 0;
  shop: Shop | null = null;

  selectedYear: number = new Date().getFullYear();
  payments: PayScheduleDto[] = [];
  months: MonthSquare[] = [];

  isLoading: boolean = false;
  errorMessage: string = '';

  loadShop(): void {
    this.service.getShopById(this.shopId).subscribe({
      next: (data: Shop) => {
        this.shop = data;
      }
    });
  }

  loadPayments(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.service.getPayScheduleByShop(this.shopId, this.selectedYear).subscribe({
      next: (resp) => {
        this.payments = resp;
        this.buildMonths();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = extractErrorMessage(err);
        this.payments = [];
        this.buildMonths();
        this.isLoading = false;
      }
    });
  }

  buildMonths(): void {
    this.months = MONTH_NAMES.map((name, idx) => {
      const monthNumber = idx + 1;
      const payment = this.payments.find(p => new Date(p.payDate).getMonth() + 1 === monthNumber) ?? null;
      return {
        monthNumber,
        name,
        isPaid: !!payment,
        payment
      };
    });
  }

  previousYear(): void {
    this.selectedYear--;
    this.loadPayments();
  }
  nextYear(): void {
    this.selectedYear++;
    this.loadPayments();
  }
  onYearInputChange(): void {
    this.loadPayments();
  }

  modalVisible: boolean = false;
  selectedMonth: MonthSquare | null = null;
  openMonthModal(month: MonthSquare): void {
    this.selectedMonth = month;
    this.modalVisible = true;
  }
  hideModal(): void {
    this.modalVisible = false;
    this.selectedMonth = null;
  }

  markAsPaid(): void {
    Swal.fire({
      icon: 'info',
      title: 'ეს ფუნქცია საჭიროებს endpoint-ს',
      text: 'გადახდის დამატებისთვის საჭიროა insert-payment endpoint-ის მისამართი და request/response ფორმატი — ჯერ არ არის მოწოდებული.',
      background: 'rgb(25, 26, 25)',
      color: '#ffffff',
      confirmButtonColor: 'green',
    });
  }

  deletePaymentAction(): void {
    Swal.fire({
      icon: 'info',
      title: 'ეს ფუნქცია საჭიროებს endpoint-ს',
      text: 'გადახდის წაშლისთვის საჭიროა delete-payment endpoint-ის მისამართი და პარამეტრები — ჯერ არ არის მოწოდებული.',
      background: 'rgb(25, 26, 25)',
      color: '#ffffff',
      confirmButtonColor: 'green',
    });
  }
}

export interface MonthSquare {
  monthNumber: number;
  name: string;
  isPaid: boolean;
  payment: PayScheduleDto | null;
}
