var callback;

exports.show = function(fnc) {
	callback = fnc;
	$.dialog.show();
};

function dialogClicked(e) {
	var opts = {
		title: 'Upload From?',
		mediaTypes: [ Ti.Media.MEDIA_TYPE_PHOTO ],
		success: callback,
		error: function() {
		  	Ti.UI.createAlertDialog({ message: 'Sorry, can not take a Photo now.', title: 'Upload Media' }).show();
		}
	};
	
	if ( e.index == 0 ) {
		opts.saveToPhotoGallery = true;
		Ti.Media.showCamera( opts );
	} else if ( e.index == 1 ) {
		Ti.Media.openPhotoGallery( opts );
	}
}