function Box(){
	
    //Default fields & values for a new box
    this.id = null;
    this.value = "";
	
    //Default pacement for a new box on an empty canvas
    this.x = 250;
    this.y = 250;
	
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
	    //This function is used when building a userquery so it needs to return 
	    //a wildcard is the box is empty.
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
	var html = '<div class="positionable box" id = "b' + this.id +'">'
	//Writing text from top to bottom is actualy really hard to do well with CSS.
	//My solution is making the available space for letter really small and adding
	//spaces after eacht letter so the browser will place them in a verticaly...
	html += '<div class="left">H E A D </div><div class="top">MOVE</div><div class="right">T A I L </div><div class="bottom">INFO</div>';
	
	//Do not show the wildcard character, even if the box contains one.
	if(this.getValue() != '*'){
	    html += '<div class="content">' + this.getValue() + '</div>';
	}else{
	    html += '<div class="content"></div>';
	}
	
	html += '</div>';
	
	return html;
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
	
    this.drawLineTo = function(event){
	//TODO: Draw a line from the center of the box the the event's X & Y position.
	$("#feedback").html("x: " + event.pageX +" y: " + event.pageY);
    }
      
    this.extend = function(direction){
	//TODO: extend the box with an empty relator and box to direction
	$("#query").off("mousemove", this.drawLineTo(event));
	alert(direction);
	    				
	//Create a new box for the tail, using the position of the head box and the tail offset
	var newBox = jQuery.tree.newBox();
    				
	newBox.setX(event.pageX);
	newBox.setY(event.pageY);
    				
	//Create a new arrow for the tail, rendering it between the boxes
	var arrow = jQuery.tree.newArrow();
    	
	if(direction == "head"){
	    arrow.setA(newBox);
	    arrow.setDirection(this);
	    arrow.setB(this);
	}else if(direction == "tail"){
	    arrow.setA(this);
	    arrow.setDirection(newBox);
	    arrow.setB(newBox);
	}	
	
	//Draw the box and arrow
	newBox.draw();
	arrow.draw();
	arrow.refresh();
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
    
    this.drawSuggestionList = function(queryResult){
	
	var columnLength = 20;
	
	
	var columnStart = '<div class="suggestionColumn">';
	var start = '<div class="suggestion">';
	var end = '</div>';
	var columnEnd = '</div>'
	
	var result = '';
	
	var columns = new Array(columnStart);
	
	for (i in queryResult.suggestion){
	    
	    //Make sure each suggestion ends up in the proper column.
	    var currentColumn = Math.floor(i / columnLength);
	    //If the current column does not excist, we just filled the previous one.
	    //that means we must close it with a div.
	    if(!columns[currentColumn]){
		columns[currentColumn - 1] = columns[currentColumn - 1] + columnEnd;
		columns.push(columnStart);
	    }
	    
	    result = start;
	    result = result + "<div class=count>" + queryResult.suggestion[i].count + "</div>";
	    result = result + "<div class=value>" + queryResult.suggestion[i].value + "</div>";
	    result = result + end;
	    
	    columns[currentColumn] = columns[currentColumn] + result;
	}
	
	//Remove any previous results..
	$("#result div").remove();
	//And show the new ones
	for(c in columns){
	    $("#result").append(columns[c]);
	    $(".suggestionColumn:last").offset({
		left: c * 210
		});
	}
	
	$(".suggestion").draggable();
	$(".suggestion").draggable("option", "revert", true);
	$(".suggestion").draggable("option", "containment", "document");
	$(".suggestion").draggable("option", "appendTo", "#query");
	$(".suggestion").draggable("option", "helper", "clone");
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
	    $("#b" + this.id).droppable();
	}
	
	$("#b" + this.id + " .left, #b" + this.id +" .right").mousedown(function(event){
	    event.stopPropagation();
	    
	    var id = $(this).parent().attr("id");
	    id = new Number (id.replace("b", ""));
	    var box  =  jQuery.tree.getBox(id);
	    
	    var direction;
	    var mousedownTab = event.target.className;
	    
	    if(mousedownTab == "left"){
		direction = "head";
	    }else if(mousedownTab == "right"){
		direction = "tail";
	    }
	    
	    $("#query").on("mousemove", box, function(event){
		event.data.drawLineTo(event);
	    });
		
	    $("#query").one("mouseup", box, function(event){
		event.data.extend(direction);
	    });
	});
	
	
	//Handler for click() events on the tabs
	$("#b" + this.id +" .top, #b" + this.id +" .bottom").click(function(event){
	    event.stopPropagation();
	    
	    var id = $(this).parent().attr("id");
	    id = new Number (id.replace("b", ""));
	    var box  =  jQuery.tree.getBox(id);
		    
	    var clickedTab = event.target.className;
	    if(clickedTab == "top"){
		box.moveMe();
	    }
	    else if(clickedTab == "bottom"){
	    //box.getSuggestionMenu();
	    }
	});
	

	$("#b" + this.id).css("left", this.x + "px");
	$("#b" + this.id).css("top", this.y + "px");
				
	//Record mousedown event data for swipe support.
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
	
	//Record mouse over data for swipe support
	$("#b" + this.id).mouseover(function(event){
	    jQuery.boxLastMouseover = this.id;
	});
	
	
	$("#b" + this.id).click(function(event){
		
	    //Find the id of the box in question, the box, and the tree
	    var id = $(this).attr("id");
	    id = new Number (id.replace("b", ""));
	    var box  =  jQuery.tree.getBox(id);
			
	    if(box.getValue() == '*'){
		$("#b" + box.getId() + " .content").html('<input type="text" value=""/>');
	    }else{
		$("#b" + box.getId() + " .content").html('<input type="text" value="' + box.getValue() + '"/>');
	    }
	    
	    $("#b" + box.getId() + " input").blur(function(){
		box.setValue(this.value);
	    //$(this).parent().html(this.value);
	    });
			
	    $("#b" + box.getId() + " input").focus();
			
	});
		
	//Handeler for swipes	
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
	
	$( "#b" + this.id).bind( "drop", function(event, ui){
	    //Find the id of the box in question, the box, and the tree
	    var id = this.id;
	    id = new Number (id.replace("b", ""));
	    var box  =  jQuery.tree.getBox(id);
	    
	    box.setValue(ui.draggable[0].lastChild.textContent);
	});
    }
}
