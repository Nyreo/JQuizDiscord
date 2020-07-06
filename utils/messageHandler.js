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
				.addField('How to Join?', 'Players can now join the quiz by typing !join.');
			return embed;
		},
		questionMessage: (number, question, answers) => {

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
	},
};