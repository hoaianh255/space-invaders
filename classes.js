class Sprite {
  constructor({ position, imgSrc, scale = 1, lineImg = 1, frames = 1, offset = { x: 0, y: 0 } }, explodeSrc = '') {
    this.position = position;
    this.imgSrc = imgSrc;
    this.scale = scale;
    this.frames = frames;
    this.offset = offset;
    this.frameCurrent = 0;
    this.frameEllapse = 0;
    this.frameHolder = 5;
    this.image = new Image();
    this.image.src = this.imgSrc;
    this.lineImg = lineImg;
    this.explodeSrc = explodeSrc;
  }
  draw() {
    c.drawImage(
      this.image,
      this.frameCurrent * (this.image.width / this.frames),
      0,
      this.image.width / this.frames,
      this.image.height,
      this.position.x,
      this.position.y,
      (this.image.width / this.frames) * this.scale,
      this.image.height * this.scale);
  }
  animeFrames() {
    this.frameEllapse++;
    if (this.frameEllapse % this.frameHolder === 0) {
      if (this.frameCurrent < this.frames - 1) {
        this.frameCurrent++;
      } else this.frameCurrent = 0;
    }
  }
  update() {
    this.draw();
    if (this.frames > 1) this.animeFrames();
  }
}


class Player extends Sprite {
  constructor({ imgSrc, lineImg, scale = 1, frames = 1, offset = { x: 0, y: 0 }, explodeSrc }) {
    super({
      imgSrc,
      lineImg,
      scale,
      frames,
      offset,
      explodeSrc
    })
    this.position = {
      x: canvas.width / 2,
      y: canvas.height - 100
    }
    this.velocity = {
      x: 0,
      y: 0
    }
    this.rotation = 0;
    this.lastKey;
    this.explodeImg = new Image();
    this.explodeImg.src = explodeSrc;
  }
  draw() {
    if (this.lineImg > 1) {
      c.drawImage(
        this.image,
        this.frameCurrent * (this.image.width / this.frames),
        this.image.height / this.lineImg,
        this.image.width / this.frames,
        this.image.height / this.lineImg,
        this.position.x - this.offset.x,
        this.position.y - this.offset.y,
        (this.image.width / this.frames) * this.scale,
        (this.image.height / this.lineImg) * this.scale);
    } else {
      c.drawImage(
        this.image,
        this.frameCurrent * (this.image.width / this.frames),
        0,
        this.image.width / this.frames,
        this.image.height,
        this.position.x - this.offset.x,
        this.position.y - this.offset.y,
        (this.image.width / this.frames) * this.scale,
        this.image.height * this.scale);
    }
  }
  update() {
    this.draw();
    if (this.frames > 1) this.animeFrames();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
  explode() {
    this.image = this.explodeImg;
    this.frames = 5;
    this.lineImg = 1;
    this.frameCurrent = 0;
  }
}

class Projectile extends Sprite {
  constructor({ position, velocity, imgSrc, scale = 1, frames = 1, offset = { x: 0, y: 0 } }) {
    super({
      position,
      imgSrc,
      scale,
      frames,
      offset
    })
    this.position = position;
    this.velocity = velocity;
  }
  draw() {
    c.drawImage(
      this.image,
      this.frameCurrent * (this.image.width / this.frames),
      0,
      this.image.width / this.frames,
      this.image.height / this.lineImg,
      this.position.x + this.offset.x,
      this.position.y,
      (this.image.width / this.frames) * this.scale,
      (this.image.height / this.lineImg) * this.scale);
  }
  update() {
    this.draw();
    if (this.frames > 1) this.animeFrames();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}


class Invader extends Sprite {
  constructor({ position, velocity = { x: 0, y: 5 }, imgSrc, scale = 1, frames = 1, offset = { x: 0, y: 0 },explodeSrc }) {
    super({
      position,
      imgSrc,
      scale,
      frames,
      offset
    })
    this.velocity = velocity;
    this.explodeImg = new Image();
    this.explodeImg.src = explodeSrc;
  }

  update() {
    this.draw();
    if (this.frames > 1) this.animeFrames();
    this.position.y += this.velocity.y;
  }
  explode() {
    this.image = this.explodeImg;
    this.frames = 5;
    this.lineImg = 1;
    this.scale = 2; 
    this.frameCurrent = 0;
  }
  shoot(invaderProjectiles) {
    invaderProjectiles.push(new InvaderProjectile({
      position: {
        x: this.position.x + (this.image.width / this.frames) / 2,
        y: this.position.y + this.image.height
      },
      velocity: {
        x: 0,
        y: 5
      }
    }))
  }
}

class InvaderProjectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 3;
    this.height = 10;
  }
  draw() {
    c.fillStyle = 'white';
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
