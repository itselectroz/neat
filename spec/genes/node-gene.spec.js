"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_gene_1 = require("../../src/genes/node-gene");
describe('genes/node-gene.ts', function () {
    describe('NodeGene', function () {
        it('should initiate', function () {
            var innovation_number = 1;
            var level = 2;
            var nodeGene = new node_gene_1.NodeGene(innovation_number, level);
            expect(nodeGene).toBeTruthy();
            expect(nodeGene.innovation).toEqual(innovation_number);
            expect(nodeGene.level).toEqual(level);
        });
        describe('equals', function () {
            it('should return true when the node genes are equal', function () {
                var nodeGeneA = new node_gene_1.NodeGene(1, 1);
                var nodeGeneB = new node_gene_1.NodeGene(1, 1);
                expect(nodeGeneA.equals(nodeGeneB)).toBeTrue();
                expect(nodeGeneB.equals(nodeGeneA)).toBeTrue();
            });
            it('should return false when the node genes are not equal', function () {
                var nodeGeneA = new node_gene_1.NodeGene(1, 1);
                var nodeGeneB = new node_gene_1.NodeGene(2, 1);
                expect(nodeGeneA.equals(nodeGeneB)).toBeFalse();
                expect(nodeGeneB.equals(nodeGeneA)).toBeFalse();
            });
        });
    });
});
