const canvas = document.querySelector('canvas');
// create context 
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 650;

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  w: {
    pressed: false
  },
  s: {
    pressed: false
  },
  space: {
    pressed: false
  }
}
// Object
const spaceship = new Player({
  imgSrc: './img/Spaceship-shooter-environment/spritesheets/ship.png',
  frames: 5,
  scale: 2,
  lineImg: 2,
  explodeSrc: './img/Spaceship-shooter-environment/spritesheets/explosion.png'
});

const projectiles = [];
const enemies = [];

// const grids = [];
const background = new Sprite(
  {
    position: { x: 0, y: 0 },
    imgSrc: './img/Spaceship-shooter-environment/backgrounds/desert-backgorund.png',
    scale: 4
  }
)
// value
let randomInterval = Math.floor(Math.random() * 200 + 100);

const invaderProjectiles = [];

const game = {
  over: false,
  active: true
}

let scored = 0;
let scoredElement = document.querySelector('#scored');
scoredElement.innerHTML = scored;
// function
function generateRandomEnemy(min, max) {

  // find diff
  let difference = max - min;

  // generate random number 
  let rand = Math.random();

  // multiply with difference 
  rand = Math.floor( rand * difference);

  // add with min value 
  rand = rand + min;

  return rand;
}


// animate
let frames = 0;
function animate() {
  if (game.active === false) return;
  requestAnimationFrame(animate)
  background.update();
  spaceship.update();
  // movement player
  if (keys.a.pressed && spaceship.lastKey === 'a' && spaceship.position.x >= 0) {
    spaceship.velocity.x = -5;
    spaceship.velocity.y = 0;
    spaceship.rotation = -0.25
  } else if (keys.d.pressed && spaceship.lastKey === 'd' && spaceship.position.x + spaceship.image.width <= canvas.width) {
    spaceship.velocity.x = 5;
    spaceship.velocity.y = 0;
    spaceship.rotation = 0.25
  } else if (keys.w.pressed && spaceship.lastKey === 'w' && spaceship.position.y + spaceship.image.height >= 0) {
    spaceship.velocity.y = -5;
    spaceship.velocity.x = 0;

  }
  else if (keys.s.pressed && spaceship.lastKey === 's' && spaceship.position.y + spaceship.image.height <= canvas.height) {
    spaceship.velocity.y = 5;
    spaceship.velocity.x = 0;

  }
  else {
    spaceship.velocity.x = 0;
    spaceship.velocity.y = 0;
    spaceship.rotation = 0;
  }

  // projectile of invaders
  invaderProjectiles.forEach((invaderProjectile, index) => {
    if (invaderProjectile.position.y + invaderProjectile.height > canvas.height) {
      setTimeout(() => {
        invaderProjectiles.splice(index, 1);
      }, 0);
    } else {
      invaderProjectile.update();
    }
    // player get shot
    if (
      invaderProjectile.position.y + invaderProjectile.height >= spaceship.position.y
      && invaderProjectile.position.y + invaderProjectile.height <= spaceship.position.y + spaceship.image.height
      && invaderProjectile.position.x + invaderProjectile.width >= spaceship.position.x
      && invaderProjectile.position.x <= spaceship.position.x + (spaceship.image.width / spaceship.frames) * spaceship.scale
    ) {
      setTimeout(() => {
        invaderProjectiles.splice(index, 1);
        spaceship.explode();
        // end game
        game.over = true;
      }, 0);
      setTimeout(() => {
        game.active = false
        const alert = document.querySelector('#alert');
        alert.innerHTML = 'Game over';
        alert.style.opacity = 1;
      }, 500);
    }
  })
  // create enemies
  enemies.forEach((enemy, enemyID) => {
    enemy.update();
    // invader shoot
    if (frames % 150 === 0 && enemies.length > 0) {
      enemy.shoot(invaderProjectiles);
    }
    // create invader and movement
      // enemy get shot
      projectiles.forEach((projectile, projectileID) => {
        if (
          projectile.position.y - projectile.image.height <= enemy.position.y + enemy.image.height
          && projectile.position.y + projectile.image.height >= enemy.position.y
          && projectile.position.x + (projectile.image.width / projectile.frames) * projectile.scale >= enemy.position.x
          && projectile.position.x <= enemy.position.x + (enemy.image.width / enemy.frames) * enemy.scale
        ) {
          setTimeout(() => {
            const enemyFound = enemies.find(enemyF => enemyF === enemy);
            const projectileFound = projectiles.find(projectileF => projectileF === projectile);
            // remove invader and projectile
            if (enemyFound && projectileFound) {
              enemyFound.explode();
              projectiles.splice(projectileID, 1);
              scored += 10;
              scoredElement.innerHTML = scored;
              setTimeout(() => {
                enemies.splice(enemyID, 1);
              }, 200);
            }
          }, 0);
        }
      });

  })
  
  // player projectiles
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
  // spawning enemies

  if (frames % randomInterval === 0) {
    enemies.push(new Invader(
      {
        position: { 
          x: generateRandomEnemy(100,canvas.width - 100),
          y: -60 
        },
        velocity: {
          x: 0,
          y: 0.5
        },
        scale: 1.2,
        imgSrc : './img/Spaceship-shooter-environment/spritesheets/enemy-big.png',
        frames: 2,
        explodeSrc: './img/Spaceship-shooter-environment/spritesheets/explosion.png'
      }
    ));
    frames = 0;
    randomInterval = Math.floor(Math.random() * 200 + 100);
  }


  frames++;
}
animate()

// events
window.addEventListener('keydown', (event) => {
  if (game.over) return;
  switch (event.key) {
    case 'a':
      keys.a.pressed = true;
      spaceship.lastKey = 'a';
      break;
    case 'd':
      keys.d.pressed = true;
      spaceship.lastKey = 'd';
      break;
    case 'w':
      keys.w.pressed = true;
      spaceship.lastKey = 'w';
      break;
    case 's':
      keys.s.pressed = true;
      spaceship.lastKey = 's';
      break
    case ' ': {
      keys.space.pressed = true;
      projectiles.push(new Projectile({
        position: {
          x: spaceship.position.x,
          y: spaceship.position.y
        },
        velocity: {
          x: 0,
          y: -10
        },
        imgSrc: './img/Spaceship-shooter-environment/spritesheets/laser-bolts.png',
        frames: 2,
        scale: 1,
        offset: {
          x: 5,
          y: 10
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
    case 'w':
      keys.w.pressed = false;
      break;
    case 's':
      keys.s.pressed = false;
      break;
    case ' ': {
      keys.space.pressed = false;
    }
  }
})
