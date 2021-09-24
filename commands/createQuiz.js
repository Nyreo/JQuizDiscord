'use strict';

const { SlashCommandBuilder } = require('@discordjs/builders');

const QuizHandler = require('../libs/quizHandler');
const MessageHandler = require('../utils/messageHandler');

const { Quiz } = require('../structs/quiz');

const config = require('../config.json');

const logger = require('../utils/logger');

// TODO IDEAS:
// standardise responses in a separate library !low!
// have a quizmaster rank option for creating permissions? !low!
// add setup enumerate codes? !low!
// add optional naming for quizzes? !low!

// process

module.exports = {
	data: new SlashCommandBuilder()
		.setName('createquiz')
		.setDescription('creates a quiz for people to join!')
		.addNumberOption(option =>
			option
				.setName('maxplayers')
				.setDescription('Max number of players for the quiz.')
				.setRequired(true),
		)
		.addNumberOption(option =>
			option
				.setName('questions')
				.setDescription('Number of questions for the quiz to have')
				.setRequired(true),
		),
	async execute(interaction) {
		const guild = interaction.guild;
		const author = interaction.user;

		// required fields
		const maxPlayers = interaction.options.getNumber('maxplayers');
		const questionCount = interaction.options.getNumber('questions');

		// create quiz object
		const quiz = new Quiz(guild.id, maxPlayers, questionCount);
		// add requesting user as the host of the quiz -- role checking?
		QuizHandler.addPlayer(quiz, author, true);

		// register object with db -- temp implementation
		try {
			await QuizHandler.createQuiz(guild.id, quiz);

			interaction.reply('Successfully created the quiz.');

			// create lobby embed
			const lobbyMsg = MessageHandler.create.lobbyMessage(quiz.players, quiz.maxPlayers);

			// store lobby reference
			const lobbyRef = await interaction.channel.send({ embeds: [lobbyMsg] });

			// possibly move this to a seperate command? /join????

			// setup join collector
			const joinFilter = m => m.content.startsWith('join');
			const joinCollector = interaction.channel.createMessageCollector({ filter: joinFilter, time: config.defaultSetupTime });

			// setup cancel collector
			const cancelFilter = m => m.content.startsWith('cancel') && m.author.id == author.id;
			const cancelCollector = interaction.channel.createMessageCollector(cancelFilter, { time : config.defaultSetupTime });

			joinCollector.on('collect', m => {
				// user who wants to join the quiz
				const player = m.author;

				QuizHandler.addPlayer(quiz, player)
					.then(() => {
						logger.console.success(`Added player [${player.username}] to quiz [${quiz.guildId}]`);
						MessageHandler.edit.updateLobby(lobbyRef, quiz.players, quiz.maxPlayers);
					})
					.catch(err => logger.console.error(err.message));
			});

			joinCollector.on('end', collected => {
				console.log(`collected: ${collected.size} items.`);
			});

			cancelCollector.on('collect', () => {
				logger.console.warning(`Quiz for guild [${quiz.guildId}] requesting setup cancellation... Shutting collectors down.`);
				joinCollector.stop('Cancelled by host.');
				cancelCollector.stop();
			});

		} catch(error) {
			logger.console.error(error.message);
			interaction.reply(error.message);
		}
	},
};