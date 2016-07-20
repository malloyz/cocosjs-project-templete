/**
 * Created by malloyzhu on 2015/7/7.
 */

var MusicManager = {
    _fileExtension: '.mp3',
    _bOpenMusic: true,
    _bOpenSound: true,

    init: function () {
        this.toggleMusicState(DataCenter.isOpenMusic());
        this.toggleSoundState(DataCenter.isOpenSound());
    },

    toggleMusicState: function (bValue) {
        this._bOpenMusic = bValue;
    },

    toggleSoundState: function (bValue) {
        this._bOpenSound = bValue;
    },

    playMusic: function (url, loop) {
        if (this._bOpenMusic) {
            cc.audioEngine.playMusic(url + this._fileExtension, loop);
        }
    },

    pauseMusic: function () {
        cc.audioEngine.pauseMusic();
    },

    playEffect: function (url, loop) {
        if (this._bOpenSound) {
            cc.audioEngine.playEffect(url + this._fileExtension, loop);
        }
    },

    playMusicRand: function (urls, loop) {
        if (this._bOpenMusic) {
            var index = Math.floor(Math.random() * urls.length);
            cc.audioEngine.playMusic(urls[index] + this._fileExtension, loop);
        }
    },

    playEffectRand: function (urls, loop) {
        if (this._bOpenSound) {
            var index = Math.floor(Math.random() * urls.length);
            cc.audioEngine.playEffect(urls[index] + this._fileExtension, loop);
        }
    }
};