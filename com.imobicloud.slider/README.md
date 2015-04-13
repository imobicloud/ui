# Titanium UI - Uploader

====

Show a dialog with 2 options: Take a photo or Load phote from gallery.
After user select photo, return it via callback

xml
	
    <Require id="uploader" src="elements/uploader"/>

js

    function showCamera(e) {
        $.uploader.show(showCameraCallback);
    }

    function showCameraCallback(e) {
        // TODO: do something with e.media
    }