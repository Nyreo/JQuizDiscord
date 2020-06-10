module.exports = {
	name: 'ping',
	description: 'Ping!',
	args: true,
	usage: '<count>',
	execute(message) {
		message.channel.send('Pong.');
	},
};