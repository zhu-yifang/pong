const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

class Component {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
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
        // collision detection
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
    constructor(x, y, color) {
        super(x, y, color);
    }

    serve() {
        this.x = 245;
        this.y = 245;
        this.speedX = 3;
        this.speedY = 0;
    }
}

class Obstacle extends Component {
    constructor(x, y, color) {
        super(x, y, color);
        this.width = 500;
        this.height = 10;
    }
}

class Paddle extends Component {
    // the paddle is a rectangle with a size of 10x100
    constructor(x, y, color) {
        super(x, y, color);
        this.height = 100;
        this.width = 10;
    }
}

class Scoreboard {
    constructor() {
        this.score1 = 0;
        this.score2 = 0;
    }
}

class GameArea {
    constructor() {
        this.width = 500;
        this.height = 500;
        this.keys = [];
    }

    start() {
        this.interval = setInterval(updateGameArea, 20, this.keys);
    }

    stop() {
        clearInterval(this.interval);
    }
}

function updateGameArea(keys) {
    paddle1.speedY = 0;
    paddle2.speedY = 0;
    // keyboard controls
    if (keys["W"] || keys["w"]) {
        paddle1.speedY = -4;
    }
    if (keys["S"] || keys["s"]) {
        paddle1.speedY = 4;
    }
    if (keys["ArrowUp"]) {
        paddle2.speedY = -4;
    }
    if (keys["ArrowDown"]) {
        paddle2.speedY = 4;
    }
    // update objects positions
    paddle1.newPos();
    paddle2.newPos();
    ball.newPos();
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
    // send updated game state to client
    io.emit('update', {
        paddle1: paddle1,
        paddle2: paddle2,
        ball: ball,
        score: scoreboard
    });
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
    }
    if (scoreboard.score2 == 10) {
        gameArea.stop();
    }
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const gameArea = new GameArea();
const ball = new Ball(245, 245, "white");
const paddle1 = new Paddle(40, 200, "white");
const paddle2 = new Paddle(450, 200, "white");
const obstacle1 = new Obstacle(0, 0, "grey");
const obstacle2 = new Obstacle(0, 490, "grey");
const scoreboard = new Scoreboard();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

io.on('connection', (socket) => {
    socket.on('start', () => {
        console.log('Game start');
        startGame();
    });
    socket.on('keydown', (key) => {
        gameArea.keys[key] = true;
    });
    socket.on('keyup', (key) => {
        gameArea.keys[key] = false;
    });
});
