# Titanium UI - Resizable Textarea

Resizable Textarea can be used for message box in chat apps

NOTE: FOR NEW UPDATES, VISIT THIS REPOSITORY: https://github.com/imobicloud/com.imobicloud.textarea

====

View
	
	<Widget id="txtMessage" src="com.imobicloud.textarea" 
		class="txt-message" 
		maxHeight="80" 
		hintText="Type here..." 
		onChange="txtMessageChange" 
		onResize="txtMessageResize"/>
	
Styles
	
	// app.tss
	".ET-container": { height: Ti.UI.SIZE, bottom: 5, left: 5, right: 5 }
		".ET-hint": { top: 7, left: 5, font: { fontSize: 12.5, fontFamily: 'HelveticaNeue-Medium' }, color: '#b7b7b7', touchEnabled: false, visible: true }
		".ET-textarea": { width: '100%', height: Ti.UI.SIZE, font: { fontSize: 12.5, fontFamily: 'HelveticaNeue-Medium' }, color: '#b7b7b7', backgroundColor: 'transparent', suppressReturn: false }
    
	".txt-message": { backgroundColor: 'red' }
	
Controller

	// get value
	$.txtMessage.getValue()
    
    // set value
	$.txtMessage.setValue('Test message');
    
	function txtMessageChange(e){
    	alert(e.value);
    }
	
    function txtMessageResize(e){
    	alert(e.height);
    }

