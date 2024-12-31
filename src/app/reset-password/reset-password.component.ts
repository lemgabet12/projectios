import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular'; // Import Storage

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  login: string = '';
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  private adrese: string = '';
  private port: string = '';
  // Password visibility states
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  serverUrl: string='';

  

  constructor(
    private router: Router,
    private http: HttpClient,
    private storage: Storage // Inject Storage
  ) {
    this.initializeStorage(); // Initialize storage on construction
  }

  async initializeStorage() {
    // Asynchronously retrieve serverUrl and port from storage
   
  }
  async loadConfig() {
    this.serverUrl = localStorage.getItem('serverUrl') || 'http://default-url';
    this.port = localStorage.getItem('port') || 'default-port';
  }
  async ngOnInit() {
await this.loadConfig();
this.serverUrl = localStorage.getItem('serverUrl') || 'http://default-url';
this.port = localStorage.getItem('port') || 'default-port';
  

  }

  returnToSettings() {
    this.router.navigate(['/settings']);
  }

  toggleShowOldPassword() {
    this.showOldPassword = !this.showOldPassword;
  }

  toggleShowNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleShowConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  async changePassword() {
    this.errorMessage = ''; // Clear any previous error messages
    this.successMessage = ''; // Clear any previous success messages

    // Validate new password and confirm password
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'New passwords do not match.';
      return;
    }

    // Check password requirements (at least 8 characters, include upper and lower case letters, numbers, and special characters)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(this.newPassword)) {
      this.errorMessage = 'New password does not meet the security requirements.';
      return;
    }

    // Dynamically construct API endpoint for password reset
    const apiUrl = `${this.serverUrl}:${this.port}/api/users/modif-password`; 

    // Request payload
    const body = {
      login: this.login,
      oldPassword: this.oldPassword, // Send plaintext old password if hashing is done on the server
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    };

    try {
      // Send PUT request to the API
      const response: any = await this.http.put(apiUrl, body, { responseType: 'text' }).toPromise();
      console.log('Password change response:', response);

      if (response === 'Password changed successfully') {
        this.successMessage = 'Password changed successfully.';
      } else {
        this.errorMessage = response || 'Failed to change password. Please try again later.';
      }
    } catch (error: any) {
      console.error('Error changing password:', error);
      if (error.error) {
        console.error('Error details:', error.error); // Log error details from the response
        this.errorMessage = error.error || 'Error changing password. Please try again later.';
      } else {
        this.errorMessage = 'Error changing password. Please try again later.';
      }
    }
  }
}
