class Quiz {
	constructor(guildId, maxPlayers, questionCount, category = 0) {
		this.guildId = guildId;
		this.maxPlayers = maxPlayers;
		this.questionCount = questionCount;
		this.category = category;

		this.players = {};

		this.questions = {};
	}

	addPlayer(player) {
		if(Object.keys(this.players).length >= this.maxPlayers) return false;

		this.players[player.id] = player;
		return true;
	}
}


module.exports = {
	Quiz,
};