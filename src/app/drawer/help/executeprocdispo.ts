import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage-angular'; // Ensure Storage is imported

@Injectable({
  providedIn: 'root'
})
export class Executeprocdispo {
  codhotel: any[] = [];
  serverUrl: string = '';
  port: string = '';
  private firstUrl!: string;
  private secondUrl!: string;

  constructor(private http: HttpClient, private storage: Storage) {
     this.storage.create(); 
    this.initializeUrls();
  }

  // Initialize URLs asynchronously
  private async initializeUrls() {
   // Ensure storage is created before use
   this.serverUrl = localStorage.getItem('urlpub') || 'http://default-url';
   this.port = localStorage.getItem('hotelport') || 'default-port';

    // API Endpoints
    this.firstUrl = `${this.serverUrl}:${this.port}/hotel/GetDataproce`;
    this.secondUrl = `${this.serverUrl}:${this.port}/hotel/categ_dispo_mobile`;
  }

  // Fetch data from the first URL
  getDataForSecondUrl(): Observable<any> {
    if (!this.firstUrl) {
      return new Observable((observer) => {
        observer.error('First URL not initialized properly');
      });
    }
    return this.http.get(this.firstUrl);
  }

  // Execute procedure using codhotel
  executeProcedure(data: any): Observable<any> {
    const params = new HttpParams().set('codhotel', data.codhotelnew); // Ensure parameters are passed correctly

    console.log("show me the code " + data.codhotelnew); // Log the correct value for debugging

    if (!this.secondUrl) {
      return new Observable((observer) => {
        observer.error('Second URL not initialized properly');
      });
    }

    return this.http.get(this.secondUrl, { params });
  }
}
