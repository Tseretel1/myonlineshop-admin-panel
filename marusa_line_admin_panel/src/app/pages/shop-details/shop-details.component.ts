import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop-details',
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './shop-details.component.html',
  styleUrl: './shop-details.component.scss'
})
export class ShopDetailsComponent {

  shop: Shop = {
    id: 0,
    name: '',
    logo: null,
    location: null,
    gmail: '',
    subscription: '',
    instagram: null,
    facebook: null,
    titkok: null,
    bog: null,
    tbc: null,
    receiver: null,
  };

  shopStats: ShopStats={
    productCount :'',
    followerCount :'',
  };
  oldShopObject!:Shop;
   
    constructor(private service:AdminService,private route: ActivatedRoute,){
    const id = this.route.snapshot.paramMap.get('id');
    if(id){
        this.shopId = Number(id);
        this.loadShop();
        this.getShopStats();
      }
    }

  ngOnInit(): void {
  }

  shopId:number = 0;
  loadShop(): void {
    this.service.getShopById(this.shopId).subscribe({
      next: (data: Shop) => {
        this.shop = { ...data };        
        this.shopId = this.shop.id;
        this.oldShopObject = { ...data }; 
        if(this.shop.logo){
          this.preview = this.shop.logo;
        }
      },
    });
  }

  getShopStats(): void {
    this.service.getShopStats(this.shopId).subscribe(
     (resp) => {
        this.shopStats = resp;
      },
    );
  }

  RollBack(): void {
    this.shop = { ...this.oldShopObject };
  }

  savePhotoVisible:boolean = false;
  showSavePhoto(){
    this.savePhotoVisible = true;
   this.triggerFileInput();
  }
  hideSavePhoto(){
    this.savePhotoVisible = false;
    this.preview = this.shop.logo;
  }
  
  uploadPhoto: {
    id: number;
    file: File;
    preview: string | ArrayBuffer | null;
  } | null = null;


  insertPhoto: Insertphoto | null = null;

  triggerFileInput(): void {
    const fileInput = document.getElementById('photoinput') as HTMLInputElement;
    fileInput.click();
  }
  preview: string | null = null; 
  onFileChange(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];

    const newPhoto = {
      id: Date.now(),
      file: file,
      preview: null as string | null
    };

    this.showSavePhoto();

    const reader = new FileReader();
    reader.onload = () => {
      newPhoto.preview = reader.result as string;
      this.uploadPhoto = newPhoto;
      this.preview = newPhoto.preview;
    };
    reader.readAsDataURL(file);
      input.value = '';
    }
  }

uploadPhotoToServer() {
  if (!this.uploadPhoto?.file) {
    throw new Error('No photo selected!');
  }

  this.service.uploadImage(this.uploadPhoto.file).subscribe({
    next: (response: any) => {
      this.insertPhoto = {
        photoUrl: response.secure_url
      };
      this.shop.logo = this.insertPhoto.photoUrl;
      this.UpdateShop();
      this.hideSavePhoto();
    },
    error: (err: any) => {
      console.error('Upload failed', err);
    }
  });
}


  uploadMessage(message: string){
    Swal.fire({
        icon: 'success',
        timer: 3000,
        showConfirmButton: false,
        confirmButtonColor: 'green',
        background:'rgb(25, 26, 25)',
        color: '#ffffff',
        title:message,
    });
    this.savePhotoVisible = false;
  }

  UpdateShop(){
    this.service.UpdateShop(this.shop).subscribe(
      (resp)=>{
        if(resp){
          this.uploadMessage('პროფილი წარმატებით რედაქტირდა');
        }
      }
    )
  }

  fieldseditPermission: boolean = false;
  modifyFields(){
    this.fieldseditPermission = true;
  }
  saveFields(){
    this.fieldseditPermission = false;
    this.UpdateShop();
  }
  cancelFields(){
    this.fieldseditPermission = false;
    this.RollBack();
  }

  logout(){
    Swal.fire({
      showConfirmButton: true,
      showCancelButton: true,
      cancelButtonText: 'არა',
      cancelButtonColor: 'red',
      confirmButtonText: 'დიახ',
      background:'rgb(25, 26, 25)',
      color: '#ffffff',      
      confirmButtonColor: 'green',
      title: 'ნამდვილად გსურთ აქაუნთიდან გასვლა?',
    }).then((results) => {
      if (results.isConfirmed) {
        localStorage.removeItem('token');
      }
    });
  }
}
export interface ShopStats{
  followerCount:string;
  productCount:string;
}

export interface user{
  id: number;
  name: number;
  email:string;
  phoneNumber:string;
  location:string;
  profilePhoto:string;
}


export interface GetOrderDto{
  UserId:number|null;
  OrderId:number|null;
  IsPaid:boolean|null;
  PageSize:number;
  PageNumber:number;
}

export interface SoldProductTypes{
    productTypeId:number,
    soldCount: number
}


export interface Shop {
  id: number;
  name: string;
  logo: string | null;
  location: string | null;
  gmail: string;
  subscription: string;
  instagram: string | null;
  facebook: string | null;
  titkok: string | null;
  bog: string|null,
  tbc: string|null,
  receiver: string|null,
}
export interface InsertPost {
  Id?:number;
  title: string;
  productTypeId: number;
  description: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  photos: Insertphoto[];
}
export interface Insertphoto {
  photoUrl: string;
}
