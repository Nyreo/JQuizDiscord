const axios = require('axios');
const { maxPlayers } = require('../config.json');

const base_url = 'https://opentdb.com/api.php?';

module.exports = {
	getQuestions:  (amount) => {
		return axios.get(`${base_url}amount=${amount}`)
			.then(response => response.data.results)
			.catch(err => console.error(err));
	},
};