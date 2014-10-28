var moment = require('alloy/moment');

init(arguments[0]);

function init(args) {
	var time = moment((args.month + 1) + '-01-' + args.year + ' 00:00:00', 'MM-DD-YYYY hh:mm:ss');
	
	$.lblMonth.text = time.format('MMMM YYYY');
	
	loadWeek();
	
	loadDate(time, args.month);
};

function loadWeek() {
  	var weekNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  	
  	for (var i = 0; i < 7; i++) {
  		var vDate = $.UI.create('View', { classes: 'calendar-week calendar-column-' + i });
  			vDate.add( $.UI.create('Label', { text: weekNames[i], classes: 'calendar-week-label calendar-column-' + i + '-label' }) );
		$.weekContainer.add(vDate);
	};
}

function loadDate(time, currentMonth) {
	var column = 0,
		dayIndex = time.day(), // Sunday as 0 and Saturday as 6
  		prevMonth = time.subtract('days', ( dayIndex ? dayIndex : 7 ) - 1),
  		today = moment().startOf('hour').hour(0).toDate().getTime() + '';// get today's time stamp without hours, minutes and seconds
  	
  	for (var i = 0; i < 42; i++) {
  		var date = prevMonth.toDate().getTime() + '',
  			viewClasses  = 'calendar-date ',
  			labelClasses = 'calendar-date-label ';
  		
  		// highlight previous and next month
  		if (prevMonth.month() != currentMonth) {
  			viewClasses  += 'calendar-date-disabled';
  			labelClasses += 'calendar-date-disabled-label';
  		}  
  		// highlight current date
  		else if (date == today) {
  			viewClasses  += 'calendar-date-today';
  			labelClasses += 'calendar-date-today-label';
  		}
  		
		viewClasses  += ' calendar-column-' + column;
		labelClasses += ' calendar-column-' + column + '-label';
		
		if (column < 6) { column++; } else { column = 0; }
  		
  		var vDate = $.UI.create('View', { date: date, classes: viewClasses });
  			vDate.add( $.UI.create('Label', { text: prevMonth.date(), classes: labelClasses }) );
		$.dateContainer.add(vDate);
		
		prevMonth.add('days', 1);
	};
}