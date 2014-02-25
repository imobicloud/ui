/*
 params = {
 	index: 0,
 	labels: [ 'one', 'two', 'three' ],
 	styles: {}
 }
 * */
exports.init = function(params) {
	if (params.styles) {
		$.tabbedBar.applyProperties(params.styles);
		delete params.styles;
	}
	
	if (OS_IOS) {
		$.tabbedBar.applyProperties(params);
	} else {
		var labels = params.labels,
			index = params.index;
			
		for(var i=0,ii=labels.length; i<ii; i++){
			var classes = 'tabbed-bar-button';
			(i === index) && (classes += ' tabbed-bar-button-active');
		  	$.tabbedBar.add( $.UI.create('Button', { buttonIndex: i, title: '  ' + labels[i] + '  ', classes: classes }) );
		};
		
		$.tabbedBar.lastIndex = index;
	}
};

function tabbedBarClicked(e) {
	var button = e.source,
		index = button.buttonIndex,
		lastIndex = $.tabbedBar.lastIndex;
		
  	if (index != null && index != lastIndex) {
  		$.addClass(button, 'tabbed-bar-button-active');
		$.removeClass($.tabbedBar.children[ lastIndex ], 'tabbed-bar-button-active');
		$.tabbedBar.lastIndex = index;
  	}
}

exports.getIndex = function() {
	return OS_IOS ? $.tabbedBar.index : $.tabbedBar.lastIndex;
};