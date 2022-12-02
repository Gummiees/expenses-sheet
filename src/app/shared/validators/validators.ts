import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function isNotInList(list: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const val = control.value?.toLowerCase().trim();
    const exists = list.some((item) => item.toLowerCase().trim() === val);
    return exists ? { isInList: { value: val } } : null;
  };
}
