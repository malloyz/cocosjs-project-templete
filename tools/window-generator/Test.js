/**
 * Created by malloyzhu on 2016/7/20
 */

var Test = WindowBase.extend({
	ctor: function () {
		this._super();
		
	},

	onShowNotify: function () {
		
	},

	onShow: function () {
		
	},

	onHideNotify: function () {
		
	},

	onHide: function () {
		
	},

	onDestroyNotify: function () {
		
	},

	onDestroy: function () {
		
	},

	onCover: function () {
		
	},

	onResume: function () {
		
	}
});

Test.GetInstance = function () {
	if (null == Test._instance) {
		Test._instance = new Test();
	}
	return Test._instance;
};

Test.Show = function () {
	var instance = Test.GetInstance();
	WindowManager.GetInstance().showWindow(instance, null, true, 10, false, null, null);
};

Test.Hide = function () {
	WindowManager.GetInstance().hideWindow(Test._instance);
};

Test.Destroy = function () {
	WindowManager.GetInstance().destroyWindow(Test._instance);
	Test._instance = null;
};
