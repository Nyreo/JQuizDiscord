const axios = require('axios');
const base_url = 'https://opentdb.com/api.php?';

const { maxPlayers } = require('../config.json');

const { quizzes, players } = require('../storage');

const defaultPlayer = {
	score: 0,
};

module.exports = {
	getQuestions:  (amount) => {
		return axios.get(`${base_url}amount=${amount}`)
			.then(response => response.data.results)
			.catch(err => console.error(err));
	},
	addPlayer: (quiz, playerId, isHost = false) => {
		if(Object.keys(quiz.players).length >= quiz.maxPlayers) return false;
		quiz.players[playerId] = { ...defaultPlayer, isHost };
		return true;
	},
	cancelQuiz: (guildId) => {
		return quizzes.delete(guildId)
			.then(() => true)
			.catch(() => false);
	},
	fetchQuiz: (guildId) => {
		return quizzes.get(guildId);
	},
};