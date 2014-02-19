var callback;

exports.show = function(fnc, date) {
	callback = fnc;
	
	if (OS_IOS) {
		$.datePicker.value = date || null;
		$.container.show();
	} else {
		var options = { callback: setTime, okButtonTitle: 'Set', title: 'Select Date' };
		if (date) { 
			options.value = date; 
		}
		Ti.UI.createPicker().showDatePickerDialog(options);
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
		callback( $.datePicker.value );
	} else {
	    //TODO: callback is called double.
		if (e.cancel === false) {
			callback( e.value );
		}
	}
}