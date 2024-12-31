import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Add declarations if there are components, directives, or pipes to be used in this module.

@NgModule({
  declarations: [], // Add any components, pipes, or directives related to this module
  imports: [
    CommonModule, // Provides common directives like ngIf, ngFor, etc.
    FormsModule // Enables template-driven forms
  ],
  exports: [
    CommonModule, // Export if other modules need these shared imports
    FormsModule // Export to make forms functionality available outside this module
  ]
})
export class ChangehotelModule {}
