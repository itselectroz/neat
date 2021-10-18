class Node {
	constructor(id, type) {
		this.id = id;
		this.type = type;
		// 0 = input
		// 1 = bias
		// 2 = hidden
		// 3 = output
	}

	clone() {
		return new this.constructor(this.id, this.type);
	}
}
