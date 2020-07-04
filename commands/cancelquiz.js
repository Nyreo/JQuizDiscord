const quizHandler = require('../libs/quizHandler');

module.exports = {
	name: 'cancelquiz',
	description: 'cancels the current quiz',
	execute(message) {
		const guild = message.guild;

		if(quizHandler.cancelQuiz(guild.id)) return message.channel.send('The quiz has been successfully deleted.');
		else return message.channel.send('Unable to delete the quiz.');
	},
}