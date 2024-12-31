import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArrivalsDeparturesPageRoutingModule } from './arrivals-departures-routing.module';

import { ArrivalsDeparturesPage } from './arrivals-departures.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArrivalsDeparturesPageRoutingModule
  ],
  declarations: [ArrivalsDeparturesPage]
})
export class ArrivalsDeparturesPageModule {}
