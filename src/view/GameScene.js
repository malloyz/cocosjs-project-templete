/**
 * Created by malloyzhu on 2016/7/6.
 */

var GameScene = cc.Scene.extend({
    ctor: function () {
        this._super();

        var view = new cc.LayerColor(cc.color(255, 111, 111));
        this.addChild(view);

        var view = new cc.Sprite(res.test_png);
        view.setPosition(cc.winSize.width / 2,cc.winSize.height / 2);
        this.addChild(view);
    }
});
