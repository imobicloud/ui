var callback,
	picker,
	selectedValues = [];

/*
 params = {
 	callback: function(values){ alert( values[0].title ); },
 	data: [
 		[{ title: 'After' }, { title: 'Before' }]
 	],
 	values: [1] 			// column 0 - row 1
 }
 * */
exports.show = function(params) {
	callback = params.callback;
	
	//
	
	picker = null;
	selectedValues.length = 0;
	$.placeholder.removeAllChildren();
	
	//
	
	var columns = [],
		data = params.data,
		values = params.values || [];
		
	for(var i=0,ii=data.length; i<ii; i++){
		var rows = data[i],
		  	column = Ti.UI.createPickerColumn();
		
		for(var j=0,jj=rows.length; j<jj; j++){
			column.addRow( Ti.UI.createPickerRow(rows[j]) );
		};
		
		columns.push(column);
		
		selectedValues.push(values[i] || 0);
	};
	
	picker = Ti.UI.createPicker({ selectionIndicator: true });
	picker.add(columns);
	$.placeholder.add(picker);
	
	picker.addEventListener('change', valueChanged);
	
	//
	
	for(var i=0,ii=selectedValues.length; i<ii; i++){
	  	picker.setSelectedRow(i, selectedValues[i], false);
	};
	
	//
	
	$.container.show();
};

function hidePicker(e) {
  	$.container.hide();
}
exports.hide = hidePicker;

function setValue(e) {
	var values = [];
	
	for(var i=0,ii=selectedValues.length; i<ii; i++){
	  	values.push( picker.columns[ i ].rows[ selectedValues[i] ] );
	};
	
	callback(values);
}

function valueChanged(e) {
	selectedValues[ e.columnIndex ] = e.rowIndex;
}