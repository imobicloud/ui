// TODO: require moment 2.8.4, current 2.7.0 [https://github.com/appcelerator/alloy/blob/master/Alloy/builtins/moment.js]
var moment = require('moment'), // require('alloy/moment'),
    dateFormatter, 
    weekFormatter,
    oDate,
    horizontalSeparator,
    verticalSeparator;

// You can call this widget with parameters or not
init(arguments[0] || {});

/*
args = {
    swipeable: 'false'
}
 * */
function init(args) {
    if (args.swipeable == 'true') {
        $.vCalendar.addEventListener('swipe', calendarSwipe);
    } 
}

// -------------------------------------------------------------------------
// ---------------------------- Public functions ---------------------------
/*
params = {
    date: null or date object
    dateFormatter: null or function(){}
    weekFormatter: null or function(){}
    horizontalSeparator: null or boolean
    verticalSeparator: null or boolean
}
 * */
exports.init = function(params) {
    if (params == null) { params = {}; }
    dateFormatter = params.dateFormatter;
    weekFormatter = params.weekFormatter;
    horizontalSeparator = params.horizontalSeparator;
    verticalSeparator = params.verticalSeparator;
    set(params.date);
};

exports.unload = function() {
    dateFormatter = null;
    weekFormatter = null;
    oDate = null;
    horizontalSeparator = null;
    verticalSeparator = null;
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

// The calendar has 2 children structures: [week, dates]. This function exports both in an array
exports.getView = function() {
    return $.vCalendar.children[0];
};
/*
// DEMO: how to use getView to add more info to current day
// You must define the new class applied in you app.tss
function loadEvents() {
    var moment = require('moment');
    var today = moment().format('YYYY-MM-DD');
    
    // The calendar has 2 children structures: [week, dates]. We only need dates
    var children = $.vCalendar.getView().children[1].children;
    for (var i=0; i<children.length; i++) {
        if (today == moment(children[i].date).format('YYYY-MM-DD')) {
            children[i].add( $.UI.create('ImageView', { classes: 'imc-calendar-date-event' }) );
        }
    };
}
 * */

// ---------------------------- End Public functions ---------------------------
// -----------------------------------------------------------------------------

// Called on start and when the month is changed, will remove current calendar and render new month
// Triggers a "change" event of type "month" and date = first day of month
function loadCalendar() {
    var container = $.vCalendar;
    
    container.add( Widget.createController('calendar', { 
        date: moment(oDate), // create a copy of oDate to prevent its value changed
        dateFormatter: dateFormatter,
        weekFormatter: weekFormatter,
        horizontalSeparator: horizontalSeparator,
        verticalSeparator: verticalSeparator
    }).getView() );
    
    if (container.children.length > 1) {
        container.remove( container.children[0] );
    }
    
    return $.trigger('change', { type: 'month', date: moment(oDate) });	// create a copy of oDate to prevent its value changed
}

// Called when a day is touched, triggers a "change" event of type "selected", the touched date
// and the view in order to you can change it (add new data, change a color, etc.)
function calendarClicked(e) {
    var view = e.source;
    view.date && $.trigger('change', { type: 'selected', date: moment(view.date), view: view });
}

/*
// DEMO: how to use selectedChange event
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
