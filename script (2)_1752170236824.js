// Основной игровой файл - оптимизированный и модульный

// Игровые переменные
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Состояние игры
let gameState = {
  gold: GameConfig.player.startGold,
  wave: 0,
  baseHP: GameConfig.player.baseHP,
  maxBaseHP: GameConfig.player.baseHP,
  baseLevel: GameConfig.player.baseLevel,
  arrows: GameConfig.player.startArrows,
  reloading: false,
  paused: false,
  gameStarted: false,
  passiveGoldTimer: 0,

  // Системы
  achievementSystem: new AchievementSystem(),

  // Оружие игрока
  playerWeapon: { ...GameConfig.weapons.simple, type: 'simple' },

  // Улучшения
  upgrades: {
    archerDamage: { cost: GameConfig.upgrades.archerDamage.baseCost, level: 0 },
    fireRate: { cost: GameConfig.upgrades.fireRate.baseCost, level: 0 },
    baseHP: { cost: GameConfig.upgrades.baseHP.baseCost, level: 0 },
    baseLevel: { cost: GameConfig.upgrades.baseLevel.baseCost, level: 0 }
  },

  updateUI: function() {
    document.getElementById('gold').textContent = this.gold;
    document.getElementById('arrows').textContent = this.reloading ? "Перезарядка..." : this.arrows;
    document.getElementById('baseLevel').textContent = this.baseLevel;
    document.getElementById('waveCounter').textContent = `Волна: ${this.wave}`;

    const healthPercentage = (this.baseHP / this.maxBaseHP) * 100;
    document.getElementById('baseHealth').style.width = healthPercentage + '%';

    if (this.reloading) {
      document.getElementById('reloadStatus').innerHTML = '<span class="reload-indicator">🔄 Перезарядка...</span>';
    } else {
      document.getElementById('reloadStatus').innerHTML = '';
    }
  }
};

// Звуковые настройки
let soundEnabled = true;
let soundVolume = 0.3;

// Игровые объекты
let enemies = [];
let soldiers = [];
let soldierQueue = [];
let bullets = [];
let particles = [];
let explosions = [];

// Окружение
let backgroundStars = [];
let clouds = [];
let trees = [];
let rocks = [];
let grass = [];

// Камера и управление
let camera = { x: 0, y: 0 };
let keys = {};
let touchStart = null;
let isDragging = false;

// Константы
const BASE_X = 650;
const BASE_Y = 250;
const BASE_WIDTH = 100;
const BASE_HEIGHT = 100;

// Звуковые функции
function playSound(soundId) {
  if (!soundEnabled) return;
  const audio = document.getElementById(soundId);
  if (audio) {
    audio.currentTime = 0;
    audio.volume = soundVolume;
    audio.play().catch(() => {});
  }
}

// Уведомления
function showNotification(text, color = "#4CAF50") {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = text;
  notification.style.background = color;
  document.body.appendChild(notification);

  setTimeout(() => {
    if (document.body.contains(notification)) {
      document.body.removeChild(notification);
    }
  }, 3000);
}

// Создание частиц и эффектов с использованием object pooling
function createParticle(x, y, text, color = "#FFFFFF") {
  const particle = ObjectPools.particles.get();
  particle.x = x;
  particle.y = y;
  particle.text = text;
  particle.color = color;
  particle.life = 60;
  particle.vy = -2;
}

function createExplosion(x, y, radius) {
  const explosion = ObjectPools.explosions.get();
  explosion.x = x;
  explosion.y = y;
  explosion.radius = 0;
  explosion.maxRadius = radius;
  explosion.life = 20;
}

function createBullet(x, y, targetX, targetY, damage, color, isPlayer = false) {
  const bullet = ObjectPools.bullets.get();
  bullet.x = x;
  bullet.y = y;
  bullet.targetX = targetX;
  bullet.targetY = targetY;
  bullet.speed = 8;
  bullet.damage = damage;
  bullet.color = color;
  bullet.isPlayer = isPlayer;
}

// Генерация фона
function generateBackground() {
  for (let i = 0; i < 50; i++) {
    backgroundStars.push({
      x: Math.random() * 1600,
      y: Math.random() * 300,
      size: Math.random() * 2 + 1,
      twinkle: Math.random() * 100
    });
  }

  for (let i = 0; i < 8; i++) {
    clouds.push({
      x: Math.random() * 1600,
      y: Math.random() * 150 + 50,
      size: Math.random() * 60 + 40,
      speed: Math.random() * 0.2 + 0.1
    });
  }

  for (let i = 0; i < 15; i++) {
    trees.push({
      x: Math.random() * 1600,
      y: 350 + Math.random() * 100,
      height: Math.random() * 40 + 30,
      width: Math.random() * 15 + 10
    });
  }

  for (let i = 0; i < 20; i++) {
    rocks.push({
      x: Math.random() * 1600,
      y: 400 + Math.random() * 150,
      size: Math.random() * 20 + 10
    });
  }

  for (let i = 0; i < 100; i++) {
    grass.push({
      x: Math.random() * 1600,
      y: 380 + Math.random() * 180,
      height: Math.random() * 15 + 5
    });
  }
}

// Рисование фона
function drawBackground() {
  // Звезды
  backgroundStars.forEach(star => {
    const alpha = (Math.sin(star.twinkle) + 1) / 2;
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(star.x - camera.x * 0.1, star.y - camera.y * 0.1, star.size, 0, GameConfig.TWO_PI);
    ctx.fill();
    star.twinkle += 0.1;
  });

  // Облака
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  clouds.forEach(cloud => {
    ctx.beginPath();
    ctx.arc(cloud.x - camera.x * 0.3, cloud.y - camera.y * 0.3, cloud.size, 0, GameConfig.TWO_PI);
    ctx.arc(cloud.x - camera.x * 0.3 + cloud.size * 0.5, cloud.y - camera.y * 0.3, cloud.size * 0.8, 0, GameConfig.TWO_PI);
    ctx.arc(cloud.x - camera.x * 0.3 - cloud.size * 0.5, cloud.y - camera.y * 0.3, cloud.size * 0.8, 0, GameConfig.TWO_PI);
    ctx.fill();
    cloud.x += cloud.speed;
    if (cloud.x > 1600) cloud.x = -100;
  });

  // Деревья
  trees.forEach(tree => {
    const treeX = tree.x - camera.x * 0.8;
    const treeY = tree.y - camera.y * 0.8;
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(treeX - tree.width/4, treeY, tree.width/2, tree.height);
    ctx.fillStyle = "#228B22";
    ctx.beginPath();
    ctx.arc(treeX, treeY - tree.height/3, tree.width, 0, GameConfig.TWO_PI);
    ctx.fill();
  });

  // Камни
  ctx.fillStyle = "#696969";
  rocks.forEach(rock => {
    ctx.beginPath();
    ctx.arc(rock.x - camera.x, rock.y - camera.y, rock.size, 0, GameConfig.TWO_PI);
    ctx.fill();
  });

  // Трава
  ctx.strokeStyle = "#32CD32";
  ctx.lineWidth = 2;
  grass.forEach(g => {
    ctx.beginPath();
    ctx.moveTo(g.x - camera.x, g.y - camera.y);
    ctx.lineTo(g.x - camera.x + Math.sin(Date.now() * 0.001 + g.x) * 2, g.y - g.height - camera.y);
    ctx.stroke();
  });
}

// Рисование базы
function drawBase() {
  const x = BASE_X - camera.x;
  const y = BASE_Y - camera.y;

  ctx.fillStyle = "#8B4513";
  ctx.fillRect(x, y, BASE_WIDTH, BASE_HEIGHT);

  ctx.strokeStyle = "#654321";
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, BASE_WIDTH, BASE_HEIGHT);

  // Зубцы крепости
  ctx.fillStyle = "#654321";
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(x + i * 20, y - 15, 15, 15);
  }

  // Флаг
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(x + BASE_WIDTH/2 - 2, y - 40, 4, 30);
  ctx.fillStyle = "#4CAF50";
  ctx.fillRect(x + BASE_WIDTH/2 + 2, y - 35, 20, 15);

  // Полоска здоровья базы
  const healthBarWidth = BASE_WIDTH + 20;
  const healthPercentage = gameState.baseHP / gameState.maxBaseHP;

  ctx.fillStyle = "#FF0000";
  ctx.fillRect(x - 10, y - 25, healthBarWidth, 8);
  ctx.fillStyle = "#00FF00";
  ctx.fillRect(x - 10, y - 25, healthBarWidth * healthPercentage, 8);

  // Текст уровня базы
  ctx.fillStyle = "#FFD700";
  ctx.font = "bold 16px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`Lv.${gameState.baseLevel}`, x + BASE_WIDTH/2, y - 35);
}

// Стрельба игрока
function handleShoot(event) {
  if (gameState.reloading || gameState.arrows <= 0 || gameState.paused) return;

  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left + camera.x;
  const mouseY = event.clientY - rect.top + camera.y;

  const playerX = BASE_X + 50;
  const playerY = BASE_Y + 50;

  // Создание пули игрока
  createBullet(playerX, playerY, mouseX, mouseY, gameState.playerWeapon.damage, "#FFD700", true);
  gameState.arrows--;
  playSound('shootSound');

  // Проверка попадания
  enemies.forEach(enemy => {
    const dist = Math.hypot(enemy.x - mouseX, enemy.y - mouseY);
    if (dist < 30) {
      let damage = gameState.playerWeapon.damage;

      if (gameState.playerWeapon.aoe) {
        enemies.forEach(e => {
          const aoeDist = Math.hypot(e.x - enemy.x, e.y - enemy.y);
          if (aoeDist <= 60) {
            e.hp -= damage;
            createParticle(e.x, e.y, `-${damage}`, "#FFD700");
          }
        });
        createExplosion(enemy.x, enemy.y, 60);
      } else {
        enemy.hp -= damage;
        createParticle(enemy.x, enemy.y, `-${damage}`, "#FFD700");
      }
    }
  });

  // Автоперезарядка
  if (gameState.arrows === 0) {
    gameState.reloading = true;
    showNotification("Перезарядка...", "#FF8844");
    setTimeout(() => {
      gameState.arrows = gameState.playerWeapon.maxArrows;
      gameState.reloading = false;
      showNotification("Перезарядка завершена!");
      gameState.updateUI();
    }, gameState.playerWeapon.reloadTime);
  }
  gameState.updateUI();
}

// Старт новой волны - исправлен баланс
function startWave() {
  if (enemies.length > 0) {
    showNotification("Дождитесь окончания текущей волны!", "#FF8844");
    return;
  }

  gameState.wave++;
  gameState.gameStarted = true;

  // Обновляем статистику
  gameState.achievementSystem.updateStatistic('waveReached', gameState.wave);

  // Награда за волну
  const waveReward = GameConfig.waves.waveReward(gameState.wave);
  gameState.gold += waveReward;
  showNotification(`Волна ${gameState.wave} началась! +${waveReward} золота`);

  // Спавн врагов - исправленный баланс
  const enemyCount = GameConfig.waves.enemiesPerWave(gameState.wave);
  for (let i = 0; i < enemyCount; i++) {
    setTimeout(() => spawnEnemy(), i * GameConfig.waves.spawnDelay);
  }

  gameState.updateUI();
}

// Спавн врага
function spawnEnemy() {
  const types = Object.keys(GameConfig.enemies);
  let type;

  if (gameState.wave % GameConfig.waves.bossWaveInterval === 0 && gameState.wave > 0) {
    const bossTypes = types.filter(t => GameConfig.enemies[t].isBoss);
    type = bossTypes[Math.floor(Math.random() * bossTypes.length)];
    showBossWarning(GameConfig.enemies[type].name);
  } else {
    const availableTypes = types.filter(t => !GameConfig.enemies[t].isBoss);
    type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
  }

  const enemy = new Enemy(-50, 200 + Math.random() * 200, type);
  // Масштабирование по волнам
  enemy.hp *= (1 + gameState.wave * 0.1);
  enemy.maxHP = enemy.hp;
  enemy.reward *= (1 + gameState.wave * 0.05);

  enemies.push(enemy);
}

// Предупреждение о боссе
function showBossWarning(bossName) {
  const warning = document.createElement('div');
  warning.className = 'boss-warning';
  warning.innerHTML = `⚠️ БОСС ПОЯВЛЯЕТСЯ! ⚠️<br>${bossName}`;
  document.body.appendChild(warning);

  setTimeout(() => {
    if (document.body.contains(warning)) document.body.removeChild(warning);
  }, 3000);
}

// Покупка солдата
function buySoldier(type) {
  const config = GameConfig.soldiers[type];
  if (gameState.gold >= config.cost) {
    gameState.gold -= config.cost;

    soldierQueue.push({
      type: type,
      spawnTime: Date.now() + 2000
    });

    // Увеличиваем стоимость
    GameConfig.soldiers[type].cost = Math.floor(config.cost * 1.15);

    // Обновляем статистику
    gameState.achievementSystem.incrementStatistic('soldiersHired');

    playSound('soldierBuySound');
    showNotification(`${config.name || type} куплен! Появится через 2 сек.`);
    gameState.updateUI();
    updateShopPrices();
  } else {
    showNotification("Недостаточно золота!", "#FF4444");
  }
}

// Обработка очереди солдат
function processSoldierQueue() {
  const now = Date.now();
  for (let i = soldierQueue.length - 1; i >= 0; i--) {
    const queueItem = soldierQueue[i];
    if (now >= queueItem.spawnTime) {
      const soldier = new Soldier(
        BASE_X + Math.random() * 100 - 50,
        BASE_Y + Math.random() * 100 - 50,
        queueItem.type
      );
      soldiers.push(soldier);
      soldierQueue.splice(i, 1);
      showNotification(`${GameConfig.soldiers[queueItem.type].name || queueItem.type} готов к бою!`, "#4CAF50");
    }
  }
}

// Покупка улучшений
function buyUpgrade(type) {
  const upgrade = gameState.upgrades[type];
  const config = GameConfig.upgrades[type];

  if (gameState.gold >= upgrade.cost) {
    gameState.gold -= upgrade.cost;
    upgrade.level++;

    switch (type) {
      case 'archerDamage':
        GameConfig.soldiers.archer.damage = Math.floor(GameConfig.soldiers.archer.damage * config.multiplier);
        showNotification("Урон лучников увеличен!");
        break;
      case 'fireRate':
        Object.keys(GameConfig.soldiers).forEach(key => {
          GameConfig.soldiers[key].cooldown = Math.floor(GameConfig.soldiers[key].cooldown * config.multiplier);
        });
        showNotification("Скорость стрельбы увеличена!");
        break;
      case 'baseHP':
        gameState.maxBaseHP += config.bonus;
        gameState.baseHP += config.bonus;
        showNotification("Здоровье базы увеличено!");
        break;
      case 'baseLevel':
        gameState.baseLevel++;
        gameState.maxBaseHP += config.bonus;
        gameState.baseHP += config.bonus;
        showNotification("Уровень базы повышен!");
        break;
    }

    upgrade.cost = Math.floor(upgrade.cost * config.costIncrease);
    playSound('soldierBuySound');
    gameState.updateUI();
    updateShopPrices();
  } else {
    showNotification("Недостаточно золота!", "#FF4444");
  }
}

// Покупка оружия
function buyWeapon(type) {
  const weapon = GameConfig.weapons[type];
  if (gameState.gold >= weapon.cost) {
    gameState.gold -= weapon.cost;
    gameState.playerWeapon = { ...weapon, type: type };
    gameState.arrows = weapon.maxArrows;

    playSound('soldierBuySound');
    showNotification(`Оружие улучшено: ${type}!`, "#9C27B0");
    gameState.updateUI();
  } else {
    showNotification("Недостаточно золота!", "#FF4444");
  }
}

// Покупка предметов
function buyItem(type) {
  const items = {
    arrows: { 
      cost: 50, 
      effect: () => { 
        gameState.arrows = Math.min(gameState.arrows + 10, gameState.playerWeapon.maxArrows); 
        showNotification("+10 стрел!"); 
      } 
    },
    heal: { 
      cost: 150, 
      effect: () => { 
        gameState.baseHP = Math.min(gameState.baseHP + 50, gameState.maxBaseHP); 
        showNotification("База восстановлена!"); 
      } 
    },
    bomb: { 
      cost: 400, 
      effect: () => { 
        enemies.forEach(enemy => {
          enemy.hp = 0;
          createExplosion(enemy.x, enemy.y, 50);
        });
        showNotification("Все враги уничтожены!", "#FF6B35");
      }
    }
  };

  const item = items[type];
  if (gameState.gold >= item.cost) {
    gameState.gold -= item.cost;
    item.effect();
    playSound('goldSound');
    gameState.updateUI();
  } else {
    showNotification("Недостаточно золота!", "#FF4444");
  }
}

// Обновление цен в интерфейсе
function updateShopPrices() {
  // Обновляем цены солдат
  Object.keys(GameConfig.soldiers).forEach(type => {
    const element = document.getElementById(`${type}-cost`);
    if (element) element.textContent = GameConfig.soldiers[type].cost;
  });

  // Обновляем улучшения
  Object.keys(gameState.upgrades).forEach(type => {
    const costElement = document.getElementById(`${type.replace(/([A-Z])/g, '-$1').toLowerCase()}-cost`);
    const levelElement = document.getElementById(`${type.replace(/([A-Z])/g, '-$1').toLowerCase()}-level`);
    if (costElement) costElement.textContent = gameState.upgrades[type].cost;
    if (levelElement) levelElement.textContent = gameState.upgrades[type].level;
  });
}

// Основной игровой цикл
function gameLoop() {
  if (!gameState.paused) {
    // Пассивное золото
    gameState.passiveGoldTimer++;
    if (gameState.passiveGoldTimer >= 300) {
      gameState.gold += 5 + Math.floor(gameState.wave / 3);
      gameState.passiveGoldTimer = 0;
    }

    // Обработка очереди солдат
    processSoldierQueue();

    // Обновление врагов
    enemies.forEach((enemy, index) => {
      if (enemy.hp <= 0) {
        gameState.gold += enemy.reward;
        gameState.achievementSystem.incrementStatistic('enemiesKilled');
        if (enemy.isBoss) {
          gameState.achievementSystem.incrementStatistic('bossesKilled');
        }
        createExplosion(enemy.x, enemy.y, 30);
        enemies.splice(index, 1);
        playSound('goldSound');
        return;
      }

      const damage = enemy.update(BASE_X, BASE_Y);
      if (damage > 0) {
        gameState.baseHP -= damage;
        createParticle(BASE_X + 50, BASE_Y + 50, `-${damage}`, "#FF0000");

        if (gameState.baseHP <= 0) {
          gameOver();
        }
      }
    });

    // Обновление солдат
    soldiers.forEach((soldier, index) => {
      if (soldier.hp <= 0) {
        soldiers.splice(index, 1);
        return;
      }

      const actions = soldier.update(enemies, soldiers, BASE_X, BASE_Y);
      if (actions) {
        actions.forEach(action => {
          switch (action.type) {
            case 'bullet':
              createBullet(action.x, action.y, action.targetX, action.targetY, action.damage, action.color);
              break;
            case 'particle':
              createParticle(action.x, action.y, action.text, action.color);
              break;
            case 'explosion':
              createExplosion(action.x, action.y, action.radius);
              break;
          }
        });
        playSound('shootSound');
      }
    });

    // Обновление пуль
    ObjectPools.bullets.active.forEach((bullet, index) => {
      const dx = bullet.targetX - bullet.x;
      const dy = bullet.targetY - bullet.y;
      const distance = Math.hypot(dx, dy);

      if (distance < bullet.speed) {
        ObjectPools.bullets.release(bullet);
      } else {
        bullet.x += (dx / distance) * bullet.speed;
        bullet.y += (dy / distance) * bullet.speed;
      }
    });

    // Обновление частиц
    ObjectPools.particles.active.forEach(particle => {
      particle.y += particle.vy;
      particle.life--;
      if (particle.life <= 0) {
        ObjectPools.particles.release(particle);
      }
    });

    // Обновление взрывов
    ObjectPools.explosions.active.forEach(explosion => {
      explosion.radius += explosion.maxRadius / 20;
      explosion.life--;
      if (explosion.life <= 0) {
        ObjectPools.explosions.release(explosion);
      }
    });

    gameState.updateUI();
  }

  // Рисование
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();
  drawBase();

  // Рисование врагов
  enemies.forEach(enemy => enemy.draw(ctx, camera));

  // Рисование солдат
  soldiers.forEach(soldier => soldier.draw(ctx, camera));

  // Рисование пуль
  ObjectPools.bullets.active.forEach(bullet => {
    ctx.fillStyle = bullet.color;
    ctx.beginPath();
    ctx.arc(bullet.x - camera.x, bullet.y - camera.y, 3, 0, GameConfig.TWO_PI);
    ctx.fill();
  });

  // Рисование частиц
  ObjectPools.particles.active.forEach(particle => {
    ctx.save();
    ctx.font = "bold 16px Arial";
    ctx.fillStyle = particle.color;
    ctx.textAlign = "center";
    ctx.globalAlpha = particle.life / 60;
    ctx.fillText(particle.text, particle.x - camera.x, particle.y - camera.y);
    ctx.restore();
  });

  // Рисование взрывов
  ObjectPools.explosions.active.forEach(explosion => {
    ctx.save();
    ctx.globalAlpha = explosion.life / 20;
    ctx.strokeStyle = "#FF6B35";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(explosion.x - camera.x, explosion.y - camera.y, explosion.radius, 0, GameConfig.TWO_PI);
    ctx.stroke();
    ctx.restore();
  });

  requestAnimationFrame(gameLoop);
}

// Сенсорное управление
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  if (e.touches.length === 1) {
    const touch = e.touches[0];
    touchStart = { x: touch.clientX, y: touch.clientY, time: Date.now() };
    isDragging = false;
  }
});

canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  if (!touchStart) return;

  const touch = e.touches[0];
  const deltaX = touch.clientX - touchStart.x;
  const deltaY = touch.clientY - touchStart.y;
  const dragDistance = Math.hypot(deltaX, deltaY);

  if (dragDistance > 15) {
    isDragging = true;
    camera.x -= deltaX * 0.5;
    camera.y -= deltaY * 0.5;
    camera.x = Math.max(-400, Math.min(400, camera.x));
    camera.y = Math.max(-200, Math.min(200, camera.y));
    touchStart.x = touch.clientX;
    touchStart.y = touch.clientY;
  }
});

canvas.addEventListener("touchend", (e) => {
  e.preventDefault();
  if (touchStart && !isDragging) {
    handleShoot({
      clientX: e.changedTouches[0].clientX,
      clientY: e.changedTouches[0].clientY
    });
  }
  isDragging = false;
  touchStart = null;
});

// Клавиатура
document.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;
  if (e.key === ' ') {
    e.preventDefault();
    togglePause();
  }
});

document.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

// Управление интерфейсом
function togglePause() {
  gameState.paused = !gameState.paused;
  showNotification(gameState.paused ? "Игра на паузе" : "Игра продолжена", gameState.paused ? "#FFA500" : "#4CAF50");
}

function toggleShop() {
  const overlay = document.getElementById('shopOverlay');
  if (overlay.style.display === 'block') {
    overlay.style.display = 'none';
    gameState.paused = false;
  } else {
    overlay.style.display = 'block';
    gameState.paused = true;
  }
}

function switchTab(tab) {
  // Убираем активный класс со всех вкладок
  document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
  
  // Скрываем все содержимое вкладок
  document.querySelectorAll('[id$="-content"]').forEach(c => c.style.display = 'none');
  
  // Добавляем активный класс на нажатую вкладку
  event.target.classList.add('active');
  
  // Показываем содержимое выбранной вкладки
  const content = document.getElementById(`${tab}-content`);
  if (content) {
    content.style.display = 'block';
  }
}

function toggleSettings() {
  const overlay = document.getElementById('settingsOverlay');
  if (overlay.style.display === 'block') {
    overlay.style.display = 'none';
    gameState.paused = false;
  } else {
    overlay.style.display = 'block';
    gameState.paused = true;
  }
}

function toggleEncyclopedia() {
  const overlay = document.getElementById('encyclopediaOverlay');
  if (overlay.style.display === 'block') {
    overlay.style.display = 'none';
    gameState.paused = false;
  } else {
    overlay.style.display = 'block';
    gameState.paused = true;
  }
}

function switchEncyclopediaTab(tab) {
  document.querySelectorAll('.encyclopedia-content').forEach(content => {
    content.style.display = 'none';
  });
  document.querySelectorAll('#encyclopediaOverlay .shop-tab').forEach(tabBtn => {
    tabBtn.classList.remove('active');
  });
  document.getElementById(tab + '-info').style.display = 'block';
  event.target.classList.add('active');
}

function changeVolume(value) {
  soundVolume = value / 100;
  document.getElementById('volumeValue').textContent = value + '%';
}

function toggleMute() {
  soundEnabled = !soundEnabled;
  showNotification(soundEnabled ? "Звук включен" : "Звук выключен");
}

function gameOver() {
  gameState.paused = true;
  showNotification(`Игра окончена! Волн пройдено: ${gameState.wave}`, "#FF0000");

  setTimeout(() => {
    if (confirm(`Игра окончена!\nВолн пройдено: ${gameState.wave}\nВрагов убито: ${gameState.achievementSystem.statistics.enemiesKilled}\nХотите начать заново?`)) {
      restartGame();
    }
  }, 2000);
}

function restartGame() {
  // Сброс состояния игры
  gameState.gold = GameConfig.player.startGold;
  gameState.wave = 0;
  gameState.baseHP = GameConfig.player.baseHP;
  gameState.maxBaseHP = GameConfig.player.baseHP;
  gameState.baseLevel = GameConfig.player.baseLevel;
  gameState.arrows = GameConfig.player.startArrows;
  gameState.reloading = false;
  gameState.paused = false;
  gameState.gameStarted = false;
  gameState.achievementSystem = new AchievementSystem();

  // Очистка массивов
  enemies = [];
  soldiers = [];
  soldierQueue = [];
  ObjectPools.bullets.releaseAll();
  ObjectPools.particles.releaseAll();
  ObjectPools.explosions.releaseAll();

  camera = { x: 0, y: 0 };

  // Сброс конфига солдат
  Object.assign(GameConfig.soldiers, {
    warrior: { cost: 150, hp: 80, damage: 15, range: 400, cooldown: 60, color: "#8B4513" },
    archer: { cost: 200, hp: 50, damage: 25, range: 150, cooldown: 45, color: "#228B22" },
    crossbowman: { cost: 350, hp: 60, damage: 38, range: 180, cooldown: 56, color: "#8B008B" },
    pikeman: { cost: 300, hp: 75, damage: 20, range: 100, cooldown: 50, color: "#CD853F", slow: true },
    mage: { cost: 1200, hp: 40, damage: 500, range: 200, cooldown: 180, color: "#4B0082", aoe: true },
    healer: { cost: 500, hp: 60, damage: 0, range: 120, cooldown: 120, color: "#FFD700", heal: true },
    necromancer: { cost: 2000, hp: 80, damage: 150, range: 160, cooldown: 150, color: "#800080", summon: true },
    giant: { cost: 3500, hp: 1000, damage: 50, range: 120, cooldown: 60, color: "#8B4513", aoe: true, stun: true },
    paladin: { cost: 2500, hp: 250, damage: 50, range: 150, cooldown: 60, color: "#FFD700", shield: true }
  });

  gameState.playerWeapon = { ...GameConfig.weapons.simple, type: 'simple' };
  gameState.upgrades = {
    archerDamage: { cost: GameConfig.upgrades.archerDamage.baseCost, level: 0 },
    fireRate: { cost: GameConfig.upgrades.fireRate.baseCost, level: 0 },
    baseHP: { cost: GameConfig.upgrades.baseHP.baseCost, level: 0 },
    baseLevel: { cost: GameConfig.upgrades.baseLevel.baseCost, level: 0 }
  };

  gameState.updateUI();
  updateShopPrices();
}

// Сохранение и загрузка
function saveGame() {
  if (SaveSystem.save(gameState)) {
    showNotification("Игра сохранена!", "#4CAF50");
  } else {
    showNotification("Ошибка сохранения!", "#FF4444");
  }
}

function loadGame() {
  const saveData = SaveSystem.load();
  if (saveData) {
    gameState.gold = saveData.gold || gameState.gold;
    gameState.wave = saveData.wave || gameState.wave;
    gameState.baseLevel = saveData.baseLevel || gameState.baseLevel;
    gameState.maxBaseHP = saveData.maxBaseHP || gameState.maxBaseHP;

    if (saveData.achievements) {
      gameState.achievementSystem.loadProgress(saveData.achievements);
    }

    gameState.updateUI();
    showNotification("Игра загружена!", "#4CAF50");
  } else {
    showNotification("Нет сохранений!", "#FF8844");
  }
}

// Обработчики событий
canvas.addEventListener("click", handleShoot);

// Исправление ошибок - добавляем недостающие обработчики урона
function applySoldierDamage(soldier, enemy) {
  if (soldier.special.shield && Math.random() < 0.4) {
    createParticle(soldier.x, soldier.y, "БЛОК!", "#FFD700");
    return false;
  }
  return true;
}

// Инициализация игры
function initGame() {
  generateBackground();
  gameState.updateUI();
  updateShopPrices();

  const bgMusic = document.getElementById('backgroundMusic');
  if (bgMusic && soundEnabled) {
    bgMusic.volume = soundVolume * 0.3;
    bgMusic.play().catch(() => {});
  }

  showNotification("Добро пожаловать в Stick TD! Купите защитников в магазине и начните первую волну!");

  // Проверка на сохранения
  if (SaveSystem.hasSave()) {
    setTimeout(() => {
      if (confirm("Найдено сохранение! Загрузить игру?")) {
        loadGame();
      }
    }, 1000);
  }

  gameLoop();
}

// Запуск игры
window.addEventListener('load', initGame);