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

        describe('activate', () => {
            it('should call the activation function with the weighted sum', () => {
                const activation_function = jasmine.createSpy('activation_function', (input: number) => 1);

                node.activation_function = activation_function;

                const exemplarNode = new Node(1);
                exemplarNode.output = 1;

                node.addConnection(new Connection(exemplarNode, node, true, 0.5));

                node.activate();

                expect(activation_function).toHaveBeenCalledWith(0.5);
            });

            it('should set the node output', () => {
                const activation_function = jasmine.createSpy('activation_function', (input: number) => 1);
                activation_function.and.returnValue(1);
                
                node.activation_function = activation_function;
                
                node.output = 0;

                node.activate();

                expect(node.output).toEqual(1);
            });
        });
    });
});