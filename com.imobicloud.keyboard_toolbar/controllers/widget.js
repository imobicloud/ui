var config,
	keyboardHeight,
	totalHeight,
	time;

init(arguments[0] || {});
function init(args) {
	if (args.children) {
		_.each(args.children, function(child) {
			$.container.add(child);
		});
		
		delete args.id;
		delete args.children;
	}
}


/*
 params = {
 	height: 40,
 	textfield: txt,
 	persistent: false,
 	window: win
 }
 * */
exports.init = function(params) {
	config = _.extend({ height: 40, persistent: false }, params);
	
	config.textfield.bottom = config.height;
	
	if (OS_IOS) {
		Ti.App.addEventListener('keyboardframechanged', updateUI);
	} else {
		config.textfield.addEventListener('click', toggle);
		config.textfield.addEventListener('focus', toggle);
		config.textfield.addEventListener('blur', toggle);
	}
};

exports.unload = function() {
	if (OS_IOS) {
		Ti.App.removeEventListener('keyboardframechanged', updateUI);
	} else {
		config.textfield.removeEventListener('click', toggle);
		config.textfield.removeEventListener('focus', toggle);
		config.textfield.removeEventListener('blur', toggle);
	}
	
	config = null;
};

function updateUI(e) {
	if (Ti.App.keyboardVisible) {
		keyboardHeight = e.keyboardFrame.height;
		totalHeight = keyboardHeight + config.height;
		
		config.textfield.bottom = totalHeight;
  		$.container.bottom = keyboardHeight;
  		
  		fireEvent(true);
	} else {
		if (config.persistent !== true) {
			config.textfield.bottom = config.height;
	  		$.container.bottom = 0;
		}
		
		fireEvent(false);
	}
}

function toggle(e) {
	var now = new Date().getTime();
	if (e.type != 'blur') {
		// TODO: Android: blur also fire focus event
		if (now - time < 500) { return; }
		
		if (keyboardHeight == null) {
			keyboardHeight = 300; //TODO: get Keyboard size
			totalHeight = keyboardHeight + config.height;
		}
		
		config.textfield.bottom = config.height;
  		$.container.bottom = 0;
		
		fireEvent(true);
	} else {
		time = now;
		
		config.textfield.bottom = totalHeight;
  		$.container.bottom = keyboardHeight;
		
		fireEvent(false);
	}
}

function fireEvent(visible) {
  	config.textfield.fireEvent('keyboard:toggle', { visible: visible, height: keyboardHeight });
}