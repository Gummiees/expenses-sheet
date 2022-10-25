import { Injectable } from '@angular/core';
import { User } from '@shared/models/user.model';
import { MeService } from '@shared/services/me.service';
import { UserService } from '@shared/services/user.service';

@Injectable()
export class UserSettingsService {
  constructor(private userService: UserService, private meService: MeService) {}

  async updateProfile(username: string | null, email: string | null) {
    await this.updateUsername(username);
    await this.updateEmail(email);
  }

  private async updateUsername(username: string | null) {
    const user: User | null = this.meService.user;
    if (!user) {
      throw new Error('You must be signed in');
    }
    if (username !== user.username) {
      user.username = username;
      await this.userService.updateUsername(username);
      await this.meService.updateUser(user);
    }
  }

  private async updateEmail(email: string | null) {
    const user: User | null = this.meService.user;
    if (!user) {
      throw new Error('You must be signed in');
    }
    if (email !== user.email) {
      user.email = email;
      await this.meService.updateUser(user);
    }
  }

  async deleteUser() {
    await this.meService.deleteUser();
    await this.userService.deleteUser();
  }

  async logout() {
    this.meService.logout();
    this.userService.logout();
  }
}
