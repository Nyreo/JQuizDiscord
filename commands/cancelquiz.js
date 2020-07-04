const quizHandler = require('../libs/quizHandler');

module.exports = {
	name: 'cancelquiz',
	description: 'cancels the current quiz',
	execute(message) {
		const guild = message.guild;
		const author = message.author;

		// check if the author is the host of the quiz
		return quizHandler.fetchQuiz(guild.id)
			.then(quiz => {
				if(quiz) {
					// quiz exists
					const isHost = quiz.players[author.id].isHost;

					if(isHost) {
						// author is the host
						quizHandler.cancelQuiz(guild.id);
						return message.channel.send('The quiz has been successfully deleted.');
					} else {
						// author is not the host
						return message.channel.send('You need to be the host to cancel a quiz.');
					}
				} else {
					// quiz does not exist
					return message.channel.send('There is currently not a quiz going on!');
				}
			})
			.catch(err => message.channel.send('An error occurred'));
	},
};