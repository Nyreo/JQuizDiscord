class Quiz {
	constructor(guildId, maxPlayers, questionCount, category = 0) {
		this.guildId = guildId;
		this.maxPlayers = maxPlayers;
		this.questionCount = questionCount;
		this.category = category;

		this.players = {};

		this.questions = {};
	}
}


module.exports = {
	Quiz,
};