var args = arguments[0] || {},
	panes = [];

loadContent();

/*
 args = {
 	classes: '',
 	activeIndex: null
 }
 * */
function loadContent() {
	if (args.classes) {
		$.addClass($.container, args.classes);
	}
	
	if (args.children) {
		_.each(args.children, function(child) {
			var index = panes.length;
			
			if (child.role == 'header') {
				child.paneIndex = index;
				
				child.addEventListener('click', togglePanel);
			} else if (child.role == 'body') {
				panes.push(child);
				
				child.height = index != args.activeIndex ? 0 : Ti.UI.SIZE;
			}
			
			$.container.add(child);
		});
		
		delete args.id;
		delete args.children;
	}
}

function togglePanel(e) {
	if (this.isActive) {
		this.isActive = false;
		panes[ this.paneIndex ].height = 0;
		args.activeIndex = null;
		
		$.container.fireEvent('accordion:change', { isActive: false, index: this.paneIndex });
	} else {
		this.isActive = true;
		panes[ this.paneIndex ].height = Ti.UI.SIZE;
		args.activeIndex = this.paneIndex;
		
		$.container.fireEvent('accordion:change', { isActive: true, index: this.paneIndex });
	}
};