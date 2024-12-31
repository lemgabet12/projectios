import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private firstUrl = 'http://192.168.3.9:8050/hotel/GetDataproce'; 
  constructor(private http: HttpClient) { 
    
  }

  executeUrl(): Observable<any> {
    const url = 'http://192.168.3.9:8050/hotel/PREPARATION_REVENU';
    
    const params = {
      d1: '07/10/2024',
      offre_: 'N',
      gttc_: '0',
      ghtva_: '0',
      ghtax_: '0',
      session_: '27500000',
      cod_unite_: '0',
      cod_hotel_: '09'
    };

    return this.http.get(url, { params });
  }
}
