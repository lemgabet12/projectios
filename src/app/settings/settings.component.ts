import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  serverUrl: string = '';
  port: string = '';
  hotels: any[] = [];
  selectedHotel: string = '';

  constructor(private router: Router, private http: HttpClient) {
    // Listen to router events
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.url === '/settings') {
        // Reload data when navigating back to settings
        this.loadConfig();
        this.fetchHotels();
      }
    });
  }

  ngOnInit() {
    this.loadConfig();
    this.fetchHotels();
  }

  async loadConfig() {
    this.serverUrl = localStorage.getItem('serverUrl') || 'http://default-url';
    this.port = localStorage.getItem('port') || 'default-port';
  }

  fetchHotels() {
    this.http
      .get(`${this.serverUrl}:${this.port}/hotel/getConfigHotel`)
      .subscribe(
        (response: any) => {
          this.hotels = response;

          // Retrieve the currently selected hotel from local storage
          const savedHotelPort = localStorage.getItem('hotelport');
          const savedUrlPub = localStorage.getItem('urlpub');
          if (savedHotelPort && savedUrlPub) {
            const selected = this.hotels.find(
              (hotel) =>
                hotel.hotelport === savedHotelPort &&
                hotel.urlpub === savedUrlPub
            );
            if (selected) {
              this.selectedHotel = selected.name;
            }
          }
        },
        (error) => {
          console.error('Failed to fetch hotels:', error);
        }
      );
  }

  onHotelChange() {
    const selected = this.hotels.find(
      (hotel) => hotel.name === this.selectedHotel
    );
    if (selected) {
      localStorage.setItem('hotelport', selected.hotelport);
      localStorage.setItem('urlpub', selected.urlpub);
      console.log('Hotel changed:', selected.name);
    }
  }

  onChangeHotel() {
    this.router.navigate(['/change-hotel']);
  }

  onChangePassword() {
    this.router.navigate(['/reset-password']);
  }

  onChangeEmail() {
    this.router.navigate(['/menu/home']);
  }

  returnToDrawer() {
    this.router.navigate(['/menu/home']);
  }
}
