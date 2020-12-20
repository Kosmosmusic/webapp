import { Pipe, PipeTransform } from '@angular/core';

import { AppTranslateService } from './translate.service';

@Pipe({
  name: 'translate',
  pure: false, // false updates values on language change
})
export class AppTranslatePipe implements PipeTransform {
  constructor(private readonly translate: AppTranslateService) {}

  public transform(value: string) {
    if (!value) {
      return 'no_value';
    }
    return this.translate.instant(value);
  }
}
