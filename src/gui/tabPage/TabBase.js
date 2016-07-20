/**
 * Created by malloyzhu on 2015/6/5.
 */

/**
 * 标签基类，构造时传入一个 Node 类型的节点
 */

var TabBase = cc.Class.extend({
    _tabNode: null,
    _tabTouchedListener: null,
    _data: null,

    ctor: function (tabNode) {
        this._tabNode = tabNode;
    },

    getTabNode: function () {
        return this._tabNode;
    },

    setData: function (data) {
        this._data = data;
    },

    getData: function () {
        return this._data;
    },

    setTabTouchedListener: function (func) {
        this._tabTouchedListener = func;
    },

    _onTabTouched: function () {
        this._tabTouchedListener(this);
    },

    /**
     * 当被选中时调用
     */
    onSelected: function () {
    },

    /**
     * 当前被选中，另外一个标签被选中时调用
     */
    onUnSelected: function () {
    },

    /**
     * 销毁前被调用
     */
    onDestroy: function () {
    }
});