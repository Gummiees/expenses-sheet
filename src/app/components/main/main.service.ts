import { Injectable } from '@angular/core';
import { Entry } from '@shared/models/entry.model';
import { Type } from '@shared/models/type.model';
import { EntryService } from '@shared/services/entry.service';
import { TypeService } from '@shared/services/type.service';
import { UserService } from '@shared/services/user.service';
import firebase from 'firebase/compat/app';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class MainService {
  private types: Type[] = [];
  public types$: BehaviorSubject<Type[]> = new BehaviorSubject<Type[]>(this.types || []);
  private entries: Entry[] = [];
  public entries$: BehaviorSubject<Entry[]> = new BehaviorSubject<Entry[]>(this.entries || []);
  constructor(
    private userService: UserService,
    private entryService: EntryService,
    private typeService: TypeService
  ) {
    this.subscribeToTypes();
    this.subscribeToEntries();
  }

  private subscribeToTypes() {
    this.typeService.listItems().subscribe((types) => {
      this.types = [...types];
      this.types$.next(this.types);
    });
  }

  private async subscribeToEntries() {
    const user: firebase.User | null = await this.userService.user;
    if (user) {
      this.entryService.listItems(user).subscribe((entries: Entry[]) => {
        this.entries = [...entries];
        this.entries$.next(this.entries);
      });
    } else {
      throw new Error('You must be logged in to view entries');
    }
  }
}
