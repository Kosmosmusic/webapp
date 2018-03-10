'use strict';

describe('Kosmosmusic controllers', () => {

	/*
	*	Soundcloud mock
	*/
	window.SC = {
		initialize: () => true,
		get: () => true
	};

	beforeEach(module('kosmosmusic'));

	describe('navController', () => {
		let scope, ctrl, doc, el, loc, compReg, sidenav, dialog, firebaseService;

		beforeEach(inject(($rootScope, $controller, _$document_, _$location_, _$mdComponentRegistry_, _$mdSidenav_, _$mdDialog_, _firebaseService_) => {
			scope = $rootScope.$new();
			doc = _$document_;
			el = angular.element('<div></div>');
			loc = _$location_;
			compReg = _$mdComponentRegistry_;
			sidenav = _$mdSidenav_;
			dialog = _$mdDialog_;
			firebaseService = _firebaseService_;
			ctrl = $controller('navController', { $scope: scope, $document: doc, $element: el, $location: loc, $mdComponentRegistry: compReg, $mdSidenav: sidenav, $mdDialog: dialog, firebaseService: firebaseService });
		}));

		it('should be defined', () => {
			expect(ctrl).toBeDefined();
		});

		it('should have variables and methods defined', () => {
			expect(scope.title).toEqual('KOS.MOS.MUSIC');
			expect(scope.button).toEqual(jasmine.objectContaining({
				index: {
					name: 'KOS.MOS.MUSIC',
					title: 'KOS.MOS.MUSIC index',
					icon: 'fa fa-home',
					href: 'index'
				},
				releases: {
					name: 'Releases',
					title: 'Soundcloud powered production showcase',
					icon: 'fa fa-music',
					href: 'releases'
				},
				mastering: {
					name: 'Mastering',
					title: 'Soundcloud powered mastering showcase',
					icon: 'fa fa-file-audio-o',
					href: 'mastering'
				},
				mixes: {
					name: 'Mixes',
					title: 'Mixcloud powered mixes showcase',
					icon: 'fa fa-mixcloud',
					href: 'mixes'
				},
				videos: {
					name: 'Videos',
					title: 'Youtube powered videos showcase',
					icon: 'fa fa-youtube',
					href: 'videos'
				},
				about: {
					name: 'About',
					title: '2018-' + new Date().getFullYear() + '&copy;' + 'All trademarks and copyrights are property of their respective owners',
					icon: 'fa fa-info',
					href: 'about'
				}
			}));
			expect(scope.selectButton).toEqual(jasmine.any(Function));
			expect(scope.disableToggler).toEqual(jasmine.any(Function));
			expect(scope.toggleSidenav).toEqual(jasmine.any(Function));
			expect(scope.isSidenavOpen).toEqual(jasmine.any(Function));
		});
	});

	describe('indexController', () => {
		let scope, ctrl, soundcloudService;

		beforeEach(inject(($rootScope, $controller, _soundcloudService_) => {
			scope = $rootScope.$new();
			soundcloudService = _soundcloudService_;
			ctrl = $controller('indexController', { $scope: scope, soundcloudService: soundcloudService });
		}));

		it('should be defined', () => {
			expect(ctrl).toBeDefined();
		});

		it('should have variables and methods defined', () => {
			expect(scope.tracks).toEqual(jasmine.any(Array));
			expect(scope.tracks.length).toEqual(0);
			expect(scope.getTracks).toEqual(jasmine.any(Function));
		});

	});

	describe('releasesController', () => {
		let scope, ctrl;

		beforeEach(inject(($rootScope, $controller) => {
			scope = $rootScope.$new();
			ctrl = $controller('releasesController', { $scope: scope });
		}));

		it('should be defined', () => {
			expect(ctrl).toBeDefined();
		});

	});

	describe('masteringController', () => {
		let scope, ctrl;

		beforeEach(inject(($rootScope, $controller) => {
			scope = $rootScope.$new();
			ctrl = $controller('masteringController', { $scope: scope });
		}));

		it('should be defined', () => {
			expect(ctrl).toBeDefined();
		});

	});

	describe('mixesController', () => {
		let scope, ctrl;

		beforeEach(inject(($rootScope, $controller) => {
			scope = $rootScope.$new();
			ctrl = $controller('mixesController', { $scope: scope });
		}));

		it('should be defined', () => {
			expect(ctrl).toBeDefined();
		});

	});

	describe('videosController', () => {
		let scope, sce, win, googleService, ctrl;

		beforeEach(inject(($rootScope, $controller, _$sce_, _$window_, _googleService_) => {
			scope = $rootScope.$new();
			sce = _$sce_;
			win = _$window_;
			googleService = _googleService_;
			ctrl = $controller('videosController', { $scope: scope, $sce: sce, window: win, googleService: googleService });
		}));

		it('should be defined', () => {
			expect(ctrl).toBeDefined();
		});

		it('should have variables and methods defined', () => {
			expect(scope.gData).toEqual(jasmine.objectContaining({
				getUserId: jasmine.any(Function),
				setUserId: jasmine.any(Function),
				isLogin: jasmine.any(Function),
				getUser: jasmine.any(Function)
			}));
			expect(scope.hasOwnProperty('channelData')).toBeTruthy();
			expect(scope.hasOwnProperty('uploads')).toBeTruthy();
			expect(scope.hasOwnProperty('playlistSrc')).toBeTruthy();
		});

	});

	describe('contactController', () => {
		let scope, ctrl, location, timeout, regXpatternsService, sendEmailService;

		beforeEach(inject(($rootScope, $controller, _$location_, _$timeout_, _regXpatternsService_, _sendEmailService_) => {
			scope = $rootScope.$new();
			location = _$location_;
			timeout = _$timeout_;
			regXpatternsService = _regXpatternsService_;
			sendEmailService = _sendEmailService_;
			spyOn(sendEmailService,'save').and.callFake(() => []);
			ctrl = $controller('contactController', { $scope: scope, $location: location, $timeout: timeout, regXpatternsService: regXpatternsService, sendEmailService: sendEmailService });
		}));

		it('should be defined', () => {
			expect(ctrl).toBeDefined();
		});

		it('should have variables and methods defined', () => {
			expect(scope.email).toEqual(jasmine.any(String));
			expect(scope.name).toEqual(jasmine.any(String));
			expect(scope.header).toEqual(jasmine.any(String));
			expect(scope.message).toEqual(jasmine.any(String));
			expect(scope.buttonText).toEqual(jasmine.objectContaining({
				reset: jasmine.any(String),
				submit: jasmine.any(String)
			}));
			expect(scope.params).toEqual(jasmine.any(String));
			expect(scope.patterns).toEqual(regXpatternsService);
			expect(scope.sendMailResponse).toEqual(jasmine.objectContaining({
				error: jasmine.any(String),
				success: jasmine.any(String)
			}));
			expect(scope.hideInstructions).toBeFalsy();
			expect(scope.switchInstructionsVisibility).toEqual(jasmine.any(Function));
			expect(scope.instructions).toEqual(jasmine.objectContaining({
				intro: jasmine.any(String),
				list: jasmine.any(Array)
			}));
			expect(scope.resetForm).toEqual(jasmine.any(Function));
			expect(scope.submitForm).toEqual(jasmine.any(Function));
		});

	});

	describe('aboutController', () => {
		let scope, ctrl, route, firebaseService;

		beforeEach(inject(($rootScope, $controller, _$route_, _firebaseService_) => {
			scope = $rootScope.$new();
			route = _$route_;
			firebaseService = _firebaseService_;
			ctrl = $controller('aboutController', { $scope: scope, $route: route, firebaseService: firebaseService });
		}));

		it('should be defined', () => {
			expect(ctrl).toBeDefined();
		});

		it('should have variables and methods defined', () => {
			expect(scope.details).toEqual(jasmine.objectContaining({}));
			expect(scope.firebase).toEqual(firebaseService);
			expect(scope.updateDetails).toEqual(jasmine.any(Function));
			expect(scope.showContactDialog).toEqual(jasmine.any(Function));
		});

	});

});
