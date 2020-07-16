module.exports = {
	name: 'help',
	description: 'provides help on the available commands',
	usage: '(optional)<command name>',
	execute(message, args) {
		const { commands } = message.client;
		let command = args.shift();

		const data = [];

		if(command && commands.get(command)) {
			command = commands.get(command);

			data.push(` that command ${command.description}.`);

			if(command.usage) data.push(`\nUsage: ${command.name} ${command.usage}`);

			return message.reply(data, { split:true });
		} else {
			data.push('Here\'s a list of all my commands: ');
			data.push(commands.map(command => `${command.name} -> ${command.description}`).join('\n'));

			return message.author.send(data, { split:true });
		}
	},
};