export function mix(v0, v1, t) {
	return v0 * (1 - t) + v1 * t;
}

export function mixObjects(obj0, obj1, t) {
	const result = {};
	for (const k in obj0) {
		result[k] = mix(obj0[k], obj1[k], t);
	}
	return result;
}
