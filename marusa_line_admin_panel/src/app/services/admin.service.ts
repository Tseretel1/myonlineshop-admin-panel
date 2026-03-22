import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Shop } from '../pages/shop-details/shop-details.component';
import { AddShop } from '../pages/add-shop/add-shop.component';
import { SubscriptionObj } from '../pages/home/home.component';

@Injectable({
  providedIn: 'root'
})
export class AdminService {


  private apiUrl = 'https://localhost:7173/';
 //private apiUrl = 'https://192.168.1.11:7174/';
  constructor(private http:HttpClient)
  {

  }

  private cloudName = 'ds1q7oiea';
  private uploadPreset = 'cloudinary_Upload_Preset';

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    return this.http.post(
      `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
      formData
    );
  }
  
  getEveryShop(): Observable<any> {
    return this.http.get<any>(this.apiUrl+`Admin/get-every-shop`,);
  }
  getShopById(shopId:number): Observable<any> {
    return this.http.get<any>(this.apiUrl+`Admin/get-shop-by-id?shopId=${shopId}`,);
  }
  getShopStats(shopId:number): Observable<any> {
    return this.http.get<any>(this.apiUrl+`Admin/get-shop-stats?shopId=${shopId}`);
  }
  UpdateShop(Newshop:Shop): Observable<any> {
    return this.http.put<any>(this.apiUrl+`Admin/update-shop`,Newshop);
  }
  AddShop(Newshop:AddShop): Observable<any> {
    return this.http.post<any>(this.apiUrl+`Admin/add-shop`,Newshop);
  }
  ChangeSubscription(Newshop:SubscriptionObj): Observable<any> {
    return this.http.put<any>(this.apiUrl+`Admin/update-subscription`,Newshop);
  }
  GetusersList(filter:Pagination): Observable<GetusersDto[]> {
    return this.http.post<GetusersDto[]>(this.apiUrl+`Admin/get-users`,filter);
  }
}
export interface Pagination{
    userName:string|null,
    gmail:string|null,
    pageNumber:number;
    pageSize:number;
}
export interface GetusersDto {
  id: number;
  email: string;
  name: string;
  profilePhoto: string;
  location: string;
  phoneNumber: string;
  role: string;
  totalCount:number;
  paidOrdersCount: number,
  unPaidOrdersCount: number,
  isBlocked: boolean,
}