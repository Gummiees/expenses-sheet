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
import { Entry } from '@shared/models/entry.model';
import { Tag } from '@shared/models/tag.model';
import { Type } from '@shared/models/type.model';
import { DialogService } from '@shared/services/dialog.service';
import { EntryService } from '@shared/services/entry.service';
import { MessageService } from '@shared/services/message.service';
import { combineLatest, filter, firstValueFrom, Subscription } from 'rxjs';
import { EntryComponentService } from '../entry.component.service';
import { EntryTable } from './entry-table.model';

@Component({
  selector: 'app-entry-table',
  templateUrl: './entry-table.component.html'
})
export class EntryTableComponent implements AfterViewInit, OnDestroy {
  public displayedColumns: string[] = ['description', 'type', 'tags', 'categories', 'action'];
  public entries: Entry[] = [];
  public dataSource: MatTableDataSource<EntryTable>;
  @Output() public edit: EventEmitter<Entry> = new EventEmitter();
  @Output() public delete: EventEmitter<void> = new EventEmitter();

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  private subscriptions: Subscription[] = [];
  constructor(
    public entryComponentService: EntryComponentService,
    private entryService: EntryService,
    private dialogService: DialogService,
    private messageService: MessageService
  ) {
    this.dataSource = new MatTableDataSource();
    this.subscribeToEntries();
    // Assign the data to the data source for the table to render
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort!;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  public onEdit(entryTable: EntryTable) {
    const entry = this.entries.find((entry) => entry.id! === entryTable.id)!;
    this.edit.emit(entry);
  }

  public async onDelete(entryTable: EntryTable) {
    const entry = this.entries.find((entry) => entry.id! === entryTable.id)!;

    const dialog: BasicDialogModel = {
      body: `Are you sure you want to delete the entry?`
    };
    const deleteConfirmation = await firstValueFrom(this.dialogService.openDialog(dialog));
    if (deleteConfirmation) {
      await this.entryService.deleteItem(entry);
      this.messageService.showOk('Entry deleted successfully');
      this.delete.emit();
    }
  }

  private subscribeToEntries() {
    const sub = combineLatest([
      this.entryComponentService.entries$,
      this.entryComponentService.tags$,
      this.entryComponentService.categories$,
      this.entryComponentService.types$
    ])
      .pipe(
        filter(
          ([entries, tags, categories, types]) =>
            !!entries && !!tags && !!categories && !!types && !!types.length
        )
      )
      .subscribe(([entries, tags, categories, types]) => {
        this.entries = [...entries];
        this.dataSource.data = entries.map((entry) =>
          this.mapEntryToTable(entry, types, categories, tags)
        );
      });
    this.subscriptions.push(sub);
  }

  private mapEntryToTable(
    entry: Entry,
    types: Type[],
    categories: Category[],
    tags: Tag[]
  ): EntryTable {
    const entryCategories = categories.filter((category) =>
      entry.categoryIds.some((categoryId) => categoryId === category.id)
    );
    const entryTags = tags.filter((tag) =>
      entry.tagIds.some((entryTagId) => entryTagId === tag.id)
    );
    return {
      id: entry.id!,
      description: entry.description,
      type: types.find((type) => type?.id == entry.typeId)?.name ?? '',
      categories: entryCategories.map((category) => category.name!),
      tags: entryTags.map((tag) => tag.name!)
    };
  }
}
