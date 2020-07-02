class Player {
	constructor(id, items, isHost = 0) {
		this.id = id;
		this.score = 0;
		this.items = items;
		this.isHost = isHost;
	}
}


module.exports = {
	Player,
};