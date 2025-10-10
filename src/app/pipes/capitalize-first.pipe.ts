import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeFirst',
  standalone: true
})
export class CapitalizeFirstPipe implements PipeTransform {

transform(value: string | null | undefined): string {
    if (!value) return '';
    const firstWord = value.split(' ')[0];
    return firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();
  }

}
