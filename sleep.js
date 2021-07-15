export const sleep = duration => new Promise(resolve => {
    setTimeout(() => {
        resolve("after" + duration);
    }, duration);
});
