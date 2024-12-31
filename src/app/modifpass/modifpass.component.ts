import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modifpass',
  templateUrl: './modifpass.component.html',
  styleUrls: ['./modifpass.component.scss'],
})
export class ModifpassComponent  {

  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      console.error('New password and confirmation do not match');
      return;
    }
    
    const resetPasswordData = {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    };

    console.log('Reset Password Data:', resetPasswordData); // Check if data is correct here

    this.http.post<any>('http://192.168.3.9:8050/api/resetPassword', resetPasswordData)
      .subscribe(
        response => {
          console.log('Password reset successfully:', response);
          // Reset form fields if needed
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
        },
        error => {
          console.error('Error resetting password:', error);
        }
      );
  }
  routlogin() {
    this.router.navigate(['login']);
  }
}
