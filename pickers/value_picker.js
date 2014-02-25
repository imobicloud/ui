var callback,
	picker,
	selectedIndexs = [];

/*
 params = {
 	callback: function(values, indexs){ alert( values[0].title ); },
 	data: [
 		[{ title: 'After' }, { title: 'Before' }]
 	],
 	indexs: [1] 			// column 0 - row 1
 }
 * */
exports.show = function(params) {
	callback = params.callback;
	
	//
	
	picker = null;
	selectedIndexs.length = 0;
	$.placeholder.removeAllChildren();
	
	//
	
	var columns = [],
		data = params.data,
		indexs = params.indexs || [];
		
	for(var i=0,ii=data.length; i<ii; i++){
		var rows = data[i],
		  	column = Ti.UI.createPickerColumn();
		
		for(var j=0,jj=rows.length; j<jj; j++){
			column.addRow( Ti.UI.createPickerRow(rows[j]) );
		};
		
		columns.push(column);
		
		selectedIndexs.push(indexs[i] || 0);
	};
	
	picker = Ti.UI.createPicker({ selectionIndicator: true });
	picker.add(columns);
	$.placeholder.add(picker);
	
	picker.addEventListener('change', valueChanged);
	
	//
	
	for(var i=0,ii=selectedIndexs.length; i<ii; i++){
	  	picker.setSelectedRow(i, selectedIndexs[i], false);
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
	
	for(var i=0,ii=selectedIndexs.length; i<ii; i++){
	  	values.push( picker.columns[ i ].rows[ selectedIndexs[i] ] );
	};
	
	callback(values, selectedIndexs);
}

function valueChanged(e) {
	selectedIndexs[ e.columnIndex ] = e.rowIndex;
}