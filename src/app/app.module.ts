import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage-angular';
import { RecaptilatifePipe } from './recaptilatife.pipe';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { FormsModule } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ChangehotelComponent } from './changehotel/changehotel.component';

@NgModule({
  declarations: [
    AppComponent, // Main application component
    RecaptilatifePipe, // Custom pipe
    ResetPasswordComponent, // Reset password page/component
    ChangehotelComponent
  ],
  imports: [
    BrowserModule, // Required for browser apps
    IonicModule.forRoot({ backButtonText: 'Retour',
      mode: 'ios',
      scrollPadding: false,
      scrollAssist: true}), // Initialize Ionic framework
    IonicStorageModule.forRoot(), // Initialize Ionic Storage
    AppRoutingModule, // Application routing
    HttpClientModule, // HTTP client for API calls
    FormsModule // Forms module for template-driven forms
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, // Reuse route strategy for Ionic
    Geolocation // Register Geolocation plugin
  ],
  bootstrap: [AppComponent], // Bootstrap main app component
})
export class AppModule {}
