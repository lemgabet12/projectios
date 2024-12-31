import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListesPageRoutingModule } from './listes-routing.module';

import { ListesPage } from './listes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListesPageRoutingModule
  ],
  declarations: [ListesPage]
})
export class ListesPageModule {}
