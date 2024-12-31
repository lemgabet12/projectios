import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Procedurecateg {
  tomorrow: Date = new Date();
  sixday: Date = new Date();
  currentDate: Date = new Date();

  monthNames: string[] = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  private serverUrl: string = '';
  private port: string = '';
  private firstUrl!: string;
  private secondUrl!: string;

  constructor(private http: HttpClient) {
    this.initializeUrls();
  }

  // Initialize URLs
  private initializeUrls() {
    this.serverUrl = localStorage.getItem('urlpub') || 'http://default-url';
    this.port = localStorage.getItem('hotelport') || 'default-port';

    this.firstUrl = `${this.serverUrl}:${this.port}/hotel/GetDataproce`;
    this.secondUrl = `${this.serverUrl}:${this.port}/hotel/generer_prev_categ_Mobile`;
  }

  // Helper function to ensure URLs are initialized
  private ensureUrlsInitialized(): Observable<void> {
    if (!this.firstUrl || !this.secondUrl) {
      this.initializeUrls(); // Re-initialize if URLs are missing
    }
    return of();
  }
params:any=null;
  // Fetch data from the first URL
  getDataForSecondUrl(): Observable<any> {
    const aa =this.ensureUrlsInitialized().pipe(
      switchMap((data) => this.http.get(this.firstUrl))
    );
    this.http.get(this.firstUrl).subscribe((data)=>{
this.params=data;
    })
    return aa
  }
prms:any=null;
  // Execute the procedure with parameters fetched from the first URL
  executeProcedure(): any {
   
    const sessionId = localStorage.getItem('sessionId') || ''; // Ensure sessionId is never null
    this.http.get(this.firstUrl).subscribe((data:any)=>{
      const prms={d1:data.tom,
        d2:data.tomm,
        offre_:'',
        cod_agence_:'',
        session_:sessionId,
        cod_hotel_:data.codhotelnew
      }
      
      this.prms=prms;
 })
     
    return this.prms;
  }

  // Get and execute the procedure
  getAndExecuteProcedure(): Observable<any> {
    return this.getDataForSecondUrl().pipe(
      switchMap(data => this.executeProcedure())
    );
  }
  proceduregenerer() :Observable<any>{

    return this.http.get(this.secondUrl,{params:this.executeProcedure()})
    }
}
