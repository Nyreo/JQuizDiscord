'use strict';

// sys
require('dotenv').config();

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
	console.log(`Logged in as ${chalk.blue(bot.user.tag)}!`);
	console.log(chalk.green('--------------\nREADY TO RECEIVE COMMANDS\n--------------'));
});

bot.on('message', message => {

	console.log(`Message Received - ${message.content} from ${chalk.underline(message.author.tag)}!`);

	// check if the message is meant for the bot
	if(!message.content.startsWith(prefix) || message.author.bot) return;

	// seperate message into command and arguments
	const args = message.content.slice(prefix.length).split(' ');
	const commandName = args.shift().toLowerCase();

	// check if the command exits, return otherwise
	console.log(`\tCommand: ${commandName}\n\tArgs: ${args}`);

	const command = bot.commands.get(commandName);

	if (command) {
		// check if the command needs args
		if(command.args && args.length) {
			command.execute(message, args);
		} else if(!command.args) {
			command.execute(message, args);
		} else {
			let reply = `You didn't provide any arguments, ${message.author}!`;

			if(command.usage) {
				reply += `\nAn example of that command would be ${command.name} ${command.usage}`;
			}

			return message.channel.send(reply);
		}
	} else {
		message.reply(`Sorry, that command does not exist, if you are having trouble, try the ${prefix}help commmand!`);
	}
});

bot.login(process.env.CLIENT_TOKEN);