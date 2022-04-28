
class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0
    }
    this.rotation = 0;
    this.scale = 0.15;
    // create image
    const image = new Image();
    image.src = './img/spaceship.png';
    // wait for the image finishes loading
    image.onload = () => {
      this.image = image;
      this.width = this.image.width * this.scale;
      this.height = this.image.width * this.scale;
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 50
      }
    }

  }
  draw() {
    // this rotate canvas
    c.save();

    c.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );

    c.rotate(this.rotation);
    // rotate back
    c.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2
    );
    if (this.image) {
      c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
    c.restore()
  }
  update() {
    if (this.image) {
      this.draw();
      this.position.x += this.velocity.x;
    }
  }
}

class Projectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;

    this.radius = 3;
  }
  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 1, Math.PI * 2);
    c.fillStyle = 'yellow';
    c.fill();
    c.closePath()
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Invader {
  constructor({ position = { x: 0, y: 0 } }) {
    this.position = position;
    this.velocity = { x: 0, y: 0 }
    this.scale = 1;

    const image = new Image();
    image.src = './img/invader.png';
    image.onload = () => {
      this.image = image;
      this.width = this.image.width * this.scale;
      this.height = this.image.height * this.scale;
    };
  }
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
  }

  update({ velocity }) {
    if (this.image) {
      this.draw();
      this.position.x += velocity.x;
      this.position.y += velocity.y;
    }
  }
}


class Grid {
  constructor() {
    this.position = { x: 0, y: 0 }
    this.velocity = { x: 3, y: 0 }
    this.invaders = [new Invader(this.position)];
    const columns = Math.floor(Math.random() * 8 + 2);
    const rows = Math.floor(Math.random() * 4 + 2);
    this.width = columns * 30;
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        this.invaders.push(new Invader({ position: { x: x * 30, y: y * 30 } }))
      }
    }
  }
  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.y =0;
    if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
      this.velocity.x = -this.velocity.x;
      this.velocity.y = 30;
    }
  }
}