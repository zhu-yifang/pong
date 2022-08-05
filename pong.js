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
        this.speedX = 3;
        this.speedY = 3;
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
    if (gameArea.keys["ArrowUp"]) {
        paddle1.speedY = -3;
    }
    if (gameArea.keys["ArrowDown"]) {
        paddle1.speedY = 3;
    }
    if (gameArea.keys["w"]) {
        paddle2.speedY = -3;
    }
    if (gameArea.keys["s"]) {
        paddle2.speedY = 3;
    }
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
    obstacle1.update();
    obstacle2.update();
    paddle2.newPos();
    paddle2.update();
    paddle1.newPos();
    paddle1.update();
    ball.newPos();
    ball.update();
}

function startGame() {
    gameArea.start();
}

const gameArea = new GameArea();
const ball = new Ball(245, 245, "white", gameArea.ctx);
const paddle1 = new Paddle(450, 200, "white", gameArea.ctx);
const paddle2 = new Paddle(40, 200, "white", gameArea.ctx);
const obstacle1 = new Obstacle(0, 0, "grey", gameArea.ctx);
const obstacle2 = new Obstacle(0, 490, "grey", gameArea.ctx);