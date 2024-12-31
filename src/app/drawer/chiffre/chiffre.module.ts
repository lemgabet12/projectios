import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChiffrePageRoutingModule } from './chiffre-routing.module';

import { ChiffrePage } from './chiffre.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChiffrePageRoutingModule
  ],
  declarations: [ChiffrePage]
})
export class ChiffrePageModule {}
