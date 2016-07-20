/**
 * Created by malloyzhu on 2015/6/15.
 */

var TipManager = cc.Class.extend({
    _tipList: null,
    _tipPanel: null,

    ctor: function () {
        this._tipList = new Array();

        var panel = new ccui.Layout();
        panel.setAnchorPoint(0.5, 0.5);
        panel.setBackGroundColor(cc.color(0, 0, 0));
        panel.setBackGroundColorOpacity(180);
        panel.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);

        var contentText = new ccui.Text();
        contentText.setTextColor(cc.color(255, 255, 255));
        contentText.setFontSize(30);
        contentText.setName("tipText");

        panel.addChild(contentText);
        this._tipPanel = panel;
        this._tipPanel.retain();
    },

    _cascadeColorOpacity: function (item) {
        item.setCascadeColorEnabled(true);
        item.setCascadeOpacityEnabled(true);

        var widgetChildren = item.getChildren();
        for (var i = 0; i < widgetChildren.length; i++) {
            var locChild = widgetChildren[i];
            this._cascadeColorOpacity(locChild);
        }
    },

    showTip: function (tipContent, position) {
        if (typeof(tipContent) !== 'string') {
            return;
        }

        var tipPanel = this._tipPanel.clone();
        this._cascadeColorOpacity(tipPanel);

        var tipText = tipPanel.getChildByName("tipText");
        tipText.ignoreContentAdaptWithSize(true);
        tipText.setString(tipContent);

        tipPanel.setContentSize(Math.max(tipText.getContentSize().width + 20, 300), 100);
        var tipPanelPosition = position || cc.p(cc.winSize.width / 2, cc.winSize.height / 2);
        tipPanel.setPosition(tipPanelPosition);
        tipText.setPosition(tipPanel.getContentSize().width / 2, tipPanel.getContentSize().height / 2);

        cc.director.getRunningScene().addChild(tipPanel, WindowZOrderType.tip_window);

        var delayTimeAction = new cc.DelayTime(1);
        var fadeOutAction = new cc.FadeOut(2);
        var callbackAction = new cc.CallFunc(this._actionComplete, this);
        var action = new cc.Sequence(delayTimeAction, fadeOutAction, callbackAction);
        tipPanel.runAction(action);

        if (this._isNeedMoveAllTip()) {
            var tipPanelSize = tipPanel.getContentSize();
            var distanceY = tipPanelSize.height + 5;
            this._moveAllTip(distanceY);
        }

        this._tipList.push(tipPanel);
    },

    _actionComplete: function (object) {
        cc.arrayRemoveObject(this._tipList, object);
        object.removeFromParent();
    },

    _moveAllTip: function (distanceY) {
        for (var i in this._tipList) {
            var moveAction = new cc.MoveBy(0.1, cc.p(0, distanceY));
            this._tipList[i].runAction(moveAction);
        }
    },

    _isNeedMoveAllTip: function () {
        //return (this._tipList.length >= 1);
        return false;
    },

    removeAllTip: function () {
        for (var i in this._tipList) {
            this._tipList[i].removeFromParent();
            this._tipList.splice(i, 1);
        }
    }
});

TipManager.GetInstance = function () {
    if (null == TipManager._instance) {
        TipManager._instance = new TipManager();
    }
    return TipManager._instance;
};
