import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Chart } from 'chart.js/auto';
import { Observable } from 'rxjs';
import { ResidentService } from 'src/app/Service/listofresident';
import { OccupationPrev } from 'src/app/models/OccupationPrev';
import { OccupationPaxPrev } from 'src/app/models/occupation/OccupationPaxPrev';
import { HotelService } from 'src/app/services/hotel.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
RefreshProcedure() {
throw new Error('Method not implemented.');
}
  private intervalId: any;
  public chart: any;
  DataPaxOccupation: any[] = [];
  tauxnbrpax: any[] = [];
  jour: any[] = [];
  rows: any[] = [];
  codhotel: any;
  getdate: any;
  dataService: any;

  @ViewChild('lineCanvas') private lineCanvas!: ElementRef;
  fifthday: Date = new Date();
  sixday: Date = new Date();
  sevenday: Date = new Date();
  dayOfMonth: any;
  day: any;
  monthName: any;
  currantday: any;

  residents: any[] = [];
  lineChartOptions: any;
  lineChartData: any;
  DataPaxOccupationPrev: OccupationPaxPrev[] = [];
  DataOccupation: any[] = [];
  DataOccupationPrev: OccupationPrev[] = [];
  data: any;
  datanomagence: any;
  isDataLoaded: boolean = false;
  tauxnbr: any[] = [];
  formattedNumber: any;

  currentDate: Date = new Date();
  serverUrl: string = '';
  port: string = '';

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) {
    // Initialize Ionic Storage
    this.initializeStorage();
  }

  // Load serverUrl and port from localStorage or use default values
  async loadConfig() {
    this.serverUrl = localStorage.getItem('urlpub') || 'http://default-url';
    this.port = localStorage.getItem('hotelport') || 'default-port';
  }

  async initializeStorage() {
    await this.storage.create();
  }

  async ngOnInit(): Promise<void> {
    // Load configuration (server URL and port)
    await this.loadConfig();
    this.loadData(); // Load data after configuration is loaded
  }

  getDataForSecondUrl(baseUrl: string): Observable<any> {
    const firstUrl = `${baseUrl}/GetDataproce`;
    console.log('Fetching data from: ', firstUrl);
    return this.http.get(firstUrl);
  }

  executeProcedure(data: any, baseUrl: string): Observable<any> {
    const sessionId = localStorage.getItem('sessionId');

    if (!sessionId) {
      console.error('Session ID is missing!');
      return new Observable((observer) => {
        observer.error('Session ID is missing!');
        observer.complete();
      });
    }

    const params = new HttpParams()
      .set('cod_hotel_New', data.codhotelnew)
      .set('d1', data.d1)
      .set('session_id_', sessionId);

    const secondUrl = `${baseUrl}/getInfo_planning_apk`;
    console.log('Executing procedure with params: ', params.toString());
    return this.http.get(secondUrl, { params });
  }

  getDetailsOccupation(baseUrl: string): Observable<any> {
    const sessionId = localStorage.getItem('sessionId');
    const url = `${baseUrl}/getOccupationPaxDetails/${sessionId}`;
    console.log('Fetching details occupation from: ', url);
    return this.http.get(url);
  }

  getOccupationDetailsPrev(baseUrl: string): Observable<any> {
    const sessionId = localStorage.getItem('sessionId');
    const url = `${baseUrl}/getOccupationDetailsPrev/${sessionId}`;
    return this.http.get(url);
  }

  getOccupationPaxDetailsPrev(baseUrl: string): Observable<any> {
    const sessionId = localStorage.getItem('sessionId');
    const url = `${baseUrl}/getOccupationPaxDetailsPrev/${sessionId}`;
    console.log('Fetching occupation pax details prev from: ', url);
    return this.http.get(url);
  }

  private parseJour(jour: string): string {
    const dateParts = jour.split(':');
    if (dateParts.length === 2) {
      const hours = parseInt(dateParts[0], 10);
      const minutes = parseInt(dateParts[1], 10);
      const formattedDate = new Date();
      formattedDate.setHours(hours, minutes);
      return formattedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return jour;
  }

  async loadData() {
    // Ensure the serverUrl and port are loaded
    if (!this.serverUrl || !this.port) {
      console.error('Server URL or Port is missing!');
      return;
    }

    const baseUrl = `${this.serverUrl}:${this.port}/hotel`;

    this.getDataForSecondUrl(baseUrl).subscribe(
      (data: any) => {
        console.log('Data from first URL: ', data);
        this.executeProcedure(data, baseUrl).subscribe(
          (result: any) => {
            this.getDetailsOccupation(baseUrl).subscribe((data: any[]) => {
              this.DataOccupation = data;
              this.isDataLoaded = true;
            });

            this.getOccupationPaxDetailsPrev(baseUrl).subscribe((data) => {
              this.DataPaxOccupationPrev = data.map((item: OccupationPaxPrev) => ({
                ...item,
                taux_pax: parseFloat(item.taux_pax.toFixed(2)),
                jour: this.parseJour(item.jour),
              }));
              this.tauxnbrpax = this.DataPaxOccupationPrev.map((item) => item.taux_pax);
              this.day = this.DataPaxOccupationPrev.map((item) => item.jour);
              this.createChart(this.tauxnbrpax, this.tauxnbr, this.day);
              this.isDataLoaded = true;
            });

            this.getOccupationDetailsPrev(baseUrl).subscribe((data) => {
              this.DataOccupationPrev = data.map((item: OccupationPrev) => ({
                ...item,
                taux_chb: parseFloat(item.taux_chb.toFixed(2)),
                jour: this.parseJour(item.jour),
              }));
              this.tauxnbr = this.DataOccupationPrev.map((item) => item.taux_chb);
              this.day = this.DataOccupationPrev.map((item) => item.jour);
              this.createChart(this.tauxnbr, this.tauxnbrpax, this.day);
              this.isDataLoaded = true;
            });
          },
          (error) => {
            console.error('Error in executeProcedure: ', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching data from second URL: ', error);
      }
    );
  }

  doRefresh(event: any) {
    setTimeout(() => {
      this.loadData(); // Manually refresh data when pulled down
      event.target.complete();
    }, 200);
  }

  createChart(tauxnbr: any, tauxnbrpax: any, day: any[]) {
    if (this.chart) {
        this.chart.destroy();
    }

    this.chart = new Chart('MyChart1', {
        type: 'line',
        data: {
            labels: day, // Use the dynamic 'day' array for x-axis labels
            datasets: [
                {
                    label: 'Pax',
                    data: tauxnbr,
                    backgroundColor: 'rgba(255, 165, 0, 0.3)', // Light orange for background
                    borderColor: 'rgba(255, 165, 0, 1)', // Solid orange for line
                    borderWidth: 3,
                    pointStyle: 'circle',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    fill: true,
                    tension: 0.4, // Smooth curves
                },
                {
                    label: 'Chambre',
                    data: tauxnbrpax,
                    backgroundColor: 'rgba(255, 0, 0, 0.3)', // Light red for background
                    borderColor: 'rgba(255, 0, 0, 1)', // Solid red for line
                    borderWidth: 3,
                    pointStyle: 'rectRot', // Square points
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    fill: true,
                    tension: 0.4, // Smooth curves
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        font: {
                            size: 14,
                            weight: 'bold',
                        },
                        padding: 20,
                    },
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#cccccc',
                    bodyFont: { size: 12 },
                    padding: 10,
                    cornerRadius: 5,
                    callbacks: {
                        label: (tooltipItem) => {
                            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                        },
                    },
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#555',
                        font: { weight: 'bold' },
                    },
                    grid: {
                        color: 'rgba(200, 200, 200, 0.5)', // Light grid lines
                        lineWidth: 1,
                    },
                },
                x: {
                    ticks: {
                        color: '#333',
                        font: { weight: 600 },
                    },
                    grid: {
                        display: false,
                    },
                },
            },
        },
    });
}

}
