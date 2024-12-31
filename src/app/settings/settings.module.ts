
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular'; // Import IonicModule

import { SettingsComponent } from './settings.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule.forRoot(), // Ensure IonicModule is imported
    RouterModule.forChild([
      {
        path: '',
        component: SettingsComponent
      }
    ])
  ]
})
export class SettingsModule {}