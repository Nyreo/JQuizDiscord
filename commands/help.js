const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Provides the user with help executing'),
	usage: '(optional)<command name>',
	async execute(interaction) {

		await interaction.reply('Test');
		// const { commands } = message.client;
		// let command = args.shift();

		// const data = [];

		// console.log(commands.get(command));

		// if(command && commands.get(command)) {
		// 	command = commands.get(command);

		// 	data.push(` that command ${command.description}.`);

		// 	if(command.usage) data.push(`\nUsage: ${command.name} ${command.usage}`);

		// 	return message.reply(data, { split:true });
		// } else {

		// 	console.log('could not find command');
		// 	data.push('Here\'s a list of all my commands: ');
		// 	data.push(commands.map(_command => `${_command.name} -> ${_command.description}`).join('\n'));

		// 	return message.author.send(data.toString());
		// }
	},
};