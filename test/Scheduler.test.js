import * as assert from 'assert';
import { Scheduler } from '../src/Scheduler.js';

describe('Scheduler', () => {
	let scheduler;

	beforeEach(() => {
		scheduler = new Scheduler();

	});
	it('initial state', () => {
	});
	it('update()', () => {
		scheduler.update(1234);
		assert.strictEqual(scheduler.now, 1234);
		scheduler.update(1300);
		assert.strictEqual(scheduler.now, 1300);
	});
	it('_scheduled', () => {
		const events = [];
		scheduler._scheduled = [{
			time: 1020,
			resolve(t) {
				events.push(['resolved', t]);
			},
		}];
		scheduler.update(700);
		assert.deepStrictEqual(events, []);
		assert.strictEqual(scheduler._scheduled.length, 1);
		scheduler.update(900);
		assert.deepStrictEqual(events, []);
		assert.strictEqual(scheduler._scheduled.length, 1);
		scheduler.update(1021);
		assert.deepStrictEqual(events, [['resolved', 1021]]);
		assert.strictEqual(scheduler._scheduled.length, 0);
	});

	it('.schedule() - automatic time0 and time based on scheduler.now and duration', () => {
		const events = [];
		scheduler.now = 1230;
		scheduler.schedule({
			duration: 300,
		});
		assert.strictEqual(scheduler._scheduled.length, 1);
		const {resolve, ...scheduled } = scheduler._scheduled[0];
		assert.deepStrictEqual(scheduled, {
			time: 1530,
			time0: 1230,
			duration: 300,
		});
	});

	it('_scheduled - continuous updating', () => {
		let events = [];
		let t = 0;
		scheduler.schedule({
			time: 2000,
			time0: 1000,
			update(t, a) {
				events.push(['update', t, a]);
			},
			resolve() {
				events.push(['resolve']);
			},
		});
		const forward = (delta) => {
			events = [];
			t += delta;
			scheduler.update(t);
		};
		forward(500);
		assert.deepStrictEqual(events, []);
		forward(500);
		assert.deepStrictEqual(events, [['update', 0, 0]]);
		forward(500);
		assert.deepStrictEqual(events, [['update', 500, 0.5]]);
		forward(500);
		assert.deepStrictEqual(events, [['update', 1000, 1], ['resolve']]);
		forward(500);
		assert.deepStrictEqual(events, []);
	});

	it('sleep', (done) => {
		scheduler.now = 69;
		scheduler.sleep(1020).then((now) => {
			assert.strictEqual(now, 1089);
			done();
		});
		assert.strictEqual(scheduler._scheduled.length, 1);
		assert.strictEqual(scheduler._scheduled[0].time, 1089);
		scheduler.update(700);
		scheduler.update(1021);
		scheduler.update(1089);
	});
});
