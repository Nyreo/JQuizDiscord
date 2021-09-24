'use strict';

// api request
const axios = require('axios');
// uri
const base_url = 'https://opentdb.com/api.php?type=multiple&';

// data storages -- temp
const { quizzes, players } = require('../storage');

// handlers
const DataHandler = require('../utils/dataHandler');
const MessageHandler = require('../utils/messageHandler');

// default player object
const defaultPlayer = {
	score: 0,
};

const entities = require('html-entities').AllHtmlEntities;

module.exports = {
	// amount, type, category, difficulty
	buildQuestionBase: async (quiz) => {
		// fetches a set of questions from the API and applies them to the provided quiz
		const questionData = await axios.get(`${base_url}amount=${quiz.questionCount}`);

		quiz.questions = questionData.data.results;
	},
	addPlayer: async (quiz, player, isHost = false) => {
		// adds a new player to the quiz storage entity

		// check if max players has been reached
		if(Object.keys(quiz.players).length >= quiz.maxPlayers) throw Error('MAX_PLAYER_CAPACITY');
		// check if the player has already joined the quiz
		else if(quiz.players[player.id]) throw Error('PLAYER_ALREADY_EXISTS');

		// safe for the player to join
		quiz.players[player.id] = { ...defaultPlayer, username: player.username, isHost };
	},
	cancelQuiz: async (guildId) => {
		// deletes an existing quiz from the storage entity
		return quizzes.delete(guildId);
	},
	fetchQuiz: async (guildId) => {
		// fetches data on a guilds quiz from the data storage entity
		return quizzes.get(guildId);
	},
	createQuiz: async (guildId, quiz) => {
		// adds quiz data to the storage entity
		// returns the created quiz

		// try fetch the quiz first
		if(await quizzes.get(guildId)) throw new Error('A quiz for that server is already running!');

		quizzes.set(guildId, quiz);
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