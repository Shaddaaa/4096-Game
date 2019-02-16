window.onkeyup = function (e) {
	var key = e.keyCode ? e.keyCode : e.which;
	if (key == 37) {
		game.move(-1,0);
	} else 	if (key == 38) {
		game.move(0,-1);
	} else 	if (key == 39) {
		game.move(1,0);
	} else 	if (key == 40) {
		game.move(0,1);
	} else 	if (key == 82) {
		game.start();
	}
}


let game = new Game(4);
console.log(game);