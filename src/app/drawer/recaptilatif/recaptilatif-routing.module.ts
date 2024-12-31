import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecaptilatifPage } from './recaptilatif.page';

const routes: Routes = [
  {
    path: '',
    component: RecaptilatifPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecaptilatifPageRoutingModule {}
