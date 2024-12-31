import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { HotelService } from 'src/app/services/hotel.service';
import { Procedurecateg } from '../help/procedurecateg';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {
  serverUrl: string = '';
  RefreshProcedure() {
    this.createPieChart();
    this.createChart();
    this.createPieChart1();
    this.loadConfig();
    this.initializeStorage();
  }
  pieChart1: any;
  pieChart: any;
  chart: any;
  currentDate: Date = new Date();
  @ViewChild('pieCanvas') pieCanvas!: ElementRef;

  Datareserv: any[] = [];
  datachambredispo = '';
  dataarrdep = '';
  datareser = '';
  string: string = '';
  Datareser = {
    getwalikingtday: '',
    getreserve: '',
    getresanul: '',
  };

  firstday: Date = new Date();
  secondday: Date = new Date();
  thirdday: Date = new Date();
  tomorrow: Date = new Date();

  DataARRDEP = {
    ArrivePrevus: '',
    Arrive: '',
    DepartPrevus: '',
    Depart: '',
  };

  private adrese: string = '';
  private port: string = '';
  private datedep: string = '';
  private datefin: string = '';

  lastyearday: string | undefined;
  isNightMode: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private hotelservice: HotelService,
    private ngZone: NgZone,
    private procedurecateg: Procedurecateg,
    private storage: Storage
  ) {
    this.initializeStorage();
  }
  doRefresh(event: any) {
    // Manually refresh data when pulled down
    setTimeout(() => {
      this.createChart();
      this.createPieChart();
      this.createPieChart1();
      event.target.complete(); // Complete the refresh action
    }, 2000); // Simulate a delay
  }
  async initializeStorage() {
    await this.storage.create(); // Initialize the storage
  }

  formatDateForService(date: string): string {
    const dateParts = date.split('T')[0].split('-');
    return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
  }
  async loadConfig() {
    this.serverUrl = localStorage.getItem('urlpub') || 'http://default-url';
    this.port = localStorage.getItem('hotelport') || 'default-port';
  }
  async ngOnInit() {
    await this.loadConfig();
    this.datedep = await this.storage.get('startDate') || 'default-startDate';
    this.datefin = await this.storage.get('endDate') || 'default-endDate';


    this.createChart();
    this.createPieChart();
    this.createPieChart1();
    // Set up interval to refresh charts every 8 seconds
    this.incrementDate();
    this.decrementDate();
  }

  incrementDate() {
    const nextDate = new Date(this.currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    this.currentDate = nextDate;
    this.cdr.detectChanges();
    console.log('Incremented Date:', this.currentDate);

    // Call the methods to update the charts with the new date
    this.createChart();
    this.createPieChart();
    this.createPieChart1();
  }

  decrementDate() {
    const prevDate = new Date(this.currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    this.currentDate = prevDate;
    this.cdr.detectChanges();
    console.log('Decremented Date:', this.currentDate);

    // Call the methods to update the charts with the new date
    this.createChart();
    this.createPieChart();
    this.createPieChart1();
  }




  toggleNightMode() {
    this.isNightMode = !this.isNightMode;
  }

  readAPI(URL: string) {
    return this.http.get<any[]>(URL);
  }

  convertDateFormat(dateString: string): string {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }

  async createChart() {
    const formattedStartDate = this.formatDateForService(this.currentDate.toISOString());
    const url = `${this.serverUrl}:${this.port}/hotel/getlistpvch?today=${formattedStartDate}`;

    this.http.get<any[]>(url).subscribe(
      (data) => {
        const labels = data.map(item => item.labelle);
        const values = data.map(item => item.ca);

        if (this.chart) {
          this.chart.destroy();
        }

        if (values.some(value => value !== 0)) {
          const ctx = document.getElementById('myCh12') as HTMLCanvasElement;
          const ctx2d = ctx.getContext('2d');
          if (!ctx2d) {
            console.error('Unable to get 2D context for canvas');
            return;
          }

          const gradient = ctx2d.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(255, 99, 132, 0.5)');
          gradient.addColorStop(1, 'rgba(54, 162, 235, 0.5)');

          this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: labels,
              datasets: [{
                label: 'Point de vente',
                data: values,
                backgroundColor: gradient,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                borderRadius: 12,
                hoverBorderColor: '#FF6384',
                hoverBorderWidth: 3,
              }],
            },
            options: {
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(200, 200, 200, 0.3)',
                  },
                  ticks: {
                    font: {
                      size: 14,
                      family: 'Arial',
                    },
                    color: '#333',
                  },
                },
                x: {
                  ticks: {
                    font: {
                      size: 14,
                      family: 'Arial',
                    },
                    color: '#333',
                  },
                },
              },
              plugins: {
                legend: {
                  display: true,
                  position: 'top',
                  labels: {
                    font: {
                      size: 16,
                      family: 'Arial',
                    },
                    color: '#555',
                  },
                },
                tooltip: {
                  callbacks: {
                    label: (context) => `Revenue: ${context.parsed.y} `,
                  },
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  titleFont: { size: 14 },
                  bodyFont: { size: 12 },
                  padding: 10,
                },
              },
              animation: {
                duration: 2000,
                easing: 'easeOutBounce',
              },
              hover: {
                mode: 'nearest',
                intersect: true,
              },
            },
          });
        } else {
          console.log('Data values are all zero. Chart not created.');
        }
      },
      (error: any) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  createPieChart() {
    const formattedStartDate = this.formatDateForService(this.currentDate.toISOString());
    this.http.get<any[]>(`${this.serverUrl}:${this.port}/hotel/getrecap?today=${formattedStartDate}`).subscribe(
      (data) => {
        const labels = data.map(item => item.type);
        const values = data.map(item => parseFloat(item.revenu));

        if (this.pieChart) {
          this.pieChart.destroy();
        }

        const ctx = document.getElementById('pieChart8') as HTMLCanvasElement;
        this.pieChart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [{
              data: values,
              backgroundColor: ['#800000', '#ffff00', '#90ee90', '#87ceeb', '#ff6347'],
              hoverBackgroundColor: ['#b30000', '#ffff66', '#66ff66', '#00bfff', '#ff3300'],
            }],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: (context) => `Revenue: ${context.parsed} `,
                },
              },
            },
          },
        });
      },
      (error: any) => {
        console.error('Error fetching data for pie chart:', error);
      }
    );
  }

  createPieChart1() {
    const formattedStartDate = this.formatDateForService(this.currentDate.toISOString());
    this.http.get<any[]>(`${this.serverUrl}:${this.port}/hotel/getrecap1?today=${formattedStartDate}`).subscribe(
      (data) => {
        const labels = data.map(item => item.type2);
        const values = data.map(item => parseFloat(item.revenu2));

        if (this.pieChart1) {
          this.pieChart1.destroy();
        }

        const ctx = document.getElementById('pieChart9') as HTMLCanvasElement;
        this.pieChart1 = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [{
              data: values,
              backgroundColor: ['#800000', '#ffff00', '#90ee90', '#87ceeb', '#ff6347'],
              hoverBackgroundColor: ['#b30000', '#ffff66', '#66ff66', '#00bfff', '#ff3300'],
            }],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: (context) => `Revenue: ${context.parsed} `,
                },
              },
            },
          },
        });
      },
      (error: any) => {
        console.error('Error fetching data for pie chart 1:', error);
      }
    );
  }
}
