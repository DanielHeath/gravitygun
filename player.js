class Player {
  constructor(position, color) {
    this.position = position
    this.color = color
    this.facing = Math.PI * Math.random()
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
  }

  act({forward, rotate, grapple}) {
    this.facing = this.facing + (rotate / 180)
    if (this.facing > 2 * Math.PI) {
      this.facing = this.facing - (2 * Math.PI)
    }
    if (this.facing < 0) {
      this.facing = this.facing + (2 * Math.PI)
    }
    if (this.color === 'blue' && forward > 0) {
      console.log('facing',this.facing, forward, this.velocity.x)
    }

    this.velocity.x -= forward * 1.8 * Math.cos(this.facing)
    this.velocity.y -= forward * 1.8 * Math.sin(this.facing)

    if (this.grapplePoint) {
      return
    }
    if (magnitude(this.velocity) > 900) {
      this.velocity.x *= 0.8
      this.velocity.y *= 0.8
    }

    if (!forward) {
      this.velocity.x *= 0.98
      this.velocity.y *= 0.98
    }
  }
}
