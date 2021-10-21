import { Node } from './node';

export class Connection {
    inputNode: Node;
    outputNode: Node;

    enabled: boolean;
    weight: number;

    constructor(inputNode: Node, outputNode: Node, enabled: boolean, weight: number) {
        this.inputNode = inputNode;
        this.outputNode = outputNode;

        this.enabled = enabled;
        this.weight = weight;
    }
}