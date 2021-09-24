'use strict';

const { SlashCommandBuilder } = require('@discordjs/builders');

const QuizHandler = require('../libs/quizHandler');
const MessageHandler = require('../utils/messageHandler');

const { Quiz } = require('../structs/quiz');

const config = require('../config.json');

const logger = require('../utils/logger');

// TODO IDEAS:
// standardise responses in a separate library !low!
// have a quizmaster rank option for creating permissions? !low!
// add setup enumerate codes? !low!
// add optional naming for quizzes? !low!

// process

module.exports = {
	data: new SlashCommandBuilder()
		.setName('createquiz')
		.setDescription('creates a quiz for people to join!')
		.addNumberOption(option =>
			option
				.setName('maxplayers')
				.setDescription('Max number of players for the quiz.')
				.setRequired(true),
		)
		.addNumberOption(option =>
			option
				.setName('questions')
				.setDescription('Number of questions for the quiz to have')
				.setRequired(true),
		),
	async execute(interaction) {
		const guild = interaction.guild;
		const author = interaction.user;

		// required fields
		const maxPlayers = interaction.options.getNumber('maxplayers');
		const questionCount = interaction.options.getNumber('questions');

		// create quiz object
		const quiz = new Quiz(guild.id, maxPlayers, questionCount);
		// add requesting user as the host of the quiz -- role checking?
		QuizHandler.addPlayer(quiz, author, true);

		// register object with db -- temp implementation
		try {
			await QuizHandler.createQuiz(guild.id, quiz);

			interaction.reply('Successfully created the quiz.');
		} catch(error) {
			logger.console.error(error.message);

			interaction.reply(error.message);
		}

		// // fairly deep promise nesting, could be improved?
		// QuizHandler.fetchQuiz(guild.id)
		// 	.then(existingQuiz => {
		// 		if(existingQuiz) {
		// 			return message.channel.send('There is already a quiz going on!');
		// 		} else {
		// 			// create new quiz and add message author as the host.
		// 			const authorFilter = m => m.author.id == author.id;

		// 			let maxPlayers, questionCount;

		// 			message.channel.send('How many players would you like?');

		// 			message.channel.awaitMessages(authorFilter, { max: 1, time: 60000, error:['time'] })
		// 				.then(collectedMaxPlayers => {
		// 					// need to validate
		// 					maxPlayers = collectedMaxPlayers.first().content;
		// 					if(maxPlayers < config.defaultMinPlayers) throw RangeError(`You can't have that amount of players! You are allowed ${config.defaultMinPlayers}-${config.defaultMaxPlayers} players!`);
		// 					else if(isNaN(maxPlayers)) throw TypeError('Please enter a valid number for the number of players.');

		// 					message.channel.send('How many questions would you like?');

		// 					message.channel.awaitMessages(authorFilter, { max: 1, time: 60000, error: ['time'] })
		// 						.then(collectedQuestionCount => {
		// 							// need to validate
		// 							questionCount = collectedQuestionCount.first().content;
		// 							if(questionCount < config.defaultMinQuestionCount) throw RangeError(`You can't have that amount of questions! You can have between ${config.defaultMinQuestionCount}-${config.defaultMaxQuestionCount} questions!`);
		// 							else if(isNaN(questionCount)) throw TypeError('Please enter a valid number for the number of questions!');
		// 						})
		// 						.then(() => {
		// 							// actually create the quiz
		// 							const newQuiz = new Quiz(guild.id, maxPlayers, questionCount);

		// 							// COMMENT OUT FOR TESTING ALONE :( -- adds creator of quiz to player pool
		// 							// try {
		// 							// 	QuizHandler.addPlayer(newQuiz, author, true);
		// 							// } catch(error) {
		// 							// 	return message.channel.send('There was a problem setting up the quiz :(');
		// 							// }

		// 							return newQuiz;
		// 						})
		// 						.then(newQuiz => {
		// 							// send completion message to host user
		// 							const quizCompletionMsg = MessageHandler.create.quizCreationMessage(newQuiz);

		// 							message.channel.send(quizCompletionMsg);

		// 							return newQuiz;
		// 						})
		// 						.then(async newQuiz => {
		// 							// set timer for quiz to begin and for players to join

		// 							// generate raw lobby message
		// 							const lobbyMessage = MessageHandler.create.lobbyMessage(newQuiz.players, newQuiz.maxPlayers);
		// 							// store reference to the lobby message that was sent
		// 							const lobbyRef = await message.channel.send(lobbyMessage);

		// 							// setup join collector
		// 							const joinFilter = m => m.content.startsWith(`${config.prefix}join`) && !m.author.bot;
		// 							const joinCollector = message.channel.createMessageCollector(joinFilter, { time : config.defaultSetupTime });

		// 							// setup cancel collector
		// 							const cancelFilter = m => m.content.startsWith(`${config.prefix}cancel`) && m.author.id == author.id;
		// 							const cancelCollector = message.channel.createMessageCollector(cancelFilter, { time : config.defaultSetupTime });

		// 							// send setup time warning message
		// 							message.channel.send(`The quiz will begin in ${config.defaultSetupTime / 1000} seconds.`);

		// 							joinCollector.on('collect', m => {
		// 								// someone wants to join the quiz
		// 								const player = m.author;

		// 								try {
		// 									QuizHandler.addPlayer(newQuiz, player);

		// 									// send join confirmation message
		// 									const currentPlayers = Object.keys(newQuiz.players).length;
		// 									message.channel.send(`${player.username} has entered the quiz! (${currentPlayers}/${newQuiz.maxPlayers})`);

		// 									// update the lobby message with the new player
		// 									MessageHandler.edit.updateLobby(lobbyRef, newQuiz.players, newQuiz.maxPlayers);

		// 									// check if max capacity has been reached (end collector if so)
		// 									if(currentPlayers == newQuiz.maxPlayers) joinCollector.stop('max_players_reached');
		// 								} catch(error) {
		// 									console.log(error.message);
		// 								}
		// 							});

		// 							joinCollector.on('end', async (m, reason) => {
		// 								// the joining process has concluded, either forcefully or naturally
		// 								if(reason == 'setup_cancelled') return message.channel.send('Quiz setup cancelled.');
		// 								// check there is enough players to actually start the quiz
		// 								if(Object.keys(newQuiz.players).length < config.defaultMinPlayers) return message.channel.send('Sorry, not enough people joined your quiz :(');

		// 								// no issues detected, begin quiz setup
		// 								message.channel.send('The quiz will begin after a brief setup period. Get READY!');

		// 								// get quiz questions
		// 								await QuizHandler.buildQuestionBase(newQuiz);
		// 								// create storage entity
		// 								await QuizHandler.createQuiz(guild.id, newQuiz);
		// 								// begin the quiz
		// 								return QuizHandler.beginQuiz(guild.id, message.channel);
		// 							});

		// 							// if cancel message received from host, stop the join collector
		// 							cancelCollector.on('collect', () => {
		// 								// force stop the creation of this quiz
		// 								joinCollector.stop('setup_cancelled');
		// 							});

		// 						})
		// 						.catch(err => {
		// 							console.log(`Error received: ${err.message}`);
		// 							return message.channel.send(err.message);
		// 						});
		// 				})
		// 				.catch(err => {
		// 					console.log(`Error received: ${err.message}`);
		// 					return message.channel.send(err.message);
		// 				});
		// 		}
		// 	})
		// 	.catch(err => {
		// 		console.log(`Error received: ${err.message}`);
		// 		return message.channel.send(err.message);
		// 	});
	},
};