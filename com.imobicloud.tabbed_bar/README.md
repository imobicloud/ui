# Tabbed Bar
====

Tabbed bar for iOS and Android

xml

	<Widget id="tabbedBar" type="widget" src="com.imobicloud.tabbed_bar"/>

tss

	".tabbed-bar": { right: 15 }
	".tabbed-bar[platform=android]": { width: Ti.UI.SIZE, height: 30, borderWidth: 1, borderColor: '#007aff', borderRadius: 3, layout: 'horizontal' }
		".tabbed-bar-button": { color: '#007aff', font: { fontSize: 14 }, backgroundColor: 'transparent' }
		".tabbed-bar-button-active": { backgroundColor: '#007aff', color: '#fff' }

js 

	$.tabbedBar.init({
		index: 1,
		labels: [ 'Deep', 'Normal', 'High' ],
		styles: { right: 15 }
	});

	$.tabbedBar.getIndex();