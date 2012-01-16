function Arrow(){
	
	this.id;
	this.a;
	this.value = "*";
	this.b;
	this.direction;
	
	this.setId = function(value){
		this.id = value;
	}
	
	this.getId = function(){
		return this.id;
	}
	
	this.setA = function(value){
		this.a = value;
	}
	
	this.getA = function(){
		return this.a;
	}
	
	this.setValue = function(value){
		this.value = value;
		if($("#a"+ this.id ).length == 1){
			$("#a"+ this.id + " input")[0].value = value;
		}
	}
	
	this.getValue = function(){
		return this.value;
	}
	
	this.setB = function(value){
		this.b = value;
	}
	
	this.getB =function(){
		return this.b;
	}
	
	this.setDirection = function(value){
		this.direction = value;
	}
	
	this.getDirection = function(){
		return this.direction;
	}
	
	this.getSource = function(){
		if(this.direction == this.a){
			return this.b;
		}else {
			return this.a;
		}
	}
	
	this.getHTML = function(){
		return '<div class="positionable arrow" id= "a' + this.id + '"><div class="arrowContent"></div><div class="innerArrowLeft"></div><div class="innerArrowRight"></div></div>';
	}
	
	this.refresh = function(){
		jQuery.tree.setArrow(this.id. this);
	}
	
	this.draw = function(){
		//Find the two points the arrow should connect
		var aX = this.a.getTailConnectionX();
		var aY = this.a.getTailConnectionY();
		
		var bX = this.b.getHeadConnectionX();
		var bY = this.b.getHeadConnectionY();
		
		var width  = bX - aX;
		var height = bY - aY;
		
		//Find out if this arrrow has been drawn before
		var selector = "#a" + this.id;
		var element = $(selector);
		if(element.length == 0){
			$("#query").append(this.getHTML());
			var element = $(selector);
		}
		
		
		//Targer is left and higher of origin
		if (width < 0 && height < 0){
			$("#a" + this.id + " .innerArrowLeft").css("border-top-width", "1px");
			$("#a" + this.id + " .innerArrowLeft").css("border-bottom-width", "0px");
			$("#a" + this.id + " .innerArrowLeft").css("border-right-width", "1px");
			
			$("#a" + this.id + " .innerArrowRight").css("border-top-width", "0px");
			$("#a" + this.id + " .innerArrowRight").css("border-bottom-width", "1px");
			
			aY = aY +height;
			aX = aX + width;
			//$("#a" + this.id + " div").css("top", Math.abs(height) + 1);
			
			$("#a" + this.id + " .arrowContent").css("right", "30%");
			$("#a" + this.id + " .arrowContent").html('&larr;<input type="text" value="' + this.getValue() + '"/>');
		}
		
		//Targer is left and lower of origin
		if(width < 0 && height >= 0){
			$("#a" + this.id + " .innerArrowLeft").css("border-top-width", "0px");
			$("#a" + this.id + " .innerArrowLeft").css("border-bottom-width", "1px");
			$("#a" + this.id + " .innerArrowLeft").css("border-right-width", "1px");
			
			$("#a" + this.id + " .innerArrowRight").css("border-top-width", "1px");
			$("#a" + this.id + " .innerArrowRight").css("border-bottom-width", "0px");
			
			aX = aX + width;
			
			$("#a" + this.id + " .arrowContent").css("right", "30%");
			$("#a" + this.id + " .arrowContent").html('&larr;<input type="text" value="' + this.getValue() + '"/>');
		}
		
		//Target is right and higer of origin
		if (width > 0 && height < 0){
			$("#a" + this.id + " .innerArrowLeft").css("border-top-width", "0px");
			$("#a" + this.id + " .innerArrowLeft").css("border-bottom-width", "1px");
			$("#a" + this.id + " .innerArrowLeft").css("border-right-width", "1px");
			
			$("#a" + this.id + " .innerArrowRight").css("border-top-width", "1px");
			$("#a" + this.id + " .innerArrowRight").css("border-bottom-width", "0px");
			
			aY = aY +height;
			//$("#a" + this.id + " div").css("top", Math.abs(height) + 1);
			
			$("#a" + this.id + " .arrowContent").css("left", "30%");
			$("#a" + this.id + " .arrowContent").html('&rarr;<input type="text" value="' + this.getValue() + '"/>');
		}
		
		//Target is right and lower of origin
		if (width > 0 && height >= 0){
			$("#a" + this.id + " .innerArrowLeft").css("border-top-width", "1px");
			$("#a" + this.id + " .innerArrowLeft").css("border-bottom-width", "0px");
			$("#a" + this.id + " .innerArrowLeft").css("border-right-width", "1px");
			
			$("#a" + this.id + " .innerArrowRight").css("border-top-width", "0px");
			$("#a" + this.id + " .innerArrowRight").css("border-bottom-width", "1px");
			
			$("#a" + this.id + " .arrowContent").css("left", "30%");
			$("#a" + this.id + " .arrowContent").html('&rarr;<input type="text" value="' + this.getValue() + '"/>');
		}

		element.css("left", aX + "px");
		element.css("top", aY + "px");
		element.css("width",  Math.abs(width) + "px");
		element.css("height",  Math.abs(height) + "px");
		
		//Update the new value of the input field to the tree
		$("#a" + this.id + " input").blur(function(){
			var id = $(this).parent().parent().attr("id");
			var id = new Number (id.replace("a", ""));
			var arrow  =  jQuery.tree.getArrow(id);
			
			arrow.setValue(this.value);
		});
		
		$("#a" + this.id + " input").click(function(){
			
			var arrow = $(this).parent().parent()[0];
			var offset = $("#" + arrow.id +" input").offset();
			
			var data = jQuery.parseJSON('{"suggestion": [{"value": "OBJ","count": "173"},{"value": "vinden","count": "53"},{"value": "willen","count": "14"}]}');
			var list = new SuggestionList( offset.left, offset.top + 30, data, "me", arrow.id);	
		});
	}
}