import { sleep } from './sleep.js';

const NEXT = Symbol('next');
const maxIterations = 10000;

export function unwrap(x) {
    return x.value;
}

function toAwaitable(value) {
    return value;
}

export function next(value) {
    return { type: NEXT, value };
}

export async function* run(genFn, untilPromise) {

    let iterations = 0;
    const task = genFn(next);

    let result;
    let ended = false;
    let resolvedValue;
    if (untilPromise) {
        untilPromise.then(() => {
            ended = true;
        });
    }
    do {
        result = await task.next(resolvedValue);
        iterations += 1;
        if (iterations > maxIterations) {
            iterations = 0;
            await sleep(10);
        }
        if (result.value && result.value.type == NEXT) {
            yield result.value;
        }
        resolvedValue = await toAwaitable(result.value);

    } while (!ended && !result.done)
}


export async function* loop(genFn, untilPromise) {
    let ended = false;
    if (untilPromise) {
        untilPromise.then(() => {
            ended = true;
        });
    }

    while (!ended) {
        yield *run(genFn, untilPromise);
    }
}