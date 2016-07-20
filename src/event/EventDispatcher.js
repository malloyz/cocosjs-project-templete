/**
 * Created by malloyzhu on 2015/5/22.
 */

var EventDispatcher = function () {
    this.init();
};

var p = EventDispatcher.prototype;

p._listenerMap = null;

p.init = function () {
    this._listenerMap = {};
};

p.addListener = function (eventName, callback, priority) {
    if (!callback || !eventName)
        return;
    var listenerList = this._listenerMap[eventName];
    if (!listenerList)
        listenerList = this._listenerMap[eventName] = [];

    for (var i in listenerList) {
        if (listenerList[i].callback == callback)
            return callback;
    }

    priority = priority || 0;
    listenerList.push({callback: callback, priority: priority});
    listenerList.sort(function (a, b) {
        return b.priority - a.priority;
    });

    return callback;
};

p.removeListener = function (eventName, callback) {
    if (!callback || !eventName)
        return;
    var listenerList = this._listenerMap[eventName];
    if (listenerList) {
        for (var i in listenerList) {
            if (listenerList[i].callback == callback) {
                listenerList.splice(i, 1);
                return;
            }
        }
    }
};

p.removeAllListeners = function (eventName) {
    if (!eventName)
        return;
    var listenerList = this._listenerMap[eventName];
    if (listenerList) {
        for (var i in listenerList) {
            listenerList.splice(i, 1);
        }
    }
};

p.dispatchEvent = function (eventName, optionalUserData) {
    if (this._listenerMap[eventName]) {
        var listeners = this._listenerMap[eventName].slice();
        for (var i in listeners) {
            var event = {eventName: eventName, userData: optionalUserData || null};
            listeners[i].callback(event);
        }
    }
};

var eventDispatcher = new EventDispatcher();