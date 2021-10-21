import { Gene } from "./gene";
import { NodeGene } from "./node-gene";

export class ConnectionGene extends Gene {
    inputGene: NodeGene;
    outputGene: NodeGene;

    enabled: boolean;
    weight: number;

    constructor(innovation: number, inputGene: NodeGene, outputGene: NodeGene, enabled: boolean = true, weight?: number) {
        super(innovation);

        this.inputGene = inputGene;
        this.outputGene = outputGene;

        this.enabled = enabled;
        this.weight = weight == undefined ? Math.random() * 2 - 1 : weight;
    }

    toggleEnabled() : void {
        this.enabled = !this.enabled;
    }

    equals(other: ConnectionGene) : boolean {
        return this.inputGene.equals(other.inputGene) && this.outputGene.equals(other.outputGene);
    }
}