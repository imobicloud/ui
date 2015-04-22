# Titanium UI - Calendar

![Imgur](http://i.imgur.com/jGWRtbK.png?1)

====

View
	
	<Widget id="vCalendar" src="com.imobicloud.calendar" onChange="calendarChange"></Widget>
    
Styles - app.tss

	".imc-calendar": { width: 320, height: Ti.UI.SIZE }
		".imc-calendar-month": { height: Ti.UI.SIZE, top: 0, layout: 'vertical' }
			".imc-calendar-week-container": { height: 32, top: 0.5, layout: 'horizontal' }
				".imc-calendar-week": { width: 45, height: 32, left: 0.5 }
					".imc-calendar-week-label": { color: '#fff', font: { fontSize: 13, fontFamily: 'HelveticaNeue-Light' } }
			".imc-calendar-date-container": { height: Ti.UI.SIZE, bottom: 0.5, layout: 'horizontal' }
				".imc-calendar-date": { width: 45, height: 33, top: 0.5, left: 0.5 }
					".imc-calendar-date-label": { color: '#fff', font: { fontSize: 13, fontFamily: 'HelveticaNeue-Light' }, touchEnabled: false }
				".imc-calendar-today": {  }
					".imc-calendar-today-label": { color: '#2b414d' }
				// do not display next or previous month
				".imc-calendar-disabled": { visible: false, touchEnabled: false }
					".imc-calendar-disabled-label": { visible: false, touchEnabled: false }
			
			".imc-calendar-column-0": { width: 46, left: 0 }
				".imc-calendar-column-label-0": {  }
			".imc-calendar-column-6": { width: 46 }
				".imc-calendar-column-label-6": {  }
    
Controller

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
	// view source calendar.js for example
	$.vCalendar.init({
		dateFormatter: function(params){
			var vDate = $.UI.create('View', { date: params.dateId });
				vDate.add( $.UI.create('Label', { text: params.dateText }) );
			return vDate;
		}
	});


