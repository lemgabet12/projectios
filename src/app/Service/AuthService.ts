import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://192.168.3.9:8050'; // Adjust as per your backend API

  constructor(private http: HttpClient) { }

  login(emailOrTelephone: string, password: string) {
    return this.http.post(`${this.baseUrl}/hotel/getlistuser`, { emailOrTelephone, password });
  }

  saveAuthTry(data: any) {
    return this.http.post(`${this.baseUrl}/auth//track`, data);
  }
}