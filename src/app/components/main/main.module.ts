import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from '@shared/shared.module';
import { MainComponent } from './main.component';
import { MainRoutingModule } from './main.routes';

@NgModule({
  declarations: [MainComponent],
  imports: [SharedModule, MainRoutingModule, MatTabsModule, MatIconModule]
})
export class MainModule {}
