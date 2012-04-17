
$(function() {
	
    $.tree = new Tree();
	
    //Vars to record the last position the mouse button was pressed down on the query workspace
    $.mouseDownX;
    $.mouseDownY;
    $.boxLastMousedown;
    $.boxLastMouseover;
	
	
    $.newArrowValue = null;
    $.newBoxValue = null;
	
    for (var i = 0; i < 1; i++){		
	var box = jQuery.tree.newBox();
	box.draw();
    }
	
    $("#ajaxIndicator").hide();
	
    $("#resultToggle").click(function(){
	submitQuery();
    });
	
    //Record the last position the mouse button was pressed down on the query workspace
    //Used for reconizing deleting swipes
    $("#query").mousedown(function(event){
	jQuery.mouseDownX = event.pageX;
	jQuery.mouseDownY = event.pageY;
	jQuery.boxLastMousedown = null;
    });
	
    //See if a deleting swipe was made if the mouse button is released on the query workspace 
    //(html element with the #query class) A swipe is a deleting swioe if:
    //
    // 1: the mouseDown event is fired by the html element having the #query class (know as the query workspace)
    // 2: the mouse, while pressed, is moved over a html element with the box class
    // 3: a mouseUp event is fired by the query workspace
    // 
    // It's important that these steps are taken is this order.
    // It's also important the mouse has been "in range" of box it moved over and wasn't used to move about
    // a different box.
 
    $("#query").mouseup(function(event){
	
	//The "box around a box" where a deleting swioe vcan be made
	var range = 60;
	
	//Check which mousebutton is released and if the pervious mouseDown event
	//wasn't on a box
	if(event.which == 1 && jQuery.boxLastMousedown == null){

	    //Check if the mouse actualy moved across a box
	    if(jQuery.boxLastMouseover != null){
						
		var lastbox = $("#" + jQuery.boxLastMouseover);
		
		var xRange = new Array(lastbox.offset().left - range, (lastbox.offset().left + lastbox.outerWidth() + range));
		var yRange = new Array(lastbox.offset().top - range , (lastbox.offset().top + lastbox.outerHeight() +range));
		
		//Check if mouse down is in range	
		if(jQuery.mouseDownY > yRange[0] && jQuery.mouseDownY < yRange[1] &&  jQuery.mouseDownX > xRange[0] && jQuery.mouseDownX < xRange[1]){
		    //Check if the mouseUp event is at least the height or the width of the box away from the mouse down 
		    if((Math.abs(event.pageY - jQuery.mouseDownY) > lastbox.outerHeight()) || (Math.abs(event.pageX - jQuery.mouseDownX) > lastbox.outerWidth())){
			var id = new Number (jQuery.boxLastMouseover.replace("b", ""));
			var box  =  jQuery.tree.getBox(id);
			box.removeMe();
		    }
		}
	    }
	}
    });
    
    //Code to make the tabs function.
    $(".tab").click(function(event){
	//Make the clicked tab active
	$(".tab").removeClass("active");
	$(event.target).addClass("active");
	//Make the proper contentpane active
	
	$(".tabcontent").hide();
	
	var id = $(event.target).attr("id");
	
	switch (id){
	    case 'suggestionsTab':
		$("#suggestions").show();
		break;
	    case 'optionsTab':
		$("#options").show();
		break;
	    case 'resultTab':
		$("#result").show();
		break;
	    default:
		$("#result").show();
		break;
	}
    });
    
    $(".tabcontent").hide();
    $("#result").show();
    
});

//Use jQuery events to show and hide the waiting/loading indicator.
$(document).ajaxStart(function(){
    $("#ajaxIndicator").show();
});

$(document).ajaxStop(function(){
    $("#ajaxIndicator").hide();
});

//Submit the current query when the enter key is pressed
$(document).bind('keypress', function(e) {
    if(e.keyCode==13){
	$("#resultToggle").click();
    }
});

function submitQuery(){
	
    var url = 'http://localhost:9998/mediator/query';
		
    $.ajax({
	type: 'POST',
	crossDomain:true,
	url: url,
	dataType:'json',
	data: jQuery.tree.getJSON(),
	success: function (data) {
	    drawQueryResult(data);
	},
	error: function (xhr) {
	    alert(xhr.responseText + '  ' + xhr.status + '  ' + xhr.statusText);
	}
    });
}

function drawQueryResult(data){
	
    var start = '<div class="result">';
    var end = '</div>';
	
    var result  = "";
	
    if(typeof data.result == 'undefined'){
	result  = "<div>Sorry, the query yielded no results,,,</div>";
    }else{
	for (i in data.result){
	    result = result + start;
	    result = result + "<div class=content>" + data.result[i].content + "</div>";
	
	    //Uncomment to add tripels to browsing
	    //for(j in data.result[i].triples){
	    //result = result + '<div class="triple">' + data.result[i].triples[j] + '</div>';
	    //}
	    result = result + end;
	}
    }
    //Remove any previous results..
    $("#result div").remove();
    //And show the new ones
    $("#result").append(result);
    
    $("#feedback").html(data.result.length + " hits.");
	
}