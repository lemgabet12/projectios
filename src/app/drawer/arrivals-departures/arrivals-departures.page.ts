import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-arrivals-departures',
  templateUrl: './arrivals-departures.page.html',
  styleUrls: ['./arrivals-departures.page.scss'],
})
export class ArrivalsDeparturesPage implements OnInit {

  arrivals = [
    { name: 'John Doe', date: new Date() },
    { name: 'Jane Smith', date: new Date(new Date().setDate(new Date().getDate() + 1)) },
    { name: 'Carlos Ruiz', date: new Date(new Date().setDate(new Date().getDate() + 2)) }
  ];

  departures = [
    { name: 'Anna Taylor', date: new Date() },
    { name: 'Lucas Nguyen', date: new Date(new Date().setDate(new Date().getDate() + 3)) },
    { name: 'Emily Zhang', date: new Date(new Date().setDate(new Date().getDate() + 4)) }
  ];

  constructor() { }

  ngOnInit() {
  }

}