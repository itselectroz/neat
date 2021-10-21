import { NodeGene } from "../../src/genes/node-gene";

describe('genes/node-gene.ts', () => {
    describe('NodeGene', () => {
        it('should initiate', () => {
            const innovation_number = 1;
            const level = 2;
            const nodeGene = new NodeGene(innovation_number, level);

            expect(nodeGene).toBeTruthy();

            expect(nodeGene.innovation).toEqual(innovation_number);
            expect(nodeGene.level).toEqual(level);
        });

        describe('equals', () => {
            it('should return true when the node genes are equal', () => {
                const nodeGeneA = new NodeGene(1, 1);
                const nodeGeneB = new NodeGene(1, 1);

                expect(nodeGeneA.equals(nodeGeneB)).toBeTrue();
                expect(nodeGeneB.equals(nodeGeneA)).toBeTrue();
            });

            it('should return false when the node genes are not equal' ,() => {
                const nodeGeneA = new NodeGene(1, 1);
                const nodeGeneB = new NodeGene(2, 1);

                expect(nodeGeneA.equals(nodeGeneB)).toBeFalse();
                expect(nodeGeneB.equals(nodeGeneA)).toBeFalse();
            });
        });
    });
});