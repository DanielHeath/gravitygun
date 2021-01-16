const rock1 = document.getElementById('rock')

class Rock {
  constructor(radius, rotation, position) {
    this.radius = radius
    this.rotation = rotation
    this.position = position
    this.mass = (radius/12)**2
    this.velocity = {x: 0, y: 0}
  }

  draw(ctx, world) {
    if (world.debug) {
      // DRAW COLLISION BORDER for debugging
      ctx.fillStyle = 'grey'
      ctx.strokeStyle = 'green'
      ctx.beginPath();
      ctx.arc(
        this.position.x,
        this.position.y,
        this.radius,
        0, 2 * Math.PI, true
      )
      ctx.fill()
      ctx.stroke()
    }

    // DRAW IMAGE
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate((window.performance.now() / 1000) * this.rotation * Math.PI / 180);
    ctx.translate(-this.radius ,-this.radius);
    ctx.drawImage(rock1, 0, 0, this.radius*2, this.radius*2)
  }
}
