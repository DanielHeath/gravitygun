
class World {
  constructor() {
    this.width = 4096
    this.height = 4096
    this.wallBounceFactor = 0.8
    this.objects = []
    this.starfield = []

    const stars = 500
    const colorrange = [0,60,240];
    for (var i = 0; i < stars; i++) {
      const x = Math.random() * this.width
      const y = Math.random() * this.height
      const radius = Math.random() * 2.2
      const hue = colorrange[i % 3]
      const sat = randNormalDist(75,12)

      this.starfield.push({
        x, y, radius, hue, sat
      })
    }

  }

  generateSafePosition() {
    let closestPermissible = 100

    while (--closestPermissible) {
      let x = randNormalDist(this.width / 2, this.width/(defaultDeviations*2))
      let y = randNormalDist(this.height / 2, this.height/(defaultDeviations*2))
      if (!this.objects.find((object) => distance(object, {x,y}) < closestPermissible)) {
        return {x,y}
      }
    }

    console.log("Disaster case: no safe position found, use the center.")
    return {x: this.width / 2, y: this.height / 2}
  }

  speed(velocity) {
    return Math.sqrt(velocity.x**2 + velocity.y ** 2)
  }

  step(ms) {
    this.objects.forEach((object) => {
      if (object.velocity) {
        // Check for 'out of bounds' collision.
        let nextPos = {
          x: object.position.x + (object.velocity.x * ms / 1000.0),
          y: object.position.y + (object.velocity.y * ms / 1000.0),
          radius: object.radius
        }
        const radius = object.radius || 0
        const collider = this.objects.find((other) => (other != object) && distance(nextPos, other) < 0)
        if (collider) {
          // if (this.speed(object.velocity) > 100) {
          //   alert('crash')
          // }
          console.log('collision', object, collider, this.speed(object.velocity))

          // Reverse velocity. TODO: a glancing crash should ricochet off
          // need to know how far off-centre it is for that to work.

          // collided!
          let {v1, v2} = collisionVelocities(object.mass, collider.mass, object.velocity, collider.velocity)
          object.velocity = v1
          collider.velocity = v2

          nextPos = {
            x: object.position.x + (object.velocity.x * ms / 1000.0),
            y: object.position.y + (object.velocity.y * ms / 1000.0),
            radius: object.radius
          }

        } else if (nextPos.x < radius) {
          console.log('hit the left wall')
          nextPos.x = radius
          object.velocity.x = -object.velocity.x * this.wallBounceFactor
        } else if ((this.width-radius) < nextPos.x) {
          console.log('hit the right wall')
          nextPos.x = this.width-radius
          object.velocity.x = -object.velocity.x * this.wallBounceFactor
        } else if (nextPos.y < radius) {
          console.log('hit the top wall')
          nextPos.y = radius
          object.velocity.y = -object.velocity.y * this.wallBounceFactor
        } else if ((this.height-radius) < nextPos.y) {
          console.log('hit the bottom wall')
          nextPos.y = this.height-radius
          object.velocity.y = -object.velocity.y * this.wallBounceFactor
        }
        object.position = nextPos
      }
    })
  }

}