import { Injectable } from '@angular/core';

import { Observable, concat, throwError } from 'rxjs';

@Injectable()
export class CustomHttpHandlersService {

	public extractObject(res: object): any {
		return res || {};
	}

	public extractArray(res: any[]): any {
		return res || [];
	}

	public handleError(error: any): Observable<any> {
		console.log('error', error);
		const errMsg = (error.message) ? error.message :
			error.status ? `${error.status} - ${error.statusText}` : 'Server error';
		console.log('errMsg', errMsg);
		return concat(throwError(errMsg));
	}
}
