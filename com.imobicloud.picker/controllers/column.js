var args = arguments[0] || {},
	selectedIndex;

init();
function init() {
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
	
	$.column.sections = [Ti.UI.createListSection({ items: items })];
};

function columnClick(e) {
	var index = e.itemIndex,
	    section = e.section;
	
	if (selectedIndex != null) {
		args.onChange(e, selectedIndex, false);
	}
	
	args.onChange(e, index, true);
	
	var item = section.getItemAt(index);
	
  	$.column.fireEvent('picker:change', {
  		id: e.itemId,
  		icon: item.icon.image,
  		title: item.title.text,
  		
  		columnIndex: args.index,
  		rowIndex: index
  	});
  	
  	selectedIndex = index;
}