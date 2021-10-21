import { Connection } from "./connection";

export class Node {
    level: number;

    output: number;
    inputConnections: Connection[];

    constructor(level: number) {
        this.level = level;

        this.output = 0;
        this.inputConnections = [];
    }
    
    addConnection(connection: Connection) : void {
        this.inputConnections.push(connection);
    }
}