const Keyv = require('keyv');

const quizzes = new Keyv();
const players = new Keyv();

module.exports = {
	quizzes,
	players,
};