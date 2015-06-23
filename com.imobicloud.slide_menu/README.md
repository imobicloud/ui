# Slide Menu
====

+NOTE: FOR NEW UPDATES, VISIT THIS REPOSITORY: https://github.com/imobicloud/com.imobicloud.slide_menu

Slide menu with 2 anchors

xml

	<Widget id="menu" src="com.imobicloud.slide_menu" anchors="[0, 230]">
		<ListView class="menu"></ListView>
		<View id="content" role="slider"/>
	</Widget>

tss

	".menu": { width: 230, top: 40, bottom: 30, left: 0 }
  	"#content": { width: '100%', left: 0, backgroundColor: '#fff' }

js

	// toggle menu
	$.menu.toggle();
	$.menu.toggle(1);