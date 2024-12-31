import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'recaptilatife'
})
export class RecaptilatifePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
