# ui
====

titanium ui elements



## Date picker

xml
	<View class="textfield" onClick="showDatePicker">
		<TextField class="txt" editable="false"/>
		<ImageView class="icon-calendar" touchEnabled="false"/>
	</View>
    
    <Require id="datePicker" src="elements/date_picker"/>

js
	var target;
    
    function showDatePicker(e) {
		var txt = e.source.children[0];
        target = txt;
        $.datePicker.show(setDate, txt.dateValue);
	}
    
	function setDate(time) {
		target.dateValue = time;
        target.value = moment(time).format('M/D/YYYY');
        $.datePicker.hide();
	}

## Time Picker

xml
	<View class="textfield" onClick="showTimePicker">
		<TextField class="txt" editable="false"/>
		<ImageView class="icon-clock" touchEnabled="false"/>
	</View>
    
    <Require id="timePicker" src="elements/time_picker"/>

js
	var target;
    
    function showTimePicker(e) {
    	var txt = e.source.children[0];
        target = txt;
        $.timePicker.show(setTime, txt.timeValue);
	}

	function setTime(time) {
		target.timeValue = time;
        target.value = moment(time).format('h:m A');
        $.timePicker.hide();
	}

## Value picker

xml
    <View class="textfield" onClick="showTypePicker">
		<TextField class="txt"  editable="false" value="What type of event is this?"/>
		<ImageView class="icon-type" touchEnabled="false"/>
	</View>
    
    <Require id="valuePicker" src="elements/value_picker"/>

js
	var target;
    
    // === one column picker
    
    function showTypePicker(e) {
    	var data = [
        	{ title: '1', value: 1 },
            { title: '2', value: 2 },
            { title: '3', value: 3 }
        ];
        
        var txt = e.source.children[0];
        target = txt;
        
        $.valuePicker.show({
        	callback: updateType,
            data: [ data ],
            values: txt.typeValue
        });
	}

	function updateType(values) {
    	target.typeValue = values;
        target.value = values[0].title;
        
        $.valuePicker.hide();
	}
    
	// === multi column picker

	function showTypePicker_multi(e) {
    	var column_1 = [
        		{ title: '1', value: 1 },
                { title: '2', value: 2 },
                { title: '3', value: 3 }
            ],
            column_2 = [
            	{ title: '4', value: 4 },
                { title: '5', value: 5 },
                { title: '6', value: 6 }
            ];
            
        var txt = e.source.children[0];
        target = txt;
        
        $.valuePicker.show({
        	callback: updateType_multi,
            data: [ column_1, column_2 ],
            values: txt.typeValue
        });
	}

	function updateType_multi(values) {
    	target.typeValue = values;
        target.value = values[0].title + ' - ' + values[1].title;
        
        $.valuePicker.hide();
	}
    