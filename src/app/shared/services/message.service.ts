import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private snackBar: MatSnackBar) {}

  showError(error: HttpErrorResponse) {
    this.snackBar.open(error.message, 'Close', { panelClass: 'error-message' });
  }

  showLocalError(error: string) {
    this.snackBar.open(error, 'Close', { panelClass: 'error-message' });
  }

  showOk(message: string) {
    this.snackBar.open(message, 'Close', { panelClass: 'success-message' });
  }

  showWarn(message: string) {
    this.snackBar.open(message, 'Close', { panelClass: 'warn-message' });
  }
}
