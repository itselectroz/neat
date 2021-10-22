import { Genome, Network } from "..";
import { ConnectionGene, NodeGene } from "../genes";

const nodeA = new NodeGene(1, 0);
const nodeB = new NodeGene(2, 1);
const genome = new Genome([
    new ConnectionGene(1, nodeA, nodeB, true, 0.5),
], [nodeA, nodeB]);

genome.new_node_mutation();

console.log(genome);