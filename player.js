class Player {
  constructor(position, color, ) {
    this.position = position
    this.color = color
    this.facing = Math.PI * Math.random()
    this.holding = null
    this.grapplePoint = null
    this.radius = 55
    this.velocity = {x: 0, y: 0}
    this.mass = 8

    this.alive = true
    this.shieldCapacityMax = 40000
    this.shieldCapacity = this.shieldCapacityMax
    this.shieldDamageReduction = 4000
    this.pendingDamage = 0

    // True if should render a shield flash
    this.renderShieldDamage = 0
  }

  receiveHitWithImpulse(impulseMagnitude, elasticity) {
    let hitEnergyLoss = (impulseMagnitude/elasticity) * (1-elasticity)
    if (this.shieldCapacity > 0) {
      hitEnergyLoss -= this.shieldDamageReduction
    } else {
      // Collision without shields
      this.alive = false
    }

    if (hitEnergyLoss < 0) {
      return
    }
    console.log(impulseMagnitude, elasticity, hitEnergyLoss)
    this.pendingDamage += hitEnergyLoss
  }

  step(ms, {forward, rotate, grapple}) {
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

    if (this.pendingDamage > (ms*100)) {
      this.pendingDamage -= (ms*100)
      this.shieldCapacity -= (ms*100)
      // 10-ish frames of damage, for each ~1600 damage taken.
      this.renderShieldDamage += (ms * 10)
    }

    if (grapple) {
      // TODO: Spawn a player-owned 'grappler' entity into the world.
      // It has a 'sticky' collision behavior. If it hits a non-sticky object,
      // it makes that object the grapplePoint of the player.

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
