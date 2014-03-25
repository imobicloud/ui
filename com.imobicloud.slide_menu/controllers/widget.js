var vars = {};

/*
sections = [{
	headerTitle : 'Section title',
	footerTitle : '',
	items : [{
		properties : { itemId : 1 },
		title : { text : 'Item title 1' },
		image : { image : '/images/xyz.png' }
	}]
}]

params = {
	slider: Ti.UI.View,
	anchor: [ 40, 200 ],
	defaultAnchor: 0,
	onClick: function(e) {
		// http://docs.appcelerator.com/titanium/latest/#!/api/Titanium.UI.ListView-event-itemclick
	}
}
 * */
exports.init = function(sections, params) {
	vars = params;
	
	//
	
	var slider = params.slider,
		anchor = params.anchor;
	
	slider.width = Ti.Platform.displayCaps.platformWidth - anchor[0];
	
	var slideIndex = params.defaultAnchor || 0;
	vars.slideIndex = slideIndex;
	slider.left = anchor[slideIndex];
	
	slider.addEventListener('swipe', sliderSwiped);
	
	//
	
	loadMenu(sections);
};

function loadMenu(sections) {
  	var arrSections = [];
		
	for(var i=0,ii=sections.length; i<ii; i++){
	  	arrSections.push( Ti.UI.createListSection(sections[i]) );
	};
	
	$.menu.sections = arrSections;
}

exports.load = function(sections) {
	loadMenu(sections);
	$.menu.scrollToItem(0, 0);
};

function menuClicked(e) {
  	vars.onClick( e );
}

function sliderSwiped(e) {
  	if (e.direction == 'left') {
  		if (vars.slideIndex > 0) {
  			slide(vars.slideIndex - 1);
  		}
  	} else if (e.direction == 'right') {
  		if (vars.slideIndex + 1 < vars.anchor.length) {
  			slide(vars.slideIndex + 1);
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
	
  	if (index < vars.anchor.length) {
		slide(index);
	} else {
		slide(0);
	}
};

function slide(index, animated) {
	vars.slideIndex = index;
	
	if (animated !== false) {
		vars.slider.animate({
			left: vars.anchor[index],
			duration: 200,
			curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
		});
	} else {
		vars.slider.left = vars.anchor[index];
	}
}