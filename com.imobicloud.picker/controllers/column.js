var args = arguments[0] || {},
	selectedIndex;

init();
function init() {
	var items = [],
		template = args.template || 'title';
		
	for(var i=0,ii=args.rows.length; i<ii; i++){
		var row = args.rows[i],
			accessoryType = i === args.selectedRow ? Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK : Ti.UI.LIST_ACCESSORY_TYPE_NONE;
	  	items.push({
	  		template: template,
	  		properties: { itemId: row.id, accessoryType: accessoryType },
	  		icon: { image: row.icon },
	  		title: { text: row.title }
	  	});
	};
	
	//
	
	$.column.sections = [Ti.UI.createListSection({ items: items })];
};

function columnClick(e) {
	var index = e.itemIndex;
	if (index === selectedIndex) {
		return;
	}
	
	var section = e.section;
	
	if (selectedIndex != null) {
		var last = section.getItemAt(selectedIndex);
		last.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_NONE;
		section.updateItemAt(selectedIndex, last);
	}
	
	var item = section.getItemAt(index);
	item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK;
	section.updateItemAt(index, item);
	
  	$.column.fireEvent('picker:change', {
  		id: e.itemId,
  		icon: item.icon.image,
  		title: item.title.text,
  		
  		columnIndex: args.index,
  		rowIndex: index
  	});
  	
  	selectedIndex = index;
}