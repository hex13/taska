import createDispatcher from '../dispatcher';

describe('task', () => {
    it('on with callback', () => {
        const events = [];
        const dispatcher = createDispatcher();
        dispatcher.on('foo', (e) => {
            events.push(e);
        });
        dispatcher.dispatch({type: 'foo', id: 1});
        dispatcher.dispatch({type: 'foo', id: 2});
        dispatcher.dispatch({type: 'foo', id: 3});
        dispatcher.dispatch({type: 'bar', id: 4});
        expect(events).toEqual([
            {type: 'foo', id: 1},
            {type: 'foo', id: 2},
            {type: 'foo', id: 3},
        ]);
    });

    it('on with promise', async () => {
        const events = [];
        const dispatcher = createDispatcher();
        // we need to call .on method earlier for listener to be registered before .dispatch calls
        const p = dispatcher.on('foo').then((e) => {
            events.push(e);
        });
        dispatcher.dispatch({type: 'bar', id: 1});
        dispatcher.dispatch({type: 'foo', id: 2});
        dispatcher.dispatch({type: 'foo', id: 3});
        dispatcher.dispatch({type: 'foo', id: 4});
        await p;
        expect(events).toEqual([
            {type: 'foo', id: 2},
        ]);
    });
})