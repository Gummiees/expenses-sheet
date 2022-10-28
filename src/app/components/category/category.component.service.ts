import { Injectable } from '@angular/core';
import { Category } from '@shared/models/category.model';
import { Type } from '@shared/models/type.model';
import { CategoryService } from '@shared/services/category.service';
import { TypeService } from '@shared/services/type.service';
import { UserService } from '@shared/services/user.service';
import firebase from 'firebase/compat/app';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class CategoryComponentService {
  public updateInterval: number = 60000;
  private types: Type[] = [];
  public types$: BehaviorSubject<Type[]> = new BehaviorSubject<Type[]>(this.types || []);
  private categories: Category[] = [];
  public categories$: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>(
    this.categories || []
  );
  constructor(
    private userService: UserService,
    private categoryService: CategoryService,
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
      this.categoryService.listItems(user).subscribe((categories: Category[]) => {
        this.categories = [...categories];
        this.categories$.next(this.categories);
      });
    } else {
      throw new Error('You must be logged in to view categories');
    }
  }
}
