/*
 args = {
 	classes: null,
 	height: null,
 	maxHeight: 80,
 	hintText: 'Enter message...'
 }
 * */
var args = arguments[0] || {};
args.maxHeight = args.maxHeight || 80;

init();
function init() {
	var style;
	
	if (args.classes) {
		style = $.createStyle({ classes: args.classes });
		$.getView().applyProperties(style);
	} else {
		style = {};
	}
	
	if (style.height) {
		$.textarea.height = parseInt(style.height, 10);
	} else {
		$.textarea.addEventListener('postlayout', textareaPostlayout);
	}
	
	if (args.hintText) {
		if (OS_IOS) {
			$.hint.text = args.hintText;
		} else {
			$.textarea.hintText = args.hintText;
		}
	}
};

function textareaChange(e) {
	var value = e.value;
	
	// toggle hint text
  	if (OS_IOS) {
  		if (value.length > 0) {
			$.hint.hide();
		} else {
			$.hint.show();
		}
  	}
  	
  	// reset textarea height
  	if (this._len && value.length < this._len) {
  		this.height = Ti.UI.SIZE;
  	}
  	
  	$.trigger('change', { value: value });
}

// limit textarea height, less than args.maxHeight
function textareaPostlayout(e) {
  	if (this.rect.height > args.maxHeight) {
  		this._len = this.value.length;
  		this.height = args.maxHeight;
  	}
  	
  	$.trigger('resize', { height: this.rect.height });
}

exports.getHeight = function() {
	return $.textarea.rect.height;
};

exports.getValue = function() {
	return $.textarea.value.trim();
};

exports.setValue = function(value) {
    if (OS_IOS) {
        if (value.length > 0) {
            $.hint.hide();
        } else {
            $.hint.show();
        }
    }
        textareaChange($.textarea);
	return $.textarea.value = value;
};

exports.updateUI = function(style) {
	$.getView().applyProperties(style);
};
