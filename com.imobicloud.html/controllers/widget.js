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
  	
  	Ti.API.info('com.imobicloud.html:load ' + args.eventName);
}

exports.unload = function() {
	if (vars.timeout) {
		clearTimeout(vars.timeout);
		vars.timeout = null;
	}
	
  	Ti.App.removeEventListener(args.eventName,  fireEvent);
  	
  	// if (OS_ANDROID) {
  		// $.container.release();
  	// }
  	
  	Ti.API.info('com.imobicloud.html:unload ' + args.eventName);
};

/*
 params = {
 	callback: '', 	// name of the function you want to run
 	params: {}		// params for that function
 }
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
	Ti.API.info('com.imobicloud.html:fireEvent ' + JSON.stringify( e ));
	
  	var callbacks = events[e.etype];
  	if (callbacks) {
  		for(var i=0,ii=callbacks.length; i<ii; i++){
			callbacks[i](e);
		};
  	}
}