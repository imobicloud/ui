var vars;

$(function(){
	FastClick.attach(document.body);
	
	$('#container')
		.on('touchstart', touchstart)
		.on('touchmove',  touchmove)
		.on('touchend',   touchend);
	
	// fix Feed not display on Nexus 7 (Android 4.4.2)	
	if (androidVersion > 4.3) {
		$(document.body).css({
			'height': window.innerHeight,
			'position': 'relative'
		});
	}	
});

/*
 params = {
 	eventName: 'app:comment',
 	longPressElement: '.comment-wrapper',
 	templates: 'stories,comment',
 	infinite: true,
 	useHash: true,
 	useTag: true
 }
 * */
function init(params) {
	vars = params;
	vars.templatePromise = new $.Deferred();
	
	var templates = params.templates;
  	if (templates) {
  		var head = document.getElementsByTagName( 'head' )[0],
  			arrTemplates = templates.split(','),
  			promises = [];
  			
		for(var i=0,ii=arrTemplates.length; i<ii; i++){
			var template = arrTemplates[i];
			
			var deferred = new $.Deferred();
			globals[ template + 'Deferred' ] = deferred;
			promises.push(deferred.promise());
			
			var link = document.createElement('link');
	     	link.rel = 'stylesheet';
	     	link.href = 'css/templates/' + template + '.css';
	     	head.appendChild(link);
			
		  	var script = document.createElement( 'script' );
			script.type = 'text/javascript';
			script.src = 'js/templates/' + template + '.jsss';
			head.appendChild( script );
		};
		
		$.when.apply(this, promises)
			.done(function(){
				setTimeout(function(){ vars.templatePromise.resolve(); }, 300);
				globals = null;
			});
  	} else {
  		vars.templatePromise.resolve();
  	}
}

/*
 params = {
 	container: '#aaa',
 	template: '',
 	data: [],
 	
 	isReset: true,
 	at: 'bottom', // top or bottom, used when isReset is false
 	
 	scrollToBottom: false,
 	scrollToTop: false,
 	hideAI: true
 }
 * */
function updateByTemplate(params) {
	// vars.templatePromise
		// .promise()
		// .then(function(){
			var html = $.templates[params.template].render(params.data);
			
			if (params.isReset) {
				$(params.container || '#container').html( html );
			} else {
				$(params.container || '#container')[ params.at != 'top' ? 'append' : 'prepend' ]( html );
			}
			
			updateViewport(params);
			
			vars.infinite && loadInfinite();
			
			if (params.hideAI !== false) {
				hideAI();
			}
		// });
}

/*
 params = {
 	container: '#aaa',
 	html: '',
 	
 	isReset: true,
 	at: 'bottom', // top or bottom, used when isReset is false
 	
 	scrollToBottom: false,
 	scrollToTop: false,
 	hideAI: true
 }
 * */
function updateByHtml(params) {
	// vars.templatePromise
		// .promise()
		// .then(function(){
			if (params.isReset) {
				$(params.container || '#container').html( unescape(params.html) );
			} else {
				$(params.container || '#container')[ params.at != 'top' ? 'append' : 'prepend' ]( unescape(params.html) );
			}
			
			updateViewport(params);
			
			vars.infinite && loadInfinite();
			
			if (params.hideAI !== false) {
				hideAI();
			}
		// });
}

function loadInfinite(e) {
	// https://github.com/mrjoelkemp/jquery.bum-smack
	$(window).smack({ threshold: 0.8 })
	    .done(function () {
	    	showAI();
	    	fireEvent(e, 'more');
	    });
}

function updateViewport(params) {
  	if (params.scrollToBottom) {
		$("html, body").animate({ scrollTop: $(document).height() }, "slow");
	} else if (params.scrollToTop) {
		$("html, body").animate({ scrollTop: 0 }, "slow");
	}
}

function showAI() {
	$('#ai').show();
}

function hideAI() {
	$('#ai').hide();
}

/*
 params = { selector: '.story-photos' }
 * */
function loadCarousel(params) {
	// vars.templatePromise
		// .promise()
		// .then(function(){
			$('#container ' + params.selector).each(function(index, obj){
		  		new IScroll(obj, {
		  			disableMouse: true,
		    		disablePointer: true,
		    		momentum: false,
		    		scrollX: true,
					scrollY: false,
					snap: 'li',
					snapSpeed: 400
				});
			});
		// });
}

/*
 params = {
 	selector: '.abc',
 	styles: { "background-color": "#ffe", "border-left": "5px solid #ccc" },
 	properties: { key: value },
 	data: { key: value },
 	html: ''
 }
 * */
function updateElement(params) {
	// vars.templatePromise
		// .promise()
		// .then(function(){
			// params = JSON.parse(params);
	
		  	var element = $('#container ' + params.selector);
		  	
		  	if (params.styles) {
		  		element.css( params.styles );
		  	}
		  	
		  	var properties = params.properties;
		  	if (properties) {
		  		for (key in properties) {
		  			if (properties.hasOwnProperty(key)) {
		  				element.prop(key, properties[key]);
		  			}
		  		}
		  	}
		  	
		  	var data = params.data;
		  	if (data) {
		  		for (var key in data) {
		  			if (data.hasOwnProperty(key)) {
		  				element.data(key, data[key]);
		  			}
		  		}
		  	}
		  	
		  	if (params.html) {
		  		element.html( unescape(params.html) );
		  	}	
		// });
}

/*
 params = [{
 	selector: '.abc',
 	styles: { "background-color": "#ffe", "border-left": "5px solid #ccc" },
 	properties: { key: value },
 	data: { key: value },
 	html: ''
 }]
 * */
function updateElements(params) {
	for(var i=0,ii=params.length; i<ii; i++){
	  	updateElement(params[i]);
	};
}

function touchstart(e) {
    vars.touching = true;
    vars.timer = setTimeout(htmlLongPressed, 500);
    vars.touchEvent = e;
};

function touchmove(e) {
  	vars.touching = false;
}

function touchend(e) {
	if (vars.touching) {
		vars.touching = false;
		clearTimeout(vars.timer);
		vars.touchEvent = null;
		htmlClicked(e);
	}
}

function htmlClicked(e) {
	e.preventDefault();
	e.stopPropagation();
	
	fireEvent(e, 'keyboard');
	
	var element = e.target;
		
	if (element.nodeName != 'A') {
		element = element.parentNode;
	}
	
  	if (element.nodeName == 'A') {
  		var hash = element.hash;
  		if (hash == '#see_more_content') {
  			$(element).parent().html( parseHTML(unescape($(element).data('content'))) );
  		} else {
  			var data = $(element).data();
	  		data.clickAction = hash;
	  		fireEvent(e, 'click', data);
  		}
  	} else {
  		while (element) {
  			var data = $(element).data();
  			if ( data.touchAction == null ) {
  				element = element.parentNode;
  			} else {
  				fireEvent(e, 'click', data);
  				break;
  			}
  		}
  	}
}

function fireEvent(e, type, data) {
	e.preventDefault();
	e.stopPropagation();
	
  	Ti.App.fireEvent(vars.eventName, { etype: type, data: data });
}

function htmlLongPressed(e) {
  	if (vars.touching && vars.longPressElement) {
  		vars.touchEvent.stopPropagation();
  		
  		vars.touching = false;
  		
  		var element = $(vars.touchEvent.target).closest( vars.longPressElement ); 
  		if (element.length) {
	  		fireEvent(e, 'longpress', element.data());
  		}
  		
  		vars.touchEvent = null;
  	}
}

function stringify(obj) {
  	return typeof obj == 'object' ? JSON.stringify(obj) : obj;
}

function truncate(text, limit, showReadMore) {
  	if (text.length <= limit) {
		return parseHTML(text);
	} else {
		var str = text.substr(0, limit);
		str = str.substr(0, str.lastIndexOf(' '));// remove the last word to ensure #aaa or @aaa not being cut
		return parseHTML(str) + (showReadMore !== false ? ' ... <a href="#see_more_content" data-content="' + escape(text) + '">Read More</a>' : ' ...');
	}
}

function parseHTML(text) {
	var lineRegex    = /\r?\n/g;
	var phoneRegex   = /(\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-.]([0-9]{4}))/gi;
	// http://blog.mattheworiordan.com/post/13174566389/url-regular-expression-for-links-with-or-without-the
    var urlRegex 	 = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/gi;
    
    var html = text
        .replace(lineRegex,    '<br/>')
        .replace(urlRegex,     '<a href="#" data-url="$1">$1</a>')
		.replace(phoneRegex,   '<a href="#" data-url="tel:$1">$1</a>');
    
    if (vars.useHash !== false) {
    	var hashTagRegex = /(^|\B)#(([a-zA-Z_]+\w*)|(\d+([,.]\d+)?))/gi;
    	html = html.replace(hashTagRegex, '$1<a href="#hash" data-hash="$2">#$2</a>');
    }
    
    if (vars.useTag !== false) {
    	var mentionRegex = /(^|\s)@(\w+)/gi;
    	html = html.replace(mentionRegex, '$1<a href="#profile" data-user-name="$2">@$2</a>');
    }
    
    return html;
};

function formatTime(time) {
  	return moment(time).fromNow();
}