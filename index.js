'use strict';

// sys
require('dotenv').config();
const log = console.log;

// custom imports
const setup = require('./setup');

// standard imports
const chalk = require('chalk');

// discord imports
const { Client } = require('discord.js');

// config imports
const { prefix, commandsDir } = require('./config.json');

// creating the client
const bot = new Client();
// loading bot commands
bot.commands = setup.loadCommands(commandsDir);

// crucial ready event, once this is complete the bot will react to events
bot.on('ready', () => {
	log(`Logged in as ${chalk.blue(bot.user.tag)}!`);
});

bot.on('message', message => {

	log(`Message Received - ${message.content} from ${chalk.underline(message.author.tag)}!`);

	if(!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(' ');
	const command = args.shift().toLowerCase();

	log(`\tCommand: ${command}\n\tArgs: ${args}`);

	if (bot.commands.get(message.content)) {
		bot.commands.get(message.content).execute(message);
	}
});

bot.login(process.env.CLIENT_TOKEN);