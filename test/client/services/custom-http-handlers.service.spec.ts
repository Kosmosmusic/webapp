import { TestBed } from '@angular/core/testing';
import { Response, ResponseOptions, Headers } from '@angular/http';

import { Observable } from 'rxjs';

import { CustomHttpHandlersService } from '../../../public/app/services/custom-http-handlers.service';

describe('CustomHttpHandlersService', () => {

	beforeEach((done: DoneFn) => {
		TestBed.configureTestingModule({
			declarations: [],
			imports: [],
			providers: [ CustomHttpHandlersService ],
			schemas: []
		}).compileComponents().then(() => {
			this.service = TestBed.get(CustomHttpHandlersService) as CustomHttpHandlersService;
			done();
		});
	});

	it('should be defined', () => {
		expect(this.service).toBeDefined();
	});

	it('should have variables and methods defined', () => {
		expect(this.service.extractObject).toEqual(jasmine.any(Function));
		expect(this.service.extractArray).toEqual(jasmine.any(Function));
		expect(this.service.handleError).toEqual(jasmine.any(Function));
	});

	it('extractObject should return an Object', () => {
		expect(this.service.extractObject({})).toEqual(jasmine.any(Object));
	});

	it('extractObject should return an empty Object if not data is present', () => {
		expect(this.service.extractObject(null)).toEqual(jasmine.any(Object));
	});

	it('extractArray should return an Array', () => {
		expect(this.service.extractArray([ {x: 'x'}, {y: 'y'} ])).toEqual(jasmine.any(Array));
	});

	it('extractArray should return an empty Array if no data is present', () => {
		expect(this.service.extractArray(null)).toEqual(jasmine.any(Array));
	});

	it('handleError should return an Observable', () => {
		expect(this.service.handleError({ errors: [{ detail: 'error' }]})).toEqual(jasmine.any(Observable));
	});

	it('handleError should handle errors properly', async () => {
		await this.service.handleError({ status: 'errorType', message: 'error message' }).subscribe(
			() => true,
			(error: string) => expect(error).toEqual('error message')
		);
		await this.service.handleError({ _body: JSON.stringify({}), status: '400', statusText: 'error status text' }).subscribe(
			() => true,
			(error: string) => expect(error).toEqual('400 - error status text')
		);
		await this.service.handleError({ status: '400', statusText: 'error status text' }).subscribe(
			() => true,
			(error: string) => expect(error).toEqual('400 - error status text')
		);
		await this.service.handleError({}).subscribe(
			() => true,
			(error: string) => expect(error).toEqual('Server error')
		);
	});

});