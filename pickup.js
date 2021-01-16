class Pickup {
  constructor(position, type) {
    this.position = position
    this.type = type
    this.radius = 55
    this.velocity = {x: 0, y: 0}
    this.mass = 0.00001
    this.ignoresCollisions = true
  }

  draw(ctx, world) {
    ctx.fillStyle='white'
    ctx.font = 'bold 48px serif';
    ctx.fillText(
      this.type,
      this.position.x-this.radius,
      this.position.y,
      this.radius*2
    )

    // DRAW SHIELD
    ctx.strokeStyle = 'green'
    ctx.lineWidth = 2
    ctx.beginPath();
    ctx.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0, 2 * Math.PI, true
    )
    ctx.stroke()
  }

}
