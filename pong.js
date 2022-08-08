class Component {
    constructor(x, y, color, ctx) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.ctx = ctx;
        // speed in pixels per frame
        this.speedX = 0;
        this.speedY = 0;
        this.width = 10;
        this.height = 10;
    }

    newPos() {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    update() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    crashWith(otherboj) {
        let myleft = this.x;
        let myright = this.x + this.width;
        let mytop = this.y;
        let mybottom = this.y + this.height;
        let otherleft = otherboj.x;
        let otherright = otherboj.x + otherboj.width;
        let othertop = otherboj.y;
        let otherbottom = otherboj.y + otherboj.height;
        let crash = true;
        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

class Ball extends Component {
    // the ball is a square with a size of 10x10
    constructor(x, y, color, ctx) {
        super(x, y, color, ctx);
    }

    serve() {
        this.x = 245;
        this.y = 245;
        this.speedX = 3;
        this.speedY = getRandomIntInclusive(-3, 3);
    }
}

class Obstacle extends Component {
    constructor(x, y, color, ctx) {
        super(x, y, color, ctx);
        this.width = 500;
        this.height = 10;
    }

}

class Paddle extends Component {
    // the paddle is a rectangle with a size of 10x100
    constructor(x, y, color, ctx) {
        super(x, y, color, ctx);
        this.height = 100;
        this.width = 10;
    }
}


class Scoreboard {
    constructor(ctx) {
        this.ctx = ctx;
        this.score1 = 0;
        this.score2 = 0;
    }

    update() {
        this.ctx.font = "50px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(this.score1, 185, 50);
        this.ctx.fillText(this.score2, 285, 50);
    }
}

class MiddleLine {
    constructor(ctx) {
        this.ctx = ctx;
    }

    update() {
        this.ctx.beginPath();
        this.ctx.setLineDash([10, 10]);
        this.ctx.moveTo(250, 0);
        this.ctx.lineTo(250, 500);
        this.ctx.strokeStyle = "white";
        this.ctx.stroke();
    }
}

class GameArea {
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.keys = [];
    }

    start() {
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    stop() {
        clearInterval(this.interval);
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
}

function updateGameArea() {
    gameArea.clear();
    paddle1.speedY = 0;
    paddle2.speedY = 0;
    // keyboard controls
    if (gameArea.keys["W"] || gameArea.keys["w"]) {
        paddle1.speedY = -4;
    }
    if (gameArea.keys["S"] || gameArea.keys["s"]) {
        paddle1.speedY = 4;
    }
    if (gameArea.keys["ArrowUp"]) {
        paddle2.speedY = -4;
    }
    if (gameArea.keys["ArrowDown"]) {
        paddle2.speedY = 4;
    }
    // collision detection
    if (ball.crashWith(paddle1)) {
        ball.speedX = -ball.speedX;
    }
    if (ball.crashWith(paddle2)) {
        ball.speedX = -ball.speedX;
    }
    if (ball.crashWith(obstacle1)) {
        ball.speedY = -ball.speedY;
    }
    if (ball.crashWith(obstacle2)) {
        ball.speedY = -ball.speedY;
    }
    if (paddle1.crashWith(obstacle1)) {
        paddle1.y = 10;
    }
    if (paddle1.crashWith(obstacle2)) {
        paddle1.y = 390;
    }
    if (paddle2.crashWith(obstacle1)) {
        paddle2.y = 10;
    }
    if (paddle2.crashWith(obstacle2)) {
        paddle2.y = 390;
    }
    checkScore();
    // update objects
    obstacle1.update();
    obstacle2.update();
    paddle1.newPos();
    paddle1.update();
    paddle2.newPos();
    paddle2.update();
    ball.newPos();
    ball.update();
    scoreboard.update();
    middleLine.update();

}

function startGame() {
    gameArea.start();
    ball.serve();
}

function checkScore() {
    if (ball.x < 0) {
        scoreboard.score2 += 1;
        ball.serve();
    }
    if (ball.x > 490) {
        scoreboard.score1 += 1;
        ball.serve();
    }
    if (scoreboard.score1 == 10) {
        gameArea.stop();
        alert("Player 1 wins!");
    }
    if (scoreboard.score2 == 10) {
        gameArea.stop();
        alert("Player 2 wins!");
    }
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const gameArea = new GameArea();
const ball = new Ball(245, 245, "white", gameArea.ctx);
const paddle1 = new Paddle(40, 200, "white", gameArea.ctx);
const paddle2 = new Paddle(450, 200, "white", gameArea.ctx);
const obstacle1 = new Obstacle(0, 0, "grey", gameArea.ctx);
const obstacle2 = new Obstacle(0, 490, "grey", gameArea.ctx);
const scoreboard = new Scoreboard(gameArea.ctx);
const middleLine = new MiddleLine(gameArea.ctx);