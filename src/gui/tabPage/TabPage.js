/**
 * Created by malloyzhu on 2015/6/5.
 */

var TabPage = cc.Class.extend({
    _tabPageList: null,//标签页列表
    _currentTabPage: null,//当前标签页
    _toggleTabPageCallBackFun: null,

    ctor: function () {
        this._tabPageList = [];
    },

    getTabPageList: function () {
        return this._tabPageList;
    },

    setFocus: function (index) {
        if (this._index == index) {
            return;
        }

        if (index < 0) {
            console.log("index less than 0");
            return;
        }

        if (index > this._tabPageList.length - 1) {
            console.log("index greater than length");
            return;
        }

        this._index = index;
        var tabPage = this.getTabPageByIndex(index);
        this._toggleTabPage(tabPage);
    },

    /**
     * 添加标签页
     * @param tab：标签
     * @param page：页
     * @param pageShowAction：页显示时的 action
     * @param pageHideAction：页隐藏时的 action
     */
    addTabPage: function (tab, page, pageShowAction, pageHideAction) {
        if (null == tab || null == page) {
            console.log("tab or page is null");
            return;
        }
        tab.setTabTouchedListener(Util.handler(this._onTabTouched, this));
        var tabPage = {tab: tab, page: page, pageShowAction: pageShowAction, pageHideAction: pageHideAction};
        this._tabPageList.push(tabPage);
        page.getPageNode().setVisible(false);
    },

    onDestroy: function () {
        for (var i in this._tabPageList) {
            this._tabPageList[i].tab.onDestroy();
            this._tabPageList[i].page.onDestroy();
        }
    },

    /**
     * （可不设置）标签页切换回调，回调函数的参数为 (tab, page, tag, page)
     * @param selector
     * @param selectorTarget
     */
    setToggleTabPageCallBack: function (func) {
        this._toggleTabPageCallBackFun = func;
    },

    /**
     *标签点击事件函数
     * @param tab：点击的标签
     * @private
     */
    _onTabTouched: function (tab) {
        if (null == tab) {
            return;
        }
        var tabPageExist = this._isExistTabPageByTab(tab);
        if (tabPageExist.bExist) {
            if (null == tabPageExist.tabPage || tabPageExist.tabPage == this._currentTabPage) {
                return;
            }
            this._index = tabPageExist.index;
            this._toggleTabPage(tabPageExist.tabPage);
        }
    },

    /**
     * 切换标签页
     * @param tabPage：要切换的标签页
     * @private
     */
    _toggleTabPage: function (tabPage) {
        this._hideTabPage(this._currentTabPage);
        this._showTabPage(tabPage);
        var previousTabPage = this._currentTabPage;
        this._currentTabPage = tabPage;
        this._callToggleTabPageCallBack(this._currentTabPage, previousTabPage);
    },

    /**
     * 获取当前选中的标签页
     * @returns {null}
     */
    getCurrentTabPage: function () {
        return this._currentTabPage;
    },

    /**
     * 切换标签页回调
     * @param currentTabPage：当前标签页
     * @param previousTabPage：上一个标签页
     * @private
     */
    _callToggleTabPageCallBack: function (currentTabPage, previousTabPage) {
        if (null == currentTabPage) {
            return;
        }
        if (null !== this._toggleTabPageCallBackFun) {
            var previousTab = (null != previousTabPage ? previousTabPage.tab : null);
            var previousPage = (null != previousTabPage ? previousTabPage.page : null);
            this._toggleTabPageCallBackFun(currentTabPage.tab, currentTabPage.page, previousTab, previousPage);
        }
    },

    /**
     * 显示标签页
     * @param tabPage：要显示的标签页
     * @private
     */
    _showTabPage: function (tabPage) {
        if (null == tabPage) {
            return;
        }
        var tab = tabPage.tab;
        var page = tabPage.page;

        if (null == tabPage.pageShowAction) {
            tab.onSelected();
            page.onShowNotify(tab);
            page.onShow(tab);
        } else {
            PageAction.setActionCompleteCallBack(Util.handler(this._onPageShowActionComplete, this));
            tab.onSelected();
            page.onShowNotify(tab);
            page.getPageNode().runAction(tabPage.pageShowAction);
        }
        page.getPageNode().setVisible(true);
    },

    /**
     * 隐藏标签页
     * @param tabPage：要隐藏的标签页
     * @private
     */
    _hideTabPage: function (tabPage) {
        if (null == tabPage) {
            return;
        }
        var tab = tabPage.tab;
        var page = tabPage.page;

        if (null == tabPage.pageHideAction) {
            tab.onUnSelected();
            page.onHideNotify(tab);
            page.onHide(tab);
            page.getPageNode().setVisible(false);
        } else {
            PageAction.setActionCompleteCallBack(Util.handler(this._onPageHideActionComplete, this));
            tab.onUnSelected();
            page.onHideNotify(tab);
            page.getPageNode().runAction(tabPage.pageHideAction);
        }
    },

    /**
     * 通过标签查找是否存在指定的标签页
     * @param tab：标签
     * @returns {*}
     * @private
     */
    _isExistTabPageByTab: function (tab) {
        if (null == tab) {
            return {bExist: false};
        }
        for (var i in this._tabPageList) {
            if (tab == this._tabPageList[i].tab) {
                return {bExist: true, tabPage: this._tabPageList[i], index: parseInt(i)};
            }
        }
        return {bExist: false};
    },

    getTabPageByIndex: function (index) {
        for (var i = 0; i < this._tabPageList.length; i++) {
            if (i == index) {
                return this._tabPageList[i];
            }
        }
        return null;
    },

    /**
     *通过页节点查找是否存在指定的标签页
     * @param pageNode
     * @returns {*}
     * @private
     */
    _isExistTabPageByPageNode: function (pageNode) {
        if (null == pageNode) {
            return {bExist: false};
        }
        for (var i in this._tabPageList) {
            if (pageNode == this._tabPageList[i].page.getPageNode()) {
                return {bExist: true, tabPage: this._tabPageList[i]};
            }
        }
        return {bExist: false};
    },

    /**
     * 显示页时使用的 action 的回调
     * @param pageNode：页节点
     * @private
     */
    _onPageShowActionComplete: function (pageNode) {
        var tabPageExist = this._isExistTabPageByPageNode(pageNode);
        if (tabPageExist.bExist) {
            var tab = tabPageExist.tabPage.tab;
            var page = tabPageExist.tabPage.page;
            page.onShow(tab);
        }
    },

    /**
     * 隐藏页时使用的 action 的回调
     * @param pageNode：页节点
     * @private
     */
    _onPageHideActionComplete: function (pageNode) {
        var tabPageExist = this._isExistTabPageByPageNode(pageNode);
        if (tabPageExist.bExist) {
            var tab = tabPageExist.tabPage.tab;
            var page = tabPageExist.tabPage.page;
            page.onHide(tab);
            page.getPageNode().setVisible(false);
        }
    }
})
