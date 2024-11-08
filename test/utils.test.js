import * as assert from 'assert';
import { mix, mixObjects } from '../src/utils.js';

describe('interpolation', () => {
	it('mix()', () => {
		assert.strictEqual(mix(3, 7, 0), 3);
		assert.strictEqual(mix(3, 7, 0.25), 4);
		assert.strictEqual(mix(3, 7, 0.5), 5);
		assert.strictEqual(mix(3, 7, 0.75), 6);
		assert.strictEqual(mix(3, 7, 1), 7);
	});
	describe('mixObjects()', () => {
		let from, to;

		beforeEach(() => {
			from = {x: 3, y: 4, foo: 1};
			to = {x: 5, y: 7, foo: 10};
		});
		it('t = 0', () => {
			assert.deepStrictEqual(mixObjects(from, to, 0), {x: 3, y: 4, foo: 1});
		});
		it('t = 0.5', () => {
			assert.deepStrictEqual(mixObjects(from, to, 0.5), {x: 4, y: 5.5, foo: 5.5});
		});
		it('t = 1', () => {
			assert.deepStrictEqual(mixObjects(from, to, 1), {x: 5, y: 7, foo: 10});
		});
		afterEach(() => {
			assert.deepStrictEqual(from, {x: 3, y: 4, foo: 1});
			assert.deepStrictEqual(to, {x: 5, y: 7, foo: 10});
		});
	})
});
