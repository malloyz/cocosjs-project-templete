/**
 * Created by malloyzhu on 2016/7/20.
 */

var Loader = {
    load: function () {
        MathUtil.init();
        StorageManager.load();
        ConfigLoader.load();
        SpriteLoader.load();
        MusicManager.init();
    }
};
