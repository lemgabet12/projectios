import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chiffre',
  templateUrl: './chiffre.page.html',
  styleUrls: ['./chiffre.page.scss'],
})
export class ChiffrePage implements OnInit {
  isGridView: boolean = true;  // Default to grid view

  currentDate: Date = new Date();
  
  cards = [
    {
      title: 'Revenu Hebergement',
      value: '16,835',
      currency: 'TND',
      monthlyTitle: 'Revenu Hebergement Mois',
      monthlyValue: '78,038',
      icon: 'bed',
      color: 'lazur-bg'
    },
    {
      title: 'Revenu Restauration',
      value: '5,042',
      currency: 'TND',
      monthlyTitle: 'Revenu Restauration Mois',
      monthlyValue: '28,125',
      icon: 'restaurant',
      color: 'navy-bg'
    },
    {
      title: 'Revenu Téléphone',
      value: '0',
      currency: 'TND',
      monthlyTitle: 'Revenu Téléphone Mois',
      monthlyValue: '9',
      icon: 'call',
      color: 'yellow-bg'
    },
    {
      title: 'Revenus Divers',
      value: '259',
      currency: 'TND',
      monthlyTitle: 'Revenus Divers Mois',
      monthlyValue: '1,576',
      icon: 'bulb',
      color: 'navy-bg'
    },
    {
      title: 'Revenu Bar',
      value: '2,036',
      currency: 'TND',
      monthlyTitle: 'Revenu Bar Mois',
      monthlyValue: '6,675',
      icon: 'cafe',
      color: 'navy-bg'
    },
    {
      title: 'Revenu Moyen par Chambre',
      value: '196',
      currency: 'TND',
      icon: 'trending-up',
      color: 'lazur-bg'
    },
    {
      title: 'REVPAR cumul',
      value: '78',
      currency: 'TND',
      icon: 'pie-chart',
      color: 'lazur-bg'
    },
    {
      title: 'REVPAR',
      value: '79',
      currency: 'TND',
      icon: 'trophy',
      color: 'red-bg'
    }
  ];

  constructor() {}

  ngOnInit(): void {}

  toggleView(view: string): void {
    this.isGridView = view === 'grid';
  }
}
