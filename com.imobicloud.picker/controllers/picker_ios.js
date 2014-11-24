var selectedIndexs = [];

exports.init = function (args) {
	var columns = [];
	
	for(var i=0,ii=args.columns.length; i<ii; i++){
		var column = args.columns[i],
			pickerColumn = Ti.UI.createPickerColumn();
		
		for(var j=0,jj=column.rows.length; j<jj; j++){
			pickerColumn.addRow( Ti.UI.createPickerRow(column.rows[j]) );
		};		
		
		columns.push(pickerColumn);
		
		selectedIndexs.push( column.selectedRow || 0 );
	};
	
	$.picker.add(columns);
};

function postlayout(e) {
  	$.picker.removeEventListener('postlayout', postlayout);
  	
  	for(var i=0,ii=selectedIndexs.length; i<ii; i++){
	  	$.picker.setSelectedRow(i, selectedIndexs[i], false);
	};
}

function pickerChange(e) {
  	selectedIndexs[ e.columnIndex ] = e.rowIndex;
}

exports.unload = function() {
	selectedIndexs.length = 0;
};

exports.reset = function () {
    for(var i=0,ii=selectedIndexs.length; i<ii; i++){
	  	$.picker.setSelectedRow(i, 0, false);
	  	selectedIndexs[i] = 0;
	};
};

exports.setSelectedRow = function(columnIndex, rowIndex, animated) {
	$.picker.setSelectedRow(columnIndex, rowIndex, animated);
};

exports.getSelectedRow = function(columnIndex) {
	return $.picker.getSelectedRow(columnIndex);
};

exports.getSelectedRows = function() {
	var selectedRows = [];
	for(var i = 0, ii = selectedIndexs.length; i < ii; i++) {
      	selectedRows.push( $.picker.getSelectedRow(i) );
    };
	return selectedRows;
};

// EVENTS

exports.on = function(type, callback) {
	//TODO
	return this;
};