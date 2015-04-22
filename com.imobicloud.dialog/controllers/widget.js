var events = {};

loadContent(arguments[0] || {});

exports.show = function(callback) {
	var dialog = $.getView();
	dialog.visible = true;
	dialog.animate({ opacity : 1 }, callback || function() {});
};

function hideDialog(e) {
	$.getView().animate({ opacity : 0 }, function() { 
		$.getView().visible = false;
		fireEvent('dialog:cancel'); 
	});
}

exports.hide = hideDialog;

/*
 args = {
 	persistent: 'false',
 	visible: 'false',
 	zIndex: 1
 }
 * */
function loadContent(args) {
	if (args.persistent != 'true') {
		$.overlay.addEventListener('click', hideDialog);
	}
	
	if (args.children) {
		var container = $.getView();
		_.each(args.children, function(child) {
			container.add(child);
		});
		
		delete args.id;
		delete args.children;
	}
	
	var dialog = $.getView();
	
	if (args.zIndex) {
		dialog.zIndex = args.zIndex;
	}
	
	if (args.visible == 'true') {
		dialog.opacity = 1;
		dialog.visible = true;
	}
}

// EVENTS

function fireEvent(type, data) {
  	var callbacks = events[type];
  	if (callbacks) {
  		for(var i=0,ii=callbacks.length; i<ii; i++){
			callbacks[i](data, { type: type });
		};
  	}
}

exports.on = function(type, callback) {
	if (events[type]) {
  		events[type].push(callback);
  	} else {
  		events[type] = [callback];
  	}
  	return this;
};