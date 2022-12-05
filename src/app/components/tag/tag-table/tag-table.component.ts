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
import { BasicDialogModel } from '@shared/models/dialog.model';
import { Tag } from '@shared/models/tag.model';
import { Type } from '@shared/models/type.model';
import { DialogService } from '@shared/services/dialog.service';
import { MessageService } from '@shared/services/message.service';
import { TagService } from '@shared/services/tag.service';
import { combineLatest, filter, firstValueFrom, Subscription } from 'rxjs';
import { TagComponentService } from '../tag.component.service';
import { TagTable } from './tag-table.model';

@Component({
  selector: 'app-tag-table',
  templateUrl: './tag-table.component.html'
})
export class TagTableComponent implements AfterViewInit, OnDestroy {
  public displayedColumns: string[] = ['name', 'type', 'action'];
  public tags: Tag[] = [];
  public dataSource: MatTableDataSource<TagTable>;
  @Output() public edit: EventEmitter<Tag> = new EventEmitter();

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  private subscriptions: Subscription[] = [];
  constructor(
    public tagComponentService: TagComponentService,
    private tagService: TagService,
    private dialogService: DialogService,
    private messageService: MessageService
  ) {
    this.dataSource = new MatTableDataSource();
    this.subscribeToTags();
    // Assign the data to the data source for the table to render
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort!;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  public onEdit(tagTable: TagTable) {
    const tag = this.tags.find((tag) => tag.id! === tagTable.id)!;
    this.edit.emit(tag);
  }

  public async onDelete(tagTable: TagTable) {
    const tag = this.tags.find((tags) => tags.id! === tagTable.id)!;

    const dialog: BasicDialogModel = {
      body: `Are you sure you want to delete the "${tag.name}" tag?`
    };
    const deleteConfirmation = await firstValueFrom(this.dialogService.openDialog(dialog));
    if (deleteConfirmation) {
      await this.tagService.deleteItem(tag);
      this.tagComponentService.removeUnselectedCategoriesByTagId(tag.id!, []);
      this.messageService.showOk('Tag deleted successfully');
    }
  }

  private subscribeToTags() {
    const sub = combineLatest([this.tagComponentService.tags$, this.tagComponentService.types$])
      .pipe(filter(([tags, types]) => !!tags && !!types))
      .subscribe(([tags, types]) => {
        this.tags = [...tags];
        this.dataSource.data = tags.map((tag) => this.mapTagToTable(tag, types));
      });
    this.subscriptions.push(sub);
  }

  private mapTagToTable(tag: Tag, types: Type[]): TagTable {
    return {
      id: tag.id!,
      name: tag.name,
      type: types.find((type) => type?.id == tag.typeId)?.name ?? ''
    };
  }
}
