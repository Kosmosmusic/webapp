/* global inject, expect */

/*
*	dynamically set backend base url to be able to deploy on any domain
*/
function setBaseUrl(absUrl) {
	return absUrl.match(new RegExp('http(s)?:\/\/[^/]+'))[0];
}

beforeEach(module('kosmosmusicServices', 'ngResource', 'ngRoute'));

describe('Kosmosmusic services', () => {
	let service, q, route, win;

	describe('soundcloudService', () => {
		beforeEach(inject((soundcloudService) => {
			service = soundcloudService;
		}));
		it('must be defined', () => {
			expect(service).toBeDefined();
		});
		it('must have variables and methods definitions', async () => {
			expect(service.init).toEqual(jasmine.any(Function));
		});
		it('must have call SC.initialize method with given options on the init mehod call', async () => {
			spyOn(SC, 'initialize').and.callThrough();
			service.init();
			expect(SC.initialize).toHaveBeenCalledWith({
				client_id: jasmine.any(String),
				redirect_uri: 'http://dnbhub.com/callback.html'
			});
		});
	});

	describe('firebaseService', () => {
		beforeEach(inject(($rootScope, _$q_, _$route_, _$window_, firebaseService) => {
			scope = $rootScope.$new();
			q = _$q_;
			route = _$route_;
			win = _$window_;
			service = firebaseService;
		}));
		it('must be defined', () => {
			expect(service).toBeDefined();
		});
		it('must have variables and methods definitions', async () => {
			expect(service.initFirebase).toEqual(jasmine.any(Function));
			expect(service.hasOwnProperty('db')).toBeTruthy();
			expect(service.db).toBeUndefined();
			expect(service.getDB).toEqual(jasmine.any(Function));
		});
	});
});
