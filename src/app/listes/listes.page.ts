import { Component, NgZone, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';

export interface Client {
  timeDiff: string;
  nom: string;
  date_arr: string;
  date_dep: string;
  chb: string;
  heure: string;
  etat: string;
}

interface RowData {
  title: string;
  number: number;
}

@Component({
  selector: 'app-listes',
  templateUrl: './listes.page.html',
  styleUrls: ['./listes.page.scss'],
})
export class ListesPage implements OnInit {
RefreshProcedure() {
throw new Error('Method not implemented.');
}
  // Client and pagination related properties
  data1: Client[] = [];
  itemsPerPage: number = 5;
  isLoading: boolean = true;
  totalPagesVIP: number = 0;
  currentPageVip: number = 1;
  itemsPerPageVIP: number = 5; // Adjust as needed
  vipData: any[] = []; // Your data array
  paginatedVipData: any[] = []; // Array to hold paginated data
  pageNumbersVIP: number[] = []; // Array to hold page numbers
  
  // Data related to rows and table details
  selectedRowIndex: number | null = null;
  data: { rows: RowData[] } = { rows: [] };
  detailHeaders: string[][] = [[], [], [], []];
  detailTitles: string[] = [
    'Liste des résidents VIP',
    'Liste des résidents Offres',
    'Liste des anniversaires',
    'Liste des résidents revenant'
  ];

  // Data for different categories (VIP, Offers, Anniversaries, Revenants)




  // Current date for calculations
  currentDate: Date = new Date();
  isDataLoaded: boolean = false;

  // Paginated data for each category


  
  // Pagination state
  pageNumbers: number[] = [];
  serverUrl: string = '';
  port: string = '';

  constructor(private http: HttpClient, private ngZone: NgZone, private storage: Storage) {
    setInterval(() => {
      this.fetchData();
    }, 10000); // Fetch data every 10 seconds
  }

  async loadConfig() {
    this.serverUrl = localStorage.getItem('urlpub') || 'http://default-url';
    this.port = localStorage.getItem('hotelport') || 'default-port';
  }

  async ngOnInit() {
    setTimeout(async () => {
    await this.loadConfig();

    this.fetchData();
    this.isLoading = false;
  }, 1000);
  }

  // Method to update page numbers dynamically
  updatePageNumbers() {
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  // Calculate time difference between current time and the provided time
  calculateTimeDifference(heure: string): string {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentSecond = currentTime.getSeconds();

    const timeParts = heure.split(":");
    if (timeParts.length !== 2) {
      return 'Format de l\'heure invalide';
    }

    const heureHour = parseInt(timeParts[0], 10);
    const heureMinute = parseInt(timeParts[1], 10);

    let diffInMinutes = ((currentHour - heureHour) * 60) + (currentMinute - heureMinute);
    let diffInSeconds = currentSecond;

    if (diffInMinutes < 0 || (diffInMinutes === 0 && diffInSeconds < 0)) {
      diffInMinutes = Math.abs(diffInMinutes);
      diffInSeconds = Math.abs(diffInSeconds);
    }

    if (diffInMinutes === 0) {
      return `${diffInSeconds} s${diffInSeconds !== 1 ? 's' : ''}`;
    }

    if (diffInMinutes < 60) {
      return `${diffInMinutes} m${diffInMinutes !== 1 ? 's' : ''}`;
    }

    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;

    let result = '';
    if (hours >= 2) {
      result += `${hours} h${hours !== 1 ? 's' : ''}`;
      if (minutes > 0) {
        result += ` et ${minutes} m${minutes}`;
      }
    } else {
      if (hours > 0) {
        result += `${hours} h${hours}`;
      }
      if (minutes > 0) {
        if (result.length > 0) {
          result += ' et ';
        }
        result += `${minutes} m${minutes}`;
      }
    }

    return result;
  }

  // pagination tableau mouvement
  totalPages: number = 0;
  currentPage: number = 1;
  paginatedData: any[] = []; // Array to hold paginated data
  
  updatePaginationMouvement(): void {
    // Calculate total number of pages
    this.totalPages = Math.ceil(this.data1.length / this.itemsPerPage);
  
    // Calculate start and end index for the current page
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
  
    // Get the data for the current page
    this.paginatedData = this.data1.slice(startIndex, endIndex);
  
    // Calculate the block of page numbers around the current page
    const blockSize = 3; // Show 3 pages at a time
    const startBlock = Math.floor((this.currentPage - 1) / blockSize) * blockSize + 1;
    const endBlock = Math.min(startBlock + blockSize - 1, this.totalPages);
  
    this.pageNumbers = [];
    for (let i = startBlock; i <= endBlock; i++) {
      this.pageNumbers.push(i);
    }
  }
  
  prevPageMouvement(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginationMouvement();
    }
  }
  
  nextPageMouvement(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginationMouvement();
    }
  }
  
  goToPageMouvement(pageNumber: number): void {
    if (pageNumber > 0 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      this.updatePaginationMouvement();
    }
  }
  

/***********************************************VIP Pagination Updates***** */


updatePaginationVIP(): void {
  this.totalPagesVIP = Math.ceil(this.vipData.length / this.itemsPerPageVIP);
  const startIndex = (this.currentPageVip - 1) * this.itemsPerPageVIP;
  const endIndex = startIndex + this.itemsPerPageVIP;
  this.paginatedVipData = this.vipData.slice(startIndex, endIndex);
  
  // Calculate the page numbers to display (3 numbers always)
  const left = Math.max(1, this.currentPageVip - 1); // Ensure at least 1
  const right = Math.min(this.totalPagesVIP, this.currentPageVip + 1); // Ensure no overflow
  
  // Ensure always 3 pages displayed
  this.pageNumbersVIP = [left].concat(
    this.currentPageVip !== left && this.currentPageVip !== right ? [this.currentPageVip] : [],
    right
  ).filter(page => page > 0 && page <= this.totalPagesVIP); // Remove invalid pages
}

prevPageVIP(): void {
  if (this.currentPageVip > 1) {
    this.currentPageVip--;
    this.updatePaginationVIP();
  }
}

nextPageVIP(): void {
  if (this.currentPageVip < this.totalPagesVIP) {
    this.currentPageVip++;
    this.updatePaginationVIP();
  }
}

goToPageVIP(pageNumber: number): void {
  if (pageNumber > 0 && pageNumber <= this.totalPagesVIP) {
    this.currentPageVip = pageNumber;
    this.updatePaginationVIP();
  }
}





/***************************************************** */

/*************************************Offre Pagination Updates ******/



totalPagesOffre: number = 0;
currentPageOffre: number = 1;
itemsPerPageOffre: number = 5; // Adjust as needed
offersData: any[] = []; // Your data array for offers
paginatedOffersData: any[] = []; // Array to hold paginated offer data
pageNumbersOffre: number[] = []; // Array to hold page numbers for offers

updatePaginationOffre(): void {
  this.totalPagesOffre = Math.ceil(this.offersData.length / this.itemsPerPageOffre);
  
  // Calculate the start and end index for the current page
  const startIndex = (this.currentPageOffre - 1) * this.itemsPerPageOffre;
  const endIndex = startIndex + this.itemsPerPageOffre;
  
  this.paginatedOffersData = this.offersData.slice(startIndex, endIndex);
  
  // Calculate the block of 3 page numbers around the current page
  const blockSize = 3;
  const startBlock = Math.floor((this.currentPageOffre - 1) / blockSize) * blockSize + 1;
  const endBlock = Math.min(startBlock + blockSize - 1, this.totalPagesOffre);

  this.pageNumbersOffre = [];
  for (let i = startBlock; i <= endBlock; i++) {
    this.pageNumbersOffre.push(i);
  }
}

prevPageOffre(): void {
  if (this.currentPageOffre > 1) {
    this.currentPageOffre--;
    this.updatePaginationOffre();
  }
}

nextPageOffre(): void {
  if (this.currentPageOffre < this.totalPagesOffre) {
    this.currentPageOffre++;
    this.updatePaginationOffre();
  }
}

goToPageOffre(pageNumber: number): void {
  if (pageNumber > 0 && pageNumber <= this.totalPagesOffre) {
    this.currentPageOffre = pageNumber;
    this.updatePaginationOffre();
  }
}


/***************************************************** */

/*************************************Annif Pagination Updates ******/

totalPagesAnnif: number = 0;
currentPageAnnif: number = 1;
itemsPerPageAnnif: number = 5; // Adjust as needed
anniversariesData: any[] = []; // Your data array for anniversaries
paginatedAnniversariesData: any[] = []; // Array to hold paginated anniversary data
pageNumbersAnnif: number[] = []; // Array to hold page numbers for anniversaries

updatePaginationAnnif(): void {
  this.totalPagesAnnif = Math.ceil(this.anniversariesData.length / this.itemsPerPageAnnif);
  
  // Calculate the start and end index for the current page
  const startIndex = (this.currentPageAnnif - 1) * this.itemsPerPageAnnif;
  const endIndex = startIndex + this.itemsPerPageAnnif;
  
  this.paginatedAnniversariesData = this.anniversariesData.slice(startIndex, endIndex);
  
  // Calculate the block of 3 page numbers around the current page
  const blockSize = 3;
  const startBlock = Math.floor((this.currentPageAnnif - 1) / blockSize) * blockSize + 1;
  const endBlock = Math.min(startBlock + blockSize - 1, this.totalPagesAnnif);

  this.pageNumbersAnnif = [];
  for (let i = startBlock; i <= endBlock; i++) {
    this.pageNumbersAnnif.push(i);
  }
}

prevPageAnnif(): void {
  if (this.currentPageAnnif > 1) {
    this.currentPageAnnif--;
    this.updatePaginationAnnif();
  }
}

nextPageAnnif(): void {
  if (this.currentPageAnnif < this.totalPagesAnnif) {
    this.currentPageAnnif++;
    this.updatePaginationAnnif();
  }
}

goToPageAnnif(pageNumber: number): void {
  if (pageNumber > 0 && pageNumber <= this.totalPagesAnnif) {
    this.currentPageAnnif = pageNumber;
    this.updatePaginationAnnif();
  }
}


/***************************************************** */

/*************************************Revenant Pagination Updates ******/

totalPagesRevenet: number = 0;
currentPageRevenent: number = 1;
itemsPerPageRevent: number = 5; // Adjust as needed
revenantData: any[] = []; // Your data array for revenants
paginatedRevenantData: any[] = []; // Array to hold paginated revenant data
pageNumbersRevenent: number[] = []; // Array to hold page numbers for revenants

updatePaginationRevenent(): void {
  this.totalPagesRevenet = Math.ceil(this.revenantData.length / this.itemsPerPageRevent);
  
  // Calculate the start and end index for the current page
  const startIndex = (this.currentPageRevenent - 1) * this.itemsPerPageRevent;
  const endIndex = startIndex + this.itemsPerPageRevent;
  
  this.paginatedRevenantData = this.revenantData.slice(startIndex, endIndex);
  
  // Calculate the block of 3 page numbers around the current page
  const blockSize = 3;
  const startBlock = Math.floor((this.currentPageRevenent - 1) / blockSize) * blockSize + 1;
  const endBlock = Math.min(startBlock + blockSize - 1, this.totalPagesRevenet);

  this.pageNumbersRevenent = [];
  for (let i = startBlock; i <= endBlock; i++) {
    this.pageNumbersRevenent.push(i);
  }
}

prevPageRevenent(): void {
  if (this.currentPageRevenent > 1) {
    this.currentPageRevenent--;
    this.updatePaginationRevenent();
  }
}

nextPageRevenent(): void {
  if (this.currentPageRevenent < this.totalPagesRevenet) {
    this.currentPageRevenent++;
    this.updatePaginationRevenent();
  }
}

goToPageRevenent(pageNumber: number): void {
  if (pageNumber > 0 && pageNumber <= this.totalPagesRevenet) {
    this.currentPageRevenent = pageNumber;
    this.updatePaginationRevenent();
  }
}





/***************************************************** */


  convertTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const remainingSeconds = seconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const finalSeconds = remainingSeconds % 60;
    const timeParts = [];
    if (hours > 0) timeParts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
    if (minutes > 0) timeParts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
    if (finalSeconds > 0) timeParts.push(`${finalSeconds} second${finalSeconds > 1 ? 's' : ''}`);
    return timeParts.join(' and ') || '0 seconds';
  }

  // Fetch general data
  fetchData(): void {
    const apiUrl = `${this.serverUrl}:${this.port}/hotel/getcountvip`;
    this.http.get<{ [key: string]: number }>(apiUrl).subscribe((response: { [x: string]: any; }) => {
      const rows = Object.keys(response).map(title => ({ title, number: response[title] }));
      this.data.rows = rows;
      this.isDataLoaded = true;
      this.fetchDetailData();
      this.fetchClients();
    });
  }

  // Fetch status color based on the client status
  getStatusColor(etat: string): string {
    switch (etat.trim()) {
      case 'Check In':
        return 'green';
      case 'Reservation':
        return 'blue';
      case 'Check Out':
        return 'red';
      default:
        return 'gray';
    }
  }

  // Fetch text color based on the client status
  getTextColor(etat: string): string {
    return (etat.trim() === 'Check In' || etat.trim() === 'Reservation' || etat.trim() === 'Check Out') ? 'white' : 'black';
  }

  // Fetch client data
  private fetchClients(): void {
    const clientApiUrl = `${this.serverUrl}:${this.port}/hotel/getMovementCl`;
    this.http.get<Client[]>(clientApiUrl).subscribe((clients: any[]) => {
      this.data1 = clients.map(client => ({
        ...client,
        timeDiff: this.calculateTimeDifference(client.heure)
      }));
      this.updatePaginationMouvement();
    });
  }

  // Fetch additional data for VIP, Offers, Anniversaries, Revenants
  private fetchDetailData(): void {
    const endpoints = [
      `${this.serverUrl}:${this.port}/hotel/getVIP`,
      `${this.serverUrl}:${this.port}/hotel/getlisteoffre`,
      `${this.serverUrl}:${this.port}/hotel/getlisteanni`,
      `${this.serverUrl}:${this.port}/hotel/getlistrevent`
    ];

    endpoints.forEach((url, index) => {
      this.fetchDataFromUrl(url, index);
    });
  }

  // Fetch data from a given URL and assign to the respective category
  private fetchDataFromUrl(url: string, index: number): void {
    this.http.get<any[]>(url).subscribe((response: any[]) => {
      if (Array.isArray(response) && response.length > 0) {
        if (index === 0) { 
          this.vipData = response;
          this.updatePaginationVIP();
        }
        else if (index === 1) {
          this.offersData = response;
          this.updatePaginationOffre();
        } 
        else if (index === 2) {
          this.anniversariesData = response;
          this.updatePaginationAnnif();
        }
        else if (index === 3) {
          this.revenantData = response;
          this.updatePaginationRevenent();
        }
      }
    });
  }
}
