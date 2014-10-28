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
 	classes: '',
 	persistent: 'false',
 	visible: 'false'
 }
 * */
function loadContent(args) {
	if (args.persistent != 'true') {
		$.overlay.addEventListener('click', hideDialog);
	}
	
	if (args.classes) {
		$.addClass($.container, args.classes);
	}
	
	if (args.children) {
		_.each(args.children, function(child) {
			$.container.add(child);
		});
		
		delete args.id;
		delete args.children;
	}
	
	if (args.visible == 'true') {
		var dialog = $.getView();
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