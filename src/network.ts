import { Genome } from "./genome";
import { Connection, Node } from "./model";

export type NodeMap = {
    [innovation: number]: Node
};

export class Network {
    connections: Connection[];
    nodes: NodeMap;

    constructor(connections: Connection[] = [], nodes: NodeMap = {}) {
        this.connections = connections;
        this.nodes = nodes;
    }

    feedForward(inputs: number[]) : boolean | number[] {
        const nodes = Object.values(this.nodes);
        
        const hidden_nodes = [];
        const input_nodes = [];
        const output_nodes = [];

        for(let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if(node.level == 0) {
                input_nodes.push(node);
            }
            else if(node.level == 1) {
                output_nodes.push(node);
            }
            else {
                hidden_nodes.push(node);
            }
        }
        
        if(input_nodes.length != inputs.length) {
            return false;
        }

        hidden_nodes.sort((a, b) => a.level - b.level);

        for(let i = 0; i < input_nodes.length; i++) {
            const node = input_nodes[i];
            node.output = inputs[i];
        }

        for(let i = 0; i < hidden_nodes.length; i++) {
            hidden_nodes[i].activate();
        }

        const outputs: number[] = [];
        for(let i = 0; i < output_nodes.length; i++) {
            const node = output_nodes[i];
            node.activate();
            outputs.push(node.output);
        }
        
        return outputs;
    }

    static buildNetwork(genome: Genome) : Network {
        const nodeMap: NodeMap = {};

        for(const node of genome.nodes) {
            nodeMap[node.innovation] = new Node(node.level);
        }

        const connections: Connection[] = [];
        for(const connectionGene of genome.connections) {
            const inputNode = nodeMap[connectionGene.inputGene.innovation];
            const outputNode = nodeMap[connectionGene.outputGene.innovation];
           
            if(!inputNode) {
                throw new Error(`Connection<${connectionGene.innovation}>: Input Node with innovation ${connectionGene.inputGene.innovation} doesn't exist`);
            }

            if(!outputNode) {
                throw new Error(`Connection<${connectionGene.innovation}>: Output Node with innovation ${connectionGene.outputGene.innovation} doesn't exist`);
            }

            const connection = new Connection(inputNode, outputNode, connectionGene.enabled, connectionGene.weight);

            outputNode.addConnection(connection);
            connections.push(connection);
        }

        return new Network(connections, nodeMap)
    }
}