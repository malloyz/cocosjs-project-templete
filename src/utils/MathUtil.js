/**
 * Created by malloyzhu on 2016/4/22.
 */

var MathUtil = {
    _table: [],

    init: function () {
        for (var angle = 0; angle <= 360; angle++) {
            var sin = Math.sin(2 * Math.PI / 360 * angle);
            var cos = Math.cos(2 * Math.PI / 360 * angle);
            this._table.push({sin: sin, cos: cos});
        }
    },

    getSin: function (angle) {
        var targetAngle = this._correctAngle(angle);
        return this._table[targetAngle].sin;
    },

    getCos: function (angle) {
        var targetAngle = this._correctAngle(angle);
        return this._table[targetAngle].cos;
    },

    _correctAngle: function (angle) {
        var targetAngle = Math.round(angle) % 360;
        targetAngle = targetAngle >= 0 ? targetAngle : (360 + targetAngle);
        return targetAngle;
    }
};
