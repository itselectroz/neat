import { ConnectionGene, NodeGene } from '../src/genes';
import { Genome } from '../src/genome';
import { Network } from '../src/network';

describe('network.ts', () => {
    describe('Network', () => {
        it('should initiate', () => {
            const network = new Network([], {});

            expect(network).toBeTruthy();
        });

        describe('buildNetwork', () => {
            it('should create an empty network from an empty genome', () => {
                const emptyGenome = new Genome([], []);

                const emptyNetwork = Network.buildNetwork(emptyGenome);

                expect(emptyNetwork.connections.length).toEqual(0);
                expect(emptyNetwork.nodes).toEqual({});
            });

            it('should correctly map the nodes array to a map', () => {
                const nodeA = new NodeGene(1, 0);
                const nodeB = new NodeGene(2, 1);

                const genome = new Genome([], [nodeA, nodeB]);

                const network = Network.buildNetwork(genome);

                expect(network.nodes[1].level).toEqual(0);
                expect(network.nodes[2].level).toEqual(1);
            });

            it('should correctly add all connections from the genome to the network', () => {
                const nodeA = new NodeGene(1, 0);
                const nodeB = new NodeGene(2, 0.5);
                const nodeC = new NodeGene(3, 1);

                const connection = new ConnectionGene(1, nodeA, nodeB, true, 0.25);
                const connectionB = new ConnectionGene(2, nodeB, nodeC, true, 0.75);

                const genome = new Genome([connection, connectionB], [nodeA, nodeB, nodeC]);

                const network = Network.buildNetwork(genome);

                expect(network.connections.length).toEqual(2);
            });

            it('should correctly create the new connection', () => {
                const nodeA = new NodeGene(1, 0);
                const nodeB = new NodeGene(3, 1);

                const connection = new ConnectionGene(1, nodeA, nodeB, false, 0.25);

                const genome = new Genome([connection], [nodeA, nodeB]);

                const network = Network.buildNetwork(genome);

                expect(network.connections.length).toBeGreaterThan(0);

                const newConnection = network.connections[0];

                // This should probably be split up into multiple tests...
                expect(newConnection.enabled).toBeFalse();
                expect(newConnection.weight).toEqual(0.25);
                expect(newConnection.inputNode.level).toEqual(0);
                expect(newConnection.outputNode.level).toEqual(1);
            });

            it('should add the connection to the output node', () => {
                const nodeA = new NodeGene(1, 0);
                const nodeB = new NodeGene(2, 1);

                const connection = new ConnectionGene(1, nodeA, nodeB, true, 0.25);

                const genome = new Genome([connection], [nodeA, nodeB]);

                const network = Network.buildNetwork(genome);

                const outputNode = network.nodes[2];

                expect(outputNode.inputConnections.length).toEqual(1);
            });

            it('should error if the input node doesn\'t exist', () => {
                const nodeA = new NodeGene(1, 0);
                const nodeB = new NodeGene(2, 1);

                const connection = new ConnectionGene(1, nodeA, nodeB, true, 0.25);

                const genome = new Genome([connection], [nodeB]);

                let error: any;
                try {
                    Network.buildNetwork(genome);
                }
                catch(e) {
                    error = e;
                }

                expect(error).toBeTruthy();
            });

            it('should error if the output node doesn\'t exist', () => {
                const nodeA = new NodeGene(1, 0);
                const nodeB = new NodeGene(2, 1);

                const connection = new ConnectionGene(1, nodeA, nodeB, true, 0.25);

                const genome = new Genome([connection], [nodeA]);

                let error: any;
                try {
                    Network.buildNetwork(genome);
                }
                catch(e) {
                    error = e;
                }

                expect(error).toBeTruthy();
            });
        });

        describe('feedForward', () => {
            it('should return false if the number of inputs do not match the input nodes', () => {
                const nodeA = new NodeGene(1, 0);
                const nodeB = new NodeGene(2, 1);

                const connection = new ConnectionGene(1, nodeA, nodeB, true, 0.25);

                const genome = new Genome([connection], [ nodeA, nodeB ]);

                const network = Network.buildNetwork(genome);

                const result = network.feedForward([1, 2]);

                expect(result).toBeFalse();
            });

            it('should set the outputs of all input nodes to correspond with the input array', () => {
                const nodeA = new NodeGene(1, 0);
                const nodeB = new NodeGene(2, 0);
                const nodeC = new NodeGene(3, 1);

                const connectionA = new ConnectionGene(1, nodeA, nodeC, true, 1);
                const connectionB = new ConnectionGene(2, nodeB, nodeC, true, 1);

                const genome = new Genome([ connectionA, connectionB ], [ nodeA, nodeB, nodeC ]);

                const network = Network.buildNetwork(genome);

                network.feedForward([1, 2]);

                const actualNodeA = network.nodes[1];
                const actualNodeB = network.nodes[2];

                expect(actualNodeA.output).toEqual(1);
                expect(actualNodeB.output).toEqual(2);
            });

            it('should set the outputs of all hidden nodes', () => {
                const nodeA = new NodeGene(1, 0);
                const nodeB = new NodeGene(2, 0.5);
                const nodeC = new NodeGene(3, 1);

                const connectionA = new ConnectionGene(1, nodeA, nodeB, true, 0.5);
                const connectionB = new ConnectionGene(2, nodeB, nodeC, true, 1);

                const genome = new Genome([ connectionA, connectionB ], [ nodeA, nodeB, nodeC ]);

                const network = Network.buildNetwork(genome);

                network.feedForward([1]);

                const hiddenNode = network.nodes[2];
                expect(hiddenNode.output).toEqual(0.6224593312018546);
            });

            it('should return the outputs of the output nodes', () => {
                const nodeA = new NodeGene(1, 0);
                const nodeB = new NodeGene(2, 0.5);
                const nodeC = new NodeGene(3, 1);

                const connectionA = new ConnectionGene(1, nodeA, nodeB, true, 0.5);
                const connectionB = new ConnectionGene(2, nodeB, nodeC, true, 1);

                const genome = new Genome([ connectionA, connectionB ], [ nodeA, nodeB, nodeC ]);

                const network = Network.buildNetwork(genome);

                const results = network.feedForward([1]);

                const outputNode = network.nodes[3];
                expect(results).toEqual([ outputNode.output ]);
            });
        });
    });
});