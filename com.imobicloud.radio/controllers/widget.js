var vars = {};

init(arguments[0] || {});

/*
 <Widget id="radioWeAre" src="com.imobicloud.radio" values="['male', 'female']" icon="true" title="false"/>
 args = {
 	icon: true,
 	title: false,
 	values: [ 'male', 'female' ],
 	value: 'male'
 }
 * */
function init(args) {
	var container = $.getView(),
		values   = typeof args.values == 'string' ? eval(args.values) : args.values,
		useIcon   = args.icon == 'true',
		useTitle  = args.title == 'true',
		value     = args.value || values[0];
		
	for(var i=0,ii=values.length; i<ii; i++){
	  	var id = values[i],
	  		isActive = value == id;
	  	
	  	var radio = $.UI.create('View', { classes: 'radio-item', dataId: id });
  			useIcon  && radio.add( $.UI.create('ImageView', { classes: 'radio-icon  radio-icon-'  + id + ( isActive ? ' radio-icon-' + id + '-on' : '' ) }) );
		  	useTitle && radio.add( $.UI.create('Label',     { classes: 'radio-label radio-label-' + id + ( isActive ? ' radio-label-' + id + '-on' : '' ) }) );
	  	container.add(radio);
	  	
	  	isActive && (vars.activeView = radio);
	};
	
	vars.activeId = value;
	vars.useIcon  = useIcon;
	vars.useTitle = useTitle;
};

function toggleRadio(e) {
  	var view = e.source,
  		id = view.dataId;
  		
  	if (id == null || id == vars.activeId) { return; }
  	
  	if (vars.useIcon) {
  		$.addClass(view.children[0], 'radio-icon-' + id + '-on');
		$.removeClass(vars.activeView.children[0], 'radio-icon-' + vars.activeId + '-on');
  	}
  	
  	if (vars.useTitle) {
  		var index = vars.useIcon ? 1 : 0;
  		$.addClass(view.children[0], 'radio-label-' + id + '-on');
		$.removeClass(vars.activeView.children[0], 'radio-label-' + vars.activeId + '-on');
  	}
	
	vars.activeId = id;
	vars.activeView = view;
}

exports.getValue = function() {
	return vars.activeId;
};