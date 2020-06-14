module.exports = {
	name: 'help',
	description: 'provides help on the available commands',
	usage: '<command> | <command> <command> ...',
	args: true,
	execute(message, args) {
		const { commands } = message.client;
		const data = [];

		if(args) {
			const arg = args.shift();
			const command = commands.get(arg);
			
			if(command) {
				data.push(`Here's how you would use the '${command.name}' commanad ->\n\t${command.name} ${command.usage}`);
				return message.reply(data, { split:true });
			} else {
				return message.reply('I\'m sorry, that command does not exist!');
			}
		} else {
			data.push('Here\'s a list of all my commands: ');
			data.push(commands.map(command => `${command.name} -> ${command.description}`).join('\n'));

			return message.author.send(data, { split:true });
		}
	},
};