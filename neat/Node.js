class Node {
	constructor(id, type) {
		this.id = id;
		this.type = type;
	}

	clone() {
		return new this.constructor(this.id, this.type);
	}
}
