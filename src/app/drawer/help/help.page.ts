import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartOptions } from 'chart.js/auto';
import { HotelService } from 'src/app/services/hotel.service';
import { HttpClient } from '@angular/common/http';
import { Executeprocdispo } from 'src/app/drawer/help/executeprocdispo';
import { Procedurecateg } from './procedurecateg';
import { forkJoin, interval } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {
  serverUrl: string ='';
  isLoading: boolean = true;
  reloadInterval: any;
  showDetailsChart: boolean =false;
RefreshProcedure() {
  this.Executeprocdispo.getDataForSecondUrl().subscribe((data) => {
    const aa = data;
    this.Executeprocdispo.executeProcedure(aa).subscribe((data1) => {});
  });
  this.RefreshProceduredispo();
  
  this.procedurecateg.getAndExecuteProcedure().subscribe(
    response => { console.log('Procedure executed successfully getAndExecuteProcedure', response); },
    error => { console.error('Error executing procedure', error); }
  );

}
doRefresh(event: any) {
  setTimeout(() => {
    this.Executeprocdispo.getDataForSecondUrl().subscribe((data) => {
      const aa = data;
      this.Executeprocdispo.executeProcedure(aa).subscribe((data1) => {});
    });
    this.RefreshProceduredispo();
    
    this.procedurecateg.getAndExecuteProcedure().subscribe(
      response => { console.log('Procedure executed successfully getAndExecuteProcedure', response); },
      error => { console.error('Error executing procedure', error); }
    );
    event.target.complete();
    this.refreshCharts();
    this.barChartMethod();
  }, 200);
}

  chart: any;
  currentDate: Date = new Date();
  @ViewChild('pieCanvas') pieCanvas!: ElementRef;
  DataapiArray: any[] = [];
  Datareserv: any[] = [];
  datachambredispo1 = '';
  DataAPI = '';
  dataarrdep = '';
  datareser = '';
  Datareser = {
    getwalikingtday: '',
    getreserve: '',
  }
  fifthday: Date = new Date();
  sixday: Date = new Date();
  sevenday: Date = new Date();
  dayOfMonth: any;
  day: any;
  monthName: any;
  private adrese: string = '';
  private port: string = '';
  firstday: Date = new Date();
  secondday: Date = new Date();
  thirdday: Date = new Date();
  tomorrow: Date = new Date();

  DataARRDEP = {
    ArrivePrevus: '',
    Arrive: '',
    DepartPrevus: '',
    Depart: '',
    today: '',
  }
  Datdispo = {
    nbr: '',
    cod_categ: '',
  }

  constructor(private http: HttpClient, private hotelservice: HotelService, private ngZone: NgZone, private Executeprocdispo: Executeprocdispo, private procedurecateg: Procedurecateg, private storage: Storage) { }

  isLive: boolean = false;

  toggleLiveStatus() {
    this.isLive = !this.isLive;
  }
 /*doRefresh(event: any) {
    // Refresh charts
    this.refreshCharts();
  
    // Complete the refresh after a short delay
    setTimeout(() => {
      this.RefreshProceduredispo();
      event.target.complete(); // Complete the refresh action
    }, 200); // Simulate a delay for smoother refresh
  }*/
    async loadConfig() {
      this.serverUrl = localStorage.getItem('urlpub') || 'http://default-url';
      this.port = localStorage.getItem('hotelport') || 'default-port';
    }
  refreshCharts() {
    // Refresh the required charts here
    this.createChartchh();  // Example function to refresh your chart
    this.RefreshProceduredispo();  // Call this to refresh your procedures and other logic
  
    // Refresh the PieChart
    this.readAPI(this.datachambredispo1).subscribe((data: any[]) => {
      const formattedData = data.map(item => ({
        cod_categ: item.cod_categ,
        nbr: item.nbr
      }));
      this.createPieChart(formattedData);  // Refresh the pie chart with new data
    });
  
 
  
    // Call other chart refreshing methods as needed
  }





  refreshProgress: number = 0;

  async ngOnInit() {
    this.reloadInterval = setInterval(() => {
     // this.refreshCharts();
    }, 500); // 10 seconds (10000ms)
        setTimeout(async () => {
    await this.loadConfig();
   // this.refreshCharts(); // Initial call to load data and charts
  
  // Set up auto-refresh every 5 minutes (300,000 ms)
    this.createChartchh()
    // Construct URLs using the retrieved address and port
    this.DataAPI = `${this.serverUrl}:${this.port}/hotel/countRack`;
    const sessionId = localStorage.getItem('sessionId');
    this.dataarrdep = `${this.serverUrl}:${this.port}/hotel/getdataarrdep`;
    this.datareser = `${this.serverUrl}:${this.port}/hotel/getwalk`;
    this.datachambredispo1 = `${this.serverUrl}:${this.port}/hotel/getchambredispo1`;
    this.readAPI(this.dataarrdep).subscribe((data) => {
      this.DataARRDEP.ArrivePrevus = data.arr_prev;
      this.DataARRDEP.Arrive = data.per_arr_prev;
      this.DataARRDEP.DepartPrevus = data.dep_prev;
      this.DataARRDEP.Depart = data.per_dep_prev;
      this.DataARRDEP.today = data.today;
      this.barChartMethod(this.DataARRDEP);
    });
    this.readAPI(this.datareser).subscribe((data) => {
      this.Datareser.getwalikingtday = data.getwalikingtday;
      this.BarChart1(this.Datareser);
    });
    // Fetch the data and initialize the charts
 
    this.readAPI(this.datachambredispo1).subscribe((data: any[]) => {
      const formattedData = data.map(item => ({
        cod_categ: item.cod_categ,
        nbr: item.nbr
      }));
      this.createPieChart(formattedData);
    });
    this.RefreshProceduredispo();

    this.currentDate.setDate(this.currentDate.getDate());
    this.tomorrow.setDate(this.currentDate.getDate() + 1);
    this.firstday.setDate(this.currentDate.getDate() + 2);
    this.secondday.setDate(this.currentDate.getDate() + 3);
    this.thirdday.setDate(this.currentDate.getDate() + 4);
    this.fifthday.setDate(this.currentDate.getDate() + 5);
    this.sixday.setDate(this.currentDate.getDate() + 6);
    this.sevenday.setDate(this.currentDate.getDate() + 7);
  
    
    this.RefreshProceduredispo();this.RefreshProcedure();
    this.procedurecateg.proceduregenerer().subscribe(()=>{})
    this.isLoading = false;
  }, 1000);
  }
  


  async RefreshProceduredispo() {
    // First API call: getDataForSecondUrl
    const dataObservable = this.Executeprocdispo.getDataForSecondUrl();
    
    // Second API call: getAndExecuteProcedure
    const procedureObservable = this.procedurecateg.getAndExecuteProcedure();
  
    // Use forkJoin to execute both API calls concurrently
    forkJoin([dataObservable, procedureObservable]).subscribe(
      ([data, response]) => {
        // Handle the data returned from both APIs
        console.log('Data from first API call:', data); // For debugging
        console.log('Response from second procedure:', response); // For debugging
  
        // Now you can execute the second procedure using the data from the first API call
        const aa = data;
        this.Executeprocdispo.executeProcedure(aa).subscribe(
          (data1) => {
            // Handle the final response of the executeProcedure if needed
            console.log('Execute procedure completed successfully', data1);
          },
          (error) => {
            console.error('Error executing procedure with data from the first API call', error);
          }
        );
      },
      (error) => {
        // Handle any errors from either of the forked observables
        console.error('Error in one of the API calls:', error);
      }
    );
  }
  

  readAPI(URL: string) {
    return this.http.get<any>(URL);
  }

 

  barChartMethod(arrdep?: any) {
    const dataValues = [
      arrdep.ArrivePrevus,
      arrdep.Arrive,
      arrdep.DepartPrevus,
      arrdep.Depart,
    ];
    const labels = [
      'Arrivées prévues',
      'Arrivées Effectuées',
      'Départs prévus',
      'Départs Effectués',
    ];
  
    const ctx = document.getElementById('occupchart2') as HTMLCanvasElement;
    const existingChart = Chart.getChart(ctx);
  
    // Destroy if a chart instance already exists
    if (existingChart) {
      existingChart.destroy();
    }
  
    // Calculate max value to determine appropriate step size
    const maxValue = Math.max(...dataValues);
    const stepSize = this.getStepSize(maxValue);
  
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: '',
          data: dataValues,
          backgroundColor: ['orange', 'orange', 'blue', 'blue'],
          borderWidth: 2,
          borderRadius: 12,
         // hoverBorderColor: '#FF6384',
          hoverBorderWidth: 3,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 2000,
          easing: 'easeOutBounce',
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(200, 200, 200, 0.3)',
            },
            ticks: {
              stepSize: stepSize,  // Dynamic step size based on data
              font: { size: 14, family: 'Arial' },
              color: '#333',
            },
          },
          x: {
            ticks: {
              font: { size: 14, family: 'Arial' },
              color: '#333',
            },
          },
        },
        plugins: {
          legend: { display: false, position: 'top' },
        },
      },
    });
  }
  
  // Function to calculate step size based on max value
  getStepSize(maxValue: number) {
    if (maxValue <= 50) {
      return 10;  // Use steps of 10 if max value is small
    } else if (maxValue <= 500) {
      return 20;  // Use steps of 50 for medium values
    } else if (maxValue <= 1000) {
      return 100;  // Use steps of 100 for larger values
    } else {
      return 200;  // Use steps of 200 for very large values
    }
  }
  
  
  BarChart1(reserv: any) {
    const dataValues = [reserv.getwalikingtday];
    const ctx = document.getElementById('myCh5') as HTMLCanvasElement;
  
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
      existingChart.destroy();
    }
  
    const ctx2d = ctx.getContext('2d');
    if (!ctx2d) {
      console.error('Unable to get 2D context for canvas');
      return;
    }
  
    const gradient = ctx2d.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(255, 99, 132, 0.5)');
    gradient.addColorStop(1, 'rgba(54, 162, 235, 0.5)');
  
    const stepSize = this.getStepSize(dataValues[0]);
  
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['WalkIN'],
        datasets: [{
          label: 'Walk-In',
          data: dataValues,
          backgroundColor: gradient,
         // borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          borderRadius: 12,
        }],
      },
      options: {
        responsive: true,
        animation: { duration: 2000, easing: 'easeOutBounce' },
        scales: {
          y: { 
            beginAtZero: true, 
            grid: { color: 'rgba(200, 200, 200, 0.3)' },
            ticks: {
              stepSize: stepSize,  // Dynamic step size based on data
              font: { size: 14, family: 'Arial' },
              color: '#333',
            },
          },
          x: { ticks: { font: { size: 14, family: 'Arial' }, color: '#333' } },
        },
        plugins: {
          title: { display: true, text: 'Walk-In Statistics' },
        },
      },
    });
  }
  
  createPieChart(dispos: any[]) {
    // Check if dispos is empty
    if (!dispos || dispos.length === 0) {
      return;
    }
  
    let pieChartData: number[] = [];
    let labels: string[] = [];
    let sum = dispos.reduce((acc, curr) => acc + (curr.nbr || 0), 0);
  
    for (let item of dispos) {
      if (item && typeof item === 'object' && 'nbr' in item && 'cod_categ' in item) {
        let percentage = (item.nbr / sum) * 100;
        pieChartData.push(percentage);
        labels.push(`${item.cod_categ} (${percentage.toFixed(2)}%)`);
      }
    }
  
    const pieChartCtx = document.getElementById('pieChart4') as HTMLCanvasElement;
  
    if (!pieChartCtx) {
      console.warn('Pie chart canvas not found.');
      return;
    }
  
    // Destroy the existing chart if it exists
    const existingPieChart = Chart.getChart(pieChartCtx);
    if (existingPieChart) {
      existingPieChart.destroy();
    }
  
    new Chart(pieChartCtx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            data: pieChartData,
            backgroundColor: [
              '#ff6f61', '#f9d423', '#24c1f2', '#ffb6c1', '#8b4513', '#ff6347', 
              '#4682b4', '#32cd32', '#ff4500', '#6a5acd', '#ffd700', '#dc143c',
              '#adff2f', '#00ced1', '#1e90ff', '#ff1493', '#9932cc', '#ff69b4',
              '#ba55d3', '#ff00ff', '#cd5c5c', '#ffa07a', '#8a2be2', '#ffdab9',
              '#87cefa', '#3cb371', '#808000', '#b03060', '#00ff7f', '#6495ed',
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: {
              boxWidth: 10,
              font: { size: 8 },
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${(context.raw as number).toFixed(2)}%`,
            },
          },
          datalabels: {
            display: true,
            color: 'black',
            font: { size: 6 },
            formatter: (value, context) => context.chart.data.labels?.[context.dataIndex] || '',
          },
        },
        layout: {
          padding: 10,
        },
      },
    });
  
    pieChartCtx.addEventListener('click', (event) => {
      const segments = Chart.getChart(pieChartCtx)?.getElementsAtEventForMode(
        event,
        'nearest',
        { intersect: true },
        true
      );
  
      if (segments && segments.length > 0) {
        const clickedIndex = segments[0].index;
        const clickedLabel = labels[clickedIndex];
        this.openDetailsChart(clickedLabel);
      }
    });
  }
  
  async openDetailsChart(clickedLabel: string) {
    this.showDetailsChart = true; 
    const monthNames = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
    ];
  
    const formatDay = (dateObj: Date) => `${dateObj.getDate()} ${monthNames[dateObj.getMonth()]}`;
  
    const labels = [
      formatDay(this.tomorrow),
      formatDay(this.firstday),
      formatDay(this.secondday),
      formatDay(this.thirdday),
      formatDay(this.fifthday),
      formatDay(this.sixday),
    ];
  
    try {
      const response = await fetch(`${this.serverUrl}:${this.port}/hotel/getprevcateg`);
      if (!response.ok) throw new Error('Failed to fetch data');
  
      const data = await response.json();
      const clickedCodCateg = clickedLabel.split('(')[0].trim();
      const filteredData = data.filter((item: { cod_CATEG: string }) => item.cod_CATEG === clickedCodCateg);
  
      const detailsChartData = filteredData.map((item: { rest: number }) => item.rest);
      const detailsChartCtx = document.getElementById('detailsChart6') as HTMLCanvasElement;
  
      if (!detailsChartCtx) {
        console.warn('Details chart canvas not found.');
        return;
      }
  
      const existingDetailsChart = Chart.getChart(detailsChartCtx);
      if (existingDetailsChart) existingDetailsChart.destroy();
  
      new Chart(detailsChartCtx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: `${clickedCodCateg} Details`,
            data: detailsChartData,
            backgroundColor: Array(6).fill('blue'),
            borderColor: 'blue',
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
              grid: { color: 'rgba(200, 200, 200, 0.3)' },
              ticks: {
                font: { size: 14, family: 'Arial' },
                color: '#333',
              },
            },
            x: {
              ticks: {
                font: { size: 14, family: 'Arial' },
                color: '#333',
              },
            },
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: { font: { size: 16, family: 'Arial' }, color: '#555' },
            },
            tooltip: {
              callbacks: {
                label: (context) => ` ${context.parsed.y} `,
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
          hover: { mode: 'nearest', intersect: true },
        },
      });
    } catch (error) {
      console.error('Error fetching details chart data:', error);
    }
  }
  


createChartchh() {
  const apiUrl1 = `${this.serverUrl}:${this.port}/hotel/getchhotel`;

  this.http.get<any[]>(apiUrl1).subscribe(
    (response) => {
      const labels = response.map(item => {
        const date = new Date(item.dat_rev);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
      });

      const data = response.map(item => item.chiffre);

      // Get the canvas element
      const chartCanvas = document.getElementById('MyChartch1') as HTMLCanvasElement;

      // Destroy the existing chart instance if it exists
      const existingChart = Chart.getChart(chartCanvas);
      if (existingChart) {
        existingChart.destroy();
      }

      // Create the new chart
      this.chart = new Chart(chartCanvas, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: "Chiffre D'affaire",
              data: data,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: '#4BC0C0',
              borderWidth: 3,
              pointBackgroundColor: '#4BC0C0',
              pointBorderColor: '#fff',
              pointRadius: 6,
              pointHoverRadius: 8,
              tension: 0.4,
              fill: true,
            }
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 1200,
            easing: 'easeInOutCubic',
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                font: {
                  size: 14,
                  weight: 600,
                },
                color: '#4BC0C0',
              }
            },
            tooltip: {
              backgroundColor: '#333',
              titleFont: { size: 16, weight: 600 },
              bodyFont: { size: 14 },
              callbacks: {
                label: (context) => {
                  const value = context.raw as number;
                  return `Chiffre: ${value.toLocaleString()}`;
                }
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Date',
                color: '#4BC0C0',
                font: {
                  size: 14,
                  weight: 600,
                }
              },
              ticks: {
                color: '#4BC0C0',
                maxRotation: 45,
                minRotation: 45,
              },
              grid: {
                color: 'rgba(220, 220, 220, 0.5)',
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                color: '#4BC0C0',
                padding: 8,
              },
              grid: {
                color: 'rgba(220, 220, 220, 0.5)',
              },
            }
          },
          layout: {
            padding: { top: 20, bottom: 10, left: 15, right: 15 }
          }
        },
      });
    },
    (error) => {
      console.error('Error fetching data', error);
    }
  );
}


}