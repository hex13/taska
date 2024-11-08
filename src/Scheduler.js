export class Scheduler {

	_scheduled = [];
	now = 0;
	lastUpdate = 0;

	update(now) {
		this.now = now;

		this._scheduled = this._scheduled.filter(scheduled => {
			if (Object.hasOwn(scheduled, 'time0')) {
				if (this.now >= scheduled.time0) {
					const relT = now - scheduled.time0;
					scheduled.update && scheduled.update(relT, relT / (scheduled.time - scheduled.time0));
				}
			}
			if (this.now < scheduled.time) return true;
			scheduled.resolve && scheduled.resolve(this.now);
			return false;
		});
		this.lastUpdate = now;
	}
	schedule(scheduled) {
		const time0 = scheduled.time0 == undefined? this.now : scheduled.time0;
		const time = scheduled.duration? time0 + scheduled.duration : scheduled.time;

		let resolve;
		const promise = new Promise(r => {
			resolve = r;
		});

		this._scheduled.push({
			...scheduled,
			time0,
			time,
			resolve: () => {
				resolve(this.now);
				scheduled.resolve && scheduled.resolve(this.now);
			},
		});
		return promise;
	}
	sleep(duration) {
		return this.schedule({
			duration,
		});
	}
}