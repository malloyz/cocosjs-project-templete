/**
 * Created by %userName% on &date&
 */

var #ClassName# = WindowBase.extend({
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

#ClassName#.GetInstance = function () {
	if (null == #ClassName#._instance) {
		#ClassName#._instance = new #ClassName#();
	}
	return #ClassName#._instance;
};

#ClassName#.Show = function () {
	var instance = #ClassName#.GetInstance();
	WindowManager.GetInstance().showWindow(instance, null, true, 10, false, null, null);
};

#ClassName#.Hide = function () {
	WindowManager.GetInstance().hideWindow(#ClassName#._instance);
};

#ClassName#.Destroy = function () {
	WindowManager.GetInstance().destroyWindow(#ClassName#._instance);
	#ClassName#._instance = null;
};
