'use strict';

module.exports = {
	// implementation of fisher-yates shuffle
	arrayShuffle: array => {
		const copy = [];
		let n = array.length, i;

		while(n) {
			i = Math.floor(Math.random() * array.length);

			if(i in array) {
				copy.push(array[i]);
				delete array[i];
				n--;
			}
		}
		return copy;
	},
};