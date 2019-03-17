'use strict';

const {describe, it} = require('mocha');
const {assert} = require('chai');

const {formVariants, arrWithoutElement} = require('../utils');

describe('Substitution of n elements', () => {
    before(async function() {
    });

    after(async function() {
    });

    describe('Element removal', () => {
        it('should remove first elem from array', async () => {
            const arr = [1, 2, 3, 4, 5];
            assert.deepEqual(arrWithoutElement(arr, 1), [2, 3, 4, 5]);
        });

        it('should remove middle elem from array', async () => {
            const arr = [1, 2, 3, 4, 5];
            assert.deepEqual(arrWithoutElement(arr, 3), [1, 2, 4, 5]);
        });

        it('should remove last elem from array', async () => {
            const arr = [1, 2, 3, 4, 5];
            assert.deepEqual(arrWithoutElement(arr, 5), [1, 2, 3, 4]);
        });
    });

    describe('Creating of variants', () => {
        it('should pass for array of length 1', async () => {
            const arrOfArrVariants = formVariants([0]);
            assert.deepEqual(arrOfArrVariants[0], [0]);
        });

        it('should pass for array of length 2', async () => {
            const arrOfArrVariants = formVariants([0, 1]);
            assert.deepEqual(arrOfArrVariants, [[0, 1], [1, 0]]);
        });

        it('should pass for array of length 3', async () => {
            const arrOfArrVariants = formVariants([0, 1, 2]);
            assert.deepEqual(arrOfArrVariants, [
                [0, 1, 2], [0, 2, 1],
                [1, 0, 2], [1, 2, 0],
                [2, 0, 1], [2, 1, 0]]
            );
        });

        it('should generate array from length', async () => {
            const arrOfArrVariants = formVariants(undefined, 3);
            assert.deepEqual(arrOfArrVariants, [
                [0, 1, 2], [0, 2, 1],
                [1, 0, 2], [1, 2, 0],
                [2, 0, 1], [2, 1, 0]]
            );
        });
    });
});
