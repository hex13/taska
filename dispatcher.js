export class ListenerRemoved {};

export default function createDispatcher() {
    const handlers = Object.create(null);
    return {
        on(eventName, callback) {
            return new Promise((resolve, reject) => {
                (handlers[eventName] || (handlers[eventName] = [])).push({ resolve, reject, callback });
            });
        },
        dispatch(event) {
            const eventHandlers = handlers[event.type];
            if (eventHandlers) {
                for (let i = 0; i < eventHandlers.length; i++) {
                    eventHandlers[i].resolve(event);
                    if (eventHandlers[i].callback) eventHandlers[i].callback(event);
                }
                handlers[event.type] = handlers[event.type].filter(handler => handler.callback);
            }
        },
        resetListeners() {
            for (const key in handlers) {
                const eventHandlers = handlers[key];
                if (eventHandlers) {
                    for (let i = 0; i < eventHandlers.length; i++) {
                        eventHandlers[i].reject(new ListenerRemoved);
                    }
                    eventHandlers.length = 0;
                }
            }
        }
    }
};