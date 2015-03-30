var args = arguments[0] || {},
	activeView,
	activeId;

init();

/*
 <Widget id="radioWeAre" src="com.imobicloud.radio"/>
 args = {
 	deselectable: false,
 	items: [{ id: 1, title: '', selected: false }]
 }
 * */
function init() {
	args.items && loadRadios(args.items);
};

exports.load = function(params) {
	args = params;
  	init();
};

function loadRadios() {
  	var container = $.getView(),
		items = args.items,
		found = false;
		
	for(var i=0,ii=items.length; i<ii; i++){
	  	var item = items[i],
	  		selected = item.selected && found === false;
	  	
	  	var radio = $.UI.create('View', { classes: 'imc-radio', dataId: item.id });
  			radio.add( $.UI.create('ImageView', { classes: 'imc-radio-icon imc-radio-icon-'  +  ( selected ? 'on' : 'off' ) }) );
		  	radio.add( $.UI.create('Label',     { classes: 'imc-radio-title imc-radio-title-' + ( selected ? 'on' : 'off' ), text: item.title }) );
	  	container.add(radio);
	  	
	  	if (selected) {
	  		activeView = radio;
	  		activeId = item.id;
	  		found = true;
	  	}
	};
}

function toggleRadio(e) {
  	var view = e.source,
  		id = view.dataId;
  		
  	if (id == null || (id === activeId && args.deselectable !== true)) { return; }
  	
  	var items = args.items;
  	for(var i=0,j=items.length; i<j; i++){
		var item = items[i];
		if (item.id == activeId) {
			item.selected = false;
		} else if (item.id == id) {
			item.selected = true;
		} 
	};
  	
  	deselectRadio();
  	
  	if (id !== activeId) {
  		view.children[0].applyProperties( $.createStyle({ classes: 'imc-radio-icon-on' }) );
  		view.children[1].applyProperties( $.createStyle({ classes: 'imc-radio-title-on' }) );
  		activeId = id;
		activeView = view;
  	} else {
  		activeId = null;
		activeView = null;
  	}
}

function deselectRadio() {
  	if (activeView) {
  		activeView.children[0].applyProperties( $.createStyle({ classes: 'imc-radio-icon-off' }) );
  		activeView.children[1].applyProperties( $.createStyle({ classes: 'imc-radio-title-off' }) );
  	}
}

exports.getSelectedItem = function() {
	if (activeId == null) { return null; }
	
	var items = args.items;
  	for(var i=0,j=items.length; i<j; i++){
		var item = items[i];
		if (item.id == activeId) {
			return item;
		}
	};
};

exports.reset = function() {
	if (activeId == null) { return; }
	
	var items = args.items;
  	for(var i=0,j=items.length; i<j; i++){
		var item = items[i];
		if (item.id == activeId) {
			item.selected = false;
			break;
		} 
	};
	
	deselectRadio();
	
	activeId = null;
	activeView = null;
};