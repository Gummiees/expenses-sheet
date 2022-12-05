import { Injectable } from '@angular/core';
import { Category } from '@shared/models/category.model';
import { Tag } from '@shared/models/tag.model';
import { Type } from '@shared/models/type.model';
import { CategoryService } from '@shared/services/category.service';
import { TagService } from '@shared/services/tag.service';
import { TypeService } from '@shared/services/type.service';
import { UserService } from '@shared/services/user.service';
import firebase from 'firebase/compat/app';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class TagComponentService {
  public updateInterval: number = 60000;
  private types: Type[] = [];
  public types$: BehaviorSubject<Type[]> = new BehaviorSubject<Type[]>(this.types || []);
  private tags: Tag[] = [];
  public tags$: BehaviorSubject<Tag[]> = new BehaviorSubject<Tag[]>(this.tags || []);
  private noUserTags: Tag[] = [];
  public noUserTags$: BehaviorSubject<Tag[]> = new BehaviorSubject<Tag[]>(this.noUserTags || []);
  private categories: Category[] = [];
  public categories$: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>(
    this.categories || []
  );
  constructor(
    private userService: UserService,
    private tagService: TagService,
    private categoryService: CategoryService,
    private typeService: TypeService
  ) {
    this.subscribeToTypes();
    this.subscribeToTags();
    this.subscribeToNoUserTags();
    this.subscribeToCategories();
  }

  public async getCategories(tagId?: string): Promise<Observable<Category[]>> {
    const user: firebase.User | null = await this.userService.user;
    if (user) {
      if (tagId) {
        return this.categoryService.listItemsByTagId(user, tagId);
      }
      return this.categoryService.listItems(user);
    } else {
      throw new Error('You must be logged in to view categories');
    }
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

  private async subscribeToNoUserTags() {
    const user: firebase.User | null = await this.userService.user;
    if (user) {
      this.tagService.listNoUserItems().subscribe((noUserTags: Tag[]) => {
        this.noUserTags = [...noUserTags];
        this.noUserTags$.next(this.noUserTags);
      });
    } else {
      throw new Error('You must be logged in to view tags');
    }
  }

  private async subscribeToCategories() {
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

  public removeUnselectedCategoriesByTagId(tagId: string, selectedCategories: Category[]) {
    const originalCategories = this.categories.filter((category) =>
      category.tagIds.some((_tagId) => _tagId === tagId)
    );

    if (originalCategories.length === 0) {
      return;
    }

    const removedCategories = originalCategories.filter((originalCategory) => {
      return !selectedCategories.some(
        (selectedCategory) => originalCategory.id! === selectedCategory.id!
      );
    });

    removedCategories.forEach((category) => {
      const updatedTagIdsList = category.tagIds.filter((_tagId) => tagId !== _tagId);
      const updatedCategory: Category = {
        ...category,
        tagIds: updatedTagIdsList
      };
      this.categoryService.updateItem(updatedCategory);
    });
  }
}
