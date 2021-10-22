import { Genome, Network } from "..";
import { ConnectionGene, NodeGene } from "../genes";

const nodeA = new NodeGene(1, 0);
const nodeB = new NodeGene(2, 0);
const nodeC = new NodeGene(3, 0.5);
const nodeD = new NodeGene(4, 0.5);
const nodeE = new NodeGene(5, 0.25);
const nodeF = new NodeGene(11, 1);

const genome = new Genome([
    new ConnectionGene(6, nodeA, nodeC, true, 1),
    new ConnectionGene(7, nodeB, nodeC, true, 1),
    new ConnectionGene(8, nodeA, nodeE, true, 1),
    new ConnectionGene(9, nodeB, nodeE, true, 1),
    new ConnectionGene(10, nodeE, nodeD, true, 1),
    new ConnectionGene(12, nodeC, nodeF, true, 1),
    new ConnectionGene(13, nodeD, nodeF, true, 1),
], [nodeA, nodeB, nodeC, nodeD, nodeE, nodeF]);

const network = Network.buildNetwork(genome);

console.log(network.feedForward([0.5, 0.2]));