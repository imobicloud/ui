# Label
====

Formatted Label

xml

	<Widget id="label" src="com.imobicloud.label" classes="tip-label" 
		text="Tip: Swipe left and right to see all menus."
		textColor="#ffffff"
		search="[
			{ 'text': 'left', 'color': 'red', 'font': { 'fontSize': 18, 'fontFamily': 'HelveticaNeue-Medium' } },
			{ 'text': 'right', 'font': { 'fontSize': 18, 'fontFamily': 'HelveticaNeue-Bold' } }
		]">
	</Widget>

tss - app.tss

	".tip-label": { width: 184.5, left: 66.5, font: { fontSize: 18, fontFamily: 'HelveticaNeue-Light' } }
	".tip-label-2": { font: { fontSize: 18, fontFamily: 'HelveticaNeue-Light' } }

js

	$.label.setText({
		classes: 'tip-label-2',
		text: 'Tip: Swipe top and bottom to see all items.',
		textColor="#000000",
		search: [
			{ text: 'top', color: 'red' },
			{ text: 'bottom', color: 'blue' }
		]
	});
