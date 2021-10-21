import { Connection, Node } from "../../src/model";

describe('model/Node.ts', () => {
    describe('Node', () => {
        let node: Node;
        beforeEach(() => {
            node = new Node(1);
        });

        it('should initiate', () => {
            expect(node).toBeTruthy();
        });

        describe('addConnection', () => {
            it('should add a connection to connections', () => {
                const connection = new Connection(new Node(2), new Node(3), true, 1);
                const connectionB = new Connection(new Node(3), new Node(4), true, 2);
                node.inputConnections = [connection];
                node.addConnection(connectionB);
                
                expect(node.inputConnections).toEqual([connection, connectionB]);
            });
        });
    });
});