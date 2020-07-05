const axios = require('axios');
const base_url = 'https://opentdb.com/api.php?type=multiple&';

const { quizzes, players } = require('../storage');

const defaultPlayer = {
	score: 0,
};

module.exports = {
	// amount, type, category, difficulty
	buildQuestionBase: async (quiz, amount) => {
		const questionData = await axios.get(`${base_url}amount=${amount}`);

		quiz.questions = questionData.data.results;
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
	createQuiz: (guildId, quiz) => {
		return quizzes.set(guildId, quiz);
	},
	beginQuiz: (guildId, channel) => {
		return channel.send('The quiz has begun!!!');
	},
};