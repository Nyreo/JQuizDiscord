/* eslint-disable no-undef */

const DataHandler = require('../dataHandler');

describe('Testing array shuffle', () => {
	test('Array shuffle on standard array', () => {
		const array = [1, 2, 3, 4];

		const shuffledArray = DataHandler.arrayShuffle(array);
		// check that the array that is passed back is the same length
		expect(shuffledArray.length).toBe(array.length);
	});

	test('Array shuffle on empty array', () => {
		const array = [];

		const shuffledArray = DataHandler.arrayShuffle(array);

		expect(shuffledArray).toEqual(array);
	});
});