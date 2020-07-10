'use strict';

// sys
require('dotenv').config();

// setup
const setup = require('./setup');

// utils
const logger = require('./utils/logger');

// discord imports
const { Client } = require('discord.js');

// config imports
const { prefix, commandsDir } = require('./config.json');

// creating the client
const bot = new Client();

// loading bot commands
bot.commands = setup.loadCommands(commandsDir);

// TODO:
// add alias inclusion for command selection !med!

// crucial ready event, once this is complete the bot will react to events
bot.on('ready', () => {
	logger.console.notification(`Logged in as ${bot.user.tag}`);
	logger.console.success('Loading succesful! Ready to receive commands.');
});

bot.on('message', message => {

	// console.log(`Message Received - ${message.content} from ${chalk.underline(message.author.tag)}!`);
	logger.console.message(message.content, message.author.tag);
	// check if the message is meant for the bot
	if(!message.content.startsWith(prefix) || message.author.bot) return;

	// seperate message into command and arguments
	const args = message.content.slice(prefix.length).split(' ');
	const commandRequest = args.shift().toLowerCase();

	// check if the command exits, return otherwise
	// console.log(`\tCommand: ${commandRequest}\n\tArgs: ${args}`);

	const command = bot.commands.get(commandRequest);

	if (command) {
		// check if the command needs args
		if(command.args && args.length) {
			command.execute(message, args);
		} else if(!command.args) {
			command.execute(message, args);
		}
	}
});

bot.login(process.env.CLIENT_TOKEN);