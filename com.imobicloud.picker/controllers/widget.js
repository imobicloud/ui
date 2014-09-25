var selectedValues = [];

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
 * */
exports.init = function (args) {
	for(var i=0,ii=args.columns.length; i<ii; i++){
		var column = args.columns[i];
		column.index = i;
		
		selectedValues.push(column.selectedRow);
		
		var wrapper = $.UI.create('View', { classes: 'picker-column ' + column.classes });
		
			if (column.title) {
				var headerView = $.UI.create('View', { classes: 'picker-header' });
					headerView.add( $.UI.create('Label', { text: column.title, classes: 'picker-header-label' }) );
				wrapper.add(headerView);
			}
			
			var view = Widget.createController('column', column).getView();
			view.addEventListener('picker:change', pickerChange);
		  	wrapper.add(view);
	  	
	  	$.picker.add(wrapper);
	};
};

function pickerChange(e) {
	e.source = null;
	selectedValues[e.columnIndex] = e;
  	$.picker.fireEvent('picker:change', e);
}

exports.getSelectedRow = function(columnIndex) {
	return selectedValues[columnIndex];
};

exports.getSelectedValues = function() {
	return selectedValues;
};