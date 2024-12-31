import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit {
  serverUrl: string = '';
  port: string = '';
  message: string = '';
  messageColor: string = 'success';
  showMessage: boolean = false;

  constructor(private navCtrl: NavController, private toastCtrl: ToastController) {}

  ngOnInit() {
    this.loadConfig();
  }

  // Load configuration from localStorage if it exists
  loadConfig() {
    this.serverUrl = localStorage.getItem('serverUrl') || this.serverUrl;
    this.port = localStorage.getItem('port')|| this.port;
  }

  // Save the current configuration to localStorage
  saveConfig() {
    if (this.serverUrl && this.port) {
      // Save the server URL and port to localStorage
      localStorage.setItem('serverUrl', this.serverUrl);
      localStorage.setItem('port', this.port.toString());

      // Show success message
      this.showMessage = true;
      this.message = 'Configuration enregistrée avec succès !';
      this.messageColor = 'success';
      
      // Optionally, display a toast notification
      this.showToast(this.message);

      // Navigate back to the login page
      this.navCtrl.navigateRoot('/login');
    } else {
      // Display error message if saving fails
      this.showMessage = true;
      this.message = 'Erreur lors de la sauvegarde de la configuration.';
      this.messageColor = 'danger';
      this.showToast(this.message);
    }
  }

  // Show a toast notification
  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      color: this.messageColor,
      position: 'top',
    });
    toast.present();
  }
}
