import { Component, ViewChild, OnInit } from '@angular/core';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import { StatusBar } from '@capacitor/status-bar';
import { SafeAreaController } from '@aashu-dubey/capacitor-statusbar-safe-area';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { HttpClient } from '@angular/common/http'; // Import HttpClient to fetch data

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild(IonRouterOutlet, { static: true }) routerOutlet?: IonRouterOutlet;
  serverUrl: string = '';
  port: string = '';

  constructor(
    private platform: Platform,
    private router: Router,
    private storage: Storage,
    private http: HttpClient // Inject HttpClient to fetch hotel data
  ) {
    this.initializeApp();
  }

  async ngOnInit() {
    await this.storage.create();
    this.loadConfig();
    await this.checkLoginStatus(); // Check login status on app start
    this.refreshHotelConfig(); // Fetch hotel configuration on app start
  }

  async loadConfig() {
    this.serverUrl = localStorage.getItem('urlpub') || 'http://default-url';
    this.port = localStorage.getItem('hotelport') || 'default-port';
  }

  // Check if the user is logged in and navigate accordingly
  async checkLoginStatus() {
    const isLoggedIn = await this.storage.get('isLoggedIn');
    if (isLoggedIn) {
      // User is logged in, navigate to the main application page
      this.router.navigate(['/menu/home']);
    } else {
      // User is not logged in, navigate to the login page
      this.router.navigate(['/login']);
    }
  }

  // Fetch the current hotel configuration and synchronize it
  async refreshHotelConfig() {
    try {
      const savedHotelPort = localStorage.getItem('hotelport');
      const savedUrlPub = localStorage.getItem('urlpub');

      // If hotel configuration is saved, refresh it by fetching updated data
      if (savedHotelPort && savedUrlPub) {
        this.http.get(`${this.serverUrl}:${this.port}/hotel/getConfigHotel`).subscribe(
          (data: any) => {
            console.log('Fetched updated hotel data:', data);
            // Check if the saved hotel details match and update if needed
            const updatedHotel = data.find(
              (hotel: { hotelport: any; urlpub: any; }) =>
                hotel.hotelport === savedHotelPort && hotel.urlpub === savedUrlPub
            );
            if (updatedHotel) {
              // Successfully fetched and synchronized hotel data
              console.log('Hotel configuration synchronized:', updatedHotel);
            } else {
              console.log('Saved hotel configuration not found in the latest data.');
            }
          },
          (error) => {
            console.error('Error fetching hotel data:', error);
          }
        );
      }
    } catch (error) {
      console.error('Error during hotel configuration refresh:', error);
    }
  }

  async initializeApp() {
    await this.storage.create();
    this.platform.ready().then(() => {
      SafeAreaController.injectCSSVariables();
      StatusBar.setOverlaysWebView({ overlay: true }).catch(() => {});

      // Handle app lifecycle events and force app to close when it's in the background
      App.addListener('appStateChange', (state) => {
        if (!state.isActive) {
          // App moved to the background, forcefully exit the app
          console.log('App is going to the background, exiting the app immediately.');
          App.exitApp();  // Forcefully close the app
        }
      });

      // Handle back button behavior
      this.platform.backButton.subscribeWithPriority(-1, () => {
        if (!this.routerOutlet?.canGoBack()) {
          App.exitApp();  // Exit the app when the back button is pressed if no pages to go back to
        }
      });
    });
  }
}
