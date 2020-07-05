const QuizHandler = require('../libs/quizHandler');

module.exports = {
	name: 'joinquiz',
	description: 'joins the current ongoing quiz',
	execute(message) {
		const guild = message.guild;
		const author = message.author;

		return QuizHandler.fetchQuiz(guild.id)
			.then(quiz => {
				// does a quiz exist?
				if(!quiz) return message.channel.send('You need to setup a quiz before you can join one!');
				// if yes, is the player already signed up?
				else if(quiz.players[author.id]) return message.channel.send('You have already joined that quiz!');
				// if not, add player
				else if(!QuizHandler.addPlayer(quiz, author.id)) return message.channel.send('You cannot join that quiz!');
				else return message.channel.send('You have now joined the quiz.');
			})
			.catch(err => {
				console.log(err);
				return message.channel.send('Sorry, something went wrong.');
			});
	},
};