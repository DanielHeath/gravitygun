class Pickup {
  constructor(position, type) {
    this.position = position
    this.type = type
    this.radius = 55
    this.velocity = {x: 0, y: 0}
    this.mass = 0.00001
    this.ignoresCollisions = true
  }

}
