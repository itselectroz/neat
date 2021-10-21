import { ConnectionGene } from "../../src/genes/connection-gene";
import { NodeGene } from "../../src/genes/node-gene";

describe('genes/connection-gene.ts', () => {
    describe('ConnectionGene', () => {
        let connectionGene: ConnectionGene;

        beforeEach(() => {
            const innovation_number = 1;
            const inputGene = new NodeGene(innovation_number + 1, 1);
            const outputGene = new NodeGene(innovation_number + 2, 2);
            connectionGene = new ConnectionGene(innovation_number, inputGene, outputGene);
        })

        it('should initiate', () => {
            expect(connectionGene).toBeTruthy();
        });
        

        describe('toggleEnabled', () => {
            it('should set enabled to false when enabled is true', () => {
                connectionGene.enabled = true;
                connectionGene.toggleEnabled();

                expect(connectionGene.enabled).toBeFalse();
            });

            it('should set enabled to true when enabled is false', () => {
                connectionGene.enabled = false;
                connectionGene.toggleEnabled();

                expect(connectionGene.enabled).toBeTrue();
            });
        });

        describe('equals', () => {
            it('should return true when the connections are equal', () => {
                const inputGene = new NodeGene(1, 1);
                const outputGene = new NodeGene(2, 2);
                const connectionGeneA = new ConnectionGene(3, inputGene, outputGene);
                const connectionGeneB = new ConnectionGene(4, inputGene, outputGene);

                expect(connectionGeneA.equals(connectionGeneB)).toBeTrue();
                expect(connectionGeneB.equals(connectionGeneA)).toBeTrue();
            });

            it('should return false when the input genes are not equal', () => {
                const inputGeneA = new NodeGene(1, 1);
                const inputGeneB = new NodeGene(5, 1.5);
                const outputGene = new NodeGene(2, 2);
                const connectionGeneA = new ConnectionGene(3, inputGeneA, outputGene);
                const connectionGeneB = new ConnectionGene(4, inputGeneB, outputGene);

                expect(connectionGeneA.equals(connectionGeneB)).toBeFalse();
                expect(connectionGeneB.equals(connectionGeneA)).toBeFalse();
            });

            it('should return false when the output genes are not equal', () => {
                const inputGene = new NodeGene(1, 1);
                const outputGeneA = new NodeGene(2, 2);
                const outputGeneB = new NodeGene(5, 2);
                const connectionGeneA = new ConnectionGene(3, inputGene, outputGeneA);
                const connectionGeneB = new ConnectionGene(4, inputGene, outputGeneB);

                expect(connectionGeneA.equals(connectionGeneB)).toBeFalse();
                expect(connectionGeneB.equals(connectionGeneA)).toBeFalse();
            });

            it('should return false when both the input and output genes are not equal', () => {
                const inputGeneA = new NodeGene(1, 1);
                const inputGeneB = new NodeGene(5, 1.5);
                const outputGeneA = new NodeGene(2, 2);
                const outputGeneB = new NodeGene(6, 2);
                const connectionGeneA = new ConnectionGene(3, inputGeneA, outputGeneA);
                const connectionGeneB = new ConnectionGene(4, inputGeneB, outputGeneB);

                expect(connectionGeneA.equals(connectionGeneB)).toBeFalse();
                expect(connectionGeneB.equals(connectionGeneA)).toBeFalse();
            });
        });
    });
});