import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { UserSettingsService } from './user-settings.service';
import { UserComponent } from './user.component';
import { UserRoutingModule } from './user.routes';

@NgModule({
  declarations: [UserComponent],
  imports: [
    RouterModule,
    SharedModule,
    UserRoutingModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatDividerModule
  ],
  providers: [UserSettingsService]
})
export class UserModule {}
