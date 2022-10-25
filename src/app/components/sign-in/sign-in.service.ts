import { Injectable } from '@angular/core';
import { MeService } from '@shared/services/me.service';
import { UserService } from '@shared/services/user.service';
import firebase from 'firebase/compat/app';

export type SignIn = 'google' | 'github' | 'twitter';

@Injectable()
export class SignInService {
  constructor(private userService: UserService, private meService: MeService) {}

  async signIn(signInWith: SignIn) {
    switch (signInWith) {
      case 'google':
        await this.userService.googleSignIn();
        break;
      case 'github':
        await this.userService.githubSignIn();
        break;
      case 'twitter':
        await this.userService.twitterSignIn();
        break;
    }

    const userAuth: firebase.User | null = await this.userService.user;
    if (userAuth) {
      const userExists: boolean = await this.meService.userExists(userAuth);
      if (userExists) {
        this.meService.login(userAuth);
      } else {
        this.meService.createUser(userAuth);
      }
    }
  }
}
