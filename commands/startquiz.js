const QuizHandler = require('../libs/quizHandler');

const { quizzes } = require('../storage');

const { Quiz } = require('../structs/quiz');
const quizHandler = require('../libs/quizHandler');

module.exports = {
	name: 'startquiz',
	description: 'creates a quiz for people to join',
	args: true,
	usage: '<question count> <max players>',
	execute(message, args) {
		const [questionCount, maxPlayers] = args;

		if(!questionCount || !maxPlayers) return message.channel.send('Please enter the correct arguments for this command!');

		const guild = message.guild;
		const author = message.author;

		quizzes.get(guild.id)
			.then(existingQuiz => {
				if(existingQuiz) {
					message.channel.send('There is already a quiz going on!');
					return false;
				} else {
					// create new quiz and add message author as the host.
					const newQuiz = new Quiz(guild.id, maxPlayers, questionCount);

					if(!quizHandler.addPlayer(newQuiz, author.id, true)) return message.channel.send('There was an error setting up the quiz.');

					quizzes.set(guild.id, newQuiz);

					console.log(newQuiz);

					// create fancy embed message?
					return message.channel
						.send(`A new quiz has been created!\n\tMax Players: ${maxPlayers}\n\tQuestions: ${questionCount}\nJoin now by typing !joinquiz`);
				}
			})
			.catch(err => console.log(err));
	},
};