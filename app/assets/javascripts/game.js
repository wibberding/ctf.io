//set variables for html dom use and reference
var HudItem;

var Map;

$(document).ready(function () {
	//runs when HTML page loads...

	Context.create("canvas");
	resizeCanvas();

	// GETS MAP DATA FROM SERVER
	Map = {
		translateView: [0, 0] //used to determine where the screen is viewing on the map...
	};

	$.get( "getMap", function( data ) {
		Map = $.extend(Map, JSON.parse(data)); //extends existing map obejct
	});

	HudItem = {
		slot_1: null,
		slot_2: null,
		slot_3: null,
		slot_4: null,
		slot_5: null,
		slot_6: null,
		slot_7: null,
		slot_8: null,

		selectedItem: 0, //default index selected

		drawItems: function () {
			//draws the items in your HUD (HTML HUD!)
			//ajax get request to get HUD
			$.get( "getHUD", function( data ) {
			  
			});
		},

		select: function (id) {
			//selects item from HTML HUD
			if (id != this.selectedItem) { //that would deselect the HUD item... don't do that
				document.getElementById("hudSlot" + id).classList.add('hudSelected');
				document.getElementById("hudSlot" + this.selectedItem).classList.remove('hudSelected'); //removes class from deselected item
				this.selectedItem = id;
			}
		}
	};

	var drawPlayerAnimation;
	function drawPlayer () {
		window.setTimeout(function() {

			drawPlayerAnimation = requestAnimationFrame(drawPlayer);
			ctx.clearRect(0, 0, canvas.width, canvas.height); //clears last input

			var playerX = canvas.width / 2 + Player.x + Map.translateView[0]; //(translateView[x, y])
			var playerY = canvas.height / 2 + Player.y + Map.translateView[1]; // 0 = x, 1 = y.

			ctx.beginPath(); //resets path that is being drawn.

			ctx.arc(playerX, playerY, Player.size, 0, 2*Math.PI, false); // ! augmented by Map.translateView and other such variables !
			if (Player.color != true) {
				ctx.fillStyle = '#ffe0bd'; //skin tone
			}
			else {
				ctx.fillStyle = 'blue';
			}
			ctx.strokeStyle = '#274729';
			ctx.stroke();
			ctx.fill();

			//controls

			playerSpeed = 1; //default setting sets the speed of player 

			if (keyShift == true) {
				playerSpeed = 2;
			}
			if (keyD == true) {
			  Player.move(playerSpeed, 0);
			}
			if (keyS == true) {
			  Player.move(0, playerSpeed);
			}
			if (keyA == true) {
			  Player.move(-playerSpeed, 0);
			}
			if (keyW == true) {
			  Player.move(0, -playerSpeed);
			}

		}, 1000 / Game.fps);

		//cancelAnimationFrame(drawPlayerAnimation);
	}

	var Game = { // holds framerate and function to draw a frame
	  fps: 60, // frames per second

	  draw: function () {
	    drawPlayer(); //referenced below... somewhere.
	  }
	};

	function startFrameCycle () {
		Game.draw();
	}

	function start () {
		startFrameCycle();
		$("#playButton").hide();
	}

	start();
});