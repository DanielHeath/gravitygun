const uniformGravity = (factor, distance) => factor / 100
const linearGravity = (factor, distance) => factor / distance / 10
const logGravity = (factor, distance) => factor / (distance*Math.log(distance))
const realGravity = (factor, distance) => factor * 100 / (distance*distance)

class GravityBeacon {
  constructor(position, facing, velocity, ignoreobjects) {
    // idea: move much faster, attach to anything it hits, attract all objects not of same type after attaching.

    this.velocity = addVec(velocity, mulVec(150, facingToUnitVec(facing)))
    this.position = position
    this.facing = facing
    this.ignoreobjects = ignoreobjects

    this.radius = 55
    this.ignoresCollisions = true
    this.lifespanMS = 12000
    this.activeAfterMs = 1000

    this.gravityStrength = 1000
  }

  step(ms, world) {
    this.activeAfterMs -= ms
    if (this.activeAfterMs > 0) {
      return
    }
    this.lifespanMS -= ms
    if (this.lifespanMS < 0) {
      world.spawnPickup(Pickup.gravitygun)
      world.deleteList.push(this)
      return
    }
    world.objects.forEach((object) => {
      if (
        object.velocity &&
        object instanceof Player &&
        this.ignoreobjects.indexOf(object) === -1 && !(
          object.position.x === this.position.x &&
          object.position.y === this.position.y
        )) {
        const direction = subVec(this.position, object.position)

        const distance = magnitude(direction)
        // Avoid accelerating things that enter the event horizon!
        // Stick them to the beacon instead.
        if (distance > this.radius) {
          const accel = mulVec(
            linearGravity(ms * this.gravityStrength, distance),
            toUnitVec(direction)
          )
          object.velocity = addVec(object.velocity, accel)
        } else {
          object.velocity = {...this.velocity}
        }

      }
    })
  }

  draw(ctx, world) {
    if (this.lifespanMS < 0) {
      return
    }
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
