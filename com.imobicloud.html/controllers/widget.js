var args,
	vars;

init(arguments[0]);

/*
 params = {
 	eventName: 'app:comment',
 	template: 'stories',
 	url: '/webview/html/index.html'
 }
 * */
function init(params) {
	args = params;
	args.eventName += '_' + new Date().getTime();
	
	vars = {
		cache: [] // cache evalJS call, when webview is not ready, evalJS not run, have to wait for it ready
	};
	
  	$.container.url = params.url;
  	
  	Ti.App.addEventListener(args.eventName,  fireEvent);
}

exports.unload = function() {
	if (vars.timeout) {
		clearTimeout(vars.timeout);
		vars.timeout = null;
	}
	
  	Ti.App.removeEventListener(args.eventName,  fireEvent);
  	
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
	
	$.container.evalJS( 'vars.templatePromise.promise().then(function(){ ' + key + str + ' });' );
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

//

var events = {};

exports.on = function(type, callback) {
	if (events[type]) {
  		events[type].push(callback);
  	} else {
  		events[type] = [callback];
  	}
  	return this;
};

function fireEvent(e) {
	Ti.API.error('fireEvent: ' + JSON.stringify( e ));

	// if (e.clickAction == '' && e.url) {
		// var urlRegex    = new RegExp("^(http|https)://", "i");
		// var phoneRegex  = /(\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-.]([0-9]{4}))/gi;
		// // Check if href not a phone number
		// if ( !phoneRegex.test( e.url ) ) {
			// // Check href don't have http://
			// if ( !urlRegex.test( e.url ) ) {
				// var regUrl = /(((http:\/\/www\.)|(www\.)|(http:\/\/))[a-zA-Z0-9._-]+\.[a-zA-Z.]{2,5}$)/gi;
				// e.url = 'http://' + e.url.match( regUrl );
			// }
		// }
		// Ti.Platform.openURL( e.url );
		// return false;
	// }
	
  	var callbacks = events[e.etype];
  	if (callbacks) {
  		for(var i=0,ii=callbacks.length; i<ii; i++){
			callbacks[i](e);
		};
  	}
}