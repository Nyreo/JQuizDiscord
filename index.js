'use strict'

require('dotenv').config()

// fs
const fs = require('fs')

// terminal commands
const chalk = require('chalk')
const log = console.log

// discord imports
const {Client, MessageEmbed, Collection} = require('discord.js')

// creating the client
const bot = new Client()
bot.commands = new Collection()

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('js'))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)

  bot.commands.set(command.name, command)
}

log(bot.commands)

// crucial ready event, once this is complete the bot will react to events
bot.on("ready", () => {
  console.log(`Logged in as ${chalk.blue(bot.user.tag)}!`)
})

bot.on('message', message => {

  log(`Message Received - ${message.content} from ${chalk.underline(message.author.tag)}!`)

  if(bot.commands.get(message.content)) {
    bot.commands.get(message.content).execute(message)
  }
});

bot.login(process.env.CLIENT_TOKEN)