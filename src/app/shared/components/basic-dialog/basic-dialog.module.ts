import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { BasicDialogComponent } from './basic-dialog.component';
import { MatButtonModule } from '@angular/material/button';
@NgModule({
  declarations: [BasicDialogComponent],
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  exports: [BasicDialogComponent],
  providers: []
})
export class BasicDialogModule {}
