import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-recaptilatif',
  templateUrl: './recaptilatif.page.html',
  styleUrls: ['./recaptilatif.page.scss'],
})
export class RecaptilatifPage implements OnInit {
RefreshProcedure() {
throw new Error('Method not implemented.');
}
  currentDate: Date = new Date();
  chart1: any;
  chart2: any;
  rows: any[] = [];
  headers: string[] = [];
  serverUrl: string = '';
  startDate: string = '';
  endDate: string = '';
  formtdstart:string='';
  formtdend:string='';
  isStartDatePickerOpen: boolean = false;
  isEndDatePickerOpen: boolean = false;
  baseUrl: string = '';
  private adrese: string = '';
  private port: string = '';

  constructor(private http: HttpClient, private router: Router, private storage: Storage,private cdr:ChangeDetectorRef) {
    this.storage.create();


  }
  doRefresh(event: any) {
   
 
   }
    async loadConfig() {
      this.serverUrl = localStorage.getItem('urlpub') || 'http://default-url';
    this.port = localStorage.getItem('hotelport') || 'default-port';
  }
  
  async ngOnInit(): Promise<void> {
  await this.loadConfig();

    // Load stored dates if available
    this.startDate = localStorage.getItem('startDate') || new Date().toISOString().split('T')[0];
    this.endDate = localStorage.getItem('endDate') || new Date().toISOString().split('T')[0];

    await this.retrieveSettings();
    this.fetchData(); // Fetch data on initialization
  }

  toggleStartDatePicker() {
    this.isStartDatePickerOpen = !this.isStartDatePickerOpen;
    this.isEndDatePickerOpen = false;
  }

  toggleEndDatePicker() {
    this.isEndDatePickerOpen = !this.isEndDatePickerOpen;
    this.isStartDatePickerOpen = false;
  }

  async retrieveSettings() {
    this.baseUrl = `${this.serverUrl}:${this.port}/hotel`;
  }
  
  formatDateForService(date: string): string {
    const dateParts = date.split('-');
    
    // Check if the date is in the expected format
    if (dateParts.length !== 3) {
      throw new Error('Invalid date format. Expected yyyy-MM-dd');
    }
  
    // Return in dd/MM/yyyy format
    return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
  }

  async fetchData() {
    const formattedStartDate = this.formatDateForService(this.startDate);
    console.log(formattedStartDate);
    this.formtdstart = formattedStartDate;
  
    const formattedEndDate = this.formatDateForService(this.endDate);
    console.log(formattedEndDate);
    this.formtdend = formattedEndDate;
  
    const sessionId = localStorage.getItem('sessionId') || ''; // Default to an empty string if null
  
    // First API call to `/PV_LIST_AR`
    this.http.get<any[]>(`${this.baseUrl}/PV_LIST_AR`, {
      params: {
        p_startDate: this.formtdstart,
        p_endDate: this.formtdend,
        session_id_: sessionId,
      },
      responseType: 'json' as const // Explicitly set response type to JSON
    }).subscribe(
      (data) => {
        if (Array.isArray(data)) {  // Check if data is an array
          this.rows = data.map(item => ({
            ...item,
            integervalue5: Math.floor(item.aut),
            integervalue4: Math.floor(item.espe),
            integervalue3: Math.floor(item.cheq),
            integervalue2: Math.floor(item.cart),
            integervalue1: Math.floor(item.aut),
            TO: Math.floor(item.ca),
          }));
        }
  
        // Nested API call to `/getlistpv` after the first one succeeds
        const sessionId = localStorage.getItem('sessionId');
        this.http.get<any[]>(`${this.baseUrl}/getlistpv/${sessionId}`, {
          responseType: 'json' as const
        }).subscribe(
          (data) => {
            console.log('items:', data);
            if (Array.isArray(data) && data.length > 0) {
              this.rows = data.map(item => ({
                ...item,
                integervalue5: Math.floor(item.aut),
                integervalue4: Math.floor(item.espe),
                integervalue3: Math.floor(item.cheq),
                integervalue2: Math.floor(item.cart),
                integervalue1: Math.floor(item.aut),
                TO: Math.floor(item.ca),
              }));
            } else {
              this.rows = [];
            }
            
            this.createChart1();
            this.createChart2();
          },
          (error) => {
            console.error('Failed to fetch data from /getlistpv:', error);
          }
        );
      },
      (error) => {
        console.error('Failed to fetch data from /PV_LIST_AR:', error);
      }
    );
  
    this.cdr.detectChanges();
  }
  
  
  

  // Save the date when user changes it in the calendar
  async onDateChange() {
    localStorage.setItem('startDate', this.startDate);
    localStorage.setItem('endDate', this.endDate);
    this.fetchData(); // Re-fetch data based on the new date range
  }


    async createChart1() {
      try {
        const sessionId = localStorage.getItem('sessionId');
        const data = await this.http.get<any[]>(`${this.baseUrl}/getmaxarticle/${sessionId}`).toPromise();
    
        // Check if data is defined and has at least 3 items
        if (!data || data.length < 3) {
          console.error('Insufficient data to display top 3 items');
          
          // Destroy any existing chart and clear the canvas if data is insufficient
          if (this.chart1) {
            this.chart1.destroy();
            this.chart1 = null; // Reset chart reference
          }
    
          return; // Exit the function to avoid displaying a chart
        }
    
        // Destroy the existing chart if it exists
        if (this.chart1) {
          this.chart1.destroy();
        }
    
        // Sort and select top 3 articles based on quantity sold (qte)
        data.sort((a, b) => b.qte - a.qte);
        const top3Data = data.slice(0, 3);
    
        // Extract labels and values for chart display
        const labels = top3Data.map(item => item.labelle);
        const values = top3Data.map(item => item.qte);
    
        const canvas = document.getElementById('chart1') as HTMLCanvasElement;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            // Define colors for each bar
            const backgroundColors = ['#36A2EB', '#36A2EB', '#36A2EB'];
            const borderColors = ['#36A2EB', '#36A2EB', '#36A2EB'];
    
            this.chart1 = new Chart(ctx, {
              type: 'bar',
              data: {
                labels: labels,
                datasets: [{
                  label: 'Meilleur article vendu',
                  data: values,
                  backgroundColor: backgroundColors,
                  borderColor: borderColors,
                  borderWidth: 2,
                  hoverBackgroundColor: ['#FF6F91', '#3A99D8', '#FFD700'],
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Articles',
                      font: { size: 14, weight: 'bold' }
                    },
                    ticks: {
                      font: { size: 12 },
                      autoSkip: false,
                      maxRotation: 45,
                      minRotation: 45,
                    }
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Quantité',
                      font: { size: 14, weight: 'bold' }
                    },
                    beginAtZero: true,
                    ticks: {
                      font: { size: 12 },
                      stepSize: 1,
                    }
                  }
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context) => `Quantity: ${context.raw}`
                    },
                    backgroundColor: '#444',
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 12 },
                    cornerRadius: 5
                  },
                  legend: {
                    display: true,
                    labels: {
                      font: { size: 14, weight: 'bold' }
                    }
                  }
                },
                onClick: (event, elements) => {
                  if (elements.length > 0) {
                    const index = elements[0].index;
                    const selectedLabelle = labels[index];
                    console.log(`Selected Article: ${selectedLabelle}`);
                  }
                }
              }
            });
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    async createChart2() {
      const sessionId = localStorage.getItem('sessionId');
      this.http.get<any[]>(`${this.baseUrl}/getlistpv/${sessionId}`).subscribe(data => {
        if (this.chart2) {
          this.chart2.destroy();
        }
    
        if (data && data.length > 0) {
          // Sort the data by the 'ca' value in descending order
          data.sort((a, b) => b.ca - a.ca);
    
          // Get the top 2 or 3 items depending on the length of the data
          const topData = data.slice(0, Math.min(3, data.length)); // Get the first 3 items if available, or fewer if there are less than 3
    
          // Prepare the labels and values for the chart
          const labels = topData.map(item => item.labelle);
          const values = topData.map(item => item.ca);
    
          // Create the chart
          this.chart2 = new Chart('chart2', {
            type: 'bar',
            data: {
              labels: labels,
              datasets: [{
                label: 'Point De Vente',
                data: values,
                backgroundColor: ['#FA7000', '#FA7000', '#FA7000'].slice(0, topData.length), // Adjust background color array length
                barPercentage: 0.6,
              }]
            },
            options: {}
          });
        }
      }, (error: any) => {
        console.error('Error fetching data:', error);
      });
    }
    

  openRowDetails(caisseid: string, labelle: string, TO: string) {
    // Save startDate and endDate in localStorage
    if (this.startDate && this.endDate) {
        localStorage.setItem('startDate', this.startDate);
        localStorage.setItem('endDate', this.endDate);
    } else {
        console.error("Start date or end date is missing.");
    }

    // Navigate to the detail page with additional parameters
    this.router.navigate(['/deteilrecap', caisseid, { labelle: labelle, TO: TO }]);
  }

  // This method will be called when the component is destroyed
  ngOnDestroy() {
    // Remove startDate and endDate from localStorage when navigating away from this page
    localStorage.removeItem('startDate');
    localStorage.removeItem('endDate');
  }



}
