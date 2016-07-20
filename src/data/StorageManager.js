/**
 * Created by malloyzhu on 2016/5/23.
 */

var StorageManager = {
    _firstStartUpGameKey: "firstStartUpGame",
    _openMusicKey: "openMusicKey",
    _openSoundKey: "openSoundKey",
    _bFirstStartUpGame: null,
    _bOpenMusic: null,
    _bOpenSound: null,

    load: function () {
        this._bFirstStartUpGame = this._getData(this._firstStartUpGameKey, true);
        this._bOpenMusic = this._getData(this._openMusicKey, true);
        this._bOpenSound = this._getData(this._openSoundKey, true);
    },

    isOpenMusic: function () {
        return this._bOpenMusic;
    },

    isOpenSound: function () {
        return this._bOpenSound;
    },

    _getData: function (key, defaultValue) {
        var valStr = cc.sys.localStorage.getItem(key);  // get null if that key doesn't exists, otherwise string
        var val = defaultValue;

        try {
            if (valStr && valStr != "") {
                val = JSON.parse(valStr);   // casting to Number, Boolean, Array, Object if possible
            }
        }
        catch (err) {
            val = valStr;   // could be a plain String type
        }

        return val;
    },

    _recordData: function (key, value) {
        cc.sys.localStorage.setItem(key, JSON.stringify(value));
    }
};