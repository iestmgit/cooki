// تنظیمات اولیه
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

// متغیرهای بازی
let gameRunning = false;
let lastTime = performance.now();
let score1 = 0;
let score2 = 0;
let particles = [];

// کلاس بازیکن
class Player {
    constructor(x, y, color, keys) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.speed = 200;
        this.color = color;
        this.keys = keys;
        this.bullets = [];
        this.shootCooldown = 0;
        this.lives = 3;
        this.shootKey = keys.shoot;
    }
    
    update(dt) {
        if (this.keys.up && this.y > 0) this.y -= this.speed * dt;
        if (this.keys.down && this.y < canvas.height - this.height) this.y += this.speed * dt;
        if (this.keys.left && this.x > 0) this.x -= this.speed * dt;
        if (this.keys.right && this.x < canvas.width - this.width) this.x += this.speed * dt;
        
        this.shootCooldown -= dt;
        if (this.keys.shoot && this.shootCooldown <= 0) {
            this.shoot();
            this.shootCooldown = 0.2;
        }
        
        this.bullets = this.bullets.filter(bullet => {
            bullet.y -= bullet.speed * dt;
            return bullet.y > 0;
        });
    }
    
    shoot() {
        this.bullets.push({
            x: this.x + this.width/2,
            y: this.y,
            speed: 500,
            color: this.color
        });
    }
    
    draw() {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        
        ctx.beginPath();
        ctx.moveTo(this.x + this.width/2, this.y);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.fill();
        
        this.bullets.forEach(bullet => {
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, 5, 0, Math.PI * 2);
            ctx.fillStyle = bullet.color;
            ctx.fill();
        });
        
        ctx.restore();
    }
}

// کلاس دشمن
class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.speed = 100 + Math.random() * 150;
        this.direction = Math.random() * Math.PI * 2;
        this.color = ['#ff4444', '#ffaa00', '#ff00ff'][Math.floor(Math.random() * 3)];
        this.hp = 2;
    }
    
    update(dt) {
        this.direction += (Math.random() - 0.5) * 0.5;
        this.x += Math.cos(this.direction) * this.speed * dt;
        this.y += Math.sin(this.direction) * this.speed * dt;
        
        if (this.x < 0 || this.x > canvas.width - this.width) {
            this.direction = Math.PI - this.direction;
        }
        if (this.y < 0 || this.y > canvas.height - this.height) {
            this.direction = -this.direction;
        }
        
        this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height - this.height, this.y));
    }
    
    draw() {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5 - Math.PI/2;
            const radius = this.width / 2;
            const x = this.x + this.width/2 + Math.cos(angle) * radius;
            const y = this.y + this.height/2 + Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
}

// کلاس ذرات
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 300;
        this.vy = (Math.random() - 0.5) * 300;
        this.life = 0.5 + Math.random() * 1;
        this.color = color;
        this.size = 3 + Math.random() * 3;
    }
    
    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.life -= dt;
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// ایجاد بازیکن‌ها
let player1 = new Player(100, 250, '#00ff88', {
    up: 'KeyW', down: 'KeyS', left: 'KeyA', right: 'KeyD', shoot: 'KeyF'
});

let player2 = new Player(650, 250, '#00aaff', {
    up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', shoot: 'Enter'
});

let enemies = [];
let enemySpawnTimer = 0;

// مدیریت کلیدها
const keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});
document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// شروع بازی (با Event Listener درست شد)
function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    gameRunning = true;
    score1 = 0;
    score2 = 0;
    player1.lives = 3;
    player2.lives = 3;
    enemies = [];
    particles = [];
    
    lastTime = performance.now(); // تنظیم مجدد زمان برای جلوگیری از پرش
    requestAnimationFrame(gameLoop);
}

// اضافه کردن شنونده رویداد به دکمه
document.getElementById('startBtn').addEventListener('click', startGame);

// حلقه بازی
function gameLoop(currentTime) {
    if (!gameRunning) return;
    
    const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
    lastTime = currentTime;
    
    player1.keys.up = keys['KeyW'];
    player1.keys.down = keys['KeyS'];
    player1.keys.left = keys['KeyA'];
    player1.keys.right = keys['KeyD'];
    player1.keys.shoot = keys['KeyF'];
    
    player2.keys.up = keys['ArrowUp'];
    player2.keys.down = keys['ArrowDown'];
    player2.keys.left = keys['ArrowLeft'];
    player2.keys.right = keys['ArrowRight'];
    player2.keys.shoot = keys['Enter'];
    
    player1.update(dt);
    player2.update(dt);
    
    enemySpawnTimer -= dt;
    if (enemySpawnTimer <= 0) {
        enemies.push(new Enemy(Math.random() * canvas.width, Math.random() * 200));
        enemySpawnTimer = 2;
    }
    
    enemies = enemies.filter(enemy => {
        enemy.update(dt);
        
        player1.bullets = player1.bullets.filter(bullet => {
            if (bullet.x > enemy.x && bullet.x < enemy.x + enemy.width &&
                bullet.y > enemy.y && bullet.y < enemy.y + enemy.height) {
                enemy.hp--;
                if (enemy.hp <= 0) {
                    score1 += 100;
                    createExplosion(enemy.x, enemy.y, enemy.color);
                    return false;
                }
                return false;
            }
            return true;
        });
        
        player2.bullets = player2.bullets.filter(bullet => {
            if (bullet.x > enemy.x && bullet.x < enemy.x + enemy.width &&
                bullet.y > enemy.y && bullet.y < enemy.y + enemy.height) {
                enemy.hp--;
                if (enemy.hp <= 0) {
                    score2 += 100;
                    createExplosion(enemy.x, enemy.y, enemy.color);
                    return false;
                }
                return false;
            }
            return true;
        });
        
        if (enemy.x < player1.x + player1.width && enemy.x + enemy.width > player1.x &&
            enemy.y < player1.y + player1.height && enemy.y + enemy.height > player1.y) {
            player1.lives--;
            createExplosion(player1.x, player1.y, '#ff0000');
            return false;
        }
        
        if (enemy.x < player2.x + player2.width && enemy.x + enemy.width > player2.x &&
            enemy.y < player2.y + player2.height && enemy.y + enemy.height > player2.y) {
            player2.lives--;
            createExplosion(player2.x, player2.y, '#ff0000');
            return false;
        }
        
        return true;
    });
    
    particles = particles.filter(particle => {
        particle.update(dt);
        return particle.life > 0;
    });
    
    draw();
    
    document.getElementById('score1').textContent = `🟢 بازیکن ۱: ${score1}`;
    document.getElementById('score2').textContent = `🔵 بازیکن ۲: ${score2}`;
    
    requestAnimationFrame(gameLoop);
}

// ایجاد انفجار
function createExplosion(x, y, color) {
    for (let i = 0; i < 15; i++) {
        particles.push(new Particle(x, y, color));
    }
}

// رسم بازی
function draw() {
    ctx.fillStyle = '#0f0c29';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
    
    player1.draw();
    player2.draw();
    
    enemies.forEach(enemy => enemy.draw());
    
    particles.forEach(particle => particle.draw());
    
    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(`♥ ${player1.lives}`, 20, 30);
    
    ctx.fillStyle = '#00aaff';
    ctx.fillText(`♥ ${player2.lives}`, canvas.width - 80, 30);
}
