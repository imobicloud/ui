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
				var dialog = Ti.UI.createAlertDialog({
					buttonNames : ['OK'],
					message : 'Activity timeout',
					title : 'Error'
				});
				dialog.show();
				dialog.addEventListener('click', hideAI);
			}, timeout);
		}
	} else {
		hideAI();
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

function hideAI() {
  	$.loadingSpinner.hide();
	$.ai.visible = false;
}