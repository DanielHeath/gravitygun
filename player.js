const pendingDamageDrainFactor = 1.0
class Player {
  constructor(position, color, ) {
    this.position = position
    this.color = color
    this.facing = Math.PI * Math.random()
    this.holding = Pickup.gravitygun
    this.grapplePoint = null
    this.radius = 55
    this.velocity = {x: 0, y: 0}
    this.mass = 8

    this.alive = true
    this.shieldCapacityMax = 400
    this.shieldCapacity = this.shieldCapacityMax
    this.shieldDamageReduction = 2
    this.pendingDamage = 0

    // True if should render a shield flash
    this.renderShieldDamage = 0
  }

  getPickup(pickup) {
    this.holding = pickup.type
  }

  receiveHitWithImpulse(impulseMagnitude, elasticity, collVelocity) {
    let hitEnergyLoss = (impulseMagnitude/elasticity) * (1-elasticity) / collVelocity
    if (this.shieldCapacity > 0) {
      hitEnergyLoss -= this.shieldDamageReduction
    } else {
      // Collision without shields
      this.alive = false
    }

    console.log(arguments, hitEnergyLoss)
    if (hitEnergyLoss < 0) {
      return
    }
    this.pendingDamage += hitEnergyLoss
  }

  draw(ctx, world) {
    if (!this.alive) {
      return
    }

    if (this.shieldCapacity > 0) {
      // DRAW SHIELD
      ctx.strokeStyle = this.color
      if (Math.random() > (this.shieldCapacity / this.shieldCapacityMax)) {
        ctx.strokeStyle = '#222'
      }
      if (this.renderShieldDamage) {
        ctx.strokeStyle = 'white'
      }
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

    // DRAW SHIP triangle
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.facing);
    ctx.fillStyle = this.color

    ctx.beginPath();
    ctx.moveTo(this.radius/-1.2, 0);
    ctx.lineTo(this.radius/1.5, this.radius/2);
    ctx.lineTo(this.radius/1.5, -this.radius/2);
    ctx.fill();

    if (this.holding === Pickup.gravitygun) {
      ctx.fillStyle = 'white'

      ctx.beginPath();
      ctx.moveTo(this.radius/-1.2, 0);
      ctx.lineTo(this.radius/4.5, this.radius/2);
      ctx.lineTo(this.radius/4.5, -this.radius/2);
      ctx.fill();
    }
    ctx.restore()
    if (this.grapplePoint) {
      // TODO untested
      ctx.save()
      ctx.strokeStyle = this.color
      ctx.beginPath();
      ctx.moveTo(this.position.x, this.position.y);
      ctx.lineTo(this.grapplePoint.x, this.grapplePoint.y);
      ctx.stroke();
      ctx.restore()
    }
  }

  step(ms, world) {
    if (!this.alive) {
      this.velocity.x = 0
      this.velocity.y = 0
      return
    }
    if (this.renderShieldDamage > 0) {
      this.renderShieldDamage -= ms
    }
    if (this.renderShieldDamage < 0) {
      this.renderShieldDamage = 0
    }

    if (this.pendingDamage > 0) {
      let drainThisFrame = ms * pendingDamageDrainFactor
      if (this.pendingDamage < drainThisFrame) {
        drainThisFrame = this.pendingDamage
      }
      this.pendingDamage -= drainThisFrame
      this.shieldCapacity -= drainThisFrame
      this.renderShieldDamage += drainThisFrame * (this.shieldCapacityMax / 4)
    }

  }

  act({forward, rotate, grapple, gravgun, world}) {
    if (grapple) {
      // TODO: Spawn a player-owned 'grappler' entity into the world.
      // It has a 'sticky' collision behavior. If it hits a non-sticky object,
      // it makes that object the grapplePoint of the player.

    }
    if (gravgun) {
      if (this.holding === Pickup.gravitygun) {
        this.holding = ""
        world.objects.push(new GravityBeacon(
          this.position,
          this.facing,
          this.velocity,
          [this]
        ))
      }
    }
    this.facing = this.facing + (rotate / 180)
    if (this.facing > 2 * Math.PI) {
      this.facing = this.facing - (2 * Math.PI)
    }
    if (this.facing < 0) {
      this.facing = this.facing + (2 * Math.PI)
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
