import { main } from "../src";

describe('index.ts', () => {
    describe('main', () => {
        it('should return 1', () => {
            const returnValue: number = main();

            expect(returnValue).toBe(1);
        });
    });
});