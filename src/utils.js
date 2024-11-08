export function mix(v0, v1, t) {
	return v0 * (1 - t) + v1 * t;
}

export function mixObjects(obj0, obj1, t) {
	const result = {...obj0};
	if (Array.isArray(obj0)) return obj0.map((v, i) => mix(v, obj1[i], t));
	for (const k in obj1) {
		const from = obj0[k];
		result[k] = (from && typeof from == 'object'? mixObjects : mix)(from, obj1[k], t);
	}
	return result;
}
