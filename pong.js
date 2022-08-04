class Ball {
  constructor(x, y, r, color, ctx) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.color = color;
    this.ctx = ctx;
    this.speedX = 5;
    this.speedY = 0;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.closePath();
  }

  move() {
    
}