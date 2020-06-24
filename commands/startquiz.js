const QuizHandler = require('../libs/quizHandler');

const { games } = require('../storage');

module.exports = {
	name: 'startquiz',
	description: 'provides help on the available commands',
	args: true,
	usage: '<question_count> (optional)<max_players>',
	execute(message, args) {
		const [questions_count, max_players] = args;
	},
};