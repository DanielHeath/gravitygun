class GravityBeacon {
  constructor(position, facing) {
    this.position = position
    this.facing = facing
    this.radius = 55
    this.velocity = {x: 0, y: 0}
    this.ignoresCollisions = true
    this.lifespanMS = 8000
    this.gravityStrength = 10
  }

  step(ms, world) {
    this.lifespanMS -= ms
    world.objects.forEach((object) => {
      if (object.velocity) {

      }
    })
  }

  draw(ctx, world) {
    ctx.fillStyle = 'white'
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.facing);

    ctx.beginPath();
    ctx.moveTo(this.radius/-1.2, 0);
    ctx.lineTo(this.radius/4.5, this.radius/2);
    ctx.lineTo(this.radius/4.5, -this.radius/2);
    ctx.fill();
  }

}
