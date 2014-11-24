var picker;

/*
 args = {
 	columns: [{
 		classes: '',
 		title: '', // string or undefined
 		template: '', // 'title', 'icon' or 'icon-title'
 		rows: [{
 			id: '',
 			icon: '',
 			title: ''
 		}],
 		selectedRow: 0 // row index
 	}]
 }
 
 $.datePicker.on('picker:change', function(e) {
	var item = e.section.getItemAt(e.rowIndex);
	item.properties.accessoryType = e.isSelected ? Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK : Ti.UI.LIST_ACCESSORY_TYPE_NONE;
	e.section.updateItemAt(e.rowIndex, item);
});
 * */
exports.init = function (args) {
	var header = $.UI.create('View', { classes: 'picker-header'}),
		hasHeader = false;
	
	for(var i=0,ii=args.columns.length; i<ii; i++){
		var column = args.columns[i];
		
		if (column.title) {
			var headerColumn = $.UI.create('View', { classes: 'picker-header-column ' + column.classes });
				headerColumn.add( $.UI.create('Label', { text: column.title, classes: 'picker-header-label' }) );
			header.add(headerColumn);
			
			hasHeader = true;
		}
	};
	
	picker.init(args);
	
	var body = picker.getView();
	
	if (hasHeader) {
		$.container.add(header);
	} else {
		$.addClass(body, 'picker-no-header');
	}
	
	$.container.add(body);
	
	picker = null;
};

init();
function init() {
	picker = Widget.createController('picker_' + (Ti.Platform.osname == 'android' ? 'android' : 'ios'), {});
	
  	exports.on     = picker.on;
	exports.unload = picker.unload;
	exports.reset  = picker.reset;
	exports.setSelectedRow  = picker.setSelectedRow;
	exports.getSelectedRow  = picker.getSelectedRow;
	exports.getSelectedRows = picker.getSelectedRows;
}
