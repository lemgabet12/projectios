import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChiffrePage } from './chiffre.page';

const routes: Routes = [
  {
    path: '',
    component: ChiffrePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChiffrePageRoutingModule {}
