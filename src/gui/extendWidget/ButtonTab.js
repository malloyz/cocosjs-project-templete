/**
 * Created by malloyzhu on 2016/7/20.
 */

var ButtonTab = TabBase.extend({
    bSelected: false,

    ctor: function (tabNode) {
        this._super(tabNode);
        tabNode.addTouchEventListener(this._onTabNodeTouched, this);
    },

    _onTabNodeTouched: function (sender, type) {
        if (type === ccui.Widget.TOUCH_ENDED) {
            this._onTabTouched();
            this._updateBrightStyle();
        }
    },

    onSelected: function () {
        this.bSelected = true;
        this._updateBrightStyle();
    },

    onUnSelected: function () {
        this.bSelected = false;
        this._updateBrightStyle();
    },

    _updateBrightStyle: function () {
        if (this.bSelected) {
            this._tabNode.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
        } else {
            this._tabNode.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
        }
    }
});
