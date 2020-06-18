module.exports = {
	name: 'reload',
	description: 'reloads the functionality of a given command',
	dev:true,
	args: true,
	execute(message, args) {
		if(!args.length) {
			return message.reply('You need to pass a command in to reload!');
		} else {
			const commandName = args.shift().toLowerCase();
			const command = message.client.commands.get(commandName)
				|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
			if(!command) {
				message.reply('There is no command with that name of alias. Please try again.');
			} else {
				delete require.cache[require.resolve(`./${command.name}.js`)];
				try {
					const newCommand = require(`./${command.name}.js`);
					message.client.commands.set(newCommand.name, newCommand);
					message.channel.send(`The command '${newCommand.name} was reload!`);
				} catch (error) {
					console.log(error);
					message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
				}
			}
		}
	},
};