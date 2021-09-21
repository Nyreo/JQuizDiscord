const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Provides the user with help executing')
		.addSubcommand(subcommand =>
			subcommand
				.setName('general')
				.setDescription('receive a dm with general help and a list of available commands.')
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('specific')
				.setDescription('Request help with a specific command!')
				.addStringOption(option =>
					option
						.setName('request')
						.setDescription('The command you are requesting help for.'),
				),
		),
	async execute(interaction) {
		// fetch bot commands
		const { commands } = interaction.client;

		// check if request command was provided
		const reqCommand = interaction.options.getString('request');
		if(!reqCommand) {
			// general help
			interaction.user.send('test');

			interaction.reply({ content: 'Help sent to your dms!', ephermal: true });
		} else {
			// specific help
			const command = commands.get(reqCommand);
			if(!command) {
				await interaction.reply({ content: 'That command does not exist.', ephermal: true });
			}
			await interaction.reply({ content: `You are asking for help with the '${reqCommand}' command. Here is the command usage: ${command.data.description}` });
		}
	},
};