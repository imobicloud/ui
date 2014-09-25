var args,
	vars,
	animation = require('alloy/animation');

exports.init = function(params) {
	vars = {
		sectionIndex: -1,
		sections: []		// cache available positions that we can display image
	};
	
	// we use dp unit for Android
	
	var fullWidth = Ti.Platform.displayCaps.platformWidth;
	if (OS_ANDROID) {
		var measurement = require('alloy/measurement');
		fullWidth = measurement.pxToDP(fullWidth);
	}
	
	// normalize input params
	
	args = _.extend({
		column: Math.floor( fullWidth * 3 / 320 ), // Alloy.isTablet ? 6 : 3, // 
		gutter: 5,
		infinite: false,
		width: fullWidth,
		onClick: function(e) {},
		onLoadMore: function(e) {}
	}, params);
	
	/*
	 generate templates base on column
	 
	 if there are 3 column:
	 + images can have size from 1 to 3
	 + we will have 3 templates
	 	- template_1 has 1 row,  with 3 cells / image-views
	 	- template_2 has 2 rows, with 3 cells / image-views 
	 	- template_3 has 3 rows, with 1 cell  / image-view
	 	=> we have this formula to calculate the number of image-views that we can use in one row: 
	 		column * size -    size * size   + 1
	 		[  all cell ] - [ display cell ] + 1
	 * */
	
	var column = args.column,
		gutter = args.gutter,
		space  = args.width - gutter * (column + 1),
		cell   = Math.floor(space / column);
		
	var templates = {};
	for (var i=1; i <= column; i++) {
		var size = cell * i + gutter * (i - 1);
	   	vars['size_' + i] = size;
		
		var childTemplates = [];
		for (var j=1, jj = column * i - i * i + 1; j <= jj; j++) {
			 childTemplates.push({
				 type: 'Ti.UI.ImageView',
				 bindId: 'photo_' + j,
				 properties: { visible: false, width: 0, height: 0, top: -1, left: -1 }
			 });
		};
		templates['template_' + i] = {
			properties: { height: size + gutter, selectedBackgroundColor: 'transparent', backgroundColor: 'transparent' },
			childTemplates: childTemplates
		};
	};
	
	// no data template
	templates['template_no_data'] = {
		properties: { height: 100, selectedBackgroundColor: 'transparent', backgroundColor: 'transparent' },
		childTemplates: [{
			 type: 'Ti.UI.Label',
			 properties: { text: 'No photos are available!', bottom: 0, font: { fontSize: Alloy.isTablet ? 18 : 13 }, color: '#000' }
		}]
	};
	
	var footerView = $.UI.create('View', { classes: 'gallery-ai' });
	footerView.add( $.UI.create('ImageView', { classes: 'gallery-ai-image' }) );
	footerView.add( $.UI.create('Label', { classes: 'gallery-ai-text' }) );
	
	$.gallery = Ti.UI.createListView({
		templates: templates,
		defaultItemTemplate: 'template_1',
		separatorColor: 'transparent',
		footerView: footerView
	});
	$.gallery.addEventListener('itemclick', galleryClick);
	$.getView().add($.gallery);
	
	toggleAI(true);
	twirl();
	
	// infinite load
	
	if (params.infinite) {
		vars.onLoadMore = params.onLoadMore;
		$.gallery.addEventListener('marker', function(e) {
			toggleAI(true);
			vars.onLoadMore(e);
		});
	}
};

exports.unload = function() {
	vars = null;
	args = null;
	
	if ($.gallery) {
		$.gallery.footerView = Ti.UI.createView();
		$.getView().remove($.gallery);
		$.gallery = null;
	}
};

exports.load = function(photos, isReset) {
	if (vars === null) { return; }
	
	if (photos.length) {
		var items  = [],
			column = args.column,
			gutter = args.gutter,
			cell   = vars['size_1'];
		
		vars.sectionIndex++;
		
		for(var i=0,ii=photos.length; i<ii; i++){
		  	var photo = photos[i],
		  		size  = photo.size,
		  		rect = vars['size_' + size];
		  	
		  	var top = left = gutter;
		  	
		  	/*
		  	 check position for photos that has size < column
		  	 if it's size == column, create a new list item for it
		  	 * */
		  	if (size < column) {
	  			var found = find(size);
	  			if (found) {
	  				var sectionIndex = found.section,
	  					rowIndex = found.row,
	  					isCurrentSection = sectionIndex === vars.sectionIndex,
	  					item = isCurrentSection ? items[rowIndex] : $.gallery.sections[sectionIndex].getItemAt(rowIndex),
	  					cellIndex = found.cell,
	  					rowSize = found.size;
	  				
	  				if (rowSize > 1) {
	  					top = (Math.floor(cellIndex / column) * (cell + gutter)) + gutter;
	  				}
					left = ((cellIndex % column) * (cell + gutter)) + gutter;
					
					for (var j=1, jj = column * rowSize - rowSize * rowSize + 1; j <= jj; j++) {
						if (!item['photo_' + j]) {
							item[ 'photo_' + j] = { data: photo.data, image: photo.url, width: rect, height: rect, top: top, left: left, visible: true };
							
							if (!isCurrentSection) {
								$.gallery.sections[sectionIndex].replaceItemsAt(rowIndex, 1, [item]);
							}
							
							break;
						}
					}
					
					continue;
	  			} else {
	  				/*
				  	 if there is no available / fit position for this photo
				  	 - we create a new row for it
				  	 - store un-used position for later photos
				  	 * */
				  	store(size);
	  			}
		  	} else {
		  		store(size);
		  	}
		  	
		  	items.push({
		  		template: 'template_' + size,
		  		photo_1: { data: photo.data, image: photo.url, width: rect, height: rect, top: top, left: left, visible: true }
		  	});
		};
		
		var section = Ti.UI.createListSection({ items: items });
		if (isReset === false) {
			$.gallery.appendSection(section);
		} else {
			$.gallery.sections = [section];
		}
		
		if (args.infinite) {
			$.gallery.setMarker({ sectionIndex: vars.sectionIndex, itemIndex: items.length - 2 });
		}
	} else if (isReset !== false) {
		$.gallery.sections = [ Ti.UI.createListSection({ items: [{ template: 'template_no_data' }] }) ];
	}
	
	toggleAI(false);
	
	// cleanup cache
	var cache = vars.sections[ vars.sectionIndex ];
	if (_.find(cache, function(row){ return row !== null; }) == undefined) {
		cache = null;
	}
};

function store(size) {
  	var column = args.column,
  		row;
  	
  	if (size < column) {
  		row = [];
  		for (var i=1; i <= size; i++) {
			for (var j=1; j <= column; j++) {
				row.push(j > size);
			};
		};
  	} else {
  		row = null;
  	}
	
	var sections = vars.sections,
		index = vars.sectionIndex;
	if (sections[index]) {
		vars.sections[index].push(row);
	} else {
		vars.sections[index] = [row];
	}
}

function find(size) {
	var sections = vars.sections,
		column = args.column,
		found = false, 
		sectionIndex,
		cellIndex,
		rowIndex,
		rowSize;

	for (var h = 0, hh = sections.length; h < hh; h++) {
		sectionIndex = h;
		var section = sections[h];
		
		if (section === null) { continue; }
		
		for (var i = 0, ii = section.length; i < ii; i++) {
			rowIndex = i;
		  	var row = section[i];
		  	
		  	if (row === null) { continue; }
		  	
		  	for(var j = 0, jj = row.length; j < jj; j++){
				if (row[j]) {
					cellIndex = j;
					rowSize = jj;
					var columnIndex = j % column + 1;
					
					if (size == 1) {
						found = true;
						row[j] = false;
						break;
					} 
					// columnIndex from 1, 2 ..., 0 is the last column in row
					// size is > 1, so the last column is not fitted for this photo
					else if (columnIndex > 0) {
						var prev = columnIndex - 1, 
							next = column - (prev + size),
							testIndex = cellIndex,
							cells = [];
	
						for (var k = 1; k <= size; k++) {
							k !== 1 && (testIndex += prev);
							for (var l = 1; l <= size; l++) {
								if (row[testIndex]) {
									cells.push(testIndex);
									testIndex++;
								} else {
									break;
								}
							};
							if (cells.length < k * size) {
								break;
							}
							testIndex += next;
						};
	
						if (cells.length >= size * size) {
							found = true;
							for (var k = 0, kk = cells.length; k < kk; k++) {
								row[ cells[k] ] = false;
							}
							break;
						}
					}
				}
			};
			
			if (row.indexOf(true) == -1) {
				section[i] = null;
			}
			
			if (found) {
				break;
			}
		};
		
		if (found) {
			break;
		}
	};
	
	return found ? { section: sectionIndex, row: rowIndex, cell: cellIndex, size: rowSize/column } : false;
}

function galleryClick(e) {
	if (e.bindId != null) {
		var data = e.section.items[ e.itemIndex ][ e.bindId ].data;
		data && args.onClick(data);
	}
}

function toggleAI(visible) {
	if ($.gallery == null) { return; }
	
	var footerView = $.gallery.footerView;
	if (visible) {
		footerView.show();
	} else {
		footerView.hide();
	}
};
exports.toggleAI = toggleAI;

function twirl() {
	var duration = 2500,
		view = $.gallery.footerView.children[0];
	
	if (OS_ANDROID) {
		var spin1 = Ti.UI.createAnimation({
			duration: duration,
			transform: Ti.UI.create2DMatrix().rotate(0, 360)
		});
		
		view.animate(spin1, twirl);
	} else {
		var localDuration = duration / 3;
	
		var spin1 = Ti.UI.createAnimation({
			duration: localDuration,
			transform: Ti.UI.create2DMatrix().rotate(120)
		});
		
		var spin2 = Ti.UI.createAnimation({
			duration: localDuration,
			transform: Ti.UI.create2DMatrix().rotate(240)
		});

		var spin3 = Ti.UI.createAnimation({
			duration: localDuration,
			transform: Ti.UI.create2DMatrix().rotate(0)
		});
		
		animation.chainAnimate(view, [spin1, spin2, spin3], twirl);
	}
}