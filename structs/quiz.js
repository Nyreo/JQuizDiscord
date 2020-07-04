class Quiz {
	constructor(guildId, maxPlayers, questionCount, category = 0) {
		this.guildId = guildId;
		this.maxPlayers = maxPlayers;
		this.questionCount = questionCount;
		this.category = category;

		this.players = {};

		this.questions = {};
	}

	playerExists(playerId) {
		if(this.players[playerId]) return true;
		return false;
	}

	addPlayer(playerId, isHost = false) {
		if(Object.keys(this.players).length >= this.maxPlayers) return false;

		this.players[playerId] = { score: 0, isHost };
		return true;
	}
}


module.exports = {
	Quiz,
};