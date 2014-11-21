var args = arguments[0] || {},
	events = {},
	selectedIndex;

init();
function init() {
	var container = $.column;
	
	$.addClass(container, args.classes);
		
	if (args.title) {
		var headerView = $.UI.create('View', { classes: 'picker-header' });
			headerView.add( $.UI.create('Label', { text: args.title, classes: 'picker-header-label' }) );
		container.add(headerView);
	} else {
		$.addClass($.list, 'picker-list-notitle');
	}
		
	//
	
	var items = [],
		template = args.template || 'title';
		
	for(var i=0,ii=args.rows.length; i<ii; i++){
		var row = args.rows[i];
	  	items.push({
	  		template: template,
	  		properties: { itemId: row.id },
	  		icon: { image: row.icon },
	  		title: { text: row.title }
	  	});
	};
	
	$.list.sections = [Ti.UI.createListSection({ items: items })];
};

function postlayout(e) {
	$.column.removeEventListener('postlayout', postlayout);
  	selectedIndex = args.selectedRow || 0;
	updateUI(selectedIndex, true, false);
}

function columnClick(e) {
	setSelectedRow(e.itemIndex, true);
}

function reset() {
  	if (selectedIndex != null) {
  		updateUI(selectedIndex, false, false);
  		
	  	selectedIndex = null;
	}
}

function setSelectedRow(rowIndex, animated) {
  	if (selectedIndex === rowIndex) { return; }
  	
  	reset();
	
	updateUI(rowIndex, true, animated);
	
  	selectedIndex = rowIndex;
}

function updateUI(rowIndex, isSelected, isAnimated) {
  	fireEvent('picker:change', {
  		section: $.list.sections[0],
  		columnIndex: args.columnIndex,
  		rowIndex: rowIndex,
  		value: args.rows[rowIndex],
  		isSelected: isSelected,
  		isAnimated: isAnimated
  	});
}

//

exports.unload = function() {
	args = null;
};

exports.reset = reset;

exports.setSelectedRow = setSelectedRow;

exports.getSelectedRow = function() {
	return args.rows[selectedIndex];
};

// EVENTS

function fireEvent(type, data) {
  	var callbacks = events[type];
  	if (callbacks) {
  		for(var i=0,ii=callbacks.length; i<ii; i++){
			callbacks[i](data, { type: type });
		};
  	}
}

exports.on = function(type, callback) {
	if (events[type]) {
  		events[type].push(callback);
  	} else {
  		events[type] = [callback];
  	}
  	return this;
};