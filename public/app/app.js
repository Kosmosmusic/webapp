/* App Module */

var kosmosmusic = angular.module('kosmosmusic', [
	'ngAnimate',
	'ngResource',
	'ngSanitize',
	'ngRoute',
	'ngAria',
	'ngMessages',
	'ngMaterial',
	'angular-google-gapi',
	'kosmosmusicControllers',
	'kosmosmusicDirectives',
	'kosmosmusicServices'
]);

kosmosmusic
	.config(['$routeProvider', '$locationProvider', '$mdThemingProvider',
		($routeProvider, $locationProvider, $mdThemingProvider) => {
			$routeProvider
				.when('/index', {
					templateUrl: 'app/views/index.html',
					controller: 'indexController'
				})
				.when('/releases', {
					templateUrl: 'app/views/releases.html',
					controller: 'releasesController'
				})
				.when('/mastering', {
					templateUrl: 'app/views/mastering.html',
					controller: 'masteringController'
				})
				.when('/mixes', {
					templateUrl: 'app/views/mixes.html',
					controller: 'mixesController'
				})
				.when('/videos', {
					templateUrl: 'app/views/videos.html',
					controller: 'videosController'
				})
				.when('/about', {
					templateUrl: 'app/views/about.html',
					controller: 'aboutController'
				})
				.otherwise({
					redirectTo: '/index'
				});

			$locationProvider.html5Mode({enabled: true, requireBase: false});

			$mdThemingProvider.theme('default')
				.primaryPalette('blue-grey')
				.accentPalette('amber')
				.warnPalette('red')
				//.backgroundPalette('blue-grey')
				.dark();
		}
	])
	.run(['$rootScope', '$location', 'firebaseService', 'soundcloudService', 'googleService',
		($rootScope, $location, firebaseService, soundcloudService, googleService) => {
			/*
			*	initialize firebase
			*/
			firebaseService.initFirebase();

			/*
			*	initialize soundcloud
			*/
			soundcloudService.init();

			/*
			*	initialize google
			*/
			googleService.init();

			$rootScope.$on('$locationChangeSuccess', (event, next, current) => {
				console.log('event', event);
				console.log('current', current);
				console.log('next', next);
			});
		}
	]);

var kosmosmusicControllers = angular.module('kosmosmusicControllers', []); // eslint-disable-line no-unused-vars
var kosmosmusicServices = angular.module('kosmosmusicServices', []); // eslint-disable-line no-unused-vars
var kosmosmusicDirectives = angular.module('kosmosmusicDirectives', []); // eslint-disable-line no-unused-vars
