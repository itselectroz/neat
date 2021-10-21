import { Connection, Node } from "../../src/model";

describe('model/connection.ts', () => {
    describe('Connection', () => {
        it('should initiate', () => {
            const inputNode = new Node(1);
            const outputNode = new Node(2);

            const connection = new Connection(inputNode, outputNode, true, 1);

            expect(connection).toBeTruthy();
        });
    });
});