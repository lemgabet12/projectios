import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-deteilagence',
  templateUrl: './deteilagence.page.html',
  styleUrls: ['./deteilagence.page.scss'],
})
export class DeteilagencePage implements OnInit, OnDestroy {
  serverUrl: string = 'http://default-url';
  port: string = 'default-port';
  apiBaseUrl: string = '';
  currentDate: Date = new Date();
  nom: string | null = null;
  nomagence: string | null = null;
  selectedRowData: any;
  selectedRowData1: any;
  isLoading: boolean = false;
  private interval: any;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.nom = this.route.snapshot.params['lib_agence'];
    const type = this.route.snapshot.params['type'];  
    this.nomagence = this.nom;

    console.log('Received nom:', this.nom);
    console.log('Received type:', type);

    this.loadConfig();

    if (this.nom) {
      this.fetchData(this.nom);
      this.startAutoRefresh();
    }

    if (type === '1') {
      this.executeProcedure();
    } else if (type === '2') {
      this.executeProcedure1();
    }
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  private startAutoRefresh() {
    this.interval = setInterval(() => {
      if (this.nom) this.fetchData(this.nom);
    }, 4000);
  }

  private executeProcedure() {
    this.http.get<any>(`${this.apiBaseUrl}/GetDataproce`).subscribe(
      (data) => {
        const { codhotelnew: cod_hotel_, dd: d1, six: d2 } = data;
        const session_ = localStorage.getItem('sessionId');
        if (!session_ || !d1 || !d2) return;

        this.http.get(`${this.apiBaseUrl}/init_jour_prev?d1=${d1}&d2=${d2}&session_=${session_}`).subscribe();
        this.http.get(
          `${this.apiBaseUrl}/generer_prev_agence_mobile?cod_agence_=&offre_=&typ_eb=-1&eb_=&d1=${d1}&d2=${d2}&session_=${session_}&cod_hotel_=${cod_hotel_}`
        ).subscribe();

        if (this.nom) this.fetchData(this.nom);
      },
      (error) => console.error('Error in executeProcedure:', error)
    );
  }

  private executeProcedure1() {
    this.http.get<any>(`${this.apiBaseUrl}/GetDataproce`).subscribe(
      (data) => {
        const { codhotelnew: cod_hotel_, hierPass: d1, setHier: d2 } = data;
        const session_ = localStorage.getItem('sessionId');
        if (!session_ || !d1 || !d2) return;

        this.http.get(`${this.apiBaseUrl}/init_jour_prev_mobile?d1=${d1}&d2=${d2}&session_=${session_}`).subscribe();
        this.http.get(
          `${this.apiBaseUrl}/generer_prev_agence_mobile1?cod_agence_=&offre_=&typ_eb=-1&eb_=&d1=${d1}&d2=${d2}&session_=${session_}&cod_hotel_=${cod_hotel_}`
        ).subscribe();

        if (this.nom) this.fetchData1(this.nom);
      },
      (error) => console.error('Error in executeProcedure1:', error)
    );
  }

  fetchData(nom?: string): void {
    this.isLoading = true;
    const url = `${this.apiBaseUrl}/getlistagenceMois/${nom}`;
    this.http.get<any>(url).subscribe(
      (data) => {
        this.selectedRowData = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Failed to fetch data:', error);
        this.isLoading = false;
      }
    );
  }

  fetchData1(nom?: string): void {
    const url = `${this.apiBaseUrl}/getlistagenceMoisless/${nom}`;
    this.http.get<any>(url).subscribe(
      (data) => {
        this.selectedRowData1 = data;
      },
      (error) => {
        console.error('Failed to fetch data1:', error);
      }
    );
  }

  returnToMainTable() {
    this.navCtrl.navigateBack('/menu/invitefriend');
  }

  async loadConfig() {
    this.serverUrl = localStorage.getItem('urlpub') || 'http://default-url';
    this.port = localStorage.getItem('hotelport') || 'default-port';
    this.apiBaseUrl = `${this.serverUrl}:${this.port}/hotel`;
  }
}
