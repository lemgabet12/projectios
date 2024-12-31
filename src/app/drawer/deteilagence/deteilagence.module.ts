import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeteilagencePageRoutingModule } from './deteilagence-routing.module';

import { DeteilagencePage } from './deteilagence.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeteilagencePageRoutingModule
  ],
  declarations: [DeteilagencePage]
})
export class DeteilagencePageModule {}
