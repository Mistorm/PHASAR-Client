//Setting the swipe options
//var swipeOptions=
//{
//	swipe:handleSwipe,
//	swipeLeft:null,
//	swipeRight:null,
//	swipeUp:null,
//	swipeStatus:null,
//	threshold:10
//}

$(function() {
	
	$.tree = new Tree();
	
	//Vars to record the last position the mouse button was pressed down on the query workspace
	$.mouseDownX;
	$.mouseDownY;
	$.boxLastMousedown;
	$.boxLastMouseover;
	
	//Butt ugly hack >.<
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
	
	
	//Enable swiping
	//$("#query").swipe( swipeOptions );
	
	//Record the last position the mouse button was pressed down on the query workspace
	$("#query").mousedown(function(event){
		jQuery.mouseDownX = event.pageX;
		jQuery.mouseDownY = event.pageY;
		jQuery.boxLastMousedown = null;
	});
	
	$("#query").mouseup(function(event){
		
		$("#query").mousemove(function(){});
		
		if(event.which == 1 && jQuery.boxLastMousedown == null){
			
			if(jQuery.boxLastMouseover != null){
			
				//var x = event.pageX - jQuery.mouseDownX;
				//var y = event.pageY - jQuery.mouseDownY;
			
				var lastbox = $("#" + jQuery.boxLastMouseover);
			
				var xRange = new Array(lastbox.offset().left, (lastbox.offset().left + lastbox.width() + 60));
				var yRange = new Array(lastbox.offset().top, (lastbox.offset().top + lastbox.height() + 60));
				
				if(jQuery.mouseDownY > yRange[1] &&  jQuery.mouseDownX > xRange[0] && jQuery.mouseDownX < xRange[1] ){
					//alert("mouse down OK");
					if(event.pageY < yRange[1] && event.pageX > xRange[0] && event.pageX< xRange[1]){
						//alert("mouse up OK")
						var id = new Number (jQuery.boxLastMouseover.replace("b", ""));
						var box  =  jQuery.tree.getBox(id);
						box.removeMe();
					}else{
						//alert("mouse down BAD");
					}
				}
			}
		}
	});
});

$(document).ajaxStart(function(){
	$("#ajaxIndicator").show();
});

$(document).ajaxStop(function(){
	$("#ajaxIndicator").hide();
});

$(document).bind('keypress', function(e) {
        if(e.keyCode==13){
		$("#resultToggle").click();
        }
});

function submitQuery(){
	
	var url = 'http://localhost:9998/mediator/query';
	//var url = 'http://95.96.221.90:9998/mediator/query';
		
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
	
		for(j in data.result[i].triples){
				result = result + '<div class="triple">' + data.result[i].triples[j] + '</div>';
			}
			result = result + end;
		}
	}
	//Remove any previous results..
	$("#result div").remove();
	//And show the new ones
	$("#result").append(result);
	
}