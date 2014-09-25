var config,
	textfield;

init(arguments[0] || {});
function init(args) {
	if (args.children) {
		_.each(args.children, function(child) {
			$.container.add(child);
		});
		
		delete args.id;
		delete args.__parentSymbol;
		delete args.children;
	}
}

/*
 params = {
 	toolbarHeight: 40,
 	keyboardHeight: 216
 }
 * */
exports.init = function(txt, params) {
	textfield = txt.parent;
	
	config = params || {};
	config.keyboardHeight == null && (config.keyboardHeight = 216);
	config.toolbarHeight  == null && (config.toolbarHeight  = 40);
	config.totalHeight = config.toolbarHeight + config.keyboardHeight;
	
	if (OS_ANDROID) {
		txt.addEventListener('blur', show);
		txt.addEventListener('click', hide);
	}
	
	textfield.bottom = config.totalHeight;
	$.container.height = config.totalHeight;
};

function show(e) {
	textfield.bottom = config.totalHeight;
  	$.container.bottom = 0;
}
exports.show = show;

function hide(e) {
	textfield.bottom = config.toolbarHeight;
  	$.container.bottom = -config.keyboardHeight;
}
exports.hide = hide;