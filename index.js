'use strict';

// sys
const fs = require('fs');
require('dotenv').config();

// utils
const logger = require('./utils/logger');

// discord imports
const { Client, Collection, Intents } = require('discord.js');

// creating the client
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
bot.commands = new Collection();

// fetch commands file names
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// load all available commands to the bot
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module

	if(!command.data) continue;
	bot.commands.set(command.data.name, command);
}

// echo loaded commands to console
console.log('List of loaded commands:');
for(const key of bot.commands.keys()) {
	console.log(`\t${key}`);
}

// crucial ready event, once this is complete the bot will react to events
bot.on('ready', () => {
	logger.console.notification(`Logged in as ${bot.user.tag}`);
	logger.console.success('Loading succesful! Ready to receive commands.');
});

// if the user makes a request using one of the slash commands
bot.on('interactionCreate', async interaction => {

	logger.console.message(interaction.commandName, 'Received Command');
	// command is not available
	if(!interaction.isCommand) return;

	// console.log(interaction.options);

	// get command
	const command = bot.commands.get(interaction.commandName);

	// not a valid command
	if(!command) return;

	// try to execute the command
	try {
		await command.execute(interaction);
	} catch (error) {
		console.log(error);
		await interaction.reply({ context: 'There was an error handling this command', ephermal: true });
	}
});

bot.login(process.env.TOKEN);