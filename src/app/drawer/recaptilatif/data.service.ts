import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  getDataFromUrl(url: string) {
    throw new Error('Method not implemented.');
  }

  getRowData1(row: any): any[] {
    return [
      [row[0], 'Product 1', 10, 20, 200],
      [row[0], 'Product 2', 15, 25, 375],
      [row[0], 'Product 3', 20, 30, 600],
      [row[0], 'Product 4', 25, 35, 875]
    ];
  }

  getRowData2(row: any): any[] {
    return [
      [row[0], 'Product 5', 11, 21, 210],
      [row[0], 'Product 6', 16, 26, 390],
      [row[0], 'Product 7', 21, 31, 630],
      [row[0], 'Product 8', 26, 36, 900]
    ];
  }

  getRowData3(row: any): any[] {
    return [
      [row[0], 'Product 9', 12, 22, 240],
      [row[0], 'Product 10', 17, 27, 405],
      [row[0], 'Product 11', 22, 32, 660],
      [row[0], 'Product 12', 27, 37, 925]
    ];
  }

  getRowData4(row: any): any[] {
    return [
      [row[0], 'Product 13', 13, 23, 260],
      [row[0], 'Product 14', 18, 28, 420],
      [row[0], 'Product 15', 23, 33, 690],
      [row[0], 'Product 16', 28, 38, 950]
    ];
  }
}


