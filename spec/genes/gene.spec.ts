import { Gene } from "../../src/genes/gene";

describe('genes/gene.ts', () => {
    describe('Gene', () => {
        it('should initiate', () => {
            const innovation_number = 1;
            const gene = new Gene(innovation_number);

            expect(gene).toBeTruthy();

            expect(gene.innovation).toEqual(innovation_number);
        });
    })
})