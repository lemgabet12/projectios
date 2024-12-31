
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class apimenu {
  serverUrl: string ='';
  port: string ='';

  private baseUrl = `${this.serverUrl}:${this.port}`;

  constructor(private http: HttpClient) { }

  login(credentials: { login: string, password: string }) {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials, { responseType: 'text' as 'json' }).toPromise();
  }

  getMenuItems(profileId: number) {
    return this.http.get<any[]>(`${this.baseUrl}/getmodele/${profileId}`).toPromise();
  }
}