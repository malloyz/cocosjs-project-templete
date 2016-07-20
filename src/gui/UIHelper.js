/**
 * Created by malloyzhu on 2015/7/23.
 */

var Direction = {leftToRight: 1, rightToLeft: 2, topToBottom: 3, bottomToTop: 4};

var UIHelper = {
    _extendListArray: [],

    /**
     * Calculate the scale ratio for SHOW_ALL mode
     *
     * @param designSize {cc.size}
     * @param containerSize {cc.size}
     * @returns {float}
     */
    calculateShowAllScale: function (designSize, containerSize) {
        var containerW = containerSize.width, containerH = containerSize.height,
            designW = designSize.width, designH = designSize.height,
            scaleX = containerW / designW, scaleY = containerH / designH, scale = 0,
            contentW, contentH;

        (scaleX < scaleY) ? (scale = scaleX, contentW = containerW, contentH = designH * scale)
            : (scale = scaleY, contentW = designW * scale, contentH = containerH);

        return scale;
    },

    /**
     * * 排序多个 view 的位置
     * @param views ：view 列表
     * @param viewHorizontalSpacing ：两个 view 之间的水平间距
     * @param midX ：中心坐标，用于 views 偏移
     * @param sortDirection : 排序方向
     */
    sortViewsPosition: function (views, viewHorizontalSpacing, midX, sortDirection) {
        if (!Util.isArray(views)) {
            return;
        }

        sortDirection = sortDirection || Direction.leftToRight;

        var firstIndex = (sortDirection == Direction.leftToRight ? 0 : views.length - 1);
        if (1 == views.length) {
            return;
        }

        var parent = views[0].getParent();
        if (null == parent) {
            console.log("parent is null");
            return;
        }

        for (var i = 1; i < views.length; i++) {
            if (views[i].getParent() !== parent) {
                console.log("parent not same");
                return;
            }
        }

        viewHorizontalSpacing = viewHorizontalSpacing || 0;

        var nextPositionX = 0;
        nextPositionX = _updateNextPositionX(views[firstIndex], nextPositionX, sortDirection);

        var viewsCount = views.length;
        if (Direction.leftToRight == sortDirection) {
            for (var i = 1; i < viewsCount; i++) {
                _setViewPosition(views[i], nextPositionX, sortDirection);
                nextPositionX = _updateNextPositionX(views[i], nextPositionX, sortDirection);
            }
        } else if (Direction.rightToLeft == sortDirection) {
            for (var i = viewsCount - 2; i >= 0; i--) {
                _setViewPosition(views[i], nextPositionX, sortDirection);
                nextPositionX = _updateNextPositionX(views[i], nextPositionX, sortDirection);
            }
        }

        if (null != midX) {
            var totalWidth = 0;
            for (var i in views) {
                var width = views[i].getContentSize().width;
                var scaleX = views[i].getScaleX();
                totalWidth += (width * scaleX + viewHorizontalSpacing);
            }
            totalWidth -= viewHorizontalSpacing;

            var firstView = views[0];
            var firstViewSize = firstView.getContentSize();
            var firstViewAnchor = firstView.getAnchorPoint();
            var firstViewScaleX = firstView.getScaleX();
            var firstViewParent = firstView.getParent();
            var firstViewWorldPosition = cc.p(firstViewParent.getPositionX() + firstView.getPositionX(), firstViewParent.getPositionY() + firstView.getPositionY());
            var firstViewLeftPositionX = firstViewWorldPosition.x - (firstViewSize.width * firstViewAnchor.x * firstViewScaleX);
            var offsetX = midX - (firstViewLeftPositionX + totalWidth / 2);
            for (var i in views) {
                views[i].setPositionX(views[i].getPositionX() + offsetX);
            }
        }

        //更新下一个 x 坐标
        function _updateNextPositionX(view, nextPositionX, sortDirection) {
            var viewPosition = view.getPosition();
            var viewContentSize = view.getContentSize();
            var viewAnchorPoint = view.getAnchorPoint();
            var scaleX = view.getScaleX();
            if (Direction.leftToRight == sortDirection) {
                nextPositionX = viewPosition.x + viewContentSize.width * (1 - viewAnchorPoint.x) * scaleX + viewHorizontalSpacing;
            } else if (Direction.rightToLeft == sortDirection) {
                nextPositionX = viewPosition.x - (viewContentSize.width * viewAnchorPoint.x) * scaleX - viewHorizontalSpacing;
            }
            return nextPositionX;
        }

        //设置 view 位置
        function _setViewPosition(view, nextPositionX, sortDirection) {
            var viewContentSize = view.getContentSize();
            var viewAnchorPoint = view.getAnchorPoint();
            var viewScaleX = view.getScaleX();
            var positionX = 0;
            if (Direction.leftToRight == sortDirection) {
                positionX = nextPositionX + viewContentSize.width * viewAnchorPoint.x * viewScaleX;
            } else if (Direction.rightToLeft == sortDirection) {
                positionX = nextPositionX - viewContentSize.width * (1 - viewAnchorPoint.x) * viewScaleX;
            }
            view.setPositionX(positionX);
        }
    },

    /**
     * 调整ui布局（针对多分辨率适配调整）
     * @param rootNode
     */
    adjustUILayout: function (rootNode) {
        var winSize = cc.winSize;
        var designSize = GameCommonDef.DESIGN_RESOLUTION_SIZE;
        if (designSize.width == winSize.width && designSize.height == winSize.height) {
            //不用调整
            return;
        }

        if (GameCommonDef.RESOLUTION_POLICY == cc.ResolutionPolicy.FIXED_WIDTH) {
            cc.log("UIHelper:adjustUILayout");
            var rootSize = rootNode.getContentSize();
            var bgImage = ccui.helper.seekWidgetByName(rootNode, "bgImage");
            if (bgImage != null) {
                bgImage.y = winSize.height / 2;
                var bgSize = bgImage.getContentSize();
                var scaleX = winSize.width / bgSize.width;
                var scaleY = winSize.height / bgSize.height;
                cc.log("scaleX: " + scaleX + ", scaleY: " + scaleY);

                //背景
                bgImage.setScale(scaleX > scaleY ? scaleX : scaleY);
            }


            var deltaHeight = winSize.height - rootSize.height;

            var topPanel = ccui.helper.seekWidgetByName(rootNode, "topPanel");
            if (topPanel != null) {
                topPanel.y = winSize.height;
            }

            var rightPanel = ccui.helper.seekWidgetByName(rootNode, "rightPanel");
            if (rightPanel != null) {
                rightPanel.y = winSize.height / 2;
            }

            var leftPanel = ccui.helper.seekWidgetByName(rootNode, "leftPanel");
            if (leftPanel != null) {
                leftPanel.y = winSize.height / 2;
            }

            var middlePanel = ccui.helper.seekWidgetByName(rootNode, "middlePanel");
            if (middlePanel != null) {
                middlePanel.y = winSize.height / 2;
            }
        } else if (GameCommonDef.RESOLUTION_POLICY == cc.ResolutionPolicy.FIXED_HEIGHT) {
            var rootSize = rootNode.getContentSize();
            var deltaWidth = winSize.width - rootSize.width;

            var bgImage = ccui.helper.seekWidgetByName(rootNode, "bgImage");
            if (bgImage != null) {
                bgImage.x = winSize.width / 2;
                var bgSize = bgImage.getContentSize();
                var scaleX = winSize.width / bgSize.width;
                var scaleY = winSize.height / bgSize.height;
                cc.log("scaleX: " + scaleX + ", scaleY: " + scaleY);

                //背景
                bgImage.setScale(scaleX > scaleY ? scaleX : scaleY);
            }

            var topPanel = ccui.helper.seekWidgetByName(rootNode, "topPanel");
            if (topPanel != null) {
                topPanel.x = winSize.width / 2;
            }

            var bottomPanel = ccui.helper.seekWidgetByName(rootNode, "bottomPanel");
            if (bottomPanel != null) {
                bottomPanel.x = winSize.width / 2;
            }

            var rightPanel = ccui.helper.seekWidgetByName(rootNode, "rightPanel");
            if (rightPanel != null) {
                rightPanel.x = winSize.width;
            }

            var middlePanel = ccui.helper.seekWidgetByName(rootNode, "middlePanel");
            if (middlePanel != null) {
                middlePanel.x = winSize.width / 2;
            }
        }

    },

    /**
     * 调整背景图片（针对多分辨率适配调整）
     * @param bgImage
     */
    adjustBgImage: function (bgImage) {
        var winSize = cc.winSize;
        var designSize = GameCommonDef.DESIGN_RESOLUTION_SIZE;
        if (designSize.width == winSize.width && designSize.height == winSize.height) {
            //不用调整
            return;
        }

        if (GameCommonDef.RESOLUTION_POLICY == cc.ResolutionPolicy.FIXED_WIDTH) {
            cc.log("UIHelper:adjustBgImage");
            if (bgImage != null) {
                bgImage.y = winSize.height / 2;
                //    var bgSize = bgImage.getContentSize();
                var scaleX = winSize.width / 1334;
                var scaleY = winSize.height / 750;
                cc.log("scaleX: " + scaleX + ", scaleY: " + scaleY);
                //背景
                bgImage.setScale(scaleX > scaleY ? scaleX : scaleY);
            }
        } else if (GameCommonDef.RESOLUTION_POLICY == cc.ResolutionPolicy.FIXED_HEIGHT) {
            if (bgImage != null) {
                bgImage.x = winSize.width / 2;
                //    var bgSize = bgImage.getContentSize();
                var scaleX = winSize.width / designSize.width;
                var scaleY = winSize.height / designSize.height;
                cc.log("scaleX: " + scaleX + ", scaleY: " + scaleY);
                //背景
                bgImage.setScale(scaleX > scaleY ? scaleX : scaleY);
            }
        }


    },

    /**
     * 将文本内容按行宽分段并设置到文本控件中
     * @param uiText：文本控件
     * @param str：文本内容
     * @param lineWidth：行宽
     */
    subsectionTextForUIText: function (uiText, str, lineWidth) {
        if (!this.isUITextObject(uiText)) {
            console.log("uiText parameter error");
            return;
        }

        if (typeof(lineWidth) !== 'number' || lineWidth <= 0) {
            console.log("lineWidth parameter error");
            return;
        }

        if (lineWidth < uiText.getFontSize()) {
            console.log("lineWidth less than fontSize");
            return;
        }

        if (typeof(str) !== 'string') {
            console.log("str parameter error");
            return;
        }

        uiText.ignoreContentAdaptWithSize(false);
        uiText.setTextAreaSize(cc.size(lineWidth, 0));
        uiText.setString(str);
        uiText.setTextAreaSize(uiText.getVirtualRendererSize());
    },

    isNodeObject: function (object) {
        return (object instanceof cc.Node);
    },

    isUISliderObject: function (object) {
        return (object instanceof ccui.Slider);
    },

    isWidgetObject: function (object) {
        return (object instanceof ccui.Widget);
    },

    isUITextObject: function (object) {
        return (object instanceof ccui.Text);
    },

    isUITextFieldObject: function (object) {
        return (object instanceof ccui.TextField);
    },

    isUIButtonObject: function (object) {
        return (object instanceof ccui.Button);
    },

    isUIImageViewObject: function (object) {
        return (object instanceof ccui.ImageView);
    },

    isUIPanelObject: function (object) {
        return (object instanceof ccui.Layout);
    },

    isUIListViewObject: function (object) {
        return (object instanceof ccui.ListView);
    },

    isUIPageViewObject: function (object) {
        return (object instanceof ccui.PageView);
    },

    isUIScrollViewObject: function (object) {
        return (object instanceof ccui.ScrollView);
    },

    isUIScale9SpriteObject: function (object) {
        return (object instanceof ccui.Scale9Sprite);
    },

    isSpriteObject: function (object) {
        return (object instanceof cc.Sprite);
    },

    /**
     * 绑定 UI 控件
     * @param object：被绑定的对象
     * @param uiFilePath：ui 文件路径
     *
     * eg：ui 文件中的所有控件都绑定到 object 中，命名规则为 下划线 + 控件名字（控件名以下划线开头的才会被绑定到 object 上）
     * 如 ui 中有个名字为 _backBtn 的按钮，则通过 object._backBtn 可得到对应名字的对象
     * 注册事件：只需要在 object 中定义函数名，事件函数名命名规则为 下划线 + 控件名字 + Touched
     * 如有个名字为 _backBtn 的按钮要注册事件，如果在 object 中定义了 _onBackBtnTouched，
     * 则会将事件函数绑定到 _backBtn 上，如没有则不会绑定，绑定事件的控件有
     * Button, ListView, PageView, ScrollView 4种类型的控件，代码详见 bindUIWidgetTouchListener
     */
    bindUIWidget: function (object, uiFilePath) {
        var rootJson = ccs.load(uiFilePath);
        var uiRoot = rootJson.node;
        this.bindUIWidgetToObject(object, uiRoot);
        return uiRoot;
    },

    /**
     * 绑定 UI 控件
     * @param object：被绑定的对象
     * @param uiRoot：ui 根
     */
    bindUIWidgetToObject: function (object, uiRoot) {
        if (!Util.isObject(object)) {
            console.log("object is not object type");
            return;
        }

        if (!this.isNodeObject(uiRoot)) {
            console.log("uiRoot is not node type");
            return;
        }

        var uiWidgetChildren = uiRoot.getChildren();
        for (var i = 0; i < uiWidgetChildren.length; i++) {
            var uiWidget = uiWidgetChildren[i];
            this._ignoreContentSize(uiWidget);
            this._handleUIWidget(object, uiWidget);
            this._handleSortViewGroup(object, uiWidget);
            this.bindUIWidgetToObject(object, uiWidget);
        }
    },

    _handleUIWidget: function (object, uiWidget) {
        var uiWidgetName = uiWidget.getName();
        //只绑定命名以下划线开头的控件
        if (Util.startsWithString(uiWidgetName, '_')) {
            object[uiWidgetName] = uiWidget;
            this.bindUIWidgetTouchListener(object, uiWidget);
        }
    },

    _handleSortViewGroup: function (object, uiWidget) {
        var uiWidgetName = uiWidget.getName();
        if (Util.endsWithString(uiWidgetName, '_')) {
            uiWidget.setBackGroundColorType(ccui.Layout.BG_COLOR_NONE);
            uiWidget.setTouchEnabled(false);

            var uiWidgets = uiWidget.getChildren();
            var sortViews = [];
            for (var i in uiWidgets) {
                sortViews.push(uiWidgets[i]);
            }

            sortViews.sort(function (a, b) {
                return (a.getPositionX() - b.getPositionX());
            });

            var sortViewGroup = new SortViewGroup();
            for (var j = 0; j < sortViews.length; j++) {
                var sortView = sortViews[j];
                sortViewGroup.addView(sortView);
            }
            var memberName = '_' + uiWidgetName.substring(0, uiWidgetName.length - 1);
            object[memberName] = sortViewGroup;

            if (object._sortViewGroupList == null) {
                object._sortViewGroupList = [];
            }
            object._sortViewGroupList.push(sortViewGroup);

            if (object.sortViewGroups == null) {
                object.sortViewGroups = function () {
                    for (var i in object._sortViewGroupList) {
                        object._sortViewGroupList[i].sort();
                    }
                }
            }
        }
    },

    _ignoreContentSize: function (uiWidget) {
        if (this.isUITextObject(uiWidget) || this.isUITextFieldObject(uiWidget)) {
            uiWidget.ignoreContentAdaptWithSize(true);
            var originalStr = uiWidget.getString();
            uiWidget.setString("");
            uiWidget.setString(originalStr);
        }
    },

    bindUIWidgetTouchListener: function (object, uiWidget) {
        if (!Util.isObject(object)) {
            console.log("object is not object type");
            return;
        }

        if (!this.isWidgetObject(uiWidget)) {
            console.log("uiWidget is not widget type");
            return;
        }

        var uiWidgetName = uiWidget.getName();
        if (!Util.startsWithString(uiWidgetName, '_')) {
            return;
        }

        //删除下划线
        uiWidgetName = uiWidgetName.substring(1);
        //将首字母转换为大写
        uiWidgetName = Util.upperFirstLetter(uiWidgetName);

        var touchListenerName = "_on" + uiWidgetName + "Touched";
        if (typeof object[touchListenerName] !== 'function') {
            return;
        }

        if (this.isUIButtonObject(uiWidget)) {
            uiWidget.addTouchEventListener(object[touchListenerName], object);
            return;
        }

        if (this.isUIListViewObject(uiWidget)) {
            uiWidget.addEventListener(object[touchListenerName], object);
            return;
        }

        if (this.isUIPageViewObject(uiWidget)) {
            uiWidget.addEventListener(object[touchListenerName], object);
            return;
        }

        if (this.isUIScrollViewObject(uiWidget)) {
            uiWidget.addEventListener(object[touchListenerName], object);
            return;
        }

        if (this.isUISliderObject(uiWidget)) {
            uiWidget.addEventListener(object[touchListenerName], object);
            return;
        }

        if (this.isUITextFieldObject(uiWidget)) {
            uiWidget.addEventListener(object[touchListenerName], object);
            return;
        }

        if (this.isUIPanelObject(uiWidget)) {
            uiWidget.addTouchEventListener(object[touchListenerName], object);
            return;
        }
    },

    /**
     * 将视图排序成 n 列
     * @param startPosition：起始位置
     * @param viewList：视图列表
     * @param horizontalInterval：水平间隔
     * @param verticalInterval：垂直间隔
     * @param col：列数
     */
    sortViewNCol: function (startPosition, viewList, horizontalInterval, verticalInterval, col, direction) {
        viewList = Util.spliceListToNCol(viewList, col);

        if (viewList.length == 0) {
            return;
        }

        if (viewList[0].length == 0) {
            return;
        }

        var yOffset = startPosition.y;
        var viewSize = viewList[0][0].getContentSize();

        for (var row = 0; row < viewList.length; row++) {
            var rowView = viewList[row];
            for (var col = 0; col < rowView.length; col++) {
                var view = rowView[col];
                var xOffset = startPosition.x + (horizontalInterval + viewSize.width) * col;
                view.setPosition(xOffset, yOffset);
            }

            direction = direction || Direction.topToBottom;
            if (direction == Direction.topToBottom) {
                yOffset -= viewSize.height;
                yOffset -= verticalInterval;
            } else if (direction == Direction.bottomToTop) {
                yOffset += viewSize.height;
                yOffset += verticalInterval;
            } else {
                console.log("direction error");
            }
        }
    },

    release: function (object) {
        if (object && object.release) {
            object.release();
        }
    },

    retain: function (object) {
        if (object && object.retain) {
            object.retain();
        }
    }
};
