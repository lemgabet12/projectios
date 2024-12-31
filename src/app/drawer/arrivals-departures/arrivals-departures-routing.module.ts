import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArrivalsDeparturesPage } from './arrivals-departures.page';

const routes: Routes = [
  {
    path: '',
    component: ArrivalsDeparturesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArrivalsDeparturesPageRoutingModule {}
