import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { AppRoutes } from '../../shared/appRoutes';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService, CreateAdminRequest } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { extractErrorMessage } from '../../shared/http-error.util';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ){

  }
  AppRoutes=AppRoutes;
  sidenavVisible:boolean = false;
  leftToright:boolean = false;
  openSidenav(){
    this.sidenavVisible =  true;
    this.leftToright = false;
  }
  hideSidenav(){
    this.leftToright = true;
    setTimeout(() => {
      this.sidenavVisible =  false;
    }, 500);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
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
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        this.router.navigate([AppRoutes.login]);
      }
    });
  }

  addAdminModalVisible: boolean = false;
  isCreatingAdmin: boolean = false;
  newAdmin: CreateAdminRequest = {
    adminName: '',
    userName: '',
    password: '',
  };

  showAddAdminModal(){
    this.newAdmin = { adminName: '', userName: '', password: '' };
    this.addAdminModalVisible = true;
  }
  hideAddAdminModal(){
    this.addAdminModalVisible = false;
  }

  createAdmin(){
    if(this.newAdmin.adminName==''||this.newAdmin.userName==''||this.newAdmin.password==''){
      return;
    }
    this.isCreatingAdmin = true;
    this.adminService.createAdmin(this.newAdmin).subscribe({
      next: (newAdminId) => {
        this.isCreatingAdmin = false;
        this.hideAddAdminModal();
        Swal.fire({
          icon: 'success',
          timer: 3000,
          showConfirmButton: false,
          background:'rgb(25, 26, 25)',
          color: '#ffffff',
          title: `ადმინი შეიქმნა, ID: ${newAdminId}`,
        });
      },
      error: (err) => {
        this.isCreatingAdmin = false;
        Swal.fire({
          icon: 'error',
          background:'rgb(25, 26, 25)',
          color: '#ffffff',
          confirmButtonColor: 'green',
          title: extractErrorMessage(err),
        });
      }
    });
  }
}
