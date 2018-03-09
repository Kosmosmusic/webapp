'use strict';
/* global kosmosmusicControllers */

kosmosmusicControllers.controller('navController', ['$rootScope', '$scope', '$document', '$element', '$location', '$route', '$mdComponentRegistry', '$mdSidenav', '$mdDialog', 'firebaseService',
	function($rootScope, $scope, $document, $element, $location, $route, $mdComponentRegistry, $mdSidenav, $mdDialog, firebaseService) {
		$scope.title = 'KOS.MOS.MUSIC';
		$scope.button = {
			index: {
				name: 'KOS.MOS.MUSIC',
				title: 'KOS.MOS.MUSIC index',
				icon: 'fa fa-fire',
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
		};
		$scope.selectButton = (href) => {
			// console.log('selectButton, href:', href);
			if ($location.path().slice(1) === href) {
				// console.log('selectButton, path:', $location.path());
				return true;
			} else {
				return false;
			}
		};
		$scope.firebase = firebaseService;
		$scope.disableToggler = () => {
			return !$mdComponentRegistry.get('left');
		};
		$scope.toggleSidenav = () => {
			if ($mdComponentRegistry.get('left')) {
				$mdSidenav('left').toggle();
			}
		};
		$scope.isSidenavOpen = () => {
			/*
			*	actual function logic must be set after focument is ready
			*	or it will generate errors, because sidenav DOM object loads after the main navbar
			*/
			if ($mdComponentRegistry.get('left')) {
				// console.log('is sidenav open', $mdSidenav('left').isOpen());
				return $mdSidenav('left').isOpen();
			}
			return false;
		};
	}
]);

kosmosmusicControllers.controller('indexController', ['$scope',
	function($scope) {
		$scope.tracks = [];
		$scope.getTracks = (callback) => {
			SC.get('/users/403059/tracks').then((tracks) => {
				$scope.tracks = tracks;
				$scope.$digest();
				callback();
			});
		};
		/*
		*	lifecycle
		*/
		$scope.$on('$viewContentLoaded', () => {
			console.log('index view controller loaded');
			$scope.getTracks(() => {
				console.log('got tracks');
			});
		});
		$scope.$on('$destroy', () => {
			console.log('index view controller destroyed');
		});
	}
]);

kosmosmusicControllers.controller('releasesController', ['$scope',
	function($scope) {
		/*
		*	lifecycle
		*/
		$scope.$on('$viewContentLoaded', () => {
			console.log('releases view controller loaded');
		});
		$scope.$on('$destroy', () => {
			console.log('releases view controller destroyed');
		});
	}
]);

kosmosmusicControllers.controller('masteringController', ['$scope',
	function($scope) {
		/*
		*	lifecycle
		*/
		$scope.$on('$viewContentLoaded', () => {
			console.log('mastering view controller loaded');
		});
		$scope.$on('$destroy', () => {
			console.log('mastering view controller destroyed');
		});
	}
]);

kosmosmusicControllers.controller('mixesController', ['$scope',
	function($scope) {
		/*
		*	lifecycle
		*/
		$scope.$on('$viewContentLoaded', () => {
			console.log('mixes view controller loaded');
		});
		$scope.$on('$destroy', () => {
			console.log('mixes view controller destroyed');
		});
	}
]);

kosmosmusicControllers.controller('videosController', ['$scope',
	function($scope) {
		/*
		*	lifecycle
		*/
		$scope.$on('$viewContentLoaded', () => {
			console.log('videos view controller loaded');
		});
		$scope.$on('$destroy', () => {
			console.log('videos view controller destroyed');
		});
	}
]);

kosmosmusicControllers.controller('contactController', ['$scope', '$mdDialog', '$location', '$anchorScroll', '$timeout', 'regXpatternsService', 'sendEmailService',
	function($scope, $mdDialog, $location, $anchorScroll, $timeout, regXpatternsService, sendEmailService) {
		$scope.email = '';
		$scope.name = '';
		$scope.header = '';
		$scope.message = '';
		$scope.domain = $location.$$host;
		$scope.buttonText = {reset: 'Reset all fields', submit: 'Send message', cancel: 'Cancel'};
		$scope.params = '';
		$scope.patterns = regXpatternsService;
		$scope.sendMailResponse = {error: '', success: ''};
		$scope.hideInstructions = false;
		$scope.switchInstructionsVisibility = () => {
			$scope.hideInstructions = true;
		};
		$scope.instructions = {
			intro: 'Use this contact form for any enquiries correlating with Drum\'n\'Bass Hub activities, for example:',
			list: [
				'make an info support request - have a blog post for your upcoming release;',
				'make a collaboration or hire request - work with us in the context of audio production from scratch or remixing;',
				'make a licencing request - use music, published by Dnbhub, for your needs;',
				'make any other request - did we miss something?'
			]
		};
		$scope.resetForm = () => {
			$scope.email = '';
			$scope.name = '';
			$scope.header = '';
			$scope.message = '';
		};
		$scope.loading = false;
		$scope.submitForm = () => {
			$scope.loading = true;
			$scope.params = 'name=' + $scope.name + '&email=' + $scope.email + '&header=' + $scope.header + '&message=' + $scope.message + '&domain=' + $scope.domain;
			sendEmailService.save({}, $scope.params).$promise.then(
				(response) => {
					// console.log(response);
					if (response.success) {
						$scope.sendMailResponse.error = '';
						$scope.sendMailResponse.success = response.success || 'Message was successfully sent';
						$scope.resetForm();
					} else {
						$scope.sendMailResponse.error = response.error || 'Unknown error';
						$scope.sendMailResponse.success = '';
					}
					$scope.scrollToSubmissionResult();
					$timeout(() => {
						$location.hash('');
						$scope.sendMailResponse.success = '';
						$scope.sendMailResponse.error = '';
						$scope.loading = false;
						$scope.hide();
					},5000);
				},
				(error) => {
					// console.log('sendMessage error: ', error);
					$scope.sendMailResponse.success = '';
					$scope.sendMailResponse.error = error.status + ' : ' + error.statusText;
					$scope.scrollToSubmissionResult();
					$timeout(() => {
						$location.hash('');
						$scope.sendMailResponse.error = '';
						$scope.loading = false;
					},5000);
				}
			);
		};
		$scope.scrollToSubmissionResult = () => {
			$location.hash('submission-result');
			$anchorScroll();
		};
		/*
		*	dialog controls
		*/
		$scope.hide = () => {
			$location.hash('');
			$mdDialog.hide();
		};
		$scope.cancel = () => {
			$location.hash('');
			$mdDialog.cancel();
		};
		/*
		*	lifecycle
		*/
		$scope.$on('$viewContentLoaded', () => {
			console.log('contact view controller loaded');
		});
		$scope.$on('$destroy', () => {
			console.log('contact view controller destroyed');
		});
	}
]);

kosmosmusicControllers.controller('aboutController', ['$scope', '$route', '$mdDialog', 'firebaseService',
	function($scope, $route, $mdDialog, firebaseService) {
		$scope.details = {};
		$scope.firebase = firebaseService;
		$scope.updateDetails = () => {
			$scope.firebase.getDB('about')
				.then((snapshot) => {
					console.log('about', snapshot.val());
					const response = snapshot.val();
					$scope.details = {};
					const keys = Object.keys(response);
					// console.log('keys, response:', keys, ',', response);
					keys.forEach((key) => {
						$scope.details[key] = response[key];
					});
					// console.log('$scope.details:', $scope.details);
					$scope.$apply();
				})
				.catch((error) => {
					console.log('error', error);
				});
		};
		$scope.showContactDialog = (event) => {
			$mdDialog.show({
				controller: 'contactController',
				templateUrl: './app/views/contact.html',
				parent: angular.element(document.body),
				targetEvent: event,
				clickOutsideToClose: false,
				fullscreen: true
			}).then(
				(result) => console.log('submitted', result),
				(rejected) => console.log('closed', rejected)
			);
		};
		/*
		*	lifecycle
		*/
		$scope.$on('$viewContentLoaded', () => {
			console.log('about view controller loaded');
			$scope.updateDetails();
		});
		$scope.$on('$destroy', () => {
			console.log('about view controller destroyed');
			$scope.firebase.getDB('about', true).off();
		});
	}
]);
