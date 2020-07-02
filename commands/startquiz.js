const QuizHandler = require('../libs/quizHandler');

const { quizzes } = require('../storage');

const { Player } = require('../structs/player');
const { Quiz } = require('../structs/quiz');

module.exports = {
	name: 'startquiz',
	description: 'Creates a quiz for people to join!',
	args: true,
	usage: '<question count> <max plaeyrs>',
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
					const host = new Player(author.id, {}, true);

					if(!newQuiz.addPlayer(host)) return message.channel.send('There was an error setting up the quiz.');

					console.log(newQuiz);

					quizzes.set(guild.id, newQuiz);

					// create fancy embed message?
					return message.channel
						.send(`A new quiz has been created!\n\tMax Players: ${maxPlayers}\n\tQuestions: ${questionCount}\nJoin now by typing !joinquiz`);
				}
			})
			.catch(err => console.log(err));
	},
};