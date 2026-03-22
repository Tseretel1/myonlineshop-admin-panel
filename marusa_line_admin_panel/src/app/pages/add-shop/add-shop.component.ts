import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { AdminService } from '../../services/admin.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppRoutes } from '../../shared/appRoutes';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-shop',
  imports: [FormsModule,CommonModule],
  templateUrl: './add-shop.component.html',
  styleUrl: './add-shop.component.scss'
})
export class AddShopComponent {
  constructor(private adminService:AdminService, private route:Router){}
  shop :AddShop={
    shopName :'',
    gmail :'',
    password :'',
  }

  addShop(){
    if(this.shop.shopName!=''&&this.shop.gmail!=''&&this.shop.password!=''){
      this.adminService.AddShop(this.shop).subscribe(
        (resp)=>{
          this.route.navigate([AppRoutes.home]);
        }
      )
    }
  }
}
export interface AddShop{
  shopName:string;
  gmail:string;
  password:string;
}