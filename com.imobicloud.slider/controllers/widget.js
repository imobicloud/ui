/*
 args = {
 	min: 0,
 	max: 100,
 	sensitive: 1,
 	tssclass: '',
 	targets: [0, 20, 40, 60, 80, 100], // or null
 	values: [20, 80]
 }
 * */
var args = arguments[0] || {},
	vars = {},
	prefix = 'slider-' + args.tssclass + '-';

var measurement;
OS_ANDROID && (measurement = require('alloy/measurement'));

init();
function init() {
	// normalize data
	args.max = parseInt(args.max, 10);
	args.min = parseInt(args.min, 10);
	args.values = JSON.parse(args.values);
	// args.targets && (args.targets = JSON.parse(args.targets));
	args.sensitive = args.sensitive ? parseInt(args.sensitive, 10) : 1;
	
	vars.range  = args.max - args.min;
	
	var thumbWidth = $.createStyle({ classes: prefix + 'thumb' }).width;
	if (thumbWidth == null) { alert( 'tss class [' + prefix + 'thumb] required [width] value!' ); }
  	vars.thumbWidth = thumbWidth;
	
	//
	
	$.addClass($.slider, prefix.substr(0, prefix.length - 1));
	
		var track = $.UI.create('View', { classes: prefix + 'track' });
		track.addEventListener('postlayout', postlayout);
		$.slider.add(track);
		
	  	for(var i=args.values.length - 1; i >= 0; i--){
	  		var view = $.UI.create('View', { left: 0, width: 0 });
	  		vars['view_' + i] = view;
	  		
				view.add( $.UI.create('View', { classes: prefix + 'track' + ' ' + prefix + 'track-' + i }) );
				view.add( $.UI.create('View', { thumbIndex: i, classes: prefix + 'thumb' + ' ' + prefix + 'thumb-' + i, right: 0 }) );
			
			$.slider.add(view);
		};	
}

function postlayout(e) {
  	this.removeEventListener('postlayout', postlayout);
  	
  	var trackWidth  = this.rect.width;
  	vars.trackWidth = trackWidth;
  	
  	var partWidth   = trackWidth / vars.range;
  	vars.partWidth  = partWidth;
  	
  	// if (args.targets) {
		// var targets = args.targets;
	  	// for(var i=targets.length - 1; i >= 0; i--){
			// $.slider.add( $.UI.create('View', { classes: prefix + 'target' + ' ' + prefix + 'target-' + i, left: targets[i] * partWidth }) );
		// };
	// }
	
	var pos = [],
		min = args.min, 
		values = args.values,
		thumbWidth = vars.thumbWidth,
		halfWidth = thumbWidth / 2;
		
  	for(var i=values.length - 1; i >= 0; i--){
  		var width = (values[i] - min) * partWidth;
  		width += thumbWidth;
  		
  		var view = vars['view_' + i];
  		view.width = width;
  		view.children[0].applyProperties({ left: halfWidth, right: halfWidth });
  		
		pos.unshift(width);	
	};
	
	//
	
	$.trigger('ready', { pos: pos });
}

function touchstart(e) {
	e.cancelBubble = true;
	vars.thumbIndex = e.source.thumbIndex;
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
	if (vars.x != null && Math.abs(vars.x - e.x) >= args.sensitive) { return; }
	vars.x = e.x;
	
  	var pos = e.source.convertPointToView({ x: e.x, y: e.y }, $.slider.children[0]);
  	if (OS_ANDROID) { pos.x = measurement.pxToDP(pos.x); }	
  	if (pos.x < 0 || pos.x > vars.trackWidth) { return; }
  	
  	var index = vars.thumbIndex,
  		width = pos.x,
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
  	
  	args.values[index] = value;
  	
  	width += vars.thumbWidth;
  	vars['view_' + index].width = width;
  	$.trigger('change', { index: index, value: value, pos: width });
}

exports.getValue = function(roundUp) {
	return args.values;
};

function setValue(values) {
	args.values = values;

	var max = args.max,
		min = args.min,
		partWidth = vars.partWidth;
	
	for(var i=0,j=values.length; i<j; i++){
	  	var value = values[i];
	  	if (value < min) { value = min; }
	  	else if (value > max) { value = max; }
	  	
  		var width = (value - min) * partWidth;
  		width += vars.thumbWidth;
		vars['view_' + i].width = width;
		$.trigger('change', { index: i, value: value, pos: width });
	};
};
exports.setValue = setValue;

exports.update = function(params) {
    if (!params) {
    	return;
    }
    
    args = params;
    
    if (args.min && args.max) {
        vars.range = args.max - args.min;
        vars.partWidth  = vars.trackWidth / vars.range;
    }
    
    setValue(args.values);
};