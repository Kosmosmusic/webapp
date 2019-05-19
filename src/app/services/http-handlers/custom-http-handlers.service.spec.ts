import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { CustomHttpHandlersService } from './custom-http-handlers.service';

describe('CustomHttpHandlersService', () => {

  let service: CustomHttpHandlersService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [],
      providers: [ CustomHttpHandlersService ],
      schemas: []
    }).compileComponents().then(() => {
      service = TestBed.get(CustomHttpHandlersService) as CustomHttpHandlersService;
    });
  }));

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have variables and methods defined', () => {
    expect(service.extractObject).toEqual(jasmine.any(Function));
    expect(service.extractArray).toEqual(jasmine.any(Function));
    expect(service.handleError).toEqual(jasmine.any(Function));
  });

  it('extractObject should return an Object', () => {
    expect(service.extractObject({})).toEqual(jasmine.any(Object));
  });

  it('extractObject should return an empty Object if not data is present', () => {
    expect(service.extractObject(null)).toEqual(jasmine.any(Object));
  });

  it('extractArray should return an Array', () => {
    expect(service.extractArray([ {x: 'x'}, {y: 'y'} ])).toEqual(jasmine.any(Array));
  });

  it('extractArray should return an empty Array if no data is present', () => {
    expect(service.extractArray(null)).toEqual(jasmine.any(Array));
  });

  it('handleError should return an Observable', () => {
    expect(service.handleError({ errors: [{ detail: 'error' }]})).toEqual(jasmine.any(Observable));
  });

  it('handleError should handle errors properly', async () => {
    await service.handleError({ status: 'errorType', message: 'error message' }).subscribe(
      () => true,
      (error: string) => expect(error).toEqual('error message')
    );
    await service.handleError({ _body: JSON.stringify({}), status: '400', statusText: 'error status text' }).subscribe(
      () => true,
      (error: string) => expect(error).toEqual('400 - error status text')
    );
    await service.handleError({ status: '400', statusText: 'error status text' }).subscribe(
      () => true,
      (error: string) => expect(error).toEqual('400 - error status text')
    );
    await service.handleError({}).subscribe(
      () => true,
      (error: string) => expect(error).toEqual('Server error')
    );
  });

});
