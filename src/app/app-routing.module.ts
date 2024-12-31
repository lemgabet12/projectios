import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SettingsComponent } from './settings/settings.component';
import { ChangehotelComponent } from './changehotel/changehotel.component';


const routes: Routes = [
  {
    path: 'config',
    loadChildren: () => import('./config/config.module').then( m => m.ConfigPageModule)
  },
  {
    path: '', // Empty path for default route
    redirectTo: 'login', // Redirect to the login page
    pathMatch: 'full'
  },
  {
    path: 'login', // Handle any other routes
    redirectTo: 'login', // Redirect to the login page for unknown routes
    pathMatch: 'full'
  },

  {
    path: '',
    loadChildren: () =>
      import('./drawer/drawer.module').then((m) => m.DrawerPageModule),
  },

  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'listes',
    loadChildren: () => import('./listes/listes.module').then( m => m.ListesPageModule)
  },

  {
    path: 'deteilrecap/:caisseid',
    loadChildren: () => import('./deteilrecap/deteilrecap.module').then( m => m.DeteilrecapPageModule)
  },
  {
    path: 'deteilagence/:NOM_AGENCE',
    loadChildren: () => import('./drawer/deteilagence/deteilagence.module').then( m => m.DeteilagencePageModule)
  },
/*  {
    path: 'reset',
    loadChildren: () => import('./reset/reset.module').then( m => m.ResetPageModule)
  },*/
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'change-hotel', component: ChangehotelComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'modif-pass', component: SettingsComponent },
  {
    path: 'chiffre',
    loadChildren: () => import('./drawer/chiffre/chiffre.module').then( m => m.ChiffrePageModule)
  },
  {
    path: 'arrivals-departures',
    loadChildren: () => import('./drawer/arrivals-departures/arrivals-departures.module').then( m => m.ArrivalsDeparturesPageModule)
  }
  


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
