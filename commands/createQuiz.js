'use strict';

const QuizHandler = require('../libs/quizHandler');
const MessageHandler = require('../utils/messageHandler');

const { Quiz } = require('../structs/quiz');

const config = require('../config.json');

// TODO IDEAS:
// standardise responses in a separate library !low!
// standardise console messages (easier for development) !medium!
// have a quizmaster rank option for creating permissions? !low!
// add setup enumerate codes? !low!
// add optional naming option for quizzes? !low!
// show joining lobby - edit mesasge when someone joins !med!

module.exports = {
	name: 'createquiz',
	description: 'creates a quiz for people to join',
	aliases: ['startquiz', 'beginquiz', 'quizcreate'],
	execute(message) {
		const guild = message.guild;
		const author = message.author;

		// not sure if ths promise nesting is the best way to go about this...
		QuizHandler.fetchQuiz(guild.id)
			.then(existingQuiz => {
				if(existingQuiz) {
					return message.channel.send('There is already a quiz going on!');
				} else {
					// create new quiz and add message author as the host.
					const authorFilter = m => m.author.id == author.id;

					let maxPlayers;
					let questionCount;

					message.channel.send('How many players would you like?');

					message.channel.awaitMessages(authorFilter, { max: 1, time: 60000, error:['time'] })
						.then(collectedMaxPlayers => {
							// need to validate
							maxPlayers = collectedMaxPlayers.first().content;
							if(maxPlayers < config.defaultMinPlayers) throw RangeError(`You can't have that amount of players! You are allowed ${config.defaultMinPlayers}-${config.defaultMaxPlayers} players!`);
							else if(isNaN(maxPlayers)) throw TypeError('Please enter a valid number for the number of players.');

							message.channel.send('How many questions would you like?');

							message.channel.awaitMessages(authorFilter, { max: 1, time: 60000, error: ['time'] })
								.then(collectedQuestionCount => {
									// need to validate
									questionCount = collectedQuestionCount.first().content;
									if(questionCount < config.defaultMinQuestionCount) throw RangeError(`You can't have that amount of questions! You can have between ${config.defaultMinQuestionCount}-${config.defaultMaxQuestionCount} questions!`);
									else if(isNaN(questionCount)) throw TypeError('Please enter a valid number for the number of questions!');
								})
								.then(() => {
									// actually create the quiz
									const newQuiz = new Quiz(guild.id, maxPlayers, questionCount);

									// COMMENT OUT FOR TESTING ALONE :( -- adds creator to player pool
									// if(!QuizHandler.addPlayer(newQuiz, author.id, true)) return message.channel.send('There was a problem setting up the quiz :(');

									return newQuiz;
								})
								.then(newQuiz => {
									// send message to user
									const quizCompletionMsg = MessageHandler.create.quizCreationMessage(newQuiz);

									message.channel.send(quizCompletionMsg);

									return newQuiz;
								})
								.then(newQuiz => {
									// set timer for quiz to begin and get players
									message.channel.send(`The quiz will begin in ${config.defaultSetupTime / 1000} seconds.`);

									// setup join collector
									const joinFilter = m => m.content.includes('joinquiz') && !m.author.bot && !(m.author.id in Object.keys(newQuiz.players));
									const joinCollector = message.channel.createMessageCollector(joinFilter, { time : config.defaultSetupTime });

									// setup cancel collector
									const cancelFilter = m => m.content.includes('cancel') && m.author.id == author.id;
									const cancelCollector = message.channel.createMessageCollector(cancelFilter, { time : config.defaultSetupTime });

									joinCollector.on('collect', m => {
										const player = m.author;

										if(QuizHandler.addPlayer(newQuiz, player.id)) {
											const currentPlayers = Object.keys(newQuiz.players).length;
											message.channel.send(`${player.username} has entered the quiz! (${currentPlayers}/${newQuiz.maxPlayers})`);
											// check if max capacity left
											if(currentPlayers == newQuiz.maxPlayers) joinCollector.stop('max_players_reached');
										}
									});

									joinCollector.on('end', async (m, reason) => {

										if(reason == 'setup_cancelled') return message.channel.send('Quiz setup cancelled.');
										// check there is enough players to actually start the quiz
										if(Object.keys(newQuiz.players).length < config.defaultMinPlayers) return message.channel.send('Sorry, not enough people joined your quiz :(');

										message.channel.send('The quiz will begin shortly!');

										// get questions
										await QuizHandler.buildQuestionBase(newQuiz);
										// create storage entity
										await QuizHandler.createQuiz(guild.id, newQuiz);
										// begin the quiz
										return QuizHandler.beginQuiz(guild.id, message.channel);

									});

									// not sure if this is the best way to do this but it works ;)
									// if cancel message received from host, stop the join collector
									cancelCollector.on('collect', () => {
										joinCollector.stop('setup_cancelled');
									});

								})
								.catch(err => {
									console.log(`Error received: ${err.message}`);
									return message.channel.send(err.message);
								});
						})
						.catch(err => {
							console.log(`Error received: ${err.message}`);
							return message.channel.send(err.message);
						});
				}
			})
			.catch(err => {
				console.log(`Error received: ${err.message}`);
				return message.channel.send(err.message);
			});
	},
};