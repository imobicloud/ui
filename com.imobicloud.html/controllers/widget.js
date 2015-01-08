var eventName = 'app:' + new Date().getTime(),
	cache = [{
		callback: 'UTILS.init',
		params: eventName
	}],
	wvReady = false;

init(arguments[0]);

/*
 params = {
 	csss: 'templates/stories,templates/comment',
 	scripts: 'libs/Event.min,templates/stories,templates/comment',
 	
 	url: '/webview/html/index.html'
 }
 * */
function init(params) {
	var html = Ti.Filesystem.getFile( Ti.Filesystem.resourcesDirectory, params.url || '/webview/html/index.html' ).read().toString(),
  		csss = params.csss ? params.csss.split(',') : [],
  		scripts = params.scripts ? params.scripts.split(',') : [],
  		css = [],
  		script = [];
	
	csss.unshift( 'index' );
	scripts.unshift( 'libs/jquery-2.1.1.min', 'libs/fastclick', 'index' );
	
	for(var i=0,ii=csss.length; i<ii; i++){
		css.push(' <link rel="stylesheet" href="webview/html/css/' + csss[i] + '.css"> ');
	}
	
	for(var i=0,ii=scripts.length; i<ii; i++){
		script.push(' <script src="webview/html/js/' + scripts[i] + '.jsss"></script> ');
	}
	
	$.container.html = html
		.replace('<!-- CSS PLACEHOLDER -->', css.join('\n\t'))
		.replace('<!-- JS PLACEHOLDER -->', script.join('\n\t'));
	
  	//
  	
  	Ti.App.addEventListener(eventName,  fireEvent);
  	
  	Ti.API.info('com.imobicloud.html:load ' + eventName);
}

exports.unload = function() {
  	Ti.App.removeEventListener(eventName,  fireEvent);
  	
  	// if (OS_ANDROID) {
  		// $.container.release();
  	// }
  	
  	Ti.API.info('com.imobicloud.html:unload ' + eventName);
};

/*
 params = {
 	callback: '', 	// name of the function you want to run
 	params: {}		// params for that function
 }
 * */
exports.run = function(params) {
	cache.push( params );
	checkCondition();
};

function checkCondition() {
  	if (wvReady) {
  		while (cache.length) {
  			var call = cache[0];
			run(call.params, call.callback);
			cache.splice(0, 1);
		}
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

function wvLoaded(e) {
  	wvReady = true;
  	checkCondition();
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