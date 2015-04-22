// TODO: require moment 2.8.4, current 2.7.0 [https://github.com/appcelerator/alloy/blob/master/Alloy/builtins/moment.js]
var moment = require(WPATH('moment')), // require('alloy/moment'),
	dateFormatter,
	oDate;

/*
 params = {
 	date: null, 		// or date object
 	dateFormatter: null // or function(){}
 }
 * */
exports.init = function(params) {
	if (params == null) { params = {}; }
	dateFormatter = params.dateFormatter;
	set(params.date);
};

exports.unload = function() {
	dateFormatter = null;
	return $.vCalendar.removeAllChildren();
};

exports.get = function() {
	return oDate;
};

function set(date) {
	oDate = moment(date).startOf('month');
	return loadCalendar();
}
exports.set = set;

function previous() {
	oDate.subtract(1, 'months');
  	return loadCalendar();
}
exports.previous = previous;

function next() {
	oDate.add(1, 'months');
  	return loadCalendar();
}
exports.next = next;

function loadCalendar() {
	var container = $.vCalendar;
	
	container.add( Widget.createController('calendar', { 
		date: moment(oDate), // create a copy of oDate to prevent its value changed
		dateFormatter: dateFormatter 
	}).getView() );
	
	if (container.children.length > 1) {
		container.remove( container.children[0] );
	}
	
	return $.trigger('change', { type: 'month', date: moment(oDate) });	// create a copy of oDate to prevent its value changed
}

function calendarClicked(e) {
	var view = e.source;
	view.date && $.trigger('change', { type: 'selected', date: moment(view.date), view: view });
}

/*
// demo how to use selectedChange event

var selectedDates = [];
function selectedChange(e) {
	var date = e.date,
		view = e.view;
	
	if (selectedDates.indexOf(date) === -1) {
		$.addClass(view, 'imc-calendar-date-selected');
		$.addClass(view.children[0], 'imc-calendar-date-selected-label');
		
		selectedDates.push(date);
	} else {
		$.removeClass(view, 'imc-calendar-date-selected');
		$.removeClass(view.children[0], 'imc-calendar-date-selected-label');
		
		selectedDates = _.without(selectedDates, date);
	}
}
 * */

function calendarSwipe(e) {
	var actions = { left: next, right: previous },
		action  = actions[e.direction];
	action && action();	
}

//

exports.getView = function() {
	return vCalendar.children[0];
};

/*
// demo how to use getView

function loadEvents() {
	var today = new Date(),
		date  = today.getDate(),
		month = today.getMonth(),
		year  = today.getFullYear();
	
  	var children = $.vCalendar.getView().children;
  	for(var i=0,ii=children.length; i<ii; i++){
  		var current = new Date( parseInt(children[i].date, 10) );
  		if (current.getFullYear() == year && current.getMonth() == month && current.getDate() == date) {
  			children[i].add( $.UI.create('ImageView', { classes: 'imc-calendar-date-event' }) );
  		}
	};
}
 * */

