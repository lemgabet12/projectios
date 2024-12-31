
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ChartOptions, ChartType, ChartData, Chart } from 'chart.js';

@Component({
  selector: 'app-deteilrecap',
  templateUrl: './deteilrecap.page.html',
  styleUrls: ['./deteilrecap.page.scss'],
})
export class DeteilrecapPage implements OnInit {
  serverUrl: string = '';
  port: string = '';
  currentDate: Date = new Date();
  pointDeVenteName: string | null = null;
  selectedRowData: any[] = [];
  TO!: number;
  startDate: string = '';
  endDate: string = '';
  caisseid: string = '';

  // Chart data and configuration
  topArticlesData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'CA (dt)',
        data: [],
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(75, 192, 192, 0.6)'],
        borderColor: 'rgba(0, 0, 0, 1)',
        borderWidth: 1
      }
    ]
  };
  
  chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#333',
          font: {
            size: 14,
            family: 'Arial',
          },
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.3)',
        },
      },
      x: {
        ticks: {
          color: '#333',
          font: {
            size: 14,
            family: 'Arial',
          },
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
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        padding: 10,
        callbacks: {
          label: (context) => `Revenue: ${context.parsed.y} dt`,
        },
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeOutBounce',
    },
  };

  chartType: ChartType = 'bar';

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private http: HttpClient
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadConfig();
    this.caisseid = this.route.snapshot.params['caisseid'];
    this.TO = parseFloat(this.route.snapshot.params['TO']);
    this.pointDeVenteName = this.route.snapshot.params['labelle'];
    this.startDate = this.formatDate(localStorage.getItem('startDate'));
    this.endDate = this.formatDate(localStorage.getItem('endDate'));

    this.executeDetielArtProcedure();
  }

  async loadConfig() {
    this.serverUrl = localStorage.getItem('urlpub') || 'http://default-url';
    this.port = localStorage.getItem('hotelport') || 'default-port';
  }

  executeDetielArtProcedure(): void {
    if (!this.startDate || !this.endDate) {
      console.error('Start date or end date is missing.');
      return;
    }
    const sessionId = localStorage.getItem('sessionId') || ''; 
    const detielArtUrl = `${this.serverUrl}:${this.port}/hotel/detiel_art?caiss_param=${this.caisseid}&p_startDate=${this.startDate}&p_endDate=${this.endDate}&session_id_=${sessionId}`;

    this.http.get(detielArtUrl).subscribe(
      () => this.fetchDataFromGetListCaisseid(),
      (error) => console.error('Error executing detiel_art:', error)
    );
  }

  fetchDataFromGetListCaisseid(): void {
    const sessionId = localStorage.getItem('sessionId') || ''; 
    const getlistCaisseidUrl = `${this.serverUrl}:${this.port}/hotel/getlistcaisseid/${sessionId}`;

    this.http.get<any[]>(getlistCaisseidUrl).subscribe(
      (data) => {
        this.selectedRowData = data.map((row) => {
          row.ca = Math.floor(parseFloat(row.ca));
          row.calculatedValue = (row.ca / this.TO) * 100;
          return row;
        });

        // Sort and get top 3 articles based on 'ca'
        const topArticles = [...this.selectedRowData]
          .sort((a, b) => b.ca - a.ca)
          .slice(0, 3);
        
        // Set chart labels and data
        this.topArticlesData.labels = topArticles.map(item => item.labelle);
        this.topArticlesData.datasets[0].data = topArticles.map(item => item.ca);

        this.createChart();  // Call to create the chart after setting the data
      },
      (error) => console.error('Error fetching data from getlistcaisseid:', error)
    );
  }

  createChart() {
    const ctx = document.getElementById('detelchart') as HTMLCanvasElement;
    const ctx2d = ctx.getContext('2d');
    if (!ctx2d) {
      console.error('Unable to get 2D context for canvas');
      return;
    }

    const gradient = ctx2d.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(54, 162, 235, 0.6)');
    gradient.addColorStop(1, 'rgba(255, 99, 132, 0.6)');

    new Chart(ctx, {
      type: 'bar',
      data: this.topArticlesData,
      options: this.chartOptions,
    });
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  }

  returnToMainTable() {
    this.navCtrl.navigateBack('/menu/recaptilatif');
  }

  RefreshProcedure() {
    this.executeDetielArtProcedure();
  }
}
