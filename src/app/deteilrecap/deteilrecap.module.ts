import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeteilrecapPageRoutingModule } from './deteilrecap-routing.module';

import { DeteilrecapPage } from './deteilrecap.page';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgChartsModule,
    DeteilrecapPageRoutingModule
  ],
  declarations: [DeteilrecapPage]
})
export class DeteilrecapPageModule {}
