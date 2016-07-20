/**
 * Created by malloyzhu on 2015/6/5.
 */

/**
 *  页 action
 * @type {{}}
 */
var PageAction = {
    setActionCompleteCallBack: function (func) {
        this._actionCompleteCallBack = func;
    },

    /**
     * action 完成时回调
     * @param object
     * @private
     */
    _onActionComplete: function (object) {
        this._actionCompleteCallBack(object);
    }
};