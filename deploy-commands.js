'use strict';

/*
	Deploys the command schema to the discord server
		- guild specific deployment
*/

require('dotenv').config();

const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

// config require
const { commandsDir } = require('./config.json');

// utils
const logger = require('./utils/logger');

// array init and file retrieval
const commands = [];
const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
	const command = require(`${commandsDir}/${file}`);

	if(!command.data) continue;

	commands.push(command.data.toJSON());
}

// list commands
logger.console.success(commands);

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

(async () => {
	try {
		await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
			{ body: commands },
		);

		console.log('Successfully registered application commands.');
	} catch (error) {
		console.error(error);
	}
})();