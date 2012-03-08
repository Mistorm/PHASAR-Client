function Tree(){

    this.boxes = new Array();
    this.arrows = new Array();
	
    this.newBox = function(){
	var box = new Box();
	var id = this.addBox(box);
	box.setId(id);
		
	return box;
    }
	
    this.addBox = function(box){
	var id = this.boxes.push(box) - 1; 
	return id;
    }
	
    this.getBox = function(id){
	return this.boxes[id];
    }
		
    this.setBox = function(id, box){
	this.boxes[id] = box;
    }
	
    this.removeBox = function(box){

	var arrows = this.getArrows(box);
		
	if(arrows.length != 1){
	    return false;
	}else{
			
	    this.boxes[box.getId()] = null;
	    this.arrows[arrows[0].getId()] = null;
			
	    //this.boxes.splice(id.getId(), 1);
	    //this.arrows.splice(arrows[0].getId(), 1);
			
	    return true;
	}
    }
	
    this.newArrow = function(){
	var arrow = new Arrow();
	var id = this.addArrow(arrow);
	arrow.setId(id);
		
	return arrow;
    }
	
    this.addArrow = function(arrow){
	var id = this.arrows.push(arrow) - 1; 
	return id;
    }
	
    this.getArrow = function(id){
	return this.arrows[id];
    }
	
    this.setArrow = function(id, arrow){
	this.arrows[id] = arrow;
    }
	
    //Get all arrows with box as a source or a destination
    this.getArrows = function(box){
		
	var returned = new Array();
				
	for(var i = 0; i < this.arrows.length; i++){
				
	    if(this.arrows[i] != null){
		if((this.arrows[i].getA() == box) || (this.arrows[i].getB() == box)){
		    returned.push(this.arrows[i]);
		}
	    }
	}
			
	return returned;
    }
	
    //Create the JSON representation of the tree
    this.getJSON = function(){
		
	//Start the JSON string
	var string;
	var json = '{';
		
		
	//Build the list of boxes and add them to the JSON string
	json  = json + '"boxes":[';
	string = null;
	for(var i = 0; i < this.boxes.length; i++ ){
			
	    //Check for null values left by perviously removed boxes & arrows
	    if(this.boxes[i] != null){
		string = '{"nr":"' + i + '", "content":"' + this.boxes[i].getValue() + '"}';
				
		if(i != this.boxes.length - 1){
		    string = string + ","
		}
				
		json = json + string;
	    }
	}
	json = json + "], ";
		
	//Build the list of arrows and afdd them to the JSON string
	json  = json + '"arrows":[';
	string = null;
	for(var j = 0; j < this.arrows.length; j++){
			
	    //Check for null values left by perviously removed boxes & arrows
	    if(this.arrows[j]!= null){
		string = '{"a":"' + this.arrows[j].getA().getId();
		string = string + '", "relator":"' + this.arrows[j].getValue();
		string = string + '", "b":"' + this.arrows[j].getB().getId();
		string = string + '", "direction":"' + this.arrows[j].getDirection().getId() + '"}';
				
		if(j != this.arrows.length - 1){
		    string = string + ","
		}
				
		json = json + string;
	    }
	}
	json = json + "]";
		
	json = json +  "}";
		
	return json;
    }
}

