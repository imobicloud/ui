# Slide Menu
====

Slide menu with 2 anchors

xml

	<Widget id="menu" src="com.imobicloud.slide_menu"/>
	<View id="content/>

tss

	".slide-menu": { width: 200, top: 40, bottom: 30, left: 0 }
		".slide-menu-item": { height: 60, backgroundColor: '#ccc' }
			".slide-menu-image": { width: 40, height: 40, left: 15 }
			".slide-menu-title": { left: 70, right: 15 }

js 

	var items = [];
	for (var i=0; i < 10; i++) {
	  	items.push({ 
	  		properties: { itemId: 'item_' + i }, 
	  		title: { text: 'Item title ' + i }, 
	  		image: { image: '/images/avatar.jpg' } 
	  	});
	};
	
	var sections = [{
		// headerView: Ti.UI.View,
		items: items
	}];
	
	$.menu.init(sections, {
 		slider: $.content,
 		anchor: [60, 200],
 		onClick: menuClicked
	});

	function menuClicked(e){
		// e.itemId
	}

You can update menu properties directly via $.menu.menu (this is a ListView)
Example: 
	
	$.menu.menu.getView().top = 100;
	$.menu.menu.addEventListener('delete', function(){});
	$.menu.menu.headerView = $.UI.create('View', { classes: 'menu-header' });