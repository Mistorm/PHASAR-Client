function Box(){
	
    //Declare the offset where a new box forming the tail of the current box will be placed 
    this.TAILOFFSETX = 300;
    this.TAILOFFSETY = 0;
	
    //Declare the offset where a new box forming the head of the current box will be placed
    this.HEADOFFSETX = -300;
    this.HEADOFFSETY = 0;
	
    //this.TAILCONNECTIONOFFSETX =  101;
    //this.TAILCONNECTIONOFFSETY = 41;
	
    //this.HEADCONNECTIONOFFSETX =  101;
    //this.HEADCONNECTIONOFFSETY = 41;
	
    //Default fields & values for a new box
    this.id = null;
    this.value = "*";
	
    //Default pacement for a new box on an empty canvas
    this.x = 250;
    this.y = 250;
	
    //Values used for the new box/arrow when extending the current box
    this.newExtensionDirection = null;
    this.newHeadValue = null;
    this.newTailValue = null;
    this.newRelatorValue = null;
	
    //Getters & setters
    this.setId = function(value){
	this.id = value;
    }
	
    this.getId =  function(){
	return this.id;
    }
	
    this.setValue = function(value){
	this.value = value;
		
	//update HTML representation if there is one
	var w = $("#b"+ this.id );
	if($("#b"+ this.id ).length == 1){
	    $("#b"+ this.id + " .content")[0].innerText = value;
	}
    }
	
    this.getValue = function(){
		
	if(this.value){
	    return this.value;
	}else{
	    return "*";
	}
    }
	
    this.setX = function(value){
	this.x = value;
    }
	
    this.getX = function(){
	return this.x;
    }
	
    this.setY = function(value){
	this.y = value;
    }
	
    this.getY = function(){
	return this.y;
    }
	
    this.getHTML =  function(){
	return '<div class="positionable box" id = "b' + this.id +'">' + '<div class="left"></div><div class="top"></div><div class="right"></div><div class="bottom"></div><div class="content">' + this.getValue() + '</div></div>';
    }
	
    //The x of where an tail arrow should conect with the box
    this.getTailConnectionX = function(){
	var width = $("#b" + this.getId()).width();
	return this.getX() + 30 + (width / 2); 
    }
	
    //The y of where an tail arrow should conect with the box
    this.getTailConnectionY = function(){
	var height = $("#b" + this.getId()).height();
	return this.getY() + 22 + (height / 2); 
    }
	
	
    //The x of where an head arrow should conect with the box
    this.getHeadConnectionX = function(){
	var width = $("#b" + this.getId()).width();
	return this.getX() + 30 + (width / 2); 
    }
	
    //The y of where an tail arrow should conect with the box
    this.getHeadConnectionY = function(){
	var height = $("#b" + this.getId()).height();
	return this.getY() + 22 + (height / 2); 
    }
	
    this.setNewHeadValue = function(value){
	this.newHeadValue = value;
    }
	
    this.setNewTailValue = function(value){
	this.newTailValue = value;
    }
	
    this.setNewRelatorValue = function(value){
	this.newRelatorValue = value;
    }
	
    this.clearExtensionVariables = function(){
	this.newExtensionDirection = null;
	this.newHeadValue = null;
	this.newTailValue = null;
	this.newRelatorValue = null;
    }
	
    this.drawSuggestionList = function(data){
	
	var tailSuggestionListXMod = 14;
	var tailSuggestionListYMod = 10;
	
	var headSuggestionListXMod = -16;
	var headSuggestionListYMod = 10;
	
	var suggestionListXMod = -2;
	var suggestionListYMod = 50;
	
	//Add menu for picking new arrow value
	var list;
	if(this.newRelatorValue != null){
	    if(this.newExtensionDirection == "head"){
		list = new SuggestionList(this.getX() + headSuggestionListXMod, this.getY() + headSuggestionListYMod, data, this.newExtensionDirection, this.getId(), "right");
	    }else{
		//list = new SuggestionList(this.getX() + $("#b" + this.getId()).outerWidth() + tailSuggestionListXMod, this.getY() + tailSuggestionListYMod, data, this.newExtensionDirection, this.getId());
		callback = function(values){alert(values)};
		list = new SuggestionMenu(this.getX() + $("#b" + this.getId()).outerWidth() + tailSuggestionListXMod, this.getY() + tailSuggestionListYMod, data, callback, false);
	    }
	}else{
	    //Add menu for picking new arrow value
	    if(this.newExtensionDirection == "head"){
		list = new SuggestionList(this.getX() + headSuggestionListXMod, this.getY() + headSuggestionListYMod, data, "arrow", this.getId(), "right");
	    }else if(this.newExtensionDirection == "tail"){
		list = new SuggestionList(this.getX() + $("#b" + this.getId()).outerWidth() + tailSuggestionListXMod, this.getY() + tailSuggestionListYMod, data, "arrow", this.getId());
	    }else{
		list = new SuggestionList(this.getX() - suggestionListXMod, this.getY() + suggestionListYMod, data, "me", "b" + this.getId());
	    }
	}
    }
	
    this.extend = function(direction){
		
	if(direction == "head" || direction == "tail"){
	    this.newExtensionDirection = direction;
	}
		
	//Get the base JSON query before doing anything else
	//var baseQuery = jQuery.tree.getJSON();
		
	//Check if  we know the new value for the relator.
	if(this.newRelatorValue != null){
	    //We do so now we can check for the box-to-be-added
	    if(this.newHeadValue != null && this.newExtensionDirection == "head"){
		//We have all the info we need to extend the box with a head
				
		//Create a new box for the tail, using the position of the head box and the tail offset
		var newBox = jQuery.tree.newBox();
				
		newBox.setX(this.getX() + this.HEADOFFSETX);
		newBox.setY(this.getY() + this.HEADOFFSETY);
		newBox.setValue(this.newHeadValue);
				
		//Create a new arrow for the tail, rendering it between the boxes
		var arrow = jQuery.tree.newArrow();
						
		arrow.setA(newBox);
		arrow.setDirection(this);
		arrow.setB(this);
		arrow.setValue(this.newRelatorValue);
				
		//Draw the box and arrow
		newBox.draw();
		arrow.draw();
		arrow.refresh();
				
		//Clear the variables used during the extention
		this.clearExtensionVariables();
	    }
	    else if(this.newTailValue != null && this.newExtensionDirection == "tail"){
		//We have all the info we need to extend the box with a tail
				
		//Create a new box for the tail, using the position of the head box and the tail offset
		var newBox = jQuery.tree.newBox();
						
		newBox.setX(this.getX() + this.TAILOFFSETX);
		newBox.setY(this.getY() + this.TAILOFFSETY);
		newBox.setValue(this.newTailValue);
				
		//Create a new arrow for the tail, rendering it between the boxes
		var arrow = jQuery.tree.newArrow();
						
		arrow.setA(this);
		arrow.setDirection(newBox);
		arrow.setB(newBox);
		arrow.setValue(this.newRelatorValue);
				
		//Draw the box and arrow
		newBox.draw();
		arrow.draw();
		arrow.refresh();
				
		//Clear the variables used during the extention
		this.clearExtensionVariables();
			
	    }else{//We have a new relator value, but no new box value.
		//Create the extention past of the JSON suggestion part
		if(this.newExtensionDirection == "head"){
		    var extension =  '{"a":"*", "relator":"'  + this.newRelatorValue + '", "b":"' + this.value + '","direction":"*"}';
		}else if(this.newExtensionDirection == "tail"){
		    var extension =  '{"a":"' + this.value + '", "relator":"' + this.newRelatorValue + '", "b":"*","direction":"*"}';
		}
					
		//var json = '{"baseQuery":'  + baseQuery + ',';
		//json = json + '"extension":' + extension + '}';
		
		var modifiedTree = jQuery.extend(true, {}, jQuery.tree);
		
		var modifiedBox = modifiedTree.newBox();
		
		var modifiedArrow = modifiedTree.newArrow();
		modifiedArrow.setA(this);
		modifiedArrow.setValue(this.newRelatorValue);
		modifiedArrow.setB(modifiedBox);
		
		if(this.newExtensionDirection == "head"){
		    modifiedArrow.setDirection(this);
		}else if(this.newExtensionDirection == "tail"){
		    modifiedArrow.setDirection(modifiedBox);
		}
		
		var modifiedJson = '{"query":'  + modifiedTree.getJSON() + ',';
		modifiedJson = modifiedJson + '"box":' + '{"nr":"' + modifiedBox.getId() + '", "content":"' + modifiedBox.getValue() + '"}' + '}';
		
		//		alert(modifiedJson);
		var url = 'http://localhost:9998/mediator/query/suggestion';
		
		$.ajax({
		    type: 'POST',
		    crossDomain:true,
		    url: url,
		    dataType:'json',
		    data: modifiedJson,
		    context: this,
		    success: this.drawSuggestionList,
		    error: function (xhr) {
			alert(xhr.responseText + '  ' + xhr.status + '  ' + xhr.statusText);
		    }
		});
	    }
	//No relator(arrow) value, need to get that first
	}else{
	    
	    var modifiedTree = jQuery.extend(true, {}, jQuery.tree);
		
	    var modifiedBox = modifiedTree.newBox();
		
	    var modifiedArrow = modifiedTree.newArrow();
	    modifiedArrow.setA(this);
	    modifiedArrow.setB(modifiedBox);
		
	    if(this.newExtensionDirection == "head"){
		modifiedArrow.setDirection(this);
	    }else if(this.newExtensionDirection == "tail"){
		modifiedArrow.setDirection(modifiedBox);
	    }
		
	    var modifiedJson = '{"query":'  + modifiedTree.getJSON() + ',';
	    
	    string = '{"a":"' + modifiedArrow.getA().getId();
	    string = string + '", "relator":"' + modifiedArrow.getValue();
	    string = string + '", "b":"' + modifiedArrow.getB().getId();
	    string = string + '", "direction":"' + modifiedArrow.getDirection().getId() + '"}';
	    
	    modifiedJson = modifiedJson + '"arrow":' + string + '}';
		
	    var url = 'http://localhost:9998/mediator/query/suggestion';
		
	    $.ajax({
		type: 'POST',
		crossDomain:true,
		url: url,
		dataType:'json',
		data: modifiedJson,
		context: this,
		success: this.drawSuggestionList,
		error: function (xhr) {
		    alert(xhr.responseText + '  ' + xhr.status + '  ' + xhr.statusText);
		}
	    });
	}
    }
	
    this.removeMe = function(){
	var arrow = jQuery.tree.getArrows(this);
			
	if(arrow.length != 0){
	    var arrowId = arrow[0].getId();
	}
				
	if(jQuery.tree.removeBox(this)){
					
	    //alert("Box " + id + " and arrow " + arrowId + " removed from the internal arrays.");
	    $("#b" + this.getId()).remove();
	    $("#a" + arrowId).remove();
	}else{
	//alert("Box not removed.");
	}
    }
    
    this.getSuggestionMenu = function(){
	var json = '{"query":'  + jQuery.tree.getJSON() + ',';
	json = json + '"box":' + '{"nr":"' + this.getId() + '", "content":"' + this.getValue() + '"}' + '}';
		
	var url = 'http://localhost:9998/mediator/query/suggestion';

	$.ajax({
	    type: 'POST',
	    crossDomain:true,
	    url: url,
	    dataType:'json',
	    data: json,
	    context: this,
	    success: this.drawSuggestionList,
	    error: function (xhr) {
		alert(xhr.responseText + '  ' + xhr.status + '  ' + xhr.statusText);
	    }
	});
    }
	
    this.moveMe = function(){
	$("#b" + this.id).addClass("draggable");
	
	$("#query").on("mousemove", (function(event){
	    var draggable = $(".draggable");
	    draggable.css("left",  event.pageX - draggable.innerWidth()/2);
	    draggable.css("top", event.pageY - draggable.innerHeight()/2);
							
	    //Find the id of the box in question, the box, and the tree
	    var id = $(".draggable")[0].id;
	    var id = new Number (id.replace("b", ""));
	    var box  =  jQuery.tree.getBox(id);
							
	    //Update the X and Y of the moved box
	    box.setX(event.pageX - draggable.innerWidth()/2);
	    box.setY(event.pageY - draggable.innerHeight()/2);
							
	    //Redraw the arrows
	    var arrows = jQuery.tree.getArrows(box);
	    for(var i = 0; i < arrows.length;i++){
		arrows[i].draw();
	    }			
	}));
    }
	
    this.draw = function(){
	
	//We can't draw a box without a valid id
	if(this.id == null){
	    alert("Box Id is null, returning...")
	    return;
	}
		
	var selector = "#b" + this.id;
	var element = $(selector);
	if(element.length == 0){
	    $("#query").append(this.getHTML());
	}
	
	$("#b" + this.id + " .left, #b" + this.id +" .right, #b" + this.id +" .top, #b" + this.id +" .bottom").click(function(event){
	    event.stopPropagation();
	    var id = $(this).parent().attr("id");
	    id = new Number (id.replace("b", ""));
	    var box  =  jQuery.tree.getBox(id);
	    
	    var clickedTab = event.target.className;
	    if(clickedTab == "left"){
		box.extend("head");
	    }else if(clickedTab == "right"){
		box.extend("tail");
	    }
	    else if(clickedTab == "top"){
		box.moveMe();
	    }
	    else if(clickedTab == "bottom"){
		box.getSuggestionMenu();
	    }
	});
		
	$("#b" + this.id).css("left", this.x + "px");
	$("#b" + this.id).css("top", this.y + "px");
				
	$("#b" + this.id).mousedown(function(event){
	    event.stopPropagation();
	    jQuery.boxLastMousedown = this.id;
	    jQuery.mouseDownX = event.pageX;
	    jQuery.mouseDownY = event.pageY;
	});
		
	$("#b" + this.id).mouseup(function(event){
	    event.stopPropagation();
	    $("#query").off("mousemove"); 
	    jQuery.boxLastMousedown = null;
	    $(this).removeClass("draggable");
	});
		
	$("#b" + this.id).mouseover(function(event){
	    jQuery.boxLastMouseover = this.id;
	});
		
	$("#b" + this.id).click(function(event){
		
	    //Find the id of the box in question, the box, and the tree
	    var id = $(this).attr("id");
	    id = new Number (id.replace("b", ""));
	    var box  =  jQuery.tree.getBox(id);
			
	    $("#b" + box.getId() + " .content").html('<input type="text" value="' + box.getValue() + '"/>');
			
	    $("#b" + box.getId() + " input").blur(function(){
		box.setValue(this.value);
	    //$(this).parent().html(this.value);
	    });
			
	    $("#b" + box.getId() + " input").focus();
			
	});
		
		
	$("#b" + this.id).mouseleave(function(event){
			
	    //Check if first mouse button was pressed
	    if(event.which == 1 && this.id == jQuery.boxLastMousedown){
				
		//Find the id of the box in question, the box, and the tree
		var id = this.id;
		var id = new Number (id.replace("b", ""));
		var box  =  jQuery.tree.getBox(id);
				
		var boxTop = this.offsetTop;
		var boxBottom = this.offsetTop + this.offsetHeight;
		var boxLeft = this.offsetLeft;
		var boxRight = this.offsetLeft + this.offsetWidth;
				
		var x = event.pageX;
		var y = event.pageY;
				
		if((y > boxTop) && (y < boxBottom)){
		    if(x < boxLeft){
			//alert("Swipe left");
			box.extend("head");
		    }
		    if(x > boxRight){
			//alert("Swipe right");
			box.extend("tail");
		    }
		}
				
		if((x < boxRight) && (x > boxLeft)){
		    if(y < boxTop){
			//alert("Swipe up");
			var box = $("#b" + this.id);
			$(this).addClass("draggable");
			$("#query").on("mousemove", (function(event){
			    var draggable = $(".draggable");
			    draggable.css("left",  event.pageX - draggable.innerWidth()/2);
			    draggable.css("top", event.pageY - draggable.innerHeight()/2);
							
			    //Find the id of the box in question, the box, and the tree
			    var id = $(".draggable")[0].id;
			    var id = new Number (id.replace("b", ""));
			    var box  =  jQuery.tree.getBox(id);
							
			    //Update the X and Y of the moved box
			    box.setX(event.pageX - draggable.innerWidth()/2);
			    box.setY(event.pageY - draggable.innerHeight()/2);
							
			    //Redraw the arrows
			    var arrows = jQuery.tree.getArrows(box);
			    for(var i = 0; i < arrows.length;i++){
				arrows[i].draw();
			    }			
			}));
		    }
		    if(y > boxBottom){
			var json = '{"query":'  + jQuery.tree.getJSON() + ',';
			json = json + '"box":' + '{"nr":"' + box.getId() + '", "content":"' + box.getValue() + '"}' + '}';
		
			var url = 'http://localhost:9998/mediator/query/suggestion';

			$.ajax({
			    type: 'POST',
			    crossDomain:true,
			    url: url,
			    dataType:'json',
			    data: json,
			    context: box,
			    success: box.drawSuggestionList,
			    error: function (xhr) {
				alert(xhr.responseText + '  ' + xhr.status + '  ' + xhr.statusText);
			    }
			});
		    }
		}
	    }
	});
	
	//Update the X and Y when dragged
	$( "#b" + this.id).bind( "drag", function(event, ui) {
	    //Find the id of the box in question, the box, and the tree
	    var id = this.id;
	    var id = new Number (id.replace("b", ""));
	    var box  =  jQuery.tree.getBox(id);
			
	    //Update the X and Y of the moved box
	    box.setX(ui.offset.left);
	    box.setY(ui.offset.top);
			
	    //Redraw the arrows
	    var arrows = jQuery.tree.getArrows(box);
	    for(var i = 0; i < arrows.length;i++){
		arrows[i].draw();
	    }
	});
    }
}
