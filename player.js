class Player {
  constructor(position, color) {
    this.position = position
    this.color = color
    this.facing = 360 * Math.random()
    this.holding = null
    this.grapplePoint = null
    this.radius = 55
    this.velocity = {x: 0, y: 0}
    this.mass = 1
  }

  step(ms) {
    this.position.x = this.position.x + (this.velocity.x * ms / 1000.0)
    this.position.y = this.position.y + (this.velocity.y * ms / 1000.0)


    this.velocity.x = this.velocity.x * 0.8
    this.velocity.y = this.velocity.y * 0.8

    console.log(this.velocity.x)
  }

  accelerate({forward, rotate}) {
    // TODO: accellerate 'forward' and turn the ship to get other velocities.
    this.facing += rotate / 3
    debugger
    this.velocity.x += forward * Math.cos(this.facing * 180/Math.pi)
    this.velocity.y += forward * Math.sin(this.facing * 180/Math.pi)
  }
}
