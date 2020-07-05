const axios = require('axios');
const base_url = 'https://opentdb.com/api.php?type=multiple&';

const Entities = require('html-entities').AllHtmlEntities;

const { quizzes, players } = require('../storage');

const defaultPlayer = {
	score: 0,
};

const entities = new Entities();

module.exports = {
	// amount, type, category, difficulty
	buildQuestionBase: async (quiz) => {
		// fetches a set of questions from the API and applies them to the provided quiz
		const questionData = await axios.get(`${base_url}amount=${quiz.questionCount}`);

		quiz.questions = questionData.data.results;
	},
	addPlayer: (quiz, playerId, isHost = false) => {
		// adds a new player to the storage entity
		if(Object.keys(quiz.players).length >= quiz.maxPlayers) return false;
		quiz.players[playerId] = { ...defaultPlayer, isHost };
		return true;
	},
	cancelQuiz: (guildId) => {
		// deletes an existing quiz from the storage entity
		return quizzes.delete(guildId)
			.then(() => true)
			.catch(() => false);
	},
	fetchQuiz: (guildId) => {
		// fetches data on a guilds quiz from the data storage entity
		return quizzes.get(guildId);
	},
	createQuiz: (guildId, quiz) => {
		// adds quiz data to the storage entity
		return quizzes.set(guildId, quiz);
	},
	beginQuiz: (guildId, channel) => {
		// starts an existing quiz
		quizzes.get(guildId)
			.then(quiz => {
				// test - delete
				for(const data of quiz.questions) {
					const dq = entities.decode(data.question);

					channel.send(dq);
				}
				console.log(quiz);
			})
			.catch(err => {
				channel.send('There was an issue with starting the quiz...');
				console.log(err);
			});
	},
};