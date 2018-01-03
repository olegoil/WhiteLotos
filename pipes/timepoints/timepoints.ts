import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timepoints',
})
export class TimepointsPipe implements PipeTransform {

  transform(value: string, ...args) {
    return value.toString().slice(0, 2)+':'+value.toString().slice(2,4);
  }
}
