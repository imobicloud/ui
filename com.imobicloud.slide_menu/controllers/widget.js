/*
args = {
	anchors: [ 40, 200 ],
	defaultAnchor: 0,
	swipeToToggle: true,
	swipeWidth: 30
}
 * */
var args = arguments[0] || {},
	vars = {};

init();

function init() {
	var slider;
	
	if (args.children) {
		_.each(args.children, function(child) {
			if (child.role == 'slider') {
				slider = child;
			}
			__parentSymbol.add(child);
		});
		
		delete args.id;
		delete args.children;
	} 
	
	if (!slider) {
		alert('A widget child with [role="slider"] is required');
		return;
	}
	
	// prepare slider
	
	args.anchors = JSON.parse(args.anchors);
	
	var slideIndex = args.defaultAnchor || 0;
	vars.slideIndex = slideIndex;
	slider.left = args.anchors[slideIndex];
	
	if (args.swipeToToggle + '' != 'false') {
		slider.addEventListener('swipe', sliderSwiped);
	}
	
	vars.slider = slider;
};

function sliderSwiped(e) {
  	if (e.direction == 'left') {
		if (vars.slideIndex > 0) {
  			slide(vars.slideIndex - 1);
  		}
  	} else if (e.direction == 'right') {
  		if (!args.swipeWidth || e.x <= args.swipeWidth) {
	  		if (vars.slideIndex + 1 < args.anchors.length) {
	  			slide(vars.slideIndex + 1);
	  		}
  		}
  	}
}

exports.toggle = function(index) {
	if (typeof index != 'number') {
		index = null;
	}
	
	if (index === vars.slideIndex) {
		return;
	}
	
	if (index == null) {
		index = vars.slideIndex + 1;
	}
	
  	if (index < args.anchors.length) {
		slide(index);
	} else {
		slide(0);
	}
};

function slide(index, animated) {
	vars.slideIndex = index;
	
	if (animated !== false) {
		vars.slider.animate({
			left: args.anchors[index],
			duration: 200,
			curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
		});
	} else {
		vars.slider.left = args.anchors[index];
	}
	
	$.trigger('toggle', { index: index });
}