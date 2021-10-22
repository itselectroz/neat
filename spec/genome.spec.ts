import { Genome } from "../src/genome";
import { ConnectionGene, NodeGene } from "../src/genes";

describe('genome.ts', () => {
    describe('Genome', () => {
        it('should initiate', () => {
            const genome = new Genome([], []);

            expect(genome).toBeTruthy();
        });

        it('should sort connections', () => {
            const nodeA = new NodeGene(1, 0);
            const nodeB = new NodeGene(2, 1);
            const connectionA = new ConnectionGene(1, nodeA, nodeB, true, 1);
            const connectionB = new ConnectionGene(2, nodeA, nodeB, true, 1);
            
            const genome = new Genome([connectionB, connectionA], []);
            
            expect(genome.connections).toEqual([ connectionA, connectionB ]);
        });

        it('should sort nodes', () => {
            const nodeA = new NodeGene(1, 0);
            const nodeB = new NodeGene(2, 0);

            const genome = new Genome([], [ nodeB, nodeA ]);

            expect(genome.nodes).toEqual([ nodeA, nodeB ]);
        });

        describe('new_node_mutation', () => {
            it('should return false if connections is empty', () => {
                const genome = new Genome([], []);
                const result = genome.new_node_mutation();
                
                expect(result).toBeFalse();
            });

            it('should return false if it gets into an infinite loop', () => {
                const connection = new ConnectionGene(1, new NodeGene(1, 0), new NodeGene(2, 0), false, 1);

                const genome = new Genome([connection], []);

                const result = genome.new_node_mutation();

                expect(result).toBeFalse();
            });

            it('should disable the mutated connection', () => {
                const nodeA = new NodeGene(1, 0);
                const nodeB = new NodeGene(2, 0);

                const connection = new ConnectionGene(1, nodeA, nodeB, true, 1);

                const genome = new Genome([connection], [nodeA, nodeB]);

                genome.new_node_mutation();

                expect(connection.enabled).toBeFalse();
            });

            it('should create a new node', () => {
                const nodeA = new NodeGene(1, 0);
                const nodeB = new NodeGene(2, 0);

                const connection = new ConnectionGene(1, nodeA, nodeB, true, 1);

                const genome = new Genome([connection], [nodeA, nodeB]);

                genome.new_node_mutation();

                expect(genome.nodes.length).toBe(3);
            });

            it('should give the new node the correct innovation number', () => {
                const nodeA = new NodeGene(1, 0);
                const nodeB = new NodeGene(2, 0);
                const nodeC = new NodeGene(3, 0);

                const connection = new ConnectionGene(1, nodeA, nodeB, true, 1);

                const genome = new Genome([connection], [nodeA, nodeB, nodeC]);

                genome.new_node_mutation();

                const newNode = genome.nodes[genome.nodes.length - 1];
                expect(newNode.innovation).toBe(4);
            });

            it('should give the new node the correct level', () => {
                const nodeA = new NodeGene(1, 0);
                const nodeB = new NodeGene(2, 1);

                const connection = new ConnectionGene(1, nodeA, nodeB, true, 1);

                const genome = new Genome([connection], [nodeA, nodeB]);

                genome.new_node_mutation();

                const newNode = genome.nodes[genome.nodes.length - 1];
                expect(newNode.level).toBe(0.5);
            });

            it('should make two new connections', () => {
                const nodeA = new NodeGene(1, 0);
                const nodeB = new NodeGene(2, 1);

                const connection = new ConnectionGene(1, nodeA, nodeB, true, 1);

                const genome = new Genome([connection], [nodeA, nodeB]);

                genome.new_node_mutation();

                expect(genome.connections.length).toBe(3);
            });

            it('should set the first new connection\'s weight to 1', () => {
                const nodeA = new NodeGene(1, 0);
                const nodeB = new NodeGene(2, 1);

                const connection = new ConnectionGene(1, nodeA, nodeB, true, 0.25);

                const genome = new Genome([connection], [nodeA, nodeB]);

                genome.new_node_mutation();
                
                const newConnection = genome.connections[genome.connections.length - 2];
                expect(newConnection.weight).toBe(1);
            });

            it('should set the second new connection\'s weight to the original connection\'s weight', () => {
                const nodeA = new NodeGene(1, 0);
                const nodeB = new NodeGene(2, 1);

                const connection = new ConnectionGene(1, nodeA, nodeB, true, 0.25);

                const genome = new Genome([connection], [nodeA, nodeB]);

                genome.new_node_mutation();

                const newConnection = genome.connections[genome.connections.length - 1];
                expect(newConnection.weight).toBe(0.25);
            });

            it('should correctly set the new connections\' innovation numbers', () => {
                const nodeA = new NodeGene(1, 0);
                const nodeB = new NodeGene(2, 1);

                const connection = new ConnectionGene(1, nodeA, nodeB, true, 0.25);

                const genome = new Genome([connection], [nodeA, nodeB]);

                genome.new_node_mutation();

                const newConnectionA = genome.connections[genome.connections.length - 2];
                const newConnectionB = genome.connections[genome.connections.length - 1];

                expect(newConnectionA.innovation).toEqual(2);
                expect(newConnectionB.innovation).toEqual(3);
            });
        });
    });
});