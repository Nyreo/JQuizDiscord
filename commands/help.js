module.exports = {
	name: 'help',
	description: 'provides help on the available commands',
	execute(message, args) {
		const { commands } = message.client;
		let command = args.shift();

		const data = [];

		console.log(command);
		console.log(commands);

		if(command && commands.get(command)) {
			command = commands.get(command);

			data.push('Info on that command:');
			data.push(command.description);

			if(command.usage) data.push(command.usage);

			return message.reply(data, { split:true });
		} else {
			data.push('Here\'s a list of all my commands: ');
			data.push(commands.map(command => `${command.name} -> ${command.description}`).join('\n'));

			return message.author.send(data, { split:true });
		}
	},
};