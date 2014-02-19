var aiTimeout,
	args = arguments[0] || {};

if (args.visible) {
	showAI(args.message);
}

exports.toggle = function(visible, message, timeout) {
	if (aiTimeout) {
		clearTimeout(aiTimeout);
		aiTimeout = null;
	}
	
	if (visible) {
		showAI(message);
		
		if (timeout) {
			aiTimeout = setTimeout(function(){
				Ti.UI.createAlertDialog({
					buttonNames : ['OK'],
					message : 'Activity timeout',
					title : 'Error'
				}).show(); 
			}, timeout);
		}
	} else {
		$.loadingSpinner.hide();
		$.ai.visible = false;
	}
};

exports.unload = function() {
  	if (aiTimeout) {
		clearTimeout(aiTimeout);
		aiTimeout = null;
	}
};

function showAI(message) {
  	message && ($.loadingMessage.text = message);
	$.loadingSpinner.show();
	$.ai.visible = true;
}