var args,
	vars,
	callbacks;

init(arguments[0]);

/*
 params = {
 	url: '/webview/html/index.html',
 	onClick: function(e){},
 	onLongpress: function(e){},
 	onHidekeyboard: function(e){}
 }
 * */
function init(params) {
  	$.container.url = params.url;
}

/*
 params = {
 	eventName: 'app:comment', // required
 	longPressElement: '.comment-wrapper',
 	template: 'stories',
 	infinite: false
 }
 
 callbacks = {
 	reloadCallback: function(){}
 }
 */
exports.init = function(params, _callbacks) {
	args = params;
	callbacks = _callbacks;
	vars = {
		cache: [] // cache evalJS call, when webview is not ready, evalJS not run, have to wait for it ready
	};
	
	args.eventName += '_' + new Date().getTime() + '_';
	
	Ti.App.addEventListener(args.eventName + 'Click',  htmlClick);
	Ti.App.addEventListener(args.eventName + 'LongPress', htmlLongpress);
	Ti.App.addEventListener(args.eventName + 'HideKeyboard', hideKeyboard);
	
	if (callbacks.reloadCallback) {
        Ti.App.addEventListener(args.eventName + 'Reload', callbacks.reloadCallback);
    }
};

exports.unload = function() {
	if (vars.timeout) {
		clearTimeout(vars.timeout);
		vars.timeout = null;
	}
	
  	Ti.App.removeEventListener(args.eventName + 'Click',  htmlClick);
  	Ti.App.removeEventListener(args.eventName + 'LongPress', htmlLongpress);
  	Ti.App.removeEventListener(args.eventName + 'HideKeyboard', hideKeyboard);
  	
  	if (callbacks.reloadCallback) {
        Ti.App.removeEventListener(args.eventName + 'Reload', callbacks.reloadCallback);
    }
  	
	// fix scroll to top for iOS
	if (OS_IOS) {
		$.fakeScroller.scrollsToTop = false;
	}
  	
  	// if (OS_ANDROID) {
  		// $.container.release();
  	// }
};

/*
 params = {
 	callback: '',
 	params: {}
 }
 
 callback can be: 
 	init
 	updateByTemplate
 	updateByHtml
 	loadCarousel
  	updateElement
  	showAI
  	hideAI
 * */
exports.run = function(params) {
	vars.cache.push( params );
	checkCondition();
};

function checkCondition() {
  	if (vars.wvReady) {
  		var cache = vars.cache;
  		while (cache.length) {
  			var call = cache[0];
			run(call.params, call.callback);
			cache.splice(0, 1);
		}
	} else {
		vars.timeout = setTimeout(checkCondition, 300);
	}
}

function run(params, key) {
	var str = '();'; // default - if params is undefined
	
	if ( params ) {
		params.html && ( params.html = escape(params.html) );
		str = '(' + JSON.stringify(params) + ');';
				
	} else if ( params == '' ) { // params is ''
		str = '("");';
	}
	
	$.container.evalJS( key + str );
}

// fix scroll to top for iOS
function fixScrollIOS(e) {
  	if (e.y === 0) {
       	$.container.evalJS( 'updateViewport({ scrollToTop: true });' );
        $.fakeScroller.setContentOffset({ x: 0, y: 500 }, false );
    }
}

function wvLoaded(e) {
  	vars.wvReady = true;
  	$.container.evalJS( 'init(' + JSON.stringify(args) + ');' );
}

function htmlClick(e) {
	Ti.API.error('htmlClick: ' + JSON.stringify( e ));
	
	if (e.clickAction == '' && e.url) {
		var urlRegex    = new RegExp("^(http|https)://", "i");
		var phoneRegex  = /(\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-.]([0-9]{4}))/gi;
		// Check if href not a phone number
		if ( !phoneRegex.test( e.url ) ) {
			// Check href don't have http://
			if ( !urlRegex.test( e.url ) ) {
				var regUrl = /(((http:\/\/www\.)|(www\.)|(http:\/\/))[a-zA-Z0-9._-]+\.[a-zA-Z.]{2,5}$)/gi;
				e.url = 'http://' + e.url.match( regUrl );
			}
		}
		Ti.Platform.openURL( e.url );
		return false;
	}
	
  	$.trigger('click', e);
}

function htmlLongpress(e) {
  	$.trigger('longpress', e);
}

function hideKeyboard(e) {
  	$.trigger('hidekeyboard', e);
}