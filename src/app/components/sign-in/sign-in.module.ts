import { NgModule } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '@shared/shared.module';
import { SignInRoutingModule } from './sign-in.routes';
import { SignInComponent } from './sign-in.component';
import { SignInService } from './sign-in.service';

@NgModule({
  declarations: [SignInComponent],
  imports: [
    SharedModule,
    SignInRoutingModule,
    AngularFireAuthModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule
  ],
  exports: [],
  providers: [SignInService]
})
export class SignInModule {}
