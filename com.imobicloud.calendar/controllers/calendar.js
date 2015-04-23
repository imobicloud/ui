// TODO: require moment 2.8.4, current 2.7.0 [https://github.com/appcelerator/alloy/blob/master/Alloy/builtins/moment.js]
var moment = require('moment'), // require('alloy/moment'),
	firstDayOfWeek; // 0: Sunday is the first day of the week. 1: Monday is the first day of the week.

init(arguments[0]);

/*
 args = {
 	date: moment object,
 	dateFormatter: null // or function(){}
 }
 * */
function init(args) {
	firstDayOfWeek = moment.localeData().firstDayOfWeek();
	
	loadWeek();
	loadDate(args.date, args.dateFormatter || dateFormatter);
};

function loadWeek() {
  	var i = firstDayOfWeek,
  		weekNames = moment.weekdaysShort(),
  		container = $.UI.create('View', { classes: 'imc-calendar-weeks' });
  	
  	while (i < 7 || firstDayOfWeek === 1) {
  		var vDate = $.UI.create('View', { classes: 'imc-calendar-week imc-calendar-week-' + i });
  			vDate.add( $.UI.create('Label', { text: weekNames[ i < 7 ? i : 0 ], classes: 'imc-calendar-week-label imc-calendar-week-label-' + i }) );
		container.add(vDate);
		
		if (i === 7) {
			break;
		}
		
		i++;
	};
	
	$.calendar.add(container);
}

function loadDate(time, formatter) {
	var column      = 0,
		thisMonth   = time.month(),
  		currentDate = time.subtract(firstDayOfWeek === 0 ? time.day() : ( time.day() || 7 ) - 1, 'days'),
  		todayId     = moment().startOf('day').format('x');// get today's time stamp without hours, minutes and seconds
  	
  	var container = $.UI.create('View', { classes: 'imc-calendar-dates' });
  	
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
  	var  viewClasses = ['imc-calendar-date'],
		labelClasses = ['imc-calendar-date-label'];
	
	if (params.isThisMonth) {
		if (params.isToday) {
			 viewClasses.push('imc-calendar-today');
  			labelClasses.push('imc-calendar-today-label');
		}
	} else {
		 viewClasses.push('imc-calendar-disabled');
		labelClasses.push('imc-calendar-disabled-label');
	}
	
	 viewClasses.push('imc-calendar-date-' + params.column);
	labelClasses.push('imc-calendar-date-label-' + params.column);
	
	var vDate = $.UI.create('View',     { date: params.dateId,   classes:  viewClasses.join(' ') });
		vDate.add( $.UI.create('Label', { text: params.dateText, classes: labelClasses.join(' ') }) );
		
	return vDate;
}