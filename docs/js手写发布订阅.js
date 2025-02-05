class EventEmitter {
    constructor() {
        this.events = {};
    }
    on(event, fn) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(fn);
    }
    emit(event, ...args) {
        if (!this.events[event]) {
            return;
        }
        this.events[event].forEach(fn => fn(...args));
    }
    off(event, fn) {
        if (!this.events[event]) {
            return;
        }
        this.events[event] = this.events[event].filter(f => f !== fn);
    }
    once(event, fn) {
        const onceFn = (...args) => {
            fn(...args);
            this.off(event, onceFn);
        };
        this.on(event, onceFn);
    }
}

let eventEmitter = new EventEmitter();

function callback1() {
    console.log('click1', ...arguments);
}
function callback2() {
    console.log('click2', ...arguments);
}

function callback3() {
    console.log('click3', ...arguments);
}

eventEmitter.on('click', callback1);

eventEmitter.on('click', callback2);

eventEmitter.once('click', callback3);

eventEmitter.emit('click', 1, 2, 3);

eventEmitter.off('click', callback2);

eventEmitter.emit('click', 4, 5, 6);