
init(arguments[0]);
function init(args) {
	if (args && args.text) {
		formatText(args);
	}
};
exports.setText = init;

/*
args = {
    // ... tss styles
    text:       '',
    textColor:  '#ffffff',
    search:     [{ 'text': '', 'color': '#ffffff', 'font': { 'fontSize': 18, 'fontFamily': 'HelveticaNeue-Medium' } }],
    duplicate:  true | false,
    case_sensitive: true | false 
}
 * */
function formatText(args) {
    var exclude = ['id', 'text', 'textColor', 'search'];
    $.label.applyProperties( _.omit(args, exclude) );
    
    var text = args.text,
       _text = args.case_sensitive ? text.toLowerCase() : text,
        search, s, sText;
    
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
        var attributedString = Ti.UI.iOS.createAttributedString({ text: text }),
            startAt = 0,
            sIndex, sLength;
        
        if (args.textColor) {
            attributedString.addAttribute({
                type: Ti.UI.iOS.ATTRIBUTE_FOREGROUND_COLOR,
                value: args.textColor,
                range: [0, text.length]
            });
        }
        
        for(var i=0,j=search.length; i<j; i++) {
            s = search[i];
            sText = (args.case_sensitive) ? (s.text + '').toLowerCase(): s.text + '';
            sIndex  = _text.indexOf(sText, startAt);
                          
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
            
            if (args.duplicate == false && sIndex > -1) {
                startAt += sIndex + sLength;
            };
        };
        
        $.label.attributedString = attributedString;
    } else {
        var html     = '',
            tempText = text,
            sIndex   = -1,
            hasBold = false;
        
        for(var i = 0, j = search.length; i < j; i++) {
            s     = search[i];
            sText = s.text + '';
            
            if (args.case_sensitive) {
                sText   = sText.toLowerCase();
                sIndex  = _text.indexOf(sText);
                sText   = text.substring(sIndex, sIndex + sText.length);
            } else {
                sIndex = tempText.indexOf(sText);
            }

			// Android - Html does not support custom font
			// Use default font instead
			var isBold = false;
			if (s.font && ( s.font.fontFamily.indexOf('-Bold') != -1 || s.font.fontFamily.indexOf('-Medium') != -1 )) {
				isBold = true;
				if (hasBold === false) {
					$.label.font.fontFamily = 'sans-serif';
					hasBold = true;
				}
			}
			
			var _html = (s.color ? '<font color=' + s.color + '>' : '') + (isBold ? '<b>' : '') + sText + (isBold ? '</b>' : '') + (s.color ? '</font>' : '');

            if (args.duplicate == false) {
                html += tempText.substring(0, sIndex + sText.length).replace(sText, _html);
                tempText = tempText.substring(sIndex + sText.length, tempText.length);
            } else {
                html = tempText.replace(sText, _html);
            }
        }

        args.textColor && ($.label.color = args.textColor);
        $.label.html = html;
        $.label.value = text;
    }
}