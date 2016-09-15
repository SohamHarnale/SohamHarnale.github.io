
//ENEMY
var Enemy = function(x,y) {
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
};

//PLAYER
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 0;
    this.y = 400;
};

var allEnemies = [];
var EnemyX = [50, 100, 150, 200, 250];
var EnemyY = [65, 145, 225];
var enemyCounter;
var enemy1, enemy2, enemy3, enemy4, enemy5;

// Creating 5 enemies whose x and y values are randonly chosen from EnemyX and EnemyY
enemy1 = new Enemy(EnemyX[Math.floor(Math.random() * 5)],EnemyY[Math.floor(Math.random() * 3)]);
enemy2 = new Enemy(EnemyX[Math.floor(Math.random() * 5)],EnemyY[Math.floor(Math.random() * 3)]);
enemy3 = new Enemy(EnemyX[Math.floor(Math.random() * 5)],EnemyY[Math.floor(Math.random() * 3)]);
enemy4 = new Enemy(EnemyX[Math.floor(Math.random() * 5)],EnemyY[Math.floor(Math.random() * 3)]);
enemy5 = new Enemy(EnemyX[Math.floor(Math.random() * 5)],EnemyY[Math.floor(Math.random() * 3)]);

allEnemies.push(enemy1,enemy2,enemy3,enemy4,enemy5);


var player = new Player();

//ENEMY PROTOTYPE

Enemy.prototype.update = function(dt) {
    this.x = this.x + (dt * 60);
    if(this.x > 505) {
        this.x = 0;
    }
};


Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//PLAYER PROTOTYPE

Player.prototype.update = function() {
    this.checkPlayerCollisions();
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


Player.prototype.checkPlayerCollisions = function() {
    var counter;
    if(this.y <60) {                                                                // If in Water
        this.reset();
    }
    for (counter in allEnemies) {
        if(allEnemies[counter].x+70 > this.x+10 && allEnemies[counter].x <this.x+85 && allEnemies[counter].y+5 >= this.y) {
            this.reset();
        }
    }
};


Player.prototype.reset = function() {
    this.y = 400;
};

Player.prototype.handleInput = function(keyPressed) {
    if(keyPressed === 'right' && this.x < 400) {
        this.x += 100;
    }

    if(keyPressed ==='left' && this.x > 82) {
        this.x -= 100;
    }

    if(keyPressed === 'down' && this.y < 400) {
        this.y += 85;
    }

    if(keyPressed === 'up' && this.y > 52) {
        this.y -= 85;
    }
};


document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});