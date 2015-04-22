
init(arguments[0]);

/*
 args = {
 	date: moment object,
 	dateFormatter: null // or function(){}
 }
 * */
function init(args) {
	loadWeek();
	loadDate(args.date, args.dateFormatter || dateFormatter);
};

function loadWeek() {
	// moment.weekdays(); 
	// moment.localeData().firstDayOfWeek();
  	// var weekNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  	var weekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  	
  	var container = $.UI.create('View', { classes: 'imc-calendar-week-container' });
  	
  	for (var i = 0; i < 7; i++) {
  		var vDate = $.UI.create('View', { classes: 'imc-calendar-week imc-calendar-column-' + i });
  			vDate.add( $.UI.create('Label', { text: weekNames[i], classes: 'imc-calendar-week-label imc-calendar-column-label-' + i }) );
		container.add(vDate);
	};
	
	$.calendar.add(container);
}

function loadDate(time, formatter) {
	// TODO: require moment 2.8.4, current 2.7.0 [https://github.com/appcelerator/alloy/blob/master/Alloy/builtins/moment.js]
	
	var moment 	  = require(WPATH('moment')), // require('alloy/moment'),
		column    = 0,
		thisMonth = time.month(),
  		// currentDate = time.subtract(( time.day() || 7 ) - 1, 'days'),
  		currentDate = time.subtract(time.day(), 'days'),
  		todayId     = moment().startOf('day').format('x');// get today's time stamp without hours, minutes and seconds
  	
  	var container = $.UI.create('View', { classes: 'imc-calendar-date-container' });
  	
  	for (var i = 0; i < 42; i++) {
  		var dateId = currentDate.format('x'),
  			isThisMonth = true,
  			isToday = false;
  		
  		if (currentDate.month() == thisMonth) {
  			if (dateId == todayId) {
  				isToday = true;
  			}
  		} else  {
  			isThisMonth = false;
  		}
  		
		container.add(formatter({
			column: column,
			dateId: dateId,
			dateText: currentDate.date(),
			isThisMonth: isThisMonth,
 			isToday: isToday
		}));
		
		currentDate.add(1, 'days');
		
		if (column < 6) { column++; } else { column = 0; }
	};
	
	$.calendar.add(container);
}

/*
 params = {
 	column: 0,
 	dateId: 1360013296123,
 	dateText: 31,
 	isThisMonth: true,
 	isToday: false
 } 
 * */
function dateFormatter(params) {
  	var viewClasses  = 'imc-calendar-date ',
		labelClasses = 'imc-calendar-date-label ';
	
	if (params.isThisMonth) {
		if (params.isToday) {
			viewClasses  += 'imc-calendar-today';
  			labelClasses += 'imc-calendar-today-label';
		}
	} else {
		viewClasses  += 'imc-calendar-disabled';
		labelClasses += 'imc-calendar-disabled-label';
	}
	
	viewClasses  += ' imc-calendar-column-' + params.column;
	labelClasses += ' imc-calendar-column-label-' + params.column;
	
	var vDate = $.UI.create('View', { date: params.dateId, classes: viewClasses });
		vDate.add( $.UI.create('Label', { text: params.dateText, classes: labelClasses }) );
		
	return vDate;
}