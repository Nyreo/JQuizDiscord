'use strict';

const Discord = require('discord.js');

const config = require('../config.json');

// TODO
// helpMessage !med!
// updatelobby !med!

// takes raw player quiz data
const generateLobbyField = (players, maxPlayers) => {
	const playerData = Object.values(players);

	// 1. Nyreo
	// 2. -empty-
	// 3. -empty-

	const lobbyField = { name: 'Lobby', value : '' };

	for(let i = 0; i < maxPlayers; i++) {
		lobbyField.value += `\n${i + 1}. `;

		if(playerData[i]) lobbyField.value += playerData[i].username;
		else lobbyField.value += '-empty-';
	}

	return lobbyField;
};

const generateAnswerList = answers => {

	const answerFields = answers.map((answer, index) => {
		return { name: index + 1, value: answer, inline:true };
	});

	return answerFields;
};


module.exports = {
	// builds embedded messages
	create: {
		quizCreationMessage: (quiz) => {

			const embed = new Discord.MessageEmbed()
				.setColor('#1aff66')
				.setTitle('Quiz Creation Complete!')
				.setDescription('Your quiz has been succesfully set up!')
				.addFields(
					{ name: 'Max Players', value: quiz.maxPlayers, inline: true },
					{ name: 'Question Count', value: quiz.questionCount, inline:true },
				)
				.addFields(
					{ name: 'How to join?', value: `Players can join by typing ${config.prefix}join in chat!` },
					{ name: 'How to cancel?', value: `The host can cancel the quiz during setup by tying ${config.prefix}cancel in chat.` },
				);

			return embed;
		},
		questionMessage: (number, question, answers) => {
			// validate input -- move to new file?
			if(number === undefined || question === undefined || answers === undefined) throw Error('One or more of the arguments is empty');
			if(typeof number != 'number' || typeof question != 'string' || typeof answers != 'object') throw TypeError('invalid type inputted');

			const answerFields = generateAnswerList(answers);

			const embed = new Discord.MessageEmbed()
				.setColor('#4fc7e8')
				.setTitle(`Question ${number}`)
				.setDescription(question)
				.addFields(answerFields);
			return embed;
		},
		helpMessage: () => 1,
		// players array from quiz
		lobbyMessage: (players, maxPlayers) => {

			const lobbyField = generateLobbyField(players, maxPlayers);

			const embed = new Discord.MessageEmbed()
				.setColor('#dbe043')
				.setTitle('Quiz Lobby')
				.setDescription('Players who have joined the quiz.')
				.addField(lobbyField.name, lobbyField.value);

			return embed;
		},
	},
	edit : {
		updateLobby: (msg, players, maxPlayers) => {

			console.log(`[${Object.values(players).length}] - ${Object.values(players)}`);

			const newLobbyEmbed = module.exports.create.lobbyMessage(players, maxPlayers);


			msg.edit({ embeds: [newLobbyEmbed] })
				.then(() => console.log('Lobby message updated'))
				.catch(() => console.error);
		},
	},
};