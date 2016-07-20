/**
 * Created by malloy on 2015/5/29.
 */

/**
 * 窗口管理器
 * @type {Function}
 */
var WindowManager = cc.Class.extend({
    _showModalWindowList: null,//显示的模态窗口列表
    _hideModalWindowList: null,//隐藏的模态窗口列表
    _destroyModalWindowList: null, //待删除的模态窗口列表

    _blurBgLayer: null,
    _blurBgLayerNull: null,

    /**
     * 初始化
     */
    ctor: function () {
        this._showModalWindowList = new ObjectArray();
        this._hideModalWindowList = new ObjectArray();
        this._destroyModalWindowList = new ObjectArray();
    },

    /**
     *
     * @param window：继承 WindowBase 的对象
     * @param windowShowAction：显示时使用的 action
     * @param bShowGreyMask：是否显示灰色蒙版
     * @param windowZOrder：窗口显示层级
     * @param bBlurBg：是否模糊背景
     * @param maskTouchedCallBack：蒙版触摸回调
     * @param root：window 的父节点
     */
    showWindow: function (window, windowShowAction, bShowGreyMask, windowZOrder, bBlurBg, maskTouchedCallBack, root) {
        if (null == window) {
            return;
        }

        if (null == root) {
            root = cc.director.getRunningScene();
        }

        var modalWindowExist = this._isExistModalWindowInHideList(window);
        if (modalWindowExist.bExist) {
            this._showModalWindowList.addObject(modalWindowExist.modalWindow);
            this._hideModalWindowList.removeObjectByIndex(modalWindowExist.index);
            this._showModalWindow(modalWindowExist.modalWindow, windowShowAction, windowZOrder, root);
        } else {
            modalWindowExist = this._isExistModalWindowInShowList(window);
            if (modalWindowExist.bExist) {
                this._showModalWindow(modalWindowExist.modalWindow, windowShowAction, windowZOrder, root);
            } else {
                var mask = this._createMask(bShowGreyMask, maskTouchedCallBack);
                var blurBgLayer = this._getBlurBgLayer(bBlurBg);
                var modalWindow = {window: window, mask: mask, blur: blurBgLayer};
                this._showModalWindowList.addObject(modalWindow);
                this._showModalWindow(modalWindow, windowShowAction, windowZOrder, root);
            }
        }

        var lastSecondIndex = this._showModalWindowList.size() - 2;
        var lastSecondModalWindow = this._showModalWindowList.getObjectByIndex(lastSecondIndex);
        this._coverModalWindow(lastSecondModalWindow);
    },

    /**
     * 获取模糊背景层
     * @private
     */
    _getBlurBgLayer: function (bBlurBg) {
        if (bBlurBg) {
            if (null == this._blurBgLayer) {
                this._blurBgLayer = new BlurBgLayer();
                this._blurBgLayer.retain();
            }
            return this._blurBgLayer;
        } else {
            if (null == this._blurBgLayerNull) {
                this._blurBgLayerNull = new BlurBgLayerNull();
                this._blurBgLayerNull.retain();
            }
            return this._blurBgLayerNull;
        }
    },

    /**
     * 隐藏指定窗口
     * @param window
     * @param windowHideAction
     */
    hideWindow: function (window, windowHideAction) {
        if (null == window) {
            return;
        }

        var modalWindowExist = this._isExistModalWindowInShowList(window);
        if (modalWindowExist.bExist) {
            this._hideModalWindowList.addObject(modalWindowExist.modalWindow);
            this._showModalWindowList.removeObjectByIndex(modalWindowExist.index);
            this._hideModalWindow(modalWindowExist.modalWindow, windowHideAction);
            this._resumeModalWindow(modalWindowExist.previousModalWindow);
        }
    },

    /**
     * 销毁指定窗口
     * @param window
     * @param windowDestroyAction
     */
    destroyWindow: function (window, windowDestroyAction) {
        if (null == window) {
            return;
        }

        var modalWindowExist = this._isExistModalWindowInShowList(window);
        if (modalWindowExist.bExist) {
            this._destroyModalWindowList.addObject(modalWindowExist.modalWindow);
            this._showModalWindowList.removeObjectByIndex(modalWindowExist.index);
            this._destroyModalWindow(modalWindowExist.modalWindow, windowDestroyAction);
            this._resumeModalWindow(modalWindowExist.previousModalWindow);
        }
    },

    /**
     * 销毁所有模态窗口
     */
    destroyAllWindow: function () {
        var size = this._showModalWindowList.size();
        for (var i = size - 1; i >= 0; i--) {
            var modalWindow = this._showModalWindowList.getObjectByIndex(i);
            var previousModalWindow = this._showModalWindowList.getObjectByIndex(i - 1);
            this._destroyModalWindow(modalWindow);
            this._resumeModalWindow(previousModalWindow);
        }

        var size = this._hideModalWindowList.size();
        for (var i = size - 1; i >= 0; i--) {
            var modalWindow = this._hideModalWindowList.getObjectByIndex(i);
            this._destroyModalWindow(modalWindow);
        }

        this._showModalWindowList.removeAllObject();
        this._hideModalWindowList.removeAllObject();

        this._blurBgLayer && this._blurBgLayer.release();
        this._blurBgLayerNull && this._blurBgLayerNull.release();
    },

    /**
     * 显示模态窗口
     * @param modalWindow
     * @param windowShowAction
     * @param root
     * @private
     */
    _showModalWindow: function (modalWindow, windowShowAction, windowZOrder, root) {
        if (null == modalWindow) {
            return;
        }

        var blur = modalWindow.blur;
        var mask = modalWindow.mask;
        var window = modalWindow.window;

        blur.removeFromParent();
        mask.removeFromParent();
        window.removeFromParent();

        windowZOrder = windowZOrder || 10;
        root.addChild(blur, windowZOrder);
        blur.onShow();
        root.addChild(mask, windowZOrder);
        root.addChild(window, windowZOrder);

        blur.setVisible(true);
        mask.setVisible(true);
        window.setVisible(true);

        if (null == windowShowAction) {
            mask.onShow();
            window.onShowNotify();
            window.onShow();
        } else {
            WindowAction.setActionCompleteCallBack(this._onWindowShowActionComplete.bind(this));
            mask.onShow();
            window.onShowNotify();
            window.runAction(windowShowAction);
        }
    },

    /**
     * 隐藏模态窗口
     * @param modalWindow
     * @param windowHideAction
     * @private
     */
    _hideModalWindow: function (modalWindow, windowHideAction) {
        if (null == modalWindow) {
            return;
        }

        var window = modalWindow.window;
        var mask = modalWindow.mask;
        var blur = modalWindow.blur;

        if (null == windowHideAction) {
            window.onHideNotify();
            window.onHide();
            window.setVisible(false);

            mask.onHide();
            mask.setVisible(false);

            blur.onHide();
            blur.setVisible(false);
        } else {
            WindowAction.setActionCompleteCallBack(this._onWindowHideActionComplete.bind(this));
            window.onHideNotify();
            window.runAction(windowHideAction);
        }
    },

    /**
     * 移除模态窗口
     * @param modalWindow
     * @param windowDestroyAction
     * @private
     */
    _destroyModalWindow: function (modalWindow, windowDestroyAction) {
        if (null == modalWindow) {
            return;
        }

        var window = modalWindow.window;
        var mask = modalWindow.mask;
        var blur = modalWindow.blur;

        if (null == windowDestroyAction) {
            window.onDestroyNotify();
            window.onDestroy();
            window.removeFromParent();

            mask.onDestroy();
            mask.removeFromParent();

            blur.onDestroy();
            blur.removeFromParent();
        } else {
            WindowAction.setActionCompleteCallBack(this._onWindowDestroyActionComplete.bind(this));
            window.onDestroyNotify();
            window.runAction(windowDestroyAction);
        }
    },

    /**
     * 如果显示窗口时有使用 action ,那么会调用这个函数
     * @param window
     * @private
     */
    _onWindowShowActionComplete: function (window) {
        window.onShow();
    },

    /**
     * 如果隐藏窗口时有使用 action ,那么会调用这个函数
     * @param window
     * @private
     */
    _onWindowHideActionComplete: function (window) {
        var modalWindowExit = this._isExistModalWindowInHideList(window);
        if (modalWindowExit.bExist) {
            var window = modalWindowExit.modalWindow.window;
            var mask = modalWindowExit.modalWindow.mask;
            var blur = modalWindowExit.modalWindow.blur;

            window.onHide();
            window.setVisible(false);

            mask.onHide();
            mask.setVisible(false);

            blur.onHide();
            blur.setVisible(false);
        }
    },

    /**
     * 如果销毁窗口时有使用 action ,那么会调用这个函数
     * @param window
     * @private
     */
    _onWindowDestroyActionComplete: function (window) {
        var modalWindowExit = this._isExistModalWindowInDestroyList(window);
        if (modalWindowExit.bExist) {
            var window = modalWindowExit.modalWindow.window;
            var mask = modalWindowExit.modalWindow.mask;
            var blur = modalWindowExit.modalWindow.blur;

            window.onDestroy();
            window.removeFromParent();

            mask.onDestroy();
            mask.removeFromParent();

            blur.onDestroy();
            blur.removeFromParent();

            this._destroyModalWindowList.removeObjectByIndex(modalWindowExit.index);
        }
    },

    /**
     * @private
     */
    _resumeModalWindow: function (modalWindow) {
        if (null != modalWindow) {
            modalWindow.window.onResume();
        }
    },

    /**
     * @private
     */
    _coverModalWindow: function (modalWindow) {
        if (null != modalWindow) {
            modalWindow.window.onCover();
        }
    },

    /**
     * 指定窗口是否存在于显示的模态窗口列表中
     * @param window
     * @returns {*}
     * @private
     */
    _isExistModalWindowInShowList: function (window) {
        var modalWindowExist = this._isExistModalWindowInList(window, this._showModalWindowList);
        if (modalWindowExist.bExist) {
            var index = modalWindowExist.index;
            var previousModalWindow = this._showModalWindowList.getObjectByIndex(index - 1);
            modalWindowExist.previousModalWindow = previousModalWindow;
        }
        return modalWindowExist;
    },

    /**
     * 指定的窗口是否存在于隐藏的模态窗口列表中
     * @param window
     * @returns {*}
     * @private
     */
    _isExistModalWindowInHideList: function (window) {
        return this._isExistModalWindowInList(window, this._hideModalWindowList);
    },

    /**
     * 指定的窗口是否存在于待销毁的模态窗口列表中
     * @param window
     * @returns {*}
     * @private
     */
    _isExistModalWindowInDestroyList: function (window) {
        return this._isExistModalWindowInList(window, this._destroyModalWindowList);
    },

    _isExistModalWindowInList: function (window, list) {
        if (null == window || null == list) {
            return {bExist: false};
        }

        var size = list.size();
        for (var i = 0; i < size; i++) {
            var modalWindow = list.getObjectByIndex(i);
            if (window == modalWindow.window) {
                return {bExist: true, modalWindow: modalWindow, index: i};
            }
        }
        return {bExist: false};
    },

    /**
     * 创建蒙版
     * @param bShowGreyMask
     * @param maskTouchedCallBack
     * @private
     */
    _createMask: function (bShowGreyMask, maskTouchedCallBack) {
        var mask = new Mask();
        var bGrey = (true === bShowGreyMask ? true : false);
        mask.setGrey(bGrey);
        mask.setTouchedCallBack(maskTouchedCallBack);
        return mask;
    }
});

WindowManager.GetInstance = function () {
    if (null == WindowManager._instance) {
        WindowManager._instance = new WindowManager();
    }
    return WindowManager._instance;
};