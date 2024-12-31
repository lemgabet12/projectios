import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecaptilatifPageRoutingModule } from './recaptilatif-routing.module';

import { RecaptilatifPage } from './recaptilatif.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecaptilatifPageRoutingModule
  ],
  declarations: [RecaptilatifPage]
})
export class RecaptilatifPageModule {}
