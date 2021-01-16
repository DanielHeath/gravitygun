class TrackingCamera {
  constructor({source, dest, player, healthBarColor}) {
    this.source = source
    this.dest = dest
    this.player = player
    const dim = dest.getClientRects()[0]
    dest.width = dim.width
    dest.height = dim.height
    this.ctx = dest.getContext('2d')
    this.deathJitter = 1
  }

  draw() {
    const healthBarBorder = 30
    let widthfraction

    this.ctx.fillStyle = '#333';
    this.ctx.fillRect(0, 0, this.dest.width, this.dest.height);
    this.ctx.drawImage(
      this.source,
      // center on player
      this.player.position.x - (this.dest.width / 2),
      this.player.position.y - (this.dest.height / 2),
      this.dest.width,
      this.dest.height,
      0,0,this.dest.width,this.dest.height
    )

    // draw loss text
    if (!this.player.alive) {
      this.ctx.fillStyle='white'
      this.ctx.font = 'bold 48px serif';
      this.deathJitter += Math.random() > 0.7 ? 1 : -1
      if (this.deathJitter > 20) {
        this.deathJitter = 20
      }
      if (this.deathJitter < 0) {
        this.deathJitter = 2
      }
      this.ctx.fillText(
        "YOU DIED",
        this.dest.width / 2 + (this.deathJitter-Math.random()*2*this.deathJitter),
        this.dest.height / 2 + (this.deathJitter-Math.random()*2*this.deathJitter)
      )
    } else if (this.player.shieldCapacity <= 0) {
      // draw health bar
      this.ctx.strokeStyle = this.player.color;
      if (Math.random() > 0.5) {
        this.ctx.strokeStyle = '#ddd';
      }
      this.ctx.strokeRect(healthBarBorder, healthBarBorder, this.dest.width - 2 * healthBarBorder, healthBarBorder);
    } else {
      this.ctx.strokeStyle = this.player.color;
      this.ctx.strokeRect(healthBarBorder, healthBarBorder, this.dest.width - 2 * healthBarBorder, healthBarBorder);

      this.ctx.fillStyle = this.player.color;
      widthfraction = this.player.shieldCapacity / this.player.shieldCapacityMax;
      this.ctx.fillRect(
        healthBarBorder, healthBarBorder,
        widthfraction*(this.dest.width-healthBarBorder-healthBarBorder), healthBarBorder
      );
    }
  }

}