import { Injectable } from '@angular/core';
import { Tag } from '@shared/models/tag.model';
import { Type } from '@shared/models/type.model';
import { TagService } from '@shared/services/tag.service';
import { TypeService } from '@shared/services/type.service';
import { UserService } from '@shared/services/user.service';
import firebase from 'firebase/compat/app';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class TagComponentService {
  public updateInterval: number = 60000;
  private types: Type[] = [];
  public types$: BehaviorSubject<Type[]> = new BehaviorSubject<Type[]>(this.types || []);
  private tags: Tag[] = [];
  public tags$: BehaviorSubject<Tag[]> = new BehaviorSubject<Tag[]>(this.tags || []);
  constructor(
    private userService: UserService,
    private tagService: TagService,
    private typeService: TypeService
  ) {
    this.subscribeToTypes();
    this.subscribeToTags();
  }

  private subscribeToTypes() {
    this.typeService.listItems().subscribe((types) => {
      this.types = [...types];
      this.types$.next(this.types);
    });
  }

  private async subscribeToTags() {
    const user: firebase.User | null = await this.userService.user;
    if (user) {
      this.tagService.listItems(user).subscribe((tags: Tag[]) => {
        this.tags = [...tags];
        this.tags$.next(this.tags);
      });
    } else {
      throw new Error('You must be logged in to view tags');
    }
  }
}
