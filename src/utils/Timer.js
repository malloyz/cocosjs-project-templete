/**
 * Created by malloyzhu on 2015/6/16.
 */

/**
 * 定时器
 * @type {Function}
 */
var Timer = cc.Class.extend({
    ctor: function () {
        this._bRunning = false;
        this._duration = 0;
        this._elapse = 0;
        this._timeUpFun = null;
    },

    setTimeUp: function (func) {
        this._timeUpFun = func;
    },

    setDuration: function (duration) {
        this._duration = duration;
    },

    getDuration: function () {
        return this._duration;
    },

    setElapse: function (elapse) {
        this._elapse = elapse;
    },

    getElapse: function () {
        return this._elapse;
    },

    update: function (dt) {
        if (!this._bRunning) {
            return;
        }

        this._elapse += dt;
        if (this._elapse >= this._duration) {
            this._elapse = 0;
            this._timeUpFun && this._timeUpFun(this);
        }
    },

    pause: function () {
        this._bRunning = false;
    },

    resume: function () {
        this._bRunning = true;
    },

    start: function () {
        this._bRunning = true;
    },

    isRunning: function () {
        return this._bRunning;
    }
});

/**
 * 可获得进度的定时器
 */
var PercentTimer = Timer.extend({
    _percent: 0,// 0 到 1

    update: function (dt) {
        if (!this._bRunning) {
            return;
        }

        this._elapse += dt;
        if (this._elapse < this._duration) {
            this._percent = this._elapse / this._duration;
        } else {
            this._elapse = 0;
            this._percent = 1;
            this._timeUpFun && this._timeUpFun(this);
        }
    },

    getPercent: function () {
        return this._percent;
    }
});

/**
 * 倒计时器
 * @type {Function}
 */
var CountdownTimer = cc.Class.extend({
    _secondTimer: null,//秒表
    _secondTimeCallBack: null,//秒回调
    _countTimeCallBack: null,//总时间倒计时完成的回调
    _currentCountTime: 0,//总时间
    _originalCountTime: 0,//原始总时间

    ctor: function (secondTimerDuration) {
        secondTimerDuration = secondTimerDuration || 1;
        this._secondTimer = new Timer();
        this._secondTimer.setDuration(secondTimerDuration);
        this._secondTimer.setTimeUp(Util.handler(this._onSecondTimeElapse, this));
    },

    setSecondTimerDuration: function (secondTimerDuration) {
        this._secondTimer.setDuration(secondTimerDuration);
    },

    _onSecondTimeElapse: function () {
        var secondTimerDurationTime = this._secondTimer.getDuration();
        this._currentCountTime -= secondTimerDurationTime;
        if (this._currentCountTime <= 0) {
            this._currentCountTime = 0;
            this._secondTimer.pause();
        }

        this._secondTimeCallBack(this._currentCountTime);

        if (!this._secondTimer.isRunning()) {
            this._countTimeCallBack();
        }
    },

    isRunning: function () {
        this._secondTimer.isRunning();
    },

    pause: function () {
        this._secondTimer.pause();
    },

    resume: function () {
        this._secondTimer.resume();
    },

    start: function () {
        this._secondTimer.start();
    },

    update: function (dt) {
        this._secondTimer.update(dt);
    },

    reset: function () {
        this._secondTimer.setElapse(0);
        this._secondTimer.resume();
    },

    setCountTime: function (countTime) {
        this._currentCountTime = countTime;
        this._originalCountTime = countTime;
    },

    getCurrentCountTime: function () {
        return this._currentCountTime;
    },

    getOriginalCountTime: function () {
        return this._originalCountTime;
    },

    setSecondTimeCallBack: function (func) {
        this._secondTimeCallBack = func;
    },

    setCountTimeCallBack: function (func) {
        this._countTimeCallBack = func;
    }
});

/**
 * 计时器
 * @type {Function}
 */
var CalcTimer = cc.Class.extend({
    _secondTimer: null,//秒表
    _minuteTimer: null,//分钟表
    _secondTimeCallBack: null,//秒回调
    _minuteTimeCallBack: null,//分钟回调
    _currentTime: 0,//当前时间

    ctor: function (secondTimerDuration, minuteTimerDuration) {
        secondTimerDuration = secondTimerDuration || 1;
        this._secondTimer = new Timer();
        this._secondTimer.setDuration(secondTimerDuration);
        this._secondTimer.setTimeUp(Util.handler(this._onSecondTimeElapse, this));

        minuteTimerDuration = minuteTimerDuration || 1;
        minuteTimerDuration = minuteTimerDuration * 60;
        this._minuteTimer = new Timer();
        this._minuteTimer.setDuration(minuteTimerDuration);
        this._minuteTimer.setTimeUp(Util.handler(this._onMinuteTimeElapse, this));
    },

    _onSecondTimeElapse: function () {
        var secondTimerDurationTime = this._secondTimer.getDuration();
        this._currentTime += secondTimerDurationTime;
        this._secondTimeCallBack(this._currentTime);
    },

    _onMinuteTimeElapse: function () {
        this._minuteTimeCallBack();
    },

    update: function (dt) {
        this._secondTimer.update(dt);
        this._minuteTimer.update(dt);
    },

    pause: function () {
        this._secondTimer.pause();
        this._minuteTimer.pause();
    },

    start: function () {
        this._secondTimer.start();
        this._minuteTimer.start();
    },

    resume: function () {
        this._secondTimer.resume();
        this._minuteTimer.resume();
    },

    reset: function () {
        this._secondTimer.setElapse(0);
        this._secondTimer.resume();

        this._minuteTimer.setElapse(0);
        this._minuteTimer.resume();

        this._currentTime = 0;
    },

    setCurrentTime: function (currentTime) {
        this._currentTime = currentTime;
    },

    setSecondTimeCallBack: function (func) {
        this._secondTimeCallBack = func;
    },

    setMinuteTimeCallBack: function (func) {
        this._minuteTimeCallBack = func;
    },

    setMinuteTimerElapse: function (elapse) {
        this._minuteTimer.setElapse(elapse);
    }
});

/**
 * 定量计时器
 */
var QuantumTimer = cc.Class.extend({
    _startTime: null,
    _endTime: null,
    _currentTime: null,
    _secondTimer: null,
    _coefficient: -1,//系数
    _secondTimeCallBack: null,
    _endTimeCallBack: null,

    ctor: function (secondTimerDuration) {
        secondTimerDuration = secondTimerDuration || 1;
        this._secondTimer = new Timer();
        this._secondTimer.setDuration(secondTimerDuration);
        this._secondTimer.setTimeUp(Util.handler(this._onSecondTimeElapse, this));
    },

    setSecondTimerDuration: function (secondTimerDuration) {
        this._secondTimer.setDuration(secondTimerDuration);
    },

    _onSecondTimeElapse: function () {
        var secondTimerDurationTime = this._secondTimer.getDuration();
        this._currentTime = this._currentTime + (secondTimerDurationTime * this._coefficient);

        if (this._coefficient == -1) {
            if (this._currentTime <= this._endTime) {
                this._callEndTimeCallBack();
            }
        } else {
            if (this._currentTime >= this._endTime) {
                this._callEndTimeCallBack();
            }
        }

        this._secondTimeCallBack(this._currentTime);
    },

    _callEndTimeCallBack: function () {
        this._currentTime = this._endTime;
        this._secondTimer.pause();
        this._endTimeCallBack();
    },

    update: function (dt) {
        this._secondTimer.update(dt);
    },

    pause: function () {
        this._secondTimer.pause();
    },

    resume: function () {
        this._secondTimer.resume();
    },

    start: function () {
        this._secondTimer.start();
    },

    isRunning: function () {
        return this._secondTimer.isRunning();
    },

    reset: function () {
        this._secondTimer.setElapse(0);
    },

    setTimeData: function (startTime, endTime) {
        this._startTime = startTime;
        this._endTime = endTime;
        this._currentTime = this._startTime;
        this._coefficient = (this._startTime > this._endTime ? -1 : 1);
    },

    getCurrentTime: function () {
        return this._currentTime;
    },

    setSecondTimeCallBack: function (func) {
        this._secondTimeCallBack = func;
    },

    setEndTimeCallBack: function (func) {
        this._endTimeCallBack = func;
    }
});
