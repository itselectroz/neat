"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../src");
describe('index.ts', function () {
    describe('main', function () {
        it('should return 1', function () {
            var returnValue = (0, src_1.main)();
            expect(returnValue).toBe(1);
        });
    });
});
