function Point(){

	this.x = 0;
	this.y = 0;
	
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
}