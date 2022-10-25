import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { LoadersService } from '@shared/services/loaders.service';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  loggedIn: boolean = false;
  constructor(
    public loadersService: LoadersService,
    private primengConfig: PrimeNGConfig,
    private readonly auth: AngularFireAuth
  ) {
    this.auth.authState.subscribe((user) => (this.loggedIn = !!user));
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
  }
}
