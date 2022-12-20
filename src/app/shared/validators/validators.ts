import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function isNotInList(list: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const val = control.value?.toLowerCase().trim();
    const exists = list.some((item) => item.toLowerCase().trim() === val);
    return exists ? { isInList: { value: val } } : null;
  };
}

export function minLengthArray(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value.length >= min) return null;

    return { minLengthArray: true };
  };
}
