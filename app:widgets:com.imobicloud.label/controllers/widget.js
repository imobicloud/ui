
init(arguments[0]);
function init(args) {
	if (args && args.text) {
		formatText(args);
	}
};
exports.setText = init;

/*
args = {
	classes: 	'',
 	text: 		'',
 	textColor: 	'#ffffff',
 	search: 	[{ 'text': '', 'color': '#ffffff', 'font': { 'fontSize': 18, 'fontFamily': 'HelveticaNeue-Medium' } }]
}
 * */
function formatText(args) {
  	args.classes && $.label.applyProperties( $.createStyle({ classes: args.classes }) );
	
	var text = args.text,
		search;
	
	if (args.search) {
		if (typeof(args.search) != 'string') {
			search = args.search;
		} else {
			search = JSON.parse( args.search.replace(/\'/g, '"') );
		}
	} else {
		search = [];
	}
		
	if (OS_IOS) {
		var attributedString = Ti.UI.iOS.createAttributedString({ text: text });
		
		if (args.textColor) {
			attributedString.addAttribute({
	           	type: Ti.UI.iOS.ATTRIBUTE_FOREGROUND_COLOR,
    			value: args.textColor,
    			range: [0, text.length]
	       	});
		}
		
		for(var i=0,j=search.length; i<j; i++){
		  	var s = search[i],
		  		sText   = s.text + '',
		  		sIndex  = text.indexOf(sText), 
		  		sLength = sText.length;
		  		
			s.font && attributedString.addAttribute({
	            type: Ti.UI.iOS.ATTRIBUTE_FONT,
	            value: s.font,
	            range: [sIndex, sLength]
	       	});
	       	
	       	s.color && attributedString.addAttribute({
	            type: Ti.UI.iOS.ATTRIBUTE_FOREGROUND_COLOR,
    			value: s.color,
    			range: [sIndex, sLength]
	       	});
		};
		
		$.label.attributedString = attributedString;
	} else {
		for(var i=0,j=search.length; i<j; i++){
			var s = search[i],
				face  = s.font  ? ('face="' + s.font.fontFamily + '"') : '',
				color = s.color ? ('color="' + s.color + '"') 			: '';
			text = text.replace(sText, '<font ' + face + ' '+ color + '>' + sText + '</font>');
		}

		args.textColor && ($.label.color = args.textColor);
		$.label.html = text;
	}
}