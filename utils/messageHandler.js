'use strict';

const Discord = require('discord.js');

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
					{ name: 'How to join?', value: 'Players can join by typing "joinquiz" in chat!' },
					{ name: 'How to cancel?', value: 'The host can cancel the quiz by tying "cancelquiz" in chat' },
				);

			return embed;
		},
		questionMessage: (number, question, answers) => {
			// validate input -- move to new file?
			if(number === undefined || question === undefined || answers === undefined) throw Error('One or more of the arguments is empty');
			if(typeof number != 'number' || typeof question != 'string' || typeof answers != 'object') throw TypeError('invalid type inputted');

			const answerFields = answers.map((answer, index) => {
				return { name: index + 1, value: answer, inline:true };
			});

			const embed = new Discord.MessageEmbed()
				.setColor('#4fc7e8')
				.setTitle(`Question ${number}`)
				.setDescription(question)
				.addFields(answerFields);
			return embed;
		},
		helpMessage: () => 1,
	},
};