
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = 'http://192.168.3.9:8050/api/inscript/register'; // Replace with your actual backend API URL

  constructor(private http: HttpClient) { }

  insertUserData(userData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'insertUserData', userData);
    // Adjust the endpoint ('insertUserData') and handling based on your backend API implementation
  }
}



