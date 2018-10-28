import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from './translate.service';

@Pipe({
	name: 'translate',
	pure: false // false updates values on language change
})
export class TranslatePipe implements PipeTransform {

	constructor(private _translate: TranslateService) {}

	public transform(value: string, args: any[]): any {
		if (!value) { return; }
		return this._translate.instant(value);
	}

}
