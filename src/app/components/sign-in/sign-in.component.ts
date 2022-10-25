import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadersService } from '@shared/services/loaders.service';
import { MessageService } from '@shared/services/message.service';
import { SignIn, SignInService } from './sign-in.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html'
})
export class SignInComponent {
  public hide: boolean = true;
  constructor(
    public loadersService: LoadersService,
    private signInService: SignInService,
    private messageService: MessageService,
    private router: Router
  ) {}

  async onGoogleSignIn() {
    this.onSignIn('google');
  }

  async onGitHubSignIn() {
    this.onSignIn('github');
  }
  async onTwitterSignIn() {
    this.onSignIn('twitter');
  }

  private async onSignIn(signInWith: SignIn) {
    this.loadersService.signInLoading = true;
    try {
      await this.signInService.signIn(signInWith);
      this.messageService.showOk('Welcome back!');
      this.router.navigate(['/']);
    } catch (e: any) {
      console.error(e);
      this.messageService.showError(e);
    }
    this.loadersService.signInLoading = false;
  }
}
