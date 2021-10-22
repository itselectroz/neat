import { sigmoid } from "../util/activation-functions";
import { Connection } from "./connection";

export class Node {
    level: number;

    output: number;
    inputConnections: Connection[];

    activation_function: (input: number) => number = sigmoid;

    constructor(level: number) {
        this.level = level;

        this.output = 0;
        this.inputConnections = [];
    }
    
    addConnection(connection: Connection) : void {
        this.inputConnections.push(connection);
    }

    activate() : void {
        let sum = 0;
        for(let i = 0; i < this.inputConnections.length; i++) {
            const connection = this.inputConnections[i];
            if(connection.enabled) {
                sum += connection.inputNode.output * connection.weight;
            }
        }
        this.output = this.activation_function(sum);
    }
}