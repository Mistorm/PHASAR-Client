function SuggestionList(x, y, list, destination, id){
	
    this.x = x;
    this.y = y;
    this.list = list;
    this.destination = destination;
    this.id = id;
	
    this.htmlStart = '<div id="suggestionList"><ul>';
    this.htmlEnd = '</div>';

    this.generateHTML = function(){
		
	var j;
	var html =  this.htmlStart;
		
	j = list.suggestion.length;
		
		
	for(var i = 0; i < j; i++){
	    html+= '<li class="suggestion"><div class="count">' + list.suggestion[i].count + '</div><div class="value">' + list.suggestion[i].value + "</div></li>";
	}
		
	//Add and hidden input tag to retrace the arrow/box we are getting the input for.
	html += '</ul><input type="hidden" value="' + this.id +'">';
		
	html +=  this.htmlEnd;
		
	return html;
    }
		
    var html = this.generateHTML();
    $("#query").append(html);
	
    //Get input for an arrow
    if(this.destination == 'arrow'){
	$("#suggestionList li").click(function(){
			
	    //$("#suggestionList").css("display", "none");
	    $("#suggestionList").remove();
			
	    var id = $(this).parent().parent().find("input")[0].value;
	    var id = new Number (id.replace("a", ""));
	    var box  =  jQuery.tree.getBox(id);
			
	    box.setNewRelatorValue($(this).children(".value")[0].innerText);
	    box.extend();
	});
    }
    //Get input for a box
    else if(this.destination == 'head'){
	$("#suggestionList li").click(function(){
			
	    //$("#suggestionList").css("display", "none");
	    $("#suggestionList").remove();
			
	    var id = $(this).parent().parent().find("input")[0].value;
	    id = new Number (id.replace("b", ""));
	    var box  =  jQuery.tree.getBox(id);
			
	    box.setNewHeadValue($(this).children(".value")[0].innerText);
	    box.extend();
	});	
    }else if(this.destination == 'tail'){
	$("#suggestionList li").click(function(){
			
	    //$("#suggestionList").css("display", "none");
	    $("#suggestionList").remove();
			
	    var id = $(this).parent().parent().find("input")[0].value;
	    id = new Number (id.replace("b", ""));
	    var box  =  jQuery.tree.getBox(id);
			
	    box.setNewTailValue($(this).children(".value")[0].innerText);
	    box.extend();
	});	
    } else if(this.destination == "me"){
	$("#suggestionList li").click(function(){
			
	    $("#suggestionList").remove();
			
	    var id = $(this).parent().parent().find("input")[0].value;
	    var me;
			
	    if(id.charAt(0) == "b"){
		id = new Number (id.replace("b", ""));
		me  =  jQuery.tree.getBox(id);
	    }else if(id.charAt(0) == "a"){
		id = new Number (id.replace("a", ""));
		me =  jQuery.tree.getArrow(id);
	    }
	    
	    me.setValue($(this).children(".value")[0].innerText);
	});
    }
    
    $("#suggestionList").mouseover(function(){
	jQuery.boxLastMouseover = null;
    });
    
    $("#suggestionList").css("left", this.x);
    $("#suggestionList").css("top", this.y);
}