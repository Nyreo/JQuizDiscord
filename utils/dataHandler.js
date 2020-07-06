'use strict';

module.exports = {
	// implementation of fisher-yates shuffle
	arrayShuffle: array => {
		let m = array.length, t, i;

		while(m) {
			i = Math.floor(Math.random() * m--);

			t = array[m];
			array[m] = array[i];
			array[i] = t;
		}
		return array;
	},
};