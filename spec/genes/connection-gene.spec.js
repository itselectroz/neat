"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var connection_gene_1 = require("../../src/genes/connection-gene");
var node_gene_1 = require("../../src/genes/node-gene");
describe('genes/connection-gene.ts', function () {
    describe('ConnectionGene', function () {
        var connectionGene;
        beforeEach(function () {
            var innovation_number = 1;
            var inputGene = new node_gene_1.NodeGene(innovation_number + 1, 1);
            var outputGene = new node_gene_1.NodeGene(innovation_number + 2, 2);
            connectionGene = new connection_gene_1.ConnectionGene(innovation_number, inputGene, outputGene);
        });
        it('should initiate', function () {
            expect(connectionGene).toBeTruthy();
        });
        describe('toggleEnabled', function () {
            it('should set enabled to false when enabled is true', function () {
                connectionGene.enabled = true;
                connectionGene.toggleEnabled();
                expect(connectionGene.enabled).toBeFalse();
            });
            it('should set enabled to true when enabled is false', function () {
                connectionGene.enabled = false;
                connectionGene.toggleEnabled();
                expect(connectionGene.enabled).toBeTrue();
            });
        });
        describe('equals', function () {
            it('should return true when the connections are equal', function () {
                var inputGene = new node_gene_1.NodeGene(1, 1);
                var outputGene = new node_gene_1.NodeGene(2, 2);
                var connectionGeneA = new connection_gene_1.ConnectionGene(3, inputGene, outputGene);
                var connectionGeneB = new connection_gene_1.ConnectionGene(4, inputGene, outputGene);
                expect(connectionGeneA.equals(connectionGeneB)).toBeTrue();
                expect(connectionGeneB.equals(connectionGeneA)).toBeTrue();
            });
            it('should return false when the input genes are not equal', function () {
                var inputGeneA = new node_gene_1.NodeGene(1, 1);
                var inputGeneB = new node_gene_1.NodeGene(5, 1.5);
                var outputGene = new node_gene_1.NodeGene(2, 2);
                var connectionGeneA = new connection_gene_1.ConnectionGene(3, inputGeneA, outputGene);
                var connectionGeneB = new connection_gene_1.ConnectionGene(4, inputGeneB, outputGene);
                expect(connectionGeneA.equals(connectionGeneB)).toBeFalse();
                expect(connectionGeneB.equals(connectionGeneA)).toBeFalse();
            });
            it('should return false when the output genes are not equal', function () {
                var inputGene = new node_gene_1.NodeGene(1, 1);
                var outputGeneA = new node_gene_1.NodeGene(2, 2);
                var outputGeneB = new node_gene_1.NodeGene(5, 2);
                var connectionGeneA = new connection_gene_1.ConnectionGene(3, inputGene, outputGeneA);
                var connectionGeneB = new connection_gene_1.ConnectionGene(4, inputGene, outputGeneB);
                expect(connectionGeneA.equals(connectionGeneB)).toBeFalse();
                expect(connectionGeneB.equals(connectionGeneA)).toBeFalse();
            });
            it('should return false when both the input and output genes are not equal', function () {
                var inputGeneA = new node_gene_1.NodeGene(1, 1);
                var inputGeneB = new node_gene_1.NodeGene(5, 1.5);
                var outputGeneA = new node_gene_1.NodeGene(2, 2);
                var outputGeneB = new node_gene_1.NodeGene(6, 2);
                var connectionGeneA = new connection_gene_1.ConnectionGene(3, inputGeneA, outputGeneA);
                var connectionGeneB = new connection_gene_1.ConnectionGene(4, inputGeneB, outputGeneB);
                expect(connectionGeneA.equals(connectionGeneB)).toBeFalse();
                expect(connectionGeneB.equals(connectionGeneA)).toBeFalse();
            });
        });
    });
});
