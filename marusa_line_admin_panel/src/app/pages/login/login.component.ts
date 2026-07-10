import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService, AdminLoginRequest } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { AppRoutes } from '../../shared/appRoutes';
import { extractErrorMessage } from '../../shared/http-error.util';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ) {}

  credentials: AdminLoginRequest = {
    userName: '',
    password: '',
  };
  errorMessage: string = '';
  isSubmitting: boolean = false;

  login(): void {
    if (this.credentials.userName === '' || this.credentials.password === '') {
      return;
    }
    this.errorMessage = '';
    this.isSubmitting = true;
    this.adminService.login(this.credentials).subscribe({
      next: (resp) => {
        this.isSubmitting = false;
        if (resp.succeeded) {
          this.authService.setToken(resp.token);
          this.router.navigate([AppRoutes.home]);
        } else {
          this.errorMessage = 'მომხმარებლის სახელი ან პაროლი არასწორია';
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = extractErrorMessage(err);
      }
    });
  }
}
