// https://github.com/raymondkam/Ti.SwipeRefreshLayout
// https://github.com/iskugor/Ti.SwipeRefreshLayout

var refreshControl;

init(arguments[0] || {});

/*
 args = {
 	onRefresh: function(e){ e.endRefreshing(); }
 }
 * */
function init(args) {
  	if (!_.isArray(args.children) || !_.contains(['Ti.UI.ListView', 'Ti.UI.TableView'], args.children[0].apiName)) {
		console.error('[pullToRefresh] is missing required Ti.UI.ListView or Ti.UI.TableView as first child element.');
		return;
	}

	var list = args.children[0];
	delete args.children;

	if (OS_IOS) {
		refreshControl = Ti.UI.createRefreshControl();
		refreshControl.addEventListener('refreshstart', onRefresh);
		list.refreshControl = refreshControl;
		$.addTopLevelView(list);
	} else {
		refreshControl = require('com.rkam.swiperefreshlayout').createSwipeRefresh({ view : list });
		refreshControl.addEventListener('refreshing', onRefresh);
		$.addTopLevelView(refreshControl);
	}
	
	// exports.beginRefreshing = beginRefreshing;
	// exports.endRefreshing = endRefreshing;
	exports.refresh = refresh;
}

function refresh() {
  	beginRefreshing();
  	onRefresh();
}

function beginRefreshing() {
	if (OS_IOS) {
		refreshControl.beginRefreshing();
	} else if (OS_ANDROID) {
		refreshControl.setRefreshing(true);
	}
};

function endRefreshing() {
	if (OS_IOS) {
		refreshControl.endRefreshing();
	} else if (OS_ANDROID) {
		refreshControl.setRefreshing(false);
	}
};

function onRefresh() {
  	$.trigger('refresh', {
    	source: $,
    	endRefreshing: endRefreshing
  	});
}