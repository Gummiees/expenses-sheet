import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Category } from '@shared/models/category.model';
import { BasicDialogModel } from '@shared/models/dialog.model';
import { Type } from '@shared/models/type.model';
import { CategoryService } from '@shared/services/category.service';
import { DialogService } from '@shared/services/dialog.service';
import { MessageService } from '@shared/services/message.service';
import { combineLatest, filter, firstValueFrom, Subscription } from 'rxjs';
import { CategoryComponentService } from '../category.component.service';
import { CategoryTable } from './category-table.model';

@Component({
  selector: 'app-category-table',
  templateUrl: './category-table.component.html'
})
export class CategoryTableComponent implements AfterViewInit, OnDestroy {
  public displayedColumns: string[] = ['name', 'type', 'action'];
  public categories: Category[] = [];
  public dataSource: MatTableDataSource<CategoryTable>;
  @Output() public edit: EventEmitter<Category> = new EventEmitter();

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  private subscriptions: Subscription[] = [];
  constructor(
    public categoryComponentService: CategoryComponentService,
    private categoryService: CategoryService,
    private dialogService: DialogService,
    private messageService: MessageService
  ) {
    this.dataSource = new MatTableDataSource();
    this.subscribeToCategories();
    // Assign the data to the data source for the table to render
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort!;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  public onEdit(categoryTable: CategoryTable) {
    const category = this.categories.find((category) => category.id! === categoryTable.id)!;
    this.edit.emit(category);
  }

  public async onDelete(categoryTable: CategoryTable) {
    const category = this.categories.find((category) => category.id! === categoryTable.id)!;

    const dialog: BasicDialogModel = {
      body: `Are you sure you want to delete the "${category.name}" category?`
    };
    const deleteConfirmation = await firstValueFrom(this.dialogService.openDialog(dialog));
    if (deleteConfirmation) {
      await this.categoryService.deleteItem(category);
      this.messageService.showOk('Category deleted successfully');
    }
  }

  private subscribeToCategories() {
    const sub = combineLatest([
      this.categoryComponentService.categories$,
      this.categoryComponentService.types$
    ])
      .pipe(filter(([categories, types]) => !!categories && !!types))
      .subscribe(([categories, types]) => {
        this.categories = [...categories];
        this.dataSource.data = categories.map((category) =>
          this.mapCategoryToTable(category, types)
        );
      });
    this.subscriptions.push(sub);
  }

  private mapCategoryToTable(category: Category, types: Type[]): CategoryTable {
    return {
      id: category.id!,
      name: category.name,
      type: types.find((type) => type?.id == category.typeId)?.name ?? ''
    };
  }
}
