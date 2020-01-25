class Genome {
    constructor() {
        this.connections = [];
        this.nodes = [];
    }

    addConnection(conn) {
        this.connections.push(conn);
        this.connections.sort((a, b) => (a.innovation > b.innovation));

        if(!this.nodes.find((x) => (x.id == conn.in.id))) {
            this.addNode(conn.in);
        }
        if(!this.nodes.find((x) => (x.id == conn.out.id))) {
            this.addNode(conn.out);
        }
    }

    addNode(node) {
        this.nodes.push(node);
        this.nodes.sort((a,b) => (a.id > b.id));
    }

    clone() {
        let genome = new this.constructor();
        for(let i = 0; i < this.connections.length; i++) {
            genome.addConnection(this.connections[i].clone());
        }

        for(let i = 0; i < this.nodes.length; i++) {
            genome.addNode(this.nodes[i].clone());
        }

        return genome;
    }

}