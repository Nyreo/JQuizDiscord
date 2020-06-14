module.exports = {
	name: 'help',
	description: 'provides help on the available commands',
	execute(message) {
		const { commands } = message.client;
		const data = [];

		data.push('Here\'s a list of all my commands: ');
		data.push(commands.map(command => `${command.name} -> ${command.description}`).join('\n'));

		return message.author.send(data, { split:true });
	},
};