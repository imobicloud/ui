var args = arguments[0];

init();
function init() {
  	$.title.text = args.title;
  	toggleSelect(args.selected);
}

function toggleSelect(isSelected) {
  	$.icon.applyProperties( $.createStyle({ classes: 'imc-checkbox-icon-' + ( isSelected ? 'on' : 'off' ) }) );
  	$.title.applyProperties( $.createStyle({ classes: 'imc-checkbox-title-' + ( isSelected ? 'on' : 'off' ) }) );
}

function checkboxClick(e) {
  	args.selected = !args.selected;
  	toggleSelect(args.selected);
  	$.checkbox.fireEvent('toggle', { id: args.id, selected: args.selected });
}