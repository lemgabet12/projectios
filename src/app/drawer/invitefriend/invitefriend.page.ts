import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-invitefriend',
  templateUrl: './invitefriend.page.html',
  styleUrls: ['./invitefriend.page.scss'],
})
export class InviteFriendPage implements OnInit {
  currentDate: Date = new Date();
  yesterday: Date = new Date(this.currentDate);
  previousMonth: Date = new Date(this.currentDate);
  nextMonth: Date = new Date(this.currentDate);
  nextday: string = new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0];
  chart: any;
  rows: any[] = [];
  moiss: any[] = [];
  muisss: any[] = [];
  codhotel: any;
  totalPrixMoiss: number = 0;
  totalPrixMuisss: number = 0;
  serverUrl: string = '';
  port: string = '';
  apiBaseUrl: string = '';
isLoading: any;

  constructor(private http: HttpClient, private router: Router) {
    this.initializeDates();
  }

  // Initialize dates for calculations
  private initializeDates(): void {
    this.yesterday = new Date(this.currentDate);
    this.yesterday.setDate(this.currentDate.getDate() - 1);

    this.previousMonth = new Date(this.yesterday);
    this.previousMonth.setMonth(this.yesterday.getMonth() - 1);

    this.nextMonth = new Date(this.currentDate);
    this.nextMonth.setMonth(this.currentDate.getMonth() + 1);
  }

  // Load configuration settings from local storage
  private async loadConfig(): Promise<void> {
    this.serverUrl = localStorage.getItem('urlpub') || 'http://default-url';
    this.port = localStorage.getItem('hotelport') || 'default-port';
    this.apiBaseUrl = `${this.serverUrl}:${this.port}/hotel`;
  }

  // Refresh the entire procedure
  public refreshProcedure(): void {
    this.executeProcedure();
    this.executeProcedure1();
    this.initializeCharts();
    this.fetchData();
    this.fetchMoisData();
    this.fetchMuisssData();
  }

  // Procedure 1: Fetch and execute data initialization
  private executeProcedure(): void {
    this.http.get<any>(`${this.apiBaseUrl}/GetDataproce`).subscribe(
      data => {
        const { codhotelnew: cod_hotel_, dd: d1, six: d2 } = data;
        const session_ = localStorage.getItem('sessionId');
        if (!session_ || !d1 || !d2) return;

        // Execute backend procedures
        this.http.get(`${this.apiBaseUrl}/init_jour_prev?d1=${d1}&d2=${d2}&session_=${session_}`).subscribe();
      //  this.http.get(`${this.apiBaseUrl}/generer?cod_agence_=&cod_user_=1&cod_hotel_=${cod_hotel_}`).subscribe();
        this.http.get(`${this.apiBaseUrl}/generer_prev_agence_mobile?cod_agence_=&offre_=&typ_eb=0&eb_=&d1=${d1}&d2=${d2}&session_=${session_}&cod_hotel_=${cod_hotel_}`).subscribe();

        // Fetch updated data
        this.fetchData();
        this.initializeCharts();
        this.fetchMoisData();
      },
      error => console.error('Error in executeProcedure:', error)
    );
  }

  // Procedure 2: Fetch and execute additional data initialization
  private executeProcedure1(): void {
    this.http.get<any>(`${this.apiBaseUrl}/GetDataproce`).subscribe(
      data => {
        const { codhotelnew: cod_hotel_, hierPass: d1, setHier: d2 } = data;
        const session_ = localStorage.getItem('sessionId');
        if (!session_ || !d1 || !d2) return;

        // Execute backend procedures
        this.http.get(`${this.apiBaseUrl}/init_jour_prev_mobile?d1=${d1}&d2=${d2}&session_=${session_}`).subscribe();
       // this.http.get(`${this.apiBaseUrl}/generer?cod_agence_=&cod_user_=1&cod_hotel_=${cod_hotel_}`).subscribe();
        this.http.get(`${this.apiBaseUrl}/generer_prev_agence_mobile1?cod_agence_=&offre_=&typ_eb=0&eb_=&d1=${d1}&d2=${d2}&session_=${session_}&cod_hotel_=${cod_hotel_}`).subscribe(
          () => this.fetchMuisssData()
        );
      },
      error => console.error('Error in executeProcedure1:', error)
    );
  }

  // Fetch data for rows
  private fetchData(): void {
    const session_ = localStorage.getItem('sessionId');
    this.http.get<any[]>(`${this.apiBaseUrl}/getlistagencejour/${session_}`).subscribe(
      data => (this.rows = data),
      error => console.error('Failed to fetch rows data:', error)
    );
  }

  // Fetch monthly data
  private fetchMoisData(): void {
    const session_ = localStorage.getItem('sessionId');
    this.http.get<any[]>(`${this.apiBaseUrl}/getlistmois/${session_}`).subscribe(
      data => {
        this.moiss = data;
        this.totalPrixMoiss = this.moiss.reduce((total, mois) => total + mois.sum_prix, 0);
      },
      error => console.error('Failed to fetch monthly data:', error)
    );
  }

  // Fetch Muisss data
  private fetchMuisssData(): void {
    const session_ = localStorage.getItem('sessionId');
    this.http.get<any[]>(`${this.apiBaseUrl}/getlistmoiss/${session_}`).subscribe(
      data => {
        this.muisss = data;
        this.totalPrixMuisss = this.muisss.reduce((total, mois) => total + mois.sum_prix, 0);
      },
      error => console.error('Failed to fetch muisss data:', error)
    );
  }

  // Open row details
  public openRowDetails(nom: string): void {
    this.router.navigate(['/deteilagence', nom, { nom }]);
  }

  // Initialize charts with fetched data
  private initializeCharts(): void {
    const session_ = localStorage.getItem('sessionId');
    this.http.get<any[]>(`${this.apiBaseUrl}/getlistagencejour/${session_}`).subscribe(
      data => {
        const labels = data.map(item => item.nom);
        const values = data.map(item => parseFloat(item.sum_prix));

        if (this.chart) this.chart.destroy();

        const ctx = document.getElementById('pieChart12') as HTMLCanvasElement;
        if (!ctx) return;

        this.chart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels,
            datasets: [
              {
                data: values,
                backgroundColor: ['#ff6f61', '#24c1f2', '#ffb6c1', '#32cd32'],
                borderColor: '#ffffff',
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: true, position: 'right' }
            }
          }
        });
      },
      error => console.error('Failed to initialize chart:', error)
    );
  }

  // Refresh functionality
  public doRefresh(event: any): void {
    setTimeout(() => {
      this.executeProcedure();
      this.executeProcedure1();
      this.initializeCharts();
      this.fetchData();
      this.fetchMoisData();
      this.fetchMuisssData();
      event.target.complete();
    }, 2000);
  }

  // OnInit lifecycle hook
  async ngOnInit(): Promise<void> {
    setTimeout(async () => {
      this.executeProcedure();
      this.executeProcedure1();
      this.initializeCharts();
      this.fetchData();
      this.fetchMoisData();
      this.fetchMuisssData();
    })
    await this.loadConfig();
    this.refreshProcedure();
  }
}
