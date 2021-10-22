import { ConnectionGene, NodeGene } from "./genes";

export class Genome {
    connections: ConnectionGene[];
    nodes: NodeGene[]; // May potentially want to change this to an object in the future, so we can reference a node by it's id

    constructor(connections: ConnectionGene[] = [], nodes: NodeGene[] = []) {
        this.connections = connections;
        this.nodes = nodes;

        this.connections.sort((a, b) => a.innovation - b.innovation);
        this.nodes.sort((a, b) => a.innovation - b.innovation);
    }

    new_node_mutation() : boolean {
        if(this.connections.length == 0) {
            return false;
        }
        let connection: ConnectionGene | null = null;
        let count = 0;
        while(!connection || !connection.enabled) {
            if(count++ >= 20) {
                break;
            }
            
            connection = this.connections[Math.floor(Math.random() * this.connections.length)];
        }

        if(!connection || !connection.enabled) {
            return false;
        }

        connection.enabled = false;
        
        const latestNode = this.nodes[this.nodes.length - 1];
        const newNode = new NodeGene(latestNode.innovation + 1, (connection.inputGene.level + connection.outputGene.level) / 2);

        this.nodes.push(newNode);

        const latestConnection = this.connections[this.connections.length - 1];
        const newConnectionA = new ConnectionGene(latestConnection.innovation + 1, connection.inputGene, newNode, true, 1);
        const newConnectionB = new ConnectionGene(latestConnection.innovation + 2, newNode, connection.outputGene, true, connection.weight);

        this.connections.push(newConnectionA);
        this.connections.push(newConnectionB);

        return true;
    }
}