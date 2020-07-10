'use strict';

const axios = require('axios');
const base_url = 'https://opentdb.com/api.php?type=multiple&';

const Entities = require('html-entities').AllHtmlEntities;

const { quizzes, players } = require('../storage');

const DataHandler = require('../utils/dataHandler');
const MessageHandler = require('../utils/messageHandler');

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
		// use awaitMessages for finding the right answers?
		// or
		// use reactions and try and remove the reaction once it has been added?
		
		// starts an existing quiz
		quizzes.get(guildId)
			.then(quiz => {
				// test - delete
				for(const questionData of quiz.questions) {
					const question = entities.decode(questionData.question);

					const correctAnswer = questionData.correct_answer;
					let answers = questionData.incorrect_answers.push(correctAnswer);
					answers = DataHandler.arrayShuffle(answers);

					const questionMessage = MessageHandler.create.questionMessage(question, answers);

					channel.send(questionMessage);

					break;
				}
				console.log(quiz);
			})
			.catch(err => {
				channel.send('There was an issue with starting the quiz...');
				console.log(err);
			});
	},
};