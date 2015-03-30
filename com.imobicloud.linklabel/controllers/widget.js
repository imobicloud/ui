init(arguments[0] || {});

/*
 args = {
 	classes: null,
 	text: ''
 }
 * */
function init(args) {
	args.classes && $.label.applyProperties( $.createStyle({ classes: args.classes }) );
	
	var text = args.text;
  	if (text) {
  		var links = getLinks(text);
  		
  		if (OS_IOS) {
  			// var attributedString = Ti.UI.iOS.createAttributedString({ text: text });
		  	// for(var i = 0, ii = links.length; i < ii; i++) {
		  		// var link = links[i];
				// attributedString.addAttribute({
					// type: Ti.UI.iOS.ATTRIBUTE_LINK,
		            // value: link,
		            // range: [text.indexOf(link), link.length]
				// });
			// };
		  	// $.label.attributedString = attributedString;
		  	
		  	$.label.value = text;
  		} else {
  			// update for Alloy.js + tiapp.xml as this: http://fokkezb.nl/2013/08/26/url-schemes-for-ios-and-android-1/
  			// TODO: wait for https://jira.appcelerator.org/browse/TIMOB-18048
  			
  			// for(var i = 0, ii = links.length; i < ii; i++) {
		  		// var link = links[i];
				// text = text.replace(link, '<a href="linklabel://' + link + '">' + link + '</a>');
			// };
  			// $.label.html = text;
  			
  			$.label.text = text;
  		}
  	}
}

function getLinks(text) {
	// /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
  	var urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/gi,
  		links = [],
  		parts;
  	
  	while ((parts = urlRegex.exec(text)) != null) {
	    if (parts.index === urlRegex.lastIndex) {
	        urlRegex.lastIndex++;
	    }
	    links.push(parts[1]);
	}
	
	return links;
}

// IOS

function labelLink(e) {
	// e.cancelBubble = true;//TODO: is this necessary?
  	$.trigger('link', e);
}

// ANDROID

function labelClick(e) {
  	Ti.API.error('com.imobicloud.linklabel:labelClick ' + JSON.stringify( e ));
}