import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BasicDialogModel } from '@shared/models/dialog.model';
import { User } from '@shared/models/user.model';
import { DialogService } from '@shared/services/dialog.service';
import { LoadersService } from '@shared/services/loaders.service';
import { MeService } from '@shared/services/me.service';
import { MessageService } from '@shared/services/message.service';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserSettingsService } from './user-settings.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html'
})
export class UserComponent implements OnDestroy {
  public hide: boolean = true;
  public name?: string | null;
  public email?: string | null;

  form: FormGroup = new FormGroup({});
  usernameControl: FormControl = new FormControl(null, [Validators.required]);
  emailControl: FormControl = new FormControl(null, [Validators.required, Validators.email]);

  private subscriptions: Subscription[] = [];

  constructor(
    public loadersService: LoadersService,
    private dialogService: DialogService,
    private userSettingsService: UserSettingsService,
    private meService: MeService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.setForms();
    this.subscribeToUser();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  onLogout() {
    const dialogModel: BasicDialogModel = {
      header: 'Logout',
      body: 'Are you sure you want to logout?'
    };
    this.dialogService
      .openDialog(dialogModel)
      .pipe(first())
      .subscribe(() => this.logout());
  }

  onDelete() {
    const dialogModel: BasicDialogModel = {
      header: 'Delete account',
      body: 'Are you sure you want to delete your account? Everything related to your account will be erased forever!'
    };
    this.dialogService
      .openDialog(dialogModel)
      .pipe(first())
      .subscribe(() => this.delete());
  }

  async onSubmit() {
    if (this.form.valid) {
      this.loadersService.userInfoLoading = true;
      try {
        await this.updateProfile();
        this.messageService.showOk('Profile updated successfully');
      } catch (e: any) {
        console.error(e);
        this.messageService.showError(e);
      }
      this.loadersService.userInfoLoading = false;
    }
  }

  private async logout() {
    this.loadersService.userInfoLoading = true;
    try {
      await this.userSettingsService.logout();
      this.messageService.showOk('Logged out successfully');
      this.router.navigate(['/']);
    } catch (e: any) {
      console.error(e);
      this.messageService.showError(e);
    }
    this.loadersService.userInfoLoading = false;
  }

  private async delete() {
    this.loadersService.userInfoLoading = true;
    try {
      await this.userSettingsService.deleteUser();
      this.messageService.showOk('User deleted successfully');
      this.router.navigate(['/']);
    } catch (e: any) {
      console.error(e);
      this.messageService.showError(e);
    }
    this.loadersService.userInfoLoading = false;
  }

  private async updateProfile() {
    const username = this.usernameControl.value;
    const email = this.emailControl.value;
    await this.userSettingsService.updateProfile(username, email);
  }

  private setUserInfo(user: User | null) {
    this.setUsername(user?.username || null);
    this.setEmail(user?.email || null);
  }

  private setUsername(username: string | null) {
    this.name = username;
    this.usernameControl.setValue(this.name);
  }

  private setEmail(email: string | null) {
    this.email = email;
    this.emailControl.setValue(this.email);
  }

  private async subscribeToUser() {
    const sub: Subscription = this.meService.$user.subscribe((user: User | null) =>
      this.setUserInfo(user)
    );
    this.subscriptions.push(sub);

    const user: User | null = await this.meService.getMe();
    this.setUserInfo(user);
  }

  private setForms() {
    this.form = new FormGroup({
      username: this.usernameControl,
      email: this.emailControl
    });
  }
}
