var callback;

exports.show = function(fnc, time) {
	callback = fnc;
	
	if (OS_IOS) {
		$.timePicker.value = time || null;
		$.container.show();
	} else {
		var options = { callback: setTime, okButtonTitle: 'Set', title: 'Select Time' };
		if (time) { 
			options.value = time; 
		}
		Ti.UI.createPicker().showTimePickerDialog(options);
	}
};

function hidePicker(e) {
  	if (OS_IOS) {
		$.container.hide();
	} else {
		
	}
}

exports.hide = hidePicker;

function setTime(e) {
	if (OS_IOS) {
		callback( $.timePicker.value );
	} else {
	    //TODO: callback is called double.
		if (e.cancel === false) {
			callback( e.value );
		}
	}
}