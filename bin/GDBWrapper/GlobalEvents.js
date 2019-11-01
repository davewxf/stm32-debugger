"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events = require("events");
const Message_1 = require("./Message");
const Time_1 = require("./Time");
let _globalEvent;
class GlobalEvent {
    constructor() {
        this._emitter = new events.EventEmitter();
    }
    static GetInstance() {
        if (_globalEvent) {
            return _globalEvent;
        }
        _globalEvent = new GlobalEvent();
        return _globalEvent;
    }
    static on(event, args) {
        GlobalEvent.GetInstance()._emitter.on(event, args);
    }
    static prepend(event, args) {
        GlobalEvent.GetInstance()._emitter.prependListener(event, args);
    }
    static emit(event, args) {
        return GlobalEvent.GetInstance()._emitter.emit(event, args);
    }
}
exports.GlobalEvent = GlobalEvent;
GlobalEvent.prepend('msg', (msg) => {
    switch (msg.type) {
        case 'Error':
            console.error(JSON.stringify(msg));
            break;
        case 'Warning':
            console.warn(JSON.stringify(msg));
            break;
        default:
            console.info(JSON.stringify(msg));
            break;
    }
    msg.timeStamp = Time_1.Time.GetInstance().GetTimeStamp();
});
GlobalEvent.on('error', (err) => {
    if (err) {
        console.error(err);
        GlobalEvent.emit('msg', Message_1.ExceptionToMessage(err));
    }
    else {
        GlobalEvent.emit('msg', Message_1.ExceptionToMessage(new Error('Empty Error received !')));
    }
});
process.on('uncaughtException', (err) => {
    GlobalEvent.emit('error', err);
});
process.on('SIGKILL', () => {
    GlobalEvent.emit('Request_Close');
});
//# sourceMappingURL=GlobalEvents.js.map