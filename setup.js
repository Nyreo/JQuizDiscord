'use strict';

const fs = require('fs');
const { Collection } = require('discord.js');

const loadCommands = (commandsDir) => {
	const commands = new Collection();
	const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('js'));

	for (const file of commandFiles) {
		const command = require(`${commandsDir}/${file}`);

		commands.set(command.name, command);
	}

	console.log(`identified ${commands.size} command(s)...`);

	return commands;
};

module.exports = {
	loadCommands,
};