loadContent(arguments[0] || {});

exports.show = function() {
	var dialog = $.getView();
	dialog.visible = true;
	dialog.animate({ opacity : 1 });
};

function hideDialog(e) {
	var dialog = $.getView();
	
	// if (e && e.source && e.source.id == 'overlay') {
		dialog.fireEvent('dialog:cancel');
		// usage: $.dialog.getView().addEventListener('dialog:cancel', function(){});
	// }
	
	dialog.animate({ opacity : 0 }, function() { 
		dialog.visible = false; 
	});
}

exports.hide = hideDialog;

/*
 args = {
 	classes: '',
 	persistent: 'false'
 }
 * */
function loadContent(args) {
	if (args.classes) {
		$.addClass($.container, args.classes);
	}
	
	if (args.persistent != 'true') {
		$.overlay.addEventListener('click', hideDialog);
	}
	
	if (args.children) {
		_.each(args.children, function(child) {
			$.container.add(child);
		});
		
		delete args.id;
		delete args.children;
	}
}