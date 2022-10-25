import { BaseUser } from './base.model';

export interface TimeSheet extends BaseUser {
  date: Date;
  typeId?: string;
}

export interface TimeSheetTable extends TimeSheet {
  onlyDate: string;
}
