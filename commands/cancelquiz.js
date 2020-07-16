const QuizHandler = require('../libs/quizHandler');

module.exports = {
	name: 'stopquiz',
	description: 'stops the current quiz',
	execute(message) {
		const guild = message.guild;
		const author = message.author;

		// check if the author is the host of the quiz
		return QuizHandler.fetchQuiz(guild.id)
			.then(quiz => {
				if(quiz) {
					// quiz exists
					const isHost = quiz.players[author.id].isHost;

					if(isHost) {
						// author is the host
						return QuizHandler.cancelQuiz(guild.id)
							.then(() => message.channel.send('The quiz has been successfully deleted.'))
							.catch(() => message.channel.send('Sorry, I could not complete your request :('));
					} else {
						// author is not the host
						return message.channel.send('You need to be the host to cancel a quiz.');
					}
				} else {
					// quiz does not exist
					return message.channel.send('There is currently not a quiz going on!');
				}
			})
			.catch(() => message.channel.send('Sorry, something went wrong :('));
	},
};