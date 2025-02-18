// 发布订阅
// on 监听事件，返回一个 callback
// emit 触发事件
// off 移除事件
// once 只触发一次事件

class EventEmitter {
    constructor() {
        this.events = new Map();
    }
    on(event, callback) {
        if (this.events.has(event)) {
            this.events.set(event, [...this.events.get(event), callback]);
        } else {
            this.events.set(event, [callback]);
        }
    }
    emit(event, ...args) {
        if (this.events.has(event)) {
            this.events.get(event).forEach(callback => {
                callback(...args);
            });
        }
    }
    off(event, callback) {
        let target = this.events.get(event);
        if (Array.isArray(target)) {
            let targetIndex = target.findIndex(fn => fn === callback);
            if (targetIndex !== -1) {
                let newCallbacks = target.filter((_, index) => index !== targetIndex);
                this.events.set(event, newCallbacks);
            }
        }
    }
    once(event, callback) {
        if (this.events.has(event)) {
            let listeners = this.events.get(event);
            let index = listeners.findIndex(fn => fn === callback);
            if (index !== -1) {
                this.off(event, callback);
            }
        }
        const onceCallback = (...args) => {
            callback(...args);
            this.off(event, onceCallback);
        }
        this.on(event, onceCallback);
    }
}

let eventEmitter = new EventEmitter();
function callback1(a, b, c) {
    console.log('callback1', a, b, c)
}
function callback2(a, b) {
    console.log('callback2', a, b)
}

eventEmitter.on('event1', callback1);
eventEmitter.on('event1', callback2);
eventEmitter.emit('event1', 1, 2, 3);
eventEmitter.off('event1', callback2);
eventEmitter.emit('event1', 4, 5, 6);
eventEmitter.once('event1', callback1);
eventEmitter.emit('event1', 7, 8, 9);
eventEmitter.emit('event1', 10, 11, 12);