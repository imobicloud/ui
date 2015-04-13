# Titanium UI - SliderUploader

![Imgur](http://i.imgur.com/mJ82noZ.png)

====

View
	
	<!-- one thumb slider -->
    <Widget id="slider1" src="com.imobicloud.slider min="1" max="30" values="[20]" tssclass="players"></Widget>

    <!-- many thumb slider -->
    <Widget id="slider2" src="com.imobicloud.slider min="1" max="30" values="[10,20,25]" tssclass="players"></Widget>
    
Styles

	".slider-players": { width: 227, height: 20, top: 20 }
		".slider-players-target": { visible: false, touchEnabled: false }
		".slider-players-track": { width: 207.5, height: 2, backgroundColor: '#a8adb0', borderRadius: 2, touchEnabled: false }
		".slider-players-track-0": {  }
		".slider-players-track-1": { backgroundColor: '#abdb92' }
        ".slider-players-track-2": { backgroundColor: 'red' }
		".slider-players-thumb": { width: 19, height: 20, backgroundImage: '/images/event_create/slider-handle.png', zIndex: 1 }
		".slider-players-thumb-0": {  }
		".slider-players-thumb-1": {  }	
    	".slider-players-thumb-2": {  }	
    
Controller

	// get value
	$.slider1.getValue();	// => [20]
    $.slider2.setValue();	// => [10,20,25]
    
    // set value
	$.slider1.setValue([25]);	
    $.slider2.setValue([15, 20, 30]);	
    
    function sliderChange(e){
    	alert(e.index + ' ' + e.value);
    }

Events

- change
	+ index: thumb index
	+ value: thumb value
	+ pos: position of thumb

- ready: 
	+ pos: array position of thumbs