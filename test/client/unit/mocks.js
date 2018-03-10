/*
*	firebase mock
*/
var firebase = {
	initializeApp: () => true,
	database: () => {
		return {
			ref: () => {
				return {
					once: () => true,
					off: () => true
				};
			}
		};
	},
	auth: () => {
		return {
			onAuthStateChanged: () => true
		};
	}
};

/*
*	soundcloud mock
*/

var SC = {
	initialize: (options) => true
};
