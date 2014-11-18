var args 		= arguments[0],
	timeout 	= args.timeout,
	callback 	= args.callback,
	timer;

init();
function init() {
	var classes = args.type || 'error';
	
	$.addClass($.getView(), 'toast-' + classes);
		$.addClass($.icon.parent, 'toast-wrapper-' + classes);
			args.icon && $.addClass($.icon, 'toast-icon-' + classes);
			$.addClass($.title.parent, 'toast-inner-' + classes);
				args.title && $.addClass($.title, 'toast-title-' + classes);
				$.addClass($.message, 'toast-message-' + classes);
	
	if (args.icon) {
		$.icon.image = args.icon;
	} else {
		$.icon.parent.remove($.icon);
		$.icon = null;
	}
	
	if (args.title) {
		$.title.text = args.title;
	} else {
		$.title.parent.remove($.title);
		$.title = null;
	}
	
	$.message.text = args.message;
	
	timer = setTimeout(messageTimeout, args.duration || 3000);
}

function messageTimeout() {
	timeout && timeout();
  	hideMe();
}

function messageClick(e) {
  	clearTimeout(timer);
  	callback && callback(e);
  	hideMe();
}

function hideMe(e) {
  	var container = $.getView(); 
  	container.parent.remove(container);
  	container.fireEvent('toast:hide');
}