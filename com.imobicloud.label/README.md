# Label
====

Formatted Label

NOTES: 
- FOR NEW UPDATES, VISIT THIS REPOSITORY: https://github.com/imobicloud/com.imobicloud.label
- WE WILL NOT UPDATE THIS WIDGET ANYMORE

xml

	<Widget id="label" src="com.imobicloud.label" class="tip-label" 
		text="Tip: Swipe left and right to see all menus."
		textColor="#ffffff"
		search="[
			{ 'text': 'left', 'color': 'red', 'font': { 'fontSize': 18, 'fontFamily': 'HelveticaNeue-Medium' } },
			{ 'text': 'right', 'font': { 'fontSize': 18, 'fontFamily': 'HelveticaNeue-Bold' } }
		]">
	</Widget>

tss

	".tip-label": { width: 184.5, left: 66.5, font: { fontSize: 18, fontFamily: 'HelveticaNeue-Light' } }
	".tip-label-2": { font: { fontSize: 18, fontFamily: 'HelveticaNeue-Light' } }

js

	/* same as xml Widget tag
	// create
	$.getView().add( Alloy.createWidget('com.imobicloud.label', function() {
        var o = $.createStyle({ classes: 'tip-label' });
        _.extend(o, {
            text: 		'Tip: Swipe left and right to see all menus.',
		 	textColor: 	'#ffffff',
		 	search: 	[
		 		{ 'text': 'left', 'color': 'red', 'font': { 'fontSize': 18, 'fontFamily': 'HelveticaNeue-Medium' } },
				{ 'text': 'right', 'font': { 'fontSize': 18, 'fontFamily': 'HelveticaNeue-Bold' } }
		 	]
        });
        return o;
    }()).getView() );
	*/
	
	// update
	$.label.setText(function() {
	    var o = $.createStyle({ classes: 'tip-label-2' });
	    _.extend(o, {
	        text: 'Tip: Swipe top and bottom to see all items.',
			textColor="#000000",
			search: [
				{ text: 'top', color: 'red' },
				{ text: 'bottom', color: 'blue' }
			]
	    });
	    return o;
	}());
