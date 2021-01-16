
class World {
  constructor() {
    this.width = 4096
    this.height = 4096
    this.wallBounceFactor = 0.8
    this.objects = []
    this.starfield = []
    this.debug = true

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
    this.objects.forEach((object, idx) => {
      if (object.velocity) {
        // Check for 'out of bounds' collision.
        let nextPos = {
          x: object.position.x + (object.velocity.x * ms / 1000.0),
          y: object.position.y + (object.velocity.y * ms / 1000.0),
          radius: object.radius
        }
        const radius = object.radius || 0
        const collider = this.objects.slice(idx+1).find((other) => distance(nextPos, other) < 0)
        if (collider) {
          // if (this.speed(object.velocity) > 100) {
          //   alert('crash')
          // }
          // console.log('collision', object, collider, this.speed(object.velocity))

          // Reverse velocity. TODO: a glancing crash should ricochet off
          // need to know how far off-centre it is for that to work.

          // collided!
          // collision angle:
          // collisionNormal(object.position, collider.position)
          // let {v1, v2} = collisionVelocities(object.mass, collider.mass, object.velocity, collider.velocity)

          let normal = collisionNormal(object.position, collider.position)
          let pc = parallelComponent(_collisionVelocity(object.velocity, collider.velocity), normal)

          // perfect elasticity.
          let elasticity = 0.5

          // The collision causes an impulse (a near-infinite force applied over a nearzero time)
          // such that the energy imparted is enough to stop (and then reflect, * 'e' elasticity)
          // both objects along the parallel component.
          let objectShareOfImpulse = (object.mass / (object.mass+collider.mass))
          let colliderShareOfImpulse = (collider.mass / (object.mass+collider.mass))
          let impulseMagnitude = elasticity*magnitude(pc)*(object.mass + collider.mass)

          object.receiveHitWithImpulse && object.receiveHitWithImpulse(impulseMagnitude, elasticity)
          collider.receiveHitWithImpulse && collider.receiveHitWithImpulse(impulseMagnitude, elasticity)

          let objectVecChange = mulVec(impulseMagnitude/object.mass, toUnitVec(normal))
          let colliderVecChange = mulVec(impulseMagnitude/collider.mass, toUnitVec(normal))

          let combinedMomentum = addVec(mulVec(object.mass, object.velocity), mulVec(collider.mass, collider.velocity))
          let objectWas = object.velocity
          let colliderWas = collider.velocity
          object.velocity = addVec(object.velocity, objectVecChange)
          collider.velocity = addVec(collider.velocity, mulVec(-1, colliderVecChange))

          if (this.debug) {
            console.table([
              {mass: object.mass, radius: object.radius, prevx: objectWas.x, x: object.velocity.x, prevy: objectWas.y, y: object.velocity.y},
              {mass: collider.mass, radius: collider.radius, prevx: colliderWas.x, x: collider.velocity.x, prevy: colliderWas.y, y: collider.velocity.y},
            ])
            let newCombinedMomentum = addVec(mulVec(object.mass, object.velocity), mulVec(collider.mass, collider.velocity))
            if (Math.abs(combinedMomentum.x - newCombinedMomentum.x) > 0.0001) {
              debugger
            }
            if (Math.abs(combinedMomentum.y - newCombinedMomentum.y) > 0.0001) {
              debugger
            }
          }

          nextPos = {
            x: object.position.x + (object.velocity.x * ms / 1000.0),
            y: object.position.y + (object.velocity.y * ms / 1000.0),
            radius: object.radius
          }

        } else if (nextPos.x < radius) {
          console.log('hit the left wall', object.velocity.x * ms / 1000.0, object)
          nextPos.x = radius // teleport back into bounds
          object.velocity.x = -object.velocity.x * this.wallBounceFactor // stop moving towards the wall
        } else if ((this.width-radius) < nextPos.x) {
          console.log('hit the right wall', object.velocity.x * ms / 1000.0, object)
          nextPos.x = this.width-radius
          object.velocity.x = -object.velocity.x * this.wallBounceFactor
        } else if (nextPos.y < radius) {
          console.log('hit the top wall', object.velocity.y * ms / 1000.0, object)
          nextPos.y = radius
          object.velocity.y = -object.velocity.y * this.wallBounceFactor
        } else if ((this.height-radius) < nextPos.y) {
          console.log('hit the bottom wall', object.velocity.y * ms / 1000.0, object)
          nextPos.y = this.height-radius
          object.velocity.y = -object.velocity.y * this.wallBounceFactor
        }
        object.position = nextPos
      }
    })
  }

}