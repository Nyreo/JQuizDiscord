const QuizHandler = require('../libs/quizHandler');

const { quizzes } = require('../storage');

const { Quiz } = require('../structs/quiz');
const quizHandler = require('../libs/quizHandler');

const quizQuestions = ['How many players would you like?', 'How many questions would you like?'];

module.exports = {
	name: 'startquiz',
	description: 'creates a quiz for people to join',
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
					// const newQuiz = new Quiz(guild.id, maxPlayers, questionCount);

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

									if(!quizHandler.addPlayer(newQuiz, author.id, true)) return message.channel.send('There was a problem setting up the quiz :(');

									quizzes.set(guild.id, newQuiz);

									return newQuiz;
								})
								.then(newQuiz => {
									message.channel
										.send(`A new quiz has been created!\n\tMax Players: ${newQuiz.maxPlayers}\n\tQuestions: ${newQuiz.questionCount}\nOther players can now join by typing !joinquiz.`);
								})
								.catch(err => console.log(err));
						})
						.catch(err => console.log(err));
				}
			})
			.catch(err => console.log(err));
	},
};