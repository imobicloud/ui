# Slide Menu
====

Slide menu with 2 anchors

xml

	<Widget id="radioWeAre" src="com.imobicloud.radio" values="['male', 'female']" value=“male” icon="true" title=“true”/>

tss

	".radio-container": { height: 43, left: 20, layout: 'horizontal' }
	".radio-item":  { width: 44, height: 43, right: 10 }
		".radio-icon":  { touchEnabled: false }
		".radio-label": { touchEnabled: false }
		
		".radio-icon-male": 	  { image: '/images/preferences/male.png' }
		".radio-icon-male-on": 	  { image: '/images/preferences/male-on.png' }
		".radio-icon-female":     { image: '/images/preferences/female.png' }
		".radio-icon-female-on":  { image: '/images/preferences/female-on.png' }
		
		".radio-label-male":      { text: '', color: ‘#999’ }
		".radio-label-male-on":   { text: '', color: ‘#39c2e1’ }
		".radio-label-female": 	  { text: '', color: '#999' }
		".radio-label-female-on": { text: '', color: ‘#39c2e1’ }

js 

	$.radioWeAre.getValue(); => ‘male’

You can update menu properties directly via $.menu.menu (this is a ListView)
Example: 
	
	$.menu.menu.getView().top = 100;
	$.menu.menu.addEventListener('delete', function(){});
	$.menu.menu.headerView = $.UI.create('View', { classes: 'menu-header' });

	// custome templates

	var cateTemplate = {
		properties: $.createStyle({ classes: 'slide-menu-item' }),
	    childTemplates: [
	        {
	        	type: 'Ti.UI.View',
	        	properties: $.createStyle({ classes: 'slide-menu-item-wrapper', apiName: 'View' }),
	        	childTemplates: [
	        		{
	        			type: 'Ti.UI.ImageView',
	        			bindId: 'image',
	        			properties: $.createStyle({ classes: 'slide-menu-image', apiName: 'ImageView' })
	        		},
	        		{
	        			type: 'Ti.UI.Label',
	        			bindId: 'title',
	        			properties: $.createStyle({ classes: 'slide-menu-title', apiName: 'Label' })
	        		}
	        	]
	        }
	    ]
	};

	$.cates.menu.applyProperties({
		templates: { 'categoryTemplate': cateTemplate },
		defaultItemTemplate: 'categoryTemplate'
	});

	var items = [];
	for (var i=0; i < 10; i++) {
	  	items.push({ 
	  		// template: 'categoryTemplate', 
	  		properties: { itemId: 'item_' + i }, 
	  		title: { text: 'Item title ' + i }, 
	  		image: { image: '/images/avatar.jpg' } 
	  	});
	};