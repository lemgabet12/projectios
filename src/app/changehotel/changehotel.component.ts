import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-changehotel',
  templateUrl: './changehotel.component.html',
  styleUrls: ['./changehotel.component.scss'],
})
export class ChangehotelComponent implements OnInit, OnDestroy {
  hotels: any[] = [];
  filteredHotels: any[] = [];
  selectedHotel: any = null;
  isSaving: boolean = false;
  isSaved: boolean = false;
  serverUrl: string = ''; // Server URL
  port: string = '';      // Port number

  constructor(private http: HttpClient, private route: Router) {}

  ngOnInit() {
    // Load server URL and port from local storage or use defaults
    this.serverUrl = localStorage.getItem('serverUrl') || 'http://localhost';
    this.port = localStorage.getItem('port') || '8080';

    this.fetchHotels();

    // Add global event listener for menu updates
    window.addEventListener('menuUpdated', this.handleMenuUpdate.bind(this));
  }

  fetchHotels() {
    // Construct the API endpoint using server URL and port
    const apiUrl = `${this.serverUrl}:${this.port}/hotel/getConfigHotel`;

    this.http.get(apiUrl).subscribe(
      (data: any) => {
        this.hotels = data;

        // Retrieve saved hotel information from local storage
        const savedHotelPort = localStorage.getItem('hotelport');
        const savedUrlPub = localStorage.getItem('urlpub');

        if (savedHotelPort && savedUrlPub) {
          this.selectedHotel = this.hotels.find(
            (hotel) =>
              hotel.hotelport === savedHotelPort &&
              hotel.urlpub === savedUrlPub
          );
        }

        this.filterHotels();
      },
      (error: any) => {
        console.error('Error fetching hotels:', error);
      }
    );
  }

  filterHotels() {
    const savedHotelPort = localStorage.getItem('hotelport');
    const savedUrlPub = localStorage.getItem('urlpub');
    this.filteredHotels = this.hotels.filter(
      (hotel) =>
        hotel.hotelport !== savedHotelPort || hotel.urlpub !== savedUrlPub
    );
  }

  updateApiDetails() {
    if (this.selectedHotel) {
      const { hotelport, urlpub } = this.selectedHotel;

      // Save selected hotel details to local storage
      localStorage.setItem('hotelport', hotelport);
      localStorage.setItem('urlpub', urlpub);

      this.filterHotels();
    }
  }

  
onSave() {
  if (this.selectedHotel) {
    this.isSaving = true;

    setTimeout(() => {
      this.isSaving = false;
      this.isSaved = true;

      setTimeout(() => {
        this.isSaved = false;
      }, 3000);

      const { hotelport, urlpub } = this.selectedHotel;

      localStorage.setItem('hotelport', hotelport);
      localStorage.setItem('urlpub', urlpub);

      const event = new Event('storage');
      window.dispatchEvent(event);

      // Force menu refresh by reloading the page or navigating to the menu
      this.route.navigate(['/settings']).then(() => window.location.reload());
    }, 1000);
  }
}






  
  synchronizeMenu() {
    const event = new CustomEvent('menuUpdated', {
      detail: {
        hotelport: this.selectedHotel?.hotelport,
        urlpub: this.selectedHotel?.urlpub,
      },
    });
    window.dispatchEvent(event);
  }

  handleMenuUpdate(event: Event) {
    const detail = (event as CustomEvent).detail;
    if (detail) {
      console.log('Menu updated with:', detail);
      // Add any menu refresh logic here
    }
  }

  ngOnDestroy() {
    // Remove event listener to prevent memory leaks
    window.removeEventListener('menuUpdated', this.handleMenuUpdate.bind(this));
  }

  gotosetting() {
    this.route.navigate(['/settings']);
  }
}
