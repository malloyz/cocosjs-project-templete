/**
 * Created by malloyzhu on 2015/6/5.
 */

/**
 *页基类，构造时传入一个 Node 类型的节点
 */

var PageBase = cc.Class.extend({
    _pageNode: null,

    ctor: function (pageNode) {
        this._pageNode = pageNode;
    },

    getPageNode: function () {
        return this._pageNode;
    },

    /**
     * 显示时调用，如果显示时没有使用 action，那么在调用 onShowNotify 后调用 onShow
     */
    onShowNotify: function (tab) {
    },

    /**
     * 显示时调用，如果显示时有使用 action，那么会先调用 onShowNotify，action 回调时调用 onShow
     */
    onShow: function (tab) {
    },

    /**
     * 隐藏时调用，如果隐藏时没有使用 action，那么在调用 onHideNotify 后调用 onHide
     */
    onHideNotify: function (tab) {
    },

    /**
     * 隐藏时调用，如果隐藏时有使用 action，那么会先调用 onHideNotify，action 回调时调用 onHide
     */
    onHide: function (tab) {
    },

    /**
     * 销毁前被调用
     */
    onDestroy: function () {
    }
});

