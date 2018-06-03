'use strict';

/*
*	API DOC: http://www.protractor.org/#/api
*/

describe('Kosmosmusic: ', () => {

	const EC = protractor.ExpectedConditions;

	it('should load index view', () => {
		// browser.ignoreSynchronization = true;
		// browser.refresh(5000);
		browser.get('');
		browser.getCurrentUrl().then((url) => {
			expect(url).toMatch('\/index$');

			const content = element.all(by.css('body[layout*=column]'));
			expect(content.count()).toEqual(1);
		});
	});

});