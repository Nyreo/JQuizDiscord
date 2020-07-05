const QuizHandler = require('../libs/quizHandler');

const { quizzes } = require('../storage');

const { Quiz } = require('../structs/quiz');

const Discord = require('discord.js');

module.exports = {
	name: 'startquiz',
	description: 'creates a quiz for people to join',
	aliases: [],
	execute(message) {
		const guild = message.guild;
		const author = message.author;

		quizzes.get(guild.id)
			.then(existingQuiz => {
				if(existingQuiz) {
					message.channel.send('There is already a quiz going on!');
					return false;
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

									if(!QuizHandler.addPlayer(newQuiz, author.id, true)) return message.channel.send('There was a problem setting up the quiz :(');

									quizzes.set(guild.id, newQuiz);

									return newQuiz;
								})
								.then(newQuiz => {
									const completionEmbed = new Discord.MessageEmbed()
										.setColor('#0099ff')
										.setTitle('Quiz Creation Complete!')
										.setDescription('Your quiz has been succesfully set up!')
										.addFields(
											{ name: 'Max Players', value: newQuiz.maxPlayers, inline: true },
											{ name: 'Question Count', value: newQuiz.questionCount, inline:true },
										)
										.addField('How to Join?', 'Players can now join the quiz by typing !joinquiz.');

									return message.channel.send(completionEmbed);
								})
								.catch(err => console.log(err));
						})
						.catch(err => console.log(err));
				}
			})
			.catch(err => console.log(err));
	},
};