var moment = require('alloy/moment'),
	events = {},
	vars = {};

exports.init = function(date) {
	var oMoment = date || moment();
	
	vars.month = oMoment.month(); // 0 -> 11
	vars.year = oMoment.year();
	
	loadCalendar();
};

exports.unload = function() {
	vars.controller && $.calendarContainer.remove( vars.controller.getView() );
	vars = null;
};

function loadCalendar() {
	var calendarContainer = $.calendarContainer;
	
	// hide lblMonth
	// var lblMonth = calendarContainer.children[0].children[0];
	// lblMonth && (lblMonth.visible = false);
	
	var data = { month: vars.month, year: vars.year },
		controller = Widget.createController('calendar', data);
	calendarContainer.add( controller.getView() );
	
	vars.controller && calendarContainer.remove( vars.controller.getView() );
	
	vars.controller = controller;
	
	fireEvent('monthChange', data);
}

exports.loadCalendar = loadCalendar;

function loadPreviousMonth(e) {
	if (vars.month != 0) {
		vars.month--;
	} else {
		vars.month = 11;
		vars.year--;
	}
	
  	loadCalendar();
}

function loadNextMonth(e) {
	if (vars.month != 11) {
		vars.month++;
	} else {
		vars.month = 0;
		vars.year++;
	}
	
  	loadCalendar();
}

function calendarClicked(e) {
	var el = e.source;
  	el.date && fireEvent('selectedChange', {
  		date: el.date,
  		view: el
  	});
}

/*
// demo how to use selectedChange event

var selectedDates = [];
function selectedChange(e) {
	var date = e.date,
		view = e.view;
	
	if (selectedDates.indexOf(date) === -1) {
		$.addClass(view, 'calendar-date-selected');
		$.addClass(view.children[0], 'calendar-date-selected-label');
		
		selectedDates.push(date);
	} else {
		$.removeClass(view, 'calendar-date-selected');
		$.removeClass(view.children[0], 'calendar-date-selected-label');
		
		selectedDates = _.without(selectedDates, date);
	}
}
 
 * */

function calendarSwipe(e) {
  	switch (e.direction) {
  		case 'left':
  			loadNextMonth();
  			break;
  		case 'right':
  			loadPreviousMonth();
  			break;
  	}
}

//

exports.getCurrent = function() {
	return { month: vars.month, year: vars.year };
};

exports.getDateView = function() {
	return vars.controller ? vars.controller.dateContainer : null;
};

/*
// demo how to use getDateView

function loadEvents() {
	var today = new Date(),
		date  = today.getDate(),
		month = today.getMonth(),
		year  = today.getFullYear();
	
  	var children = $.vCalendar.getDateView().children;
  	for(var i=0,ii=children.length; i<ii; i++){
  		var current = new Date( parseInt(children[i].date, 10) );
  		if (current.getFullYear() == year && current.getMonth() == month && current.getDate() == date) {
  			children[i].add( $.UI.create('ImageView', { classes: 'calendar-date-event' }) );
  		}
	};
}
 * */

// EVENTS

function fireEvent(type, data) {
  	var callbacks = events[type];
  	if (callbacks) {
  		for(var i=0,ii=callbacks.length; i<ii; i++){
			callbacks[i](data, { type: type });
		};
  	}
}

exports.on = function(type, callback) {
	if (events[type]) {
  		events[type].push(callback);
  	} else {
  		events[type] = [callback];
  	}
  	return this;
};