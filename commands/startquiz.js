const Discord = require('discord.js');

const QuizHandler = require('../libs/quizHandler');

const { Quiz } = require('../structs/quiz');

const config = require('../config.json');

module.exports = {
	name: 'startquiz',
	description: 'creates a quiz for people to join',
	aliases: [],
	execute(message) {
		const guild = message.guild;
		const author = message.author;

		QuizHandler.fetchQuiz(guild.id)
			.then(existingQuiz => {
				if(existingQuiz) {
					return message.channel.send('There is already a quiz going on!');
				} else {
					// create new quiz and add message author as the host.
					const userFilter = m => m.author.id == author.id;

					let maxPlayers;
					let questionCount;

					message.channel.send('How many players would you like?');

					message.channel.awaitMessages(userFilter, { max: 1, time: 60000, error:['time'] })
						.then(collectedMaxPlayers => {
							// need to validate
							maxPlayers = collectedMaxPlayers.first().content;

							message.channel.send('How many questions would you like?');

							message.channel.awaitMessages(userFilter, { max: 1, time: 60000, error: ['time'] })
								.then(collectedQuestionCount => {
									// need to validate
									questionCount = collectedQuestionCount.first().content;
								})
								.then(() => {
									// actually create the quiz
									const newQuiz = new Quiz(guild.id, maxPlayers, questionCount, 0);

									// COMMENT OUT FOR TESTING
									if(!QuizHandler.addPlayer(newQuiz, author.id, true)) return message.channel.send('There was a problem setting up the quiz :(');

									QuizHandler.createQuiz(guild.id, newQuiz);

									return newQuiz;
								})
								.then(newQuiz => {
									// creation message
									const completionEmbed = new Discord.MessageEmbed()
										.setColor('#1aff66')
										.setTitle('Quiz Creation Complete!')
										.setDescription('Your quiz has been succesfully set up!')
										.addFields(
											{ name: 'Max Players', value: newQuiz.maxPlayers, inline: true },
											{ name: 'Question Count', value: newQuiz.questionCount, inline:true },
										)
										.addField('How to Join?', 'Players can now join the quiz by typing !join.');

									message.channel.send(completionEmbed);

									return newQuiz;
								})
								.then(newQuiz => {
									// set timer for quiz to begin and get players
									message.channel.send(`The quiz will begin in ${config.defaultSetupTime / 1000} seconds.`);

									const joinFilter = m => m.content.includes('join') && !(m.author.id in Object.keys(newQuiz.players));

									const joinCollector = message.channel.createMessageCollector(joinFilter, { time : config.defaultSetupTime });

									joinCollector.on('collect', m => {
										const player = m.author;

										if(QuizHandler.addPlayer(newQuiz, player.id)) {
											const currentPlayers = Object.keys(newQuiz.players).length;
											message.channel.send(`${player.username} has entered the quiz! (${currentPlayers}/${newQuiz.maxPlayers})`);
											// check if max capacity left
											if(currentPlayers == newQuiz.maxPlayers) joinCollector.stop('Max players reached...');
										}
									});

									joinCollector.on('end', collected => {
										message.channel.send('The quiz will begin shortly!');
									});
								})
								.catch(err => {
									console.log(err);
									return message.channel.send('There was a problem setting up the quiz.');
								});
						})
						.catch(err => {
							console.log(err);
							return message.channel.send('There was a problem setting up the quiz.');
						});
				}
			})
			.catch(err => {
				console.log(err);
				return message.channel.send('There was a problem setting up the quiz.');
			});
	},
};