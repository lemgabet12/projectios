import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  private adrese:string ="http://192.168.3.9"
  private port:string = "8050"
  private maapping:string ="hotel"
  getdate: any[] = [];
  codhotel: any[] = [];
  constructor(private http:HttpClient) { }




  getDetailsOccupation(): Observable<any> {
    return this.http.get(`http://192.168.3.9:8050/${this.maapping}/getOccupationDetails`);
  }
  getOccupationDetailsPrev(): Observable<any> {
    return this.http.get(`http://192.168.3.9:8050/${this.maapping}/getOccupationDetailsPrev`);
  }
  
  
}
