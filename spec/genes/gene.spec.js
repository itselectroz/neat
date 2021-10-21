"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gene_1 = require("../../src/genes/gene");
describe('genes/gene.ts', function () {
    describe('Gene', function () {
        it('should initiate', function () {
            var innovation_number = 1;
            var gene = new gene_1.Gene(innovation_number);
            expect(gene).toBeTruthy();
            expect(gene.innovation).toEqual(innovation_number);
        });
    });
});
