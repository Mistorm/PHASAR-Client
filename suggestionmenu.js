/**
 * 
 *Create a new menu with the following atrubutes:
 *
 *x: the x (left) position of of the list in pixels
 *y: the y (top) position of of the list in pixels
 *list: the values the list should containt
 *callback: the function the will be call when a choice has been made or when the list has been closed.
 *shift: if true, the x position of the list will match top right conner (instead of top left)
 */

function SuggestionMenu(x, y, list, callback, shift){
        
    this.x = x;
    this.y = y;
    this.list = list;
    this.shift = shift;
    this.callback = callback;
        
    $.callback.add(this.callback);
   
    //Configuration values, tweak if desired.
    var multiSelect = true;
    var okCancelButtons = true;
    var closeButton = true;
    
    this.generateHTML = function(){
	var html = '<div id="suggestionMenu">';
	
	//Add the close button if desired.
	if(closeButton){
	    html += '<div id="closeButtonBar">'
	    html += '<div id="closeButton">X</div>';
	    html += '</div>';
	}
    
	html+= '<div id="suggestionItems">';
	
	//Add the suggestion items.
	var j = list.suggestion.length;
	
	for(var i = 0; i < j; i++){
	    html += '<div class="item">';
	    html += '<div class="count">' + list.suggestion[i].count + '</div>';
	    html += '<div class="value">' + list.suggestion[i].value + '</div>';
	    html += '</div>';
	}
	
	html += '</div>';
	
	if(okCancelButtons){
	    html += '<div id="okCancelButtonBar">';
	    html += '<div id="okButton">OK</div>';
	    html += '<div id="cancelButton">Cancel</div>';
	    html += '</div>';
	}
	
	html += "</div>";
	
	return html;
    }
    
    //Add menu to the query workspace
    var html = this.generateHTML();
    $("#query").append(html);
    
    
    
    //Add functionality to menu by adding functionality to jQuery events
    
    //Make items in the menu selectable
    $("#suggestionMenu .item").click(function(event){
	$(this).toggleClass("selected");
    })
    
    //Make the close and cancel button close the menu
    $("#suggestionMenu #cancelButton").click(function(){
	$("#suggestionMenu").remove();
    });
    
    //Call the callback function when the OK button of close button is clicked
    $("#suggestionMenu #okButton, #suggestionMenu #closeButton").click(function(){
	
	var values = new Array();
	
	$("#suggestionMenu .selected .value").each(function(index){
	    values.push(this.textContent);
	})
	
	$.callback.fire(values);
	$.callback.empty();
	
	$("#suggestionMenu").remove();
    });
    
    
    
    //Put the menu on its proper location
    if(shift == false){
	$("#suggestionMenu").css("left", this.x);
    }else if(shift == true){
	$("#suggestionMenu").css("left", this.x - $("#suggestionList").width());
    }
    
    $("#suggestionList").css("top", this.y);
}

