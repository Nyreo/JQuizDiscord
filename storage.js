// init storage -- temporary for development purposes

const Keyv = require('keyv');

// storages
const quizzes = new Keyv();
const players = new Keyv();

module.exports = {
	quizzes,
	players,
};