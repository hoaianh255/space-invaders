const canvas = document.querySelector('canvas');
// create context 
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  space: {
    pressed: false
  }
}
// Object
const spaceship1 = new Player();

const projectiles = [];

const grids = [new Grid()];
// value
let randomInterval = Math.floor(Math.random() * 500 + 500);
// animate

let frames = 0;
function animate() {
  requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height);
  spaceship1.update();
  grids.forEach(grid => {
    grid.update();
    grid.invaders.forEach(invader => {
      invader.update({velocity: {x: grid.velocity.x, y: grid.velocity.y}})
    })
  })
  projectiles.forEach((projectile, index) => {
    // remove object in projectiles
    if (projectile.position.y + projectile.radius <= 0) {
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    } else {
      projectile.update();
    }
  })
  // add grid
  if(  frames % randomInterval === 0){
    grids.push(new Grid());
    frames = 0;
    randomInterval = Math.floor(Math.random() * 500 + 500);
  }
  // movement player
  if (keys.a.pressed && spaceship1.position.x >= 0) {
    spaceship1.velocity.x = -7;
    spaceship1.rotation = -0.25
  } else if (keys.d.pressed && spaceship1.position.x + spaceship1.width <= canvas.width) {
    spaceship1.velocity.x = 7;
    spaceship1.rotation = 0.25
  } else {
    spaceship1.velocity.x = 0;
    spaceship1.rotation = 0;
  }
  frames++;
}
animate()

// events
window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'a':
      keys.a.pressed = true;
      break;
    case 'd':
      keys.d.pressed = true;
      break;
    case ' ': {
      keys.space.pressed = true;
      console.log(projectiles);
      projectiles.push(new Projectile({
        position: {
          x: spaceship1.position.x + spaceship1.width / 2,
          y: spaceship1.position.y
        },
        velocity: {
          x: 0,
          y: -10
        }

      }))
    }
  }
});

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'a':
      keys.a.pressed = false;
      break;
    case 'd':
      keys.d.pressed = false;
      break;
    case ' ': {
      keys.space.pressed = false;
    }
  }
})
