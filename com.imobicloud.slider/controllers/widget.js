/*
 args = {
 	min: 0,
 	max: 100,
 	tssclass: '',
 	targets: [0, 20, 40, 60, 80, 100], // or null
 	values: [20, 80]
 }
 * */
var args = arguments[0] || {},
	vars = {},
	prefix = 'slider-' + args.tssclass + '-';

init();
function init() {
	// normalize data
	args.max = parseInt(args.max, 10);
	args.min = parseInt(args.min, 10);
	args.values = JSON.parse(args.values);
	args.targets && (args.targets = JSON.parse(args.targets));
	
	vars.range  = args.max - args.min;
	
	//
	
	$.addClass($.slider, prefix.substr(0, prefix.length - 1));
	
		var track = $.UI.create('View', { classes: prefix + 'track' });
		track.addEventListener('postlayout', postlayout);
		$.slider.add(track);
}

function postlayout(e) {
  	this.removeEventListener('postlayout', postlayout);
  	
  	var y 			= this.rect.y,
  		trackWidth  = this.rect.width,
  		sliderWidth = this.parent.rect.width,
  		partWidth   = trackWidth / vars.range,
  		minX		= (sliderWidth - trackWidth) / 2;
  		
  	vars.partWidth  = partWidth;
  	vars.trackWidth = trackWidth;
  	vars.minX 		= minX;
  	vars.maxX 		= minX + trackWidth;
  	vars.y 			= y;
  	
  	// if (args.targets) {
		// var targets = args.targets;
	  	// for(var i=targets.length - 1; i >= 0; i--){
			// $.slider.add( $.UI.create('View', { classes: prefix + 'target' + ' ' + prefix + 'target-' + i, left: targets[i] * partWidth }) );
		// };
	// }
	
	var pos = [],
		min = args.min, 
		values = args.values;
		
  	for(var i=values.length - 1; i >= 0; i--){
  		var value = values[i],
  			width = (value - min) * partWidth;
  		
  		var track = $.UI.create('View', { classes: prefix + 'track' + ' ' + prefix + 'track-' + i, left: minX, width: width });
		vars['track_' + i] = track;
		$.slider.add(track);
		
		var center = { x: minX + width, y: y };
		var thumb = $.UI.create('View', { thumbIndex: i, classes: prefix + 'thumb' + ' ' + prefix + 'thumb-' + i, center: center });
		vars['thumb_' + i] = thumb;
		$.slider.add(thumb);
		
		pos.unshift( center );	
	};
	
	//
	
	$.trigger('ready', { pos: pos });
}

function touchstart(e) {
	e.cancelBubble = true;
	vars.thumbIndex = e.source.thumbIndex;
  	vars.x = e.x;
}

function touchend(e) {
	e.cancelBubble = true;
  	vars.thumbIndex = null;
}

function touchcancel(e) {
	e.cancelBubble = true;
  	vars.thumbIndex = null;
}

function touchmove(e) {
	e.cancelBubble = true;
	if (vars.thumbIndex == null) { return; }
	
  	var pos = e.source.convertPointToView({ x: e.x, y: e.y }, $.slider);
  	if (pos.x < vars.minX) { return; }
  	else if (pos.x > vars.maxX) { return; }
  	
  	var index = vars.thumbIndex,
  		width = pos.x - vars.minX,
  		value = (width / vars.partWidth) + args.min;
  		
  	if (value - parseInt(value) >= 0.5) { 
  		value = Math.ceil(value);
  	} else {
  		value = Math.floor(value);
  	}
  	
  	var prev = args.values[index - 1];
  	if (prev && value <= prev) { return; }
  	var next = args.values[index + 1];
  	if (next && value >= next) { return; }
  	
  	vars['track_' + index].width  = width;
  	vars['thumb_' + index].center = { x: pos.x, y: vars.y };
  	
  	args.values[index] = value; 
  	
  	$.trigger('change', { index: index, value: value, pos: { x: pos.x, y: pos.y } });
}

exports.getValue = function(roundUp) {
	return args.values;
};

exports.setValue = function(values) {
	args.values = values;
	
	var y = vars.y,
		max = args.max,
		min = args.min,
		minX = vars.minX,
		partWidth = vars.partWidth;
	
	for(var i=0,j=values.length; i<j; i++){
	  	var value = values[i];
	  	if (value < min) { value = min; }
	  	else if (value > max) { value = max; }
	  	
  		var width = (value - min) * partWidth;
		vars['track_' + i].width  = width;
		vars['thumb_' + i].center = { x: minX + width, y: y };
	};
};