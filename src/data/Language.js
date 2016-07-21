/**
 * Created by malloy on 16/6/2.
 */

var Language = {
    getString: function (key) {
        if (cc.sys.LANGUAGE_CHINESE == cc.sys.language) {
            return ZhLanguage[key];
        } else {
            return EnLanguage[key];
        }
    }
}
