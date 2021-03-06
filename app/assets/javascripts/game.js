var Start;
var EndGame;

var playerName; //set by websocket server

App.cable.subscriptions.create({
  channel: "GameChannel",
  id: 1
},{
  received: function(data) {
  	//does nothing
  }
});

//initiate WebSockets...

//runs when HTML page loads...

Context.create("canvas");
resizeCanvas();


var drawContentAnimation;
function drawContent () {

	// stop
    if (stop) {
        return;
    }

    // request another frame

    drawContentAnimation = requestAnimationFrame(drawContent);

    // calc elapsed time since last loop

    now = Date.now();
    elapsed = now - then;

    // if enough time has elapsed, draw the next frame

    if (elapsed > fpsInterval) {

        // Get ready for next frame by setting then=now, but...
        // Also, adjust for fpsInterval not being multiple of 16.67
        then = now - (elapsed % fpsInterval);


		ctx.clearRect(0, 0, canvas.width, canvas.height); //clears last input

		drawGrid(200, 200, Map.mapLimit[0], Map.mapLimit[1]); //maplimit declared in gameobjects, drawGrid in canvas.js


		//below methods defined in gameObjects.js...

		//loads local players...

		Player.rotation = Math.atan2(Game.mousePos[0] - (Player.x - Map.translateView[0]), - (Game.mousePos[1] - (Player.y - Map.translateView[1])) )*(180/Math.PI);

		//all dropped items

		Player.drawAll(Player.x, Player.y, Player.rotation, Player.name, Player.inventory[HudItem.selectedItem])

		//draws all queued animations
		Animation.drawAll();

		//controls

		playerSpeed = Player.speed; //default setting sets the speed of player 

		let playerMovementArray = [0, 0];

		if (keyShift == true) {
			playerSpeed = Player.sprintSpeed;
		}
		if (keyAlt == true) { //sneaking
			playerSpeed = Player.sneakSpeed;
		}

		if (keyD == true) {
		  playerMovementArray[0] = playerSpeed;
		}
		if (keyS == true) {
		  playerMovementArray[1] = playerSpeed;
		}
		if (keyA == true) {
		  playerMovementArray[0] = -playerSpeed;
		}
		if (keyW == true) {
		  playerMovementArray[1] = -playerSpeed;
		}

		Player.move(playerMovementArray[0], playerMovementArray[1]); //Important for formatting canvas view...

	}
}


function startFrameCycle () {
	Game.draw(Game.fps);
}

Start = function () {
	App.game.get_name();
	startFrameCycle();
	window.setTimeout(function() {
		App.game.get_name(); //just in case it doesn't show up
	}, 1000);

	App.game.get_self_uuid();

	Player.lastMove = Date.now();
}

EndGame = function () {
	cancelAnimationFrame(drawContentAnimation);
	$("#status").html("<span style='color: red'>Lost connection to server :-(</span>");
}

function startGame () {
	var name = $("#name").val();

	$("#name").blur();
	$("#name").slideUp(500); //500 ms (1/2) of a second
	$(".upper").fadeOut(500);

	addKeyEventListeners(); //detect game keystrokes

	App.game.start_game(name, [Player.x, Player.y]);
}


