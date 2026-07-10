import { HttpErrorResponse } from '@angular/common/http';

export function extractErrorMessage(err: HttpErrorResponse): string {
  if (typeof err.error === 'string' && err.error.trim().length > 0) {
    return err.error;
  }
  if (err.error?.message) {
    return err.error.message;
  }
  return err.message || 'დაფიქსირდა შეცდომა';
}
