function makeNetwork(nodes, cons) {
	let network = new Network();
	
	for(let i = 0; i < cons.length; i++) {
		let conn = cons[i];
		conn.in = nodes[conn.in];
		conn.out = nodes[conn.out];
		network.addConnection(conn);
	}

	return network;
}

function setup() {
	console.clear();
	createCanvas(windowWidth, windowHeight);

	let network = makeNetwork([
		new Node(1, 0),
		new Node(2, 0),
		new Node(3, 2),
		new Node(4, 3)
	], [
		new ConnectionGene(0, 2,   0.5, true, 1),
		new ConnectionGene(1, 2,   0.35, true, 2),
		new ConnectionGene(2, 3,   1, true, 3)
	]);

	let network2 = makeNetwork([
		new Node(1, 0),
		new Node(2, 0),
		new Node(3, 2),
		new Node(4, 2),
		new Node(5, 3)
	], [
		new ConnectionGene(0, 2,   0.1, true, 1),
		new ConnectionGene(1, 2,   0.1, true, 2),
		new ConnectionGene(0, 3,   0.25, true, 4),
		new ConnectionGene(1, 3,   0.35, true, 5),
		new ConnectionGene(2, 4,   1, true, 3)
	]);

	// let newNetwork = Network.cross(network2, network);

	console.table(network2.clone().connections);

	network2.mutate();

	console.table(network2.connections);
	
	// newNetwork.buildNetwork();

	// console.log(newNetwork.feedForward([1,2]))
}

function draw() {
	
}