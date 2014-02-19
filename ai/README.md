# Titanium UI - Activity Indicator

====

## Attach AI to window
	
    var ai = Alloy.createController('elements/ai', { visible: true, message: 'Loading...' });
    win.add( ai.getView() );

## Toggle AI

    // show AI
    ai.toggle(true);

    // show AI with custom message
    ai.toggle(true, 'Loading. Please wait...');

    // show AI with timeout: show a message after 5 seconds
    ai.toggle(true, null, 5000);

    // hide AI
    ai.toggle(false);