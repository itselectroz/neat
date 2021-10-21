import { Gene } from "./gene";

export class NodeGene extends Gene {
    level: number;

    constructor(innovation: number, level: number) {
        super(innovation);
        this.level = level;
    }

    equals(other: NodeGene) : boolean {
        return other.innovation == this.innovation;
    }
}