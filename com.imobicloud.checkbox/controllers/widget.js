/*
 args = {
 	items: [ { id: 1, title: '', selected: false } ]
 }
 * */
var args = arguments[0] || {};

init();
function init() {
 	args.items && loadCheckbox(args.items);
}

exports.load = function(params) {
	args = params;
  	init();
};

function loadCheckbox(items) {
  	for(var i=0,j=items.length; i<j; i++){
  		var checkbox = Widget.createController('checkbox', items[i]).getView();
  		checkbox.addEventListener('toggle', checkboxToggle);
		$.container.add(checkbox);
	};
}

function checkboxToggle(e) {
  	var items = args.items;
  	
  	for(var i=0,j=items.length; i<j; i++){
		var item = items[i];
		if (item.id == e.id) {
			item.selected = e.selected;
			$.trigger('toggle', item);
			break;
		}
	};
}

exports.getSelectedItems = function() {
	var items = args.items,
		selected = [];
		
  	for(var i=0,j=items.length; i<j; i++){
		var item = items[i];
		if (item.selected) {
			selected.push(item);
		}
	};
	
	return selected;
};