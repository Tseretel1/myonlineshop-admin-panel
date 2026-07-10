import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token';

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) {
      return false;
    }
    if (Date.now() >= payload.exp * 1000) {
      this.logout();
      return false;
    }
    return true;
  }

  getAdminName(): string | null {
    return this.decodeToken(this.getToken())?.AdminName ?? null;
  }

  getAdminId(): string | null {
    return this.decodeToken(this.getToken())?.AdminId ?? null;
  }

  private decodeToken(token: string | null): any {
    if (!token) {
      return null;
    }
    try {
      const payload = token.split('.')[1];
      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
      const json = decodeURIComponent(
        atob(padded)
          .split('')
          .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
          .join('')
      );
      return JSON.parse(json);
    } catch {
      return null;
    }
  }
}
