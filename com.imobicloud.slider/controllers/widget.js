/*
 args = {
 	min: 0,
 	max: 100,
 	values: [20, 80],
 	onChange: function(type, values){}
 }
 * */
var args = arguments[0] || {},
	handlers = {},
	vars = {};

exports.addEventListener = function(type, callback) {
	if (handlers[type] == null) {
		handlers[type] = [];
	}
	handlers[type].push(callback);
};

exports.removeEventListener = function(type, callback) {
	if (handlers[type]) {
		var index = handlers[type].indexOf(callback);
		index != -1 && handlers[type].splice(index, 1);
	}
};

init();
function init() {
	var tssclass = args.tssclass,
		// lastValue = 0,
		values = args.values = JSON.parse(args.values);
	
  	for(var i=0,ii=values.length; i<ii; i++){
		var index = i + 1,
			// value = values[i],
			thumb = $.UI.create('View', { dataIndex: index, classes: 'slider-thumb slider-thumb-' + tssclass + '-' + index }), // , center: { x: value + '%', y: '50%' }
			track = $.UI.create('View', { classes: 'slider-track slider-track-' + tssclass + '-' + index }); // , left: lastValue + '%', width: (value - lastValue) + '%'
		
		$.slider.add(track);
		$.slider.add(thumb);
		
		thumb.addEventListener('touchstart', touchstart);
		thumb.addEventListener('touchmove', touchmove);
		thumb.addEventListener('touchend', touchend);
		thumb.addEventListener('touchcancel', touchcancel);
		
		vars['thumb_' + index] = thumb;
		vars['track_' + index] = track;
		
		// lastValue = value;
	};
	
	vars.valueRange = args.max - args.min;
}

function slide() {
	var index = ++vars.lastIndex,
		value = args.values[index];
		
  	if (value != null) {
  		var _index = index + 1,
  			lastDest = vars.lastDest || vars.leftRange,
	  		dest = vars.leftRange + percentToPoint(value);
	  	
	  	var thumb = vars['thumb_' + _index],
	  		centerY = vars.centerY;
	  	thumb.center = { x: lastDest, y: centerY };
	  	thumb.opacity = 1;
  		thumb.animate({
  			center: { x: dest, y: centerY },
  			duration: 1000
  		}, slide);	
  		
  		var track = vars['track_' + _index];
  		track.left = lastDest;
  		track.opacity = 1;
  		track.animate({
  			width: dest - lastDest,
  			duration: 1000
  		});	
  		
  		vars.lastDest = dest;
  		vars.lastIndex = index;
  	}
}

function postlayout(e) {
	$.slider.removeEventListener('postlayout', postlayout);

	var left  = Math.floor( vars['thumb_1'].rect.width / 2 ),
		width = Math.floor( $.slider.rect.width - left - Math.floor( vars['thumb_' + args.values.length].rect.width / 2 ) );
	$.track.applyProperties({ left: left, width: width, opacity: 1 });
	
	vars.leftRange  = left;
	vars.slideRange = width;
	vars.centerY    = $.slider.rect.height / 2;
	
	vars.lastIndex = -1;
	slide();
}

function touchstart(e) {
	e.cancelBubble = true;
  	vars.targetIndex = e.source.dataIndex;
  	vars.x = e.x;
  	
  	Ti.API.error('Quang:vars.targetIndex ' + JSON.stringify( vars.targetIndex ));
}

function touchend(e) {
	e.cancelBubble = true;
  	if (vars.targetIndex == null) { return; }
  	vars.targetIndex = null;
  	
  	var callbacks = handlers['change'];
  	if (callbacks) {
  		for(var i=0,ii=callbacks.length; i<ii; i++){
			var type = vars.targetIndex == 'thumb_1' ? 1 : 2;
			callbacks[i]( type, getValue(type) );
	  	};
  	}
}

function touchcancel(e) {
	e.cancelBubble = true;
  	vars.targetIndex = null;
}

function touchmove(e) {
	e.cancelBubble = true;
	if (vars.targetIndex == null) { return; }
	
  	var pos = e.source.convertPointToView({ x: e.x, y: e.y }, $.track);
  	if (pos < 0) { pos = 0; }
  	if (pos > vars.slideRange) { pos = vars.slideRange; }
  	
  	var values = args.values,
  		index = vars.targetIndex,
  		newPos = pos.x - vars.x;
  		
  	newPos = vars.leftRange + validate(values[index - 2], newPos, values[index]);
  	
  	vars['thumb_' + index].center = { x: newPos, y: vars.centerY };
  	// vars['track_' + index].width = ;
}

function validate(min, value, max) {
	var minPos = percentToPoint(min || args.min),
		maxPos = percentToPoint(max || args.max);
	
	Ti.API.error('Quang:min ' + minPos + ' pos ' + value + ' max ' + maxPos);
	
  	if (value < minPos) {
  		return minPos;
  	} else if (value > maxPos) {
		return maxPos;
	} else {
		return value;
	}
}

function percentToPoint(percent) {
	var point = Math.floor( percent * vars.slideRange / vars.valueRange );
	if (point < 0) {
		point = 0;
	} else if (point > vars.slideRange) {
		point = vars.slideRange;
	}
  	return point;
}

function pointToPercent(point) {
	var percent = Math.floor( point * vars.valueRange / vars.slideRange );
	if (percent < args.min) {
		percent = args.min;
	} else if (percent > args.max) {
		percent = args.max;
	}
  	return percent;
}

/*
exports.setProperties = function(args) {
	vars = args;
	checkCondition();
};

function checkCondition() {
  	if (vars.isReady) {
		updateUI();
	} else {
		setTimeout(checkCondition, 500);
	}
}

function updateUI() {
  	
}

function getValue(type) {
	var value;
	
  	if (type == 1) {
  		value = Math.floor( $.thumb_1.left * vars.valueRange / vars.slideRange ) + args.min;
  		if (value < args.min) {
			value = args.min;
		}
  	} else {
  		value = Math.floor( $.thumb_2.left * vars.valueRange / vars.slideRange ) + args.min;
  		if (value > args.max) {
			value = args.max;
		}
  	}
  	
  	args.values[type] = value;
  	
	return value;
}

*/