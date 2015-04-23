# Titanium UI - Calendar

![Imgur](http://i.imgur.com/jGWRtbK.png?1)

====

View
	
	<Widget id="vCalendar" src="com.imobicloud.calendar" swipeable="true" onChange="calendarChange"></Widget>
    
Styles - app.tss

	".imc-calendar": { width: 320, height: Ti.UI.SIZE }
		".imc-calendar-month": { height: Ti.UI.SIZE, top: 0, layout: 'vertical' }
			".imc-calendar-weeks": { height: 32, top: 0.5, layout: 'horizontal' }
				".imc-calendar-week": { width: 45, height: 32, left: 0.5 }
					".imc-calendar-week-label": { color: '#fff', font: { fontSize: 13, fontFamily: 'HelveticaNeue-Light' } }
			".imc-calendar-dates": { height: Ti.UI.SIZE, bottom: 0.5, layout: 'horizontal' }
				".imc-calendar-date": { width: 45, height: 33, top: 0.5, left: 0.5 }
					".imc-calendar-date-label": { color: '#fff', font: { fontSize: 13, fontFamily: 'HelveticaNeue-Light' }, touchEnabled: false }
				".imc-calendar-today": {  }
					".imc-calendar-today-label": { color: '#2b414d' }
				// do not display next or previous month
				".imc-calendar-disabled": { height: 0, visible: false, touchEnabled: false }
					".imc-calendar-disabled-label": { visible: false, touchEnabled: false }
			
			// custom column styles, there are 6 columns: 0, 1, 2, 3, 4, 5, 6
			// column 0
			".imc-calendar-week-0": {  }
				".imc-calendar-week-label-0": {  }
			".imc-calendar-date-0": {  }	
				".imc-calendar-date-label-0": {  }
			// column 6
			".imc-calendar-week-6": {  }
				".imc-calendar-week-label-6": {  }
			".imc-calendar-date-6": {  }
				".imc-calendar-date-label-6": {  }

			// custom events - custom dateFormatter
			".imc-calendar-events": { width: Ti.UI.SIZE, height: 5, top: 75.5, layout: 'horizontal', touchEnabled: false }
				".imc-calendar-event": { width: 5, height: 5, left: 1.5, right: 1.5, touchEnabled: false }
				".imc-calendar-event-yellow": { backgroundColor: '#e8db07' }
				".imc-calendar-event-blue":   { backgroundColor: '#005ab4' }
				".imc-calendar-event-red":    { backgroundColor: '#ac1e1f' }	
    
Controller

	// customize locale
	var moment = require('moment');
	moment.locale('en', {
	    weekdaysShort : ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
		week : {
	        dow : 1 // Monday is the first day of the week.
	    }
	});

	// show calendar
	$.vCalendar.init(); 
	// or 
	$.vCalendar.init({
		date: new Date("October 13, 2014 11:13:00")
	});

	// events
	function calendarChange(e) {
		// e.type: 
		// - month: month changed
		// - selected: selected date changed
		
		// e.date: moment object

		// e.view: view of the date, selected date changed only
	}

	// get or set value
	$.vCalendar.set( new Date("October 13, 2014 11:13:00") ); 
	$.vCalendar.get(); // => return moment object

	// show next / previous month
	$.vCalendar.previous();
	$.vCalendar.next();

	$.vCalendar.getView(); // => return view of current month

	// For custom date UI, use dateFormatter
	// view com.imobicloud.calendar/controllers/calendar.js for example
	$.vCalendar.init({
		dateFormatter: function(params){
			var vDate = $.UI.create('View', { date: params.dateId });
				vDate.add( $.UI.create('Label', { text: params.dateText }) );

			// if has events
			if (1) {
				var vEvents = $.UI.create('View', { classes: 'imc-calendar-events' });
					vEvents.add( $.UI.create('View', { classes: 'imc-calendar-event imc-calendar-event-yellow' }) );
					vEvents.add( $.UI.create('View', { classes: 'imc-calendar-event imc-calendar-event-blue' }) );
					vEvents.add( $.UI.create('View', { classes: 'imc-calendar-event imc-calendar-event-red' }) );
				vDate.add(vEvents);
			}

			return vDate;
		}
	});

	// remove calendar + cleanup
	$.vCalendar.unload();

