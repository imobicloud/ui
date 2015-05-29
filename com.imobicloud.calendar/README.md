# Titanium UI - Calendar

This calendar widget provides you with a very CSS customizable calendar with some basic commands.

![Calendar example](http://i.imgur.com/jGWRtbK.png?1)

NOTE: FOR NEW UPDATES, VISIT THIS REPOSITORY: https://github.com/imobicloud/com.imobicloud.calendar

##Manifest
* Version: 1.0
* Github: https://github.com/imobicloud/ui
* License: not specified yet
* Author: imobicloud
* Supported Platforms: Android, iOS, Mobileweb

## Adding the Calendar to Your Alloy Project

* In your application's config.json file you need to include the following line in your dependencies:

```
"dependencies": {
    "com.imobicloud.calendar": "1.0"
}
```

*  Create a widgets directory in your app directory if it doesn't already exist.
*  Copy the com.imobicloud.calendar folder into your app/widgets directory.
*  NOTE: for now, we are using the momentJS version 2.8.4 (currently the included in Alloy is 2.7.0), so you need to copy a recent version on `lib` folder and `var moment = require('moment');` it to work

## Create a Calendar in the View
You can add a Calendar to a view by *requiring* the calendar widget. 

	<Widget id="vCalendar" src="com.imobicloud.calendar" swipeable="true" />

Assign it an ID that you can use in your controller. E.g. `id="vCalendar"` You can now access the Calendar via `$.vCalendar` in your controller.
The `swipeable="true"` option allows you to activate the swipe left/right on the calendar to change the current month.

```
Ti.API.info("calendar value " + $.vCalendar.value);
```

## Detect a Calendar change
You can detect a Calendar change simply adding an onChange event. 

	<Widget id="vCalendar" src="com.imobicloud.calendar" onChange="calendarChange" />

You can now access the Calendar change in your controller:

```
function calendarChange(e) {
    // Possible values on e: 
    // e.type: 
    //      'month': the user has changed the current month
    //      'selected': the user has selected a day in the calendar
    
    // e.date: moment object with the selected day (first day of month when month changed)

    // e.view: view of the date to be able to add/change values. Only available when e.type = 'selected'
    Ti.API.info('type: ' + e.type + ' - date: ' + e.date.format("DD-MM-YYYY"));
}
```

## Styling the Calendar
In order to style the widget and due to how it is build, you need to add the styles to app.tss to make it available to all the app.
Use any valid properties for [Ti.UI.View object](http://docs.appcelerator.com/titanium/latest/#!/api/Titanium.UI.View).

```
".imc-calendar": {top: 0, width: Ti.UI.FILL, height: Ti.UI.SIZE, backgroundColor:"white", borderColor: 'pink', borderWidth: 1 }
    ".imc-calendar-month": { height: Ti.UI.SIZE, top: 0, layout: 'vertical'}
        ".imc-calendar-weeks": { height: 32, top: 0.5, layout: 'horizontal', backgroundColor: 'pink' }
            ".imc-calendar-week": { width: "14%", height: 32, left: 0.5 }
                ".imc-calendar-week-label": { color: 'white', font: { fontSize: 13, fontFamily: 'HelveticaNeue-Light' } }
        ".imc-calendar-dates": { height: Ti.UI.SIZE, bottom: 0.5, layout: 'horizontal' }
            ".imc-calendar-date": { width: "14%", height: 33, top: 0.5, left: 0.5 }
                ".imc-calendar-date-label": { color: 'black', font: { fontSize: 13, fontFamily: 'HelveticaNeue-Light' }, touchEnabled: false }
            ".imc-calendar-today": { backgroundColor:"#FCF8E3" }
                ".imc-calendar-today-label": { color: 'black' }
            ".imc-calendar-disabled": { }
                ".imc-calendar-disabled-label": { color: 'grey' }
```

Those are for standard elements. If you need more detailed styling, you can customize individual items:

```
// There are 7 columns: 0, 1, 2, 3, 4, 5, 6
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
```

## Initializing the Calendar in the Controller

The Calendar is off by default. Before you open your window, you need to call the Calendar with the *init* method. For example:

```
$.vCalendar.init();
or if you want to initialize in a specific day
$.vCalendar.init({
		date: new Date("October 13, 2014 11:13:00")
});
```
## Initialization Parameters

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| date | *Date* | A date to start calendar on it. |
| dateFormatter | *function* | A custom function to create every date item on the calendar. If not passed the default function creates a simple view with a label inside to represent the day. |
| weekFormatter | *function* | A custom function to create every weekday item on the calendar. If not passed the default function creates a simple view with a label inside to represent the weekday. |

## Accessible Methods
| Method | Description | Example |
| ---------- | ---- | ----------- |
| get() | Retrieves the current selected day as a moment object. | `$.vCalendar.get();` |
| set(date) | Sets the selected day, reloading the calendar. | `$.vCalendar.set( new Date("May 28, 2015 11:13:00") );` |
| previous() | Jumps one month back. | `$.vCalendar.previous();` |
| next() | Jumps one month forward. | `$.vCalendar.next();` |
| getView() | The calendar has 2 children structures: [week, dates]. This function retrieves both in an array | `$.vCalendar.getView();` |
| unload() | Removes the calendar from the view and all internal references  | `$.vCalendar.unload();` |

## Customizing

You can customize the calendar. For example, to set the week row in another language or set first day of the week:

```
var moment = require('moment');
moment.locale('en', {
    weekdaysShort : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    week : {
        dow : 1 // Monday is the first day of the week.
    }
});
```

## Including events

When you have events to add to an empty calendar, you can do two things: get the view and add it manually or reload the calendar with a custom dateFormatter. E.g.:

Add a custom style for events

```
// custom events - custom dateFormatter
".imc-calendar-events": { width: Ti.UI.SIZE, height: 5, top: 75.5, layout: 'horizontal', touchEnabled: false }
    ".imc-calendar-event": { width: 5, height: 5, left: 1.5, right: 1.5, touchEnabled: false }
    ".imc-calendar-event-yellow": { backgroundColor: '#e8db07' }
    ".imc-calendar-event-blue":   { backgroundColor: '#005ab4' }
    ".imc-calendar-event-red":    { backgroundColor: '#ac1e1f' }	
```

Now in the controller initialize the calendar with options:

```
// For custom week/date UI, use weekFormatter/dateFormatter
// See com.imobicloud.calendar/controllers/calendar.js for example

$.vCalendar.init({
    weekFormatter: function(params) {
        var vDate = $.UI.create('View', { classes: 'imc-calendar-week imc-calendar-week-' + params.column });
        vDate.add( $.UI.create('Label', { text: params.weekText, classes: 'imc-calendar-week-label imc-calendar-week-label-' + params.column }) );
        return vDate;
    },
    dateFormatter: function(params) {
        var vDate = $.UI.create('View', { date: params.dateId });
        vDate.add( $.UI.create('Label', { text: params.dateText }) );

        // if has events
        if (your condition) {
            var vEvents = $.UI.create('View', { classes: 'imc-calendar-events' });
            vEvents.add( $.UI.create('View', { classes: 'imc-calendar-event imc-calendar-event-yellow' }) );
            vEvents.add( $.UI.create('View', { classes: 'imc-calendar-event imc-calendar-event-blue' }) );
            vEvents.add( $.UI.create('View', { classes: 'imc-calendar-event imc-calendar-event-red' }) );
            vDate.add(vEvents);
        }

        return vDate;
    }
});
```

The option to manipulate the existing view can be done like this: let's change the background color of the previous day to current date (yesterday)

```
function loadEvents() {
    var moment = require('moment');
    var yesterday = moment().subtract(1, 'd').format('DD-MM-YYYY');
    
	// The calendar has 2 children structures: [week, dates]. We only need dates
  	var children = $.vCalendar.getView().children[1].children;
    //Ti.API.info(JSON.stringify(children[0].children));
  	for (var i=0; i<children.length; i++) {
        Ti.API.info("date: " + moment(children[i].date).format('DD-MM-YYYY'));
        if (yesterday == moment(children[i].date).format('DD-MM-YYYY')) {
            children[i].backgroundColor = 'yellow';
            // or you can add a new view, e.g.
  			//children[i].add( $.UI.create('View', { classes: 'imc-calendar-date-event' }) );
  		}
	};
}
```
