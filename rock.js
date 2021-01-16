class Rock {
  constructor(radius, rotation, position) {
    this.radius = radius
    this.rotation = rotation
    this.position = position
    this.mass = (radius/12)**2
    this.velocity = {x: 0, y: 0}
  }
}
