/* 
 * The code in this file supports the Mars Rover Coding Challenge from Hello World.
 * The two main methods are positionRover (set the initial starting point) and
 * moveRover (accept commands for forward, back, left or right as f,b,l,r).
 * 
 */
var commands, direction, x, y;

/* 
 * This function is used to set the initial starting point for the rocket.  It takes the 
 * x,y point coordinates along with the direction (N,S,E,W) from the NASA Control Panel
 * on the application interface. It then calls setPositionParameters to reposition the rocket
 * 
 */
function positionRover() {
    x = document.getElementById('x').value;
    y = document.getElementById('y').value;
    direction = document.getElementById('direction').value;
    setPositionParameters(x,y,direction);
	updateURL(x, y, direction);
}

/* 
 * This function updates the URL parameters so they can be used by other methods
 * 
 */
function updateURL(x, y, direction) {
    if (history.pushState) {
    	var values='?x=' + x + "&y=" + y + "&direction=" + direction;
        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + values;
        window.history.pushState({path:newurl},'',newurl);
    }
}

/* 
 * This function repositions the rocket to the correct cell (x,y) and faces it 
 * in the correct direction (facing N,S,E,W)
 * 
 */
function setPositionParameters(x,y,direction) {
	
    var elem = document.getElementById('rocketNav');
    elem.style.gridColumnStart = x;
    elem.style.gridColumnEnd = parseInt(x)+1;
    elem.style.gridRowStart = y;
    elem.style.gridRowEnd = parseInt(y)+1;
    
    if(direction.toLowerCase() == "e") {
    	elem.style.transform = "rotate(90deg)"; //standard syntax
    	elem.style.webkitTransform  = "rotate(90deg)"; //Chrome, Safari, Opera
    	elem.style.paddingRight = "32px";
    	elem.style.paddingTop = "26px";
    	elem.style.paddingBottom = "6px";
    	elem.style.paddingLeft = "0px";
    } else if (direction.toLowerCase() == "s") {
    	elem.style.transform = "rotate(180deg)";
    	elem.style.webkitTransform  = "rotate(180deg)";
    	elem.style.gridRowStart = parseInt(y)-1;
    	elem.style.paddingRight = "6px";
    	elem.style.paddingTop = "0px";
    	elem.style.paddingBottom = "32px";
    	elem.style.paddingLeft = "26px";
    } else if (direction.toLowerCase() == "w") {
    	elem.style.transform = "rotate(270deg)";
    	elem.style.webkitTransform  = "rotate(270deg)";
    	elem.style.paddingRight = "0px";
    	elem.style.paddingTop = "6px";
    	elem.style.paddingBottom = "26px";
    	elem.style.paddingLeft = "32px";
    } else { // n
    	elem.style.transform = "rotate(0deg)"; 
    	elem.style.webkitTransform  = "rotate(0deg)"; 
    	elem.style.paddingRight = "16px";
    	elem.style.paddingTop = "0px";
    	elem.style.paddingBottom = "32px";
    	elem.style.paddingLeft = "6px";
    }
}

/* 
 * This function accepts movement commands from the NASA Control Panel and 
 * executes them accordingly by moving the rocket forward, back, left or right as f,b,l,r).
 * It may execute a single command or a series of commands.  
 * 
 * If the command is to move forward or back, it calls the move method.
 * if the command is to move left or right, it calls the turn method.
 * 
 * The current rocket position is captured from the URL parameters.
 * 
 */
function moveRover() {
    commands = document.getElementById('commands').value;
    if (commands === undefined) {
        return commandsArray;
    } else { 
        for(var index = 0; index < commands.length; index++) {
            var command = commands[index].toLowerCase();
            if (command === 'f' || command === 'b') {
            	move(command);
            } else if (command === 'l' || command === 'r') {
                turn(command);
            }
        }
    }
} //end moveRover

/* 
 * This function is called by moveRover() when the command to execute is to move 
 * the rocket forward or back.  
 * 
 */
function move(command) {
    var xIncrease = 0, yIncrease = 0;
	var url = new URL(window.location);
	x = url.searchParams.get("x");
	y = url.searchParams.get("y");
	direction = url.searchParams.get("direction");
	var roverLocation = [ x , y ];
    if (command === 'f') { // Forward
	    if (direction.toLowerCase() === 'n') { // North
	        yIncrease = -1;
	    } else if (direction.toLowerCase()  === 'e') { // East
	        xIncrease = 1;
	    } else if (direction.toLowerCase()  === 's') { // South
	        yIncrease = 1;
	    } else if (direction.toLowerCase()  === 'w') { // West
	        xIncrease = -1;
	    }
    }
    if (command === 'b') { // Backward
	    if (direction.toLowerCase() === 'n') { // North
	        yIncrease = 1;
	    } else if (direction.toLowerCase()  === 'e') { // East
	        xIncrease = -1;
	    } else if (direction.toLowerCase()  === 's') { // South
	        yIncrease = -1;
	    } else if (direction.toLowerCase()  === 'w') { // West
	        xIncrease = 1;
	    }
    }
    var newLocation = [parseInt(roverLocation[0]) + parseInt(xIncrease), parseInt(roverLocation[1]) + parseInt(yIncrease)];
    repositionRocket(newLocation, direction);
}

/* 
 * This function repositions the rocket to the correct cell (x,y) and faces it 
 * in the correct direction (facing N,S,E,W)
 * 
 */
function repositionRocket(location, direction) {
	var x = location[0];
	var y = location[1];
    var elem = document.getElementById('rocketNav');
    elem.style.gridColumnStart = x;
    elem.style.gridColumnEnd = parseInt(x)+1;
    elem.style.gridRowStart = y;
    elem.style.gridRowEnd = parseInt(y)+1;
    
	updateURL(x, y, direction);
}

/* 
 * This function is called by moveRover() when the command to execute is to turn 
 * the rocket to the left or right. The command is used to determine the correct direction 
 * (which in this case is determined after first converting directions to numbers).
 * The turnRocket method is then called with the correct direction for the rocket. 
 * 
 */
function turn(command) {
	var url = new URL(window.location);
	x = url.searchParams.get("x");
	y = url.searchParams.get("y");
	direction = url.searchParams.get("direction");

    var directionNumber = directionToNumber(direction.toLowerCase());
    if (command.toLowerCase() === 'l') { // Left
        directionNumber = (directionNumber + 4 - 1) % 4;
    } else { // Right
        directionNumber = (directionNumber + 1) % 4;
    }
    var newDirection = directions[directionNumber];
    turnRocket(newDirection);
	updateURL(x, y, newDirection);
}

this.directions = ['n', 'e', 's', 'w'];

/* 
 * This function loops through the directions array (above) and locates the
 * matching index for the direction variable that was passed in
 * 
 */
function directionToNumber(direction) {
    for(var index = 0; index < 4; index++) {
        if (directions[index] === direction) return index;
    }
}

/* 
 * This function faces the rocket in the correct direction (facing N,S,E,W)
 * 
 */
function turnRocket(direction) {
	
    var elem = document.getElementById('rocketNav');
    if(direction.toLowerCase() == "e") {
    	elem.style.transform = "rotate(90deg)"; //standard syntax
    	elem.style.webkitTransform  = "rotate(90deg)"; //Chrome, Safari, Opera
    	elem.style.paddingRight = "32px";
    	elem.style.paddingTop = "26px";
    	elem.style.paddingBottom = "6px";
    	elem.style.paddingLeft = "0px";
    } else if (direction.toLowerCase() == "s") {
    	elem.style.transform = "rotate(180deg)";
    	elem.style.webkitTransform  = "rotate(180deg)";
    	elem.style.paddingRight = "6px";
    	elem.style.paddingTop = "32px";
    	elem.style.paddingBottom = "0px";
    	elem.style.paddingLeft = "26px";
    } else if (direction.toLowerCase() == "w") {
    	elem.style.transform = "rotate(270deg)";
    	elem.style.webkitTransform  = "rotate(270deg)";
    	elem.style.paddingRight = "0px";
    	elem.style.paddingTop = "6px";
    	elem.style.paddingBottom = "26px";
    	elem.style.paddingLeft = "32px";
    } else { // n
    	elem.style.transform = "rotate(0deg)"; 
    	elem.style.webkitTransform  = "rotate(0deg)"; 
    	elem.style.paddingRight = "16px";
    	elem.style.paddingTop = "0px";
    	elem.style.paddingBottom = "32px";
    	elem.style.paddingLeft = "6px";
    }
}