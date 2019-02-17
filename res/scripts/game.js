class Game {
	constructor(size, cvs = document.getElementById("game-cvs")) {
		this.cvs = cvs;
		this.ctx = this.cvs.getContext("2d");

		this.size = size;
		this.squareSize = this.cvs.width/this.size;

		this.running = true;

		this.squares = [];

		this.cookie = new Cookie(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000));


		this.showHighscore();
		this.start();
	}

	start() {
		for(var x = 0; x < this.size; x++) {
			this.squares[x] = [];
			for(var y = 0; y < this.size; y++) {
				this.squares[x][y] = 0;
			}
		}
		this.addRandomPiece();
		this.running = true;
	}

	paint() {
		this.ctx.fillStyle = "#FFFFFF";
		this.ctx.fillRect(0,0,this.cvs.width,this.cvs.height);
		this.ctx.fillStyle = "#000000";
		this.ctx.strokeStyle = "#000000";
		this.ctx.lineWidth = 2;
		this.ctx.font = "80px Arial";
		this.ctx.textBaseline = "middle";
		this.ctx.textAlign = "center";
		for(var y = 0; y < this.size; y++) {
			for(var x = 0; x < this.size; x++) {
				this.ctx.strokeRect(x*this.squareSize, y*this.squareSize, this.squareSize, this.squareSize);
				if(this.squares[x][y] != 0) {
					this.ctx.fillText(this.squares[x][y], (x+0.5)*this.squareSize, (y+0.5)*this.squareSize);
				}
			}
		}
	}

	addRandomPiece() {
		if(this.isFull()) {
			this.gameOver();
			return;
		}
		var free = [[],[]];
		for(var y = 0; y < this.size; y++) {
			for(var x = 0; x < this.size; x++) {
				if(this.squares[x][y] == 0) {
					free[0].push(x);
					free[1].push(y);
				}
			}
		}
		var i = Math.floor(Math.random()*free[0].length);
		this.squares[free[0][i]][free[1][i]] = 2;
		this.paint();
	}

	move(xDir, yDir) {
		if(!this.running)
			return;

		var y = 0;
		if(yDir == -1 || xDir == -1)
			y = -yDir;
		if(yDir == 1 || xDir == 1)
			y = this.size-1-yDir;

		for(; y < this.size && y >= 0; y += -xDir-yDir) {

			var x = 0;
			if(xDir == -1 || yDir == -1) {
				x = -xDir;
			}
			if(xDir == 1 || yDir == 1)
				x = this.size-1-xDir;
			
			for(; x < this.size && x >= 0; x += -xDir-yDir) {
				var xv = x;
				var yv = y;
				var xv2 = x+xDir;
				var yv2 = y+yDir;
				if(this.squares[x][y] != 0) {
					for(var i = 0; xv2 >= 0 && xv2 < this.size && yv2 >= 0 < this.size && (this.squares[xv][yv] == this.squares[xv2][yv2] || this.squares[xv2][yv2] == 0);) {
						if(this.squares[xv][yv] == this.squares[xv2][yv2]) {
							this.squares[xv2][yv2] = this.squares[xv][yv]*2;
							this.squares[xv][yv] = 0;
						} else if(this.squares[xv2][yv2] == 0) {
							this.squares[xv2][yv2] = this.squares[xv][yv];
							this.squares[xv][yv] = 0;
						}
						i++;
						xv = x + i*xDir;
						yv = y + i*yDir;
						xv2 = x + (i+1)*xDir;
						yv2 = y + (i+1)*yDir;
					}
				}
			}
		}
		this.addRandomPiece();
		if (this.running)
			this.paint();
	}

	isFull() {
		for(var y = 0; y < this.size; y++) {
			for(var x = 0; x < this.size; x++) {
				if(this.squares[x][y] == 0) {
					return false;
				}
			}
		}
		return true;
	}

	gameOver() {
		this.running = false;
		this.ctx.fillStyle = "#FFFFFF";
		this.ctx.fillRect(30, this.cvs.height/2 - 100, this.cvs.width-60, 200);
		this.ctx.fillStyle = "#FF0000";
		this.ctx.strokeRect(30, this.cvs.height/2 - 100, this.cvs.width-60, 200);
		this.ctx.fillText("GAME OVER!", this.cvs.width/2, this.cvs.height/2 - 50);
		var score = 0;
		for(var x = 0; x < this.size; x++) {
			for(var y = 0; y < this.size; y++) {
				score += this.squares[x][y];
			}
		}
		this.ctx.fillText("SCORE: " + score, this.cvs.width/2, this.cvs.height/2 + 50);
		var high_score = this.cookie.get("high_score");
		if (!high_score || parseInt(high_score) < score) {
			console.log("hi");
			this.cookie.set("high_score", score);
		}
		this.showHighscore();
	}

	showHighscore() {
		var e = document.getElementById("highscore");
		var highscore = this.cookie.get("high_score");
		e.textContent = "Highscore: " + (highscore ? highscore : 0);
	}
}