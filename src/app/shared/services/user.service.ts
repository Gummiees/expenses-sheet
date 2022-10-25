import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public get user(): Promise<firebase.User | null> {
    if (this._user) {
      return Promise.resolve(this._user);
    }
    return this.auth.currentUser;
  }
  private _user: firebase.User | null = null;
  public $user: BehaviorSubject<firebase.User | null> = new BehaviorSubject(this._user);

  constructor(private readonly auth: AngularFireAuth, private router: Router) {
    this.setUserInfo();
  }

  public async logout() {
    await this.auth.signOut();
    this.router.navigate(['/sign-in']);
  }

  public async googleSignUp() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.auth.signInWithPopup(provider);
    this._user = credential.user;
    this.$user.next(this._user);
  }

  public async googleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.auth.signInWithPopup(provider);
    this._user = credential.user;
    this.$user.next(this._user);
  }

  public async githubSignIn() {
    const provider = new firebase.auth.GithubAuthProvider();
    const credential = await this.auth.signInWithPopup(provider);
    this._user = credential.user;
    this.$user.next(this._user);
  }

  public async twitterSignIn() {
    const provider = new firebase.auth.TwitterAuthProvider();
    const credential = await this.auth.signInWithPopup(provider);
    this._user = credential.user;
    this.$user.next(this._user);
  }

  public async deleteUser() {
    if (this._user == null) {
      this._user = await this.auth.currentUser;
      this.$user.next(this._user);
    }
    await this._user?.delete();
    this.router.navigate(['/sign-in']);
  }

  public async updateUsername(username: string | null) {
    if (this._user == null) {
      this._user = await this.auth.currentUser;
    }
    await this._user?.updateProfile({ displayName: username });
    this.$user.next(this._user);
  }

  public async getUserInfo(): Promise<firebase.User | null> {
    await this.setUserInfo();
    return this._user;
  }

  public async setUserInfo() {
    if (!this._user) {
      this._user = await this.auth.currentUser;
      this.$user.next(this._user);
    }
  }
}
