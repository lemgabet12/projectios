import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeteilrecapPage } from './deteilrecap.page';

const routes: Routes = [
  {
    path: '',
    component: DeteilrecapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeteilrecapPageRoutingModule {}
