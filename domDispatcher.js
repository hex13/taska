import createDispatcher from "./dispatcher.js";
export default function createDomDispatcher() {
    const dispatcher = createDispatcher();
    const originalOn = dispatcher.on.bind(dispatcher);
    dispatcher.on = (sel, handler) => {
        let eventName, el;
        if (Array.isArray(sel)) {
            el = sel[0];
            eventName = sel[1];
        } else {
            el = document;
            eventName = sel;
        }
        function handleEvent(e) {
            dispatcher.dispatch(e);
            el.removeEventListener(eventName, handleEvent);
        }
        setTimeout(() => {
            el.addEventListener(eventName, handleEvent);
        }, 0);

        return originalOn(eventName, handler);
    };

    return dispatcher;
};