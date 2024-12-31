import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeteilagencePage } from './deteilagence.page';

const routes: Routes = [
  {
    path: '',
    component: DeteilagencePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeteilagencePageRoutingModule {}
