// Игровые переменные
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Звуковые настройки
let soundEnabled = true;
let soundVolume = 0.3;

// Звуковые эффекты
function playSound(soundId) {
  if (!soundEnabled) return;
  const audio = document.getElementById(soundId);
  if (audio) {
    audio.currentTime = 0;
    audio.volume = soundVolume;
    audio.play().catch(() => {});
  }
}

// Состояние игры
let gold = 100;
let wave = 0;
let baseHP = 100;
let maxBaseHP = 100;
let baseLevel = 1;
let arrows = 5;
let reloading = false;
let paused = false;
let passiveGoldTimer = 0;

// Система оружия
let playerWeapon = {
  type: 'simple',
  damage: 20,
  maxArrows: 5,
  reloadTime: 6000,
  level: 1,
  aoe: false
};

// Игровые объекты
let enemies = [];
let soldiers = [];
let soldierQueue = [];
let bullets = [];
let particles = [];
let explosions = [];
let backgroundStars = [];
let clouds = [];
let trees = [];
let zombies = [];
let rocks = [];
let grass = [];

// Камера
let camera = { x: 0, y: 0 };

// Ввод
let keys = {};
let touchStart = null;
let isDragging = false;

// Константы
const BASE_X = 650;
const BASE_Y = 250;
const BASE_WIDTH = 100;
const BASE_HEIGHT = 100;

// Определения типов солдат-стикменов
const soldierTypes = {
  warrior: { name: "Воин-стикмен", cost: 150, hp: 80, damage: 15, range: 400, cooldown: 60, color: "#8B4513" },
  archer: { name: "Лучник-стикмен", cost: 200, hp: 50, damage: 25, range: 150, cooldown: 45, color: "#228B22" },
  crossbowman: { name: "Арбалетчик-стикмен", cost: 350, hp: 60, damage: 38, range: 180, cooldown: 56, color: "#8B008B" },
  pikeman: { name: "Копейщик-стикмен", cost: 300, hp: 120, damage: 20, range: 80, cooldown: 50, color: "#4682B4", slow: true },
  mage: { name: "Маг-стикмен", cost: 1200, hp: 40, damage: 500, range: 200, cooldown: 900, color: "#FF69B4", isMage: true },
  healer: { name: "Целитель-стикмен", cost: 500, hp: 60, damage: 0, range: 100, cooldown: 90, color: "#FFD700", isHealer: true },
  necromancer: { name: "Некромант-стикмен", cost: 800, hp: 70, damage: 30, range: 120, cooldown: 120, color: "#8A2BE2", isSummoner: true }
};

// Определения типов врагов-стикменов
const enemyTypes = {
  goblin: { name: "Гоблин-стикмен", hp: 30, speed: 1, damage: 10, reward: 15, color: "#228B22" },
  orc: { name: "Орк-стикмен", hp: 60, speed: 0.8, damage: 20, reward: 25, color: "#8B4513" },
  troll: { name: "Тролль-стикмен", hp: 120, speed: 0.6, damage: 30, reward: 40, color: "#696969" },
  dragon: { name: "Дракон-стикмен", hp: 200, speed: 0.5, damage: 50, reward: 75, color: "#DC143C", isFlying: true },
  ironGolem: { name: "Железный Голем-стикмен", hp: 400, speed: 0.3, damage: 80, reward: 150, color: "#708090", isBoss: true },
  shadowMage: { name: "Теневой Маг-стикмен", hp: 250, speed: 0.7, damage: 60, reward: 120, color: "#4B0082", isBoss: true, canSummon: true }
};

// Типы зомби-стикменов для некроманта
const zombieTypes = {
  normal: { hp: 50, damage: 30, speed: 0.4, chance: 0.6, color: "#9ACD32" },
  knight: { hp: 100, damage: 50, speed: 0.35, chance: 0.2, color: "#FFD700" },
  paladin: { hp: 125, damage: 60, speed: 0.3, chance: 0.15, color: "#FF6347" },
  general: { hp: 200, damage: 50, speed: 0.25, chance: 0.04, color: "#8B0000", canSummon: true },
  giant: { hp: 500, damage: 100, speed: 0.15, chance: 0.01, color: "#2F4F4F", aoe: true }
};

// Улучшения
const upgrades = {
  archerDamage: { cost: 200, level: 0, multiplier: 1.5 },
  fireRate: { cost: 300, level: 0, multiplier: 0.8 },
  baseHP: { cost: 250, level: 0, bonus: 50 },
  baseLevel: { cost: 500, level: 0, bonus: 100 }
};

// Функции рисования стикменов
function drawStickman(x, y, color, animFrame, type = 'normal', size = 1) {
  ctx.save();
  ctx.translate(x - camera.x, y - camera.y);
  ctx.scale(size, size);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  const bounce = Math.sin(animFrame * 0.2) * 2;

  // Голова
  ctx.beginPath();
  ctx.arc(0, -15 + bounce, 5, 0, Math.PI * 2);
  ctx.stroke();

  // Тело
  ctx.beginPath();
  ctx.moveTo(0, -10 + bounce);
  ctx.lineTo(0, 10 + bounce);
  ctx.stroke();

  // Руки (анимация)
  const armSwing = Math.sin(animFrame * 0.3) * 0.3;
  ctx.beginPath();
  ctx.moveTo(0, -5 + bounce);
  ctx.lineTo(-8 + armSwing, 2 + bounce);
  ctx.moveTo(0, -5 + bounce);
  ctx.lineTo(8 - armSwing, 2 + bounce);
  ctx.stroke();

  // Ноги (анимация бега)
  const legSwing = Math.sin(animFrame * 0.4) * 0.5;
  ctx.beginPath();
  ctx.moveTo(0, 10 + bounce);
  ctx.lineTo(-5 + legSwing, 20 + bounce);
  ctx.moveTo(0, 10 + bounce);
  ctx.lineTo(5 - legSwing, 20 + bounce);
  ctx.stroke();

  // Оружие/атрибуты в зависимости от типа
  if (type === 'archer') {
    // Лук
    ctx.beginPath();
    ctx.arc(-10, -5 + bounce, 6, 0, Math.PI);
    ctx.stroke();
  } else if (type === 'crossbowman') {
    // Арбалет
    ctx.beginPath();
    ctx.moveTo(8, 2 + bounce);
    ctx.lineTo(15, -1 + bounce);
    ctx.moveTo(10, -3 + bounce);
    ctx.lineTo(13, -3 + bounce);
    ctx.stroke();
  } else if (type === 'warrior') {
    // Меч
    ctx.beginPath();
    ctx.moveTo(8, 2 + bounce);
    ctx.lineTo(12, -3 + bounce);
    ctx.stroke();
  } else if (type === 'pikeman') {
    // Копье
    ctx.beginPath();
    ctx.moveTo(8, 2 + bounce);
    ctx.lineTo(15, -8 + bounce);
    ctx.stroke();
  } else if (type === 'mage') {
    // Магический посох
    ctx.strokeStyle = '#FF69B4';
    ctx.beginPath();
    ctx.moveTo(8, 2 + bounce);
    ctx.lineTo(8, -15 + bounce);
    ctx.arc(8, -17 + bounce, 3, 0, Math.PI * 2);
    ctx.stroke();
  } else if (type === 'healer') {
    // Посох с кристаллом
    ctx.beginPath();
    ctx.moveTo(8, 2 + bounce);
    ctx.lineTo(8, -10 + bounce);
    ctx.arc(8, -12 + bounce, 2, 0, Math.PI * 2);
    ctx.stroke();
  } else if (type === 'necromancer') {
    // Темный посох
    ctx.strokeStyle = '#800080';
    ctx.beginPath();
    ctx.moveTo(8, 2 + bounce);
    ctx.lineTo(8, -12 + bounce);
    ctx.moveTo(6, -12 + bounce);
    ctx.lineTo(10, -12 + bounce);
    ctx.stroke();
  }

  ctx.restore();
}

// Функция рисования стикмена-врага
function drawEnemyStickman(x, y, color, animFrame, type = 'normal', size = 1) {
  ctx.save();
  ctx.translate(x - camera.x, y - camera.y);
  ctx.scale(size, size);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  const bounce = Math.sin(animFrame * 0.25) * 1.5;
  const aggressive = Math.sin(animFrame * 0.5) * 0.2;

  // Голова (более угрожающая)
  ctx.beginPath();
  ctx.arc(0, -15 + bounce, 5, 0, Math.PI * 2);
  ctx.stroke();

  // Злые глаза
  ctx.fillStyle = 'red';
  ctx.fillRect(-2, -17 + bounce, 1, 1);
  ctx.fillRect(1, -17 + bounce, 1, 1);

  // Тело
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -10 + bounce);
  ctx.lineTo(0, 10 + bounce + aggressive);
  ctx.stroke();

  // Руки (агрессивная поза)
  ctx.beginPath();
  ctx.moveTo(0, -5 + bounce);
  ctx.lineTo(-10 + aggressive, 0 + bounce);
  ctx.moveTo(0, -5 + bounce);
  ctx.lineTo(10 - aggressive, 0 + bounce);
  ctx.stroke();

  // Ноги (быстрая ходьба)
  const legSwing = Math.sin(animFrame * 0.6) * 0.8;
  ctx.beginPath();
  ctx.moveTo(0, 10 + bounce + aggressive);
  ctx.lineTo(-6 + legSwing, 20 + bounce);
  ctx.moveTo(0, 10 + bounce + aggressive);
  ctx.lineTo(6 - legSwing, 20 + bounce);
  ctx.stroke();

  // Оружие врага
  if (type === 'orc' || type === 'troll') {
    // Большой топор
    ctx.beginPath();
    ctx.moveTo(10, 0 + bounce);
    ctx.lineTo(15, -5 + bounce);
    ctx.moveTo(13, -8 + bounce);
    ctx.lineTo(17, -2 + bounce);
    ctx.stroke();
  } else if (type === 'dragon') {
    // Крылья
    ctx.beginPath();
    ctx.moveTo(-5, -5 + bounce);
    ctx.lineTo(-15, -10 + bounce);
    ctx.lineTo(-10, 0 + bounce);
    ctx.moveTo(5, -5 + bounce);
    ctx.lineTo(15, -10 + bounce);
    ctx.lineTo(10, 0 + bounce);
    ctx.stroke();
  }

  ctx.restore();
}

// Инициализация фона
function initBackground() {
  // Звезды
  for (let i = 0; i < 50; i++) {
    backgroundStars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      brightness: Math.random() * 0.5 + 0.5
    });
  }

  // Облака
  for (let i = 0; i < 8; i++) {
    clouds.push({
      x: Math.random() * 1200,
      y: Math.random() * 150 + 20,
      speed: 0.1 + Math.random() * 0.2,
      size: 25 + Math.random() * 35
    });
  }

  // Деревья
  for (let i = 0; i < 12; i++) {
    trees.push({
      x: Math.random() * 1000,
      y: 280 + Math.random() * 40,
      height: 50 + Math.random() * 40,
      width: 8 + Math.random() * 6
    });
  }

  // Камни
  for (let i = 0; i < 15; i++) {
    rocks.push({
      x: Math.random() * 800,
      y: 320 + Math.random() * 50,
      size: 8 + Math.random() * 15
    });
  }

  // Трава
  for (let i = 0; i < 30; i++) {
    grass.push({
      x: Math.random() * 800,
      y: 350 + Math.random() * 30,
      height: 5 + Math.random() * 10
    });
  }
}

// Функции настроек
function toggleSettings() {
  const settings = document.getElementById("settings");
  const isVisible = settings.style.display !== "none";
  settings.style.display = isVisible ? "none" : "block";
  paused = !isVisible;

  if (!isVisible) {
    updateWeaponStats();
  }
}

function updateWeaponStats() {
  const weaponNames = {
    'simple': 'Простой лук',
    'crossbow': 'Арбалет',
    'magic': 'Магический лук'
  };

  document.getElementById("statsWeaponType").textContent = weaponNames[playerWeapon.type];
  document.getElementById("statsWeaponDamage").textContent = playerWeapon.damage;
  document.getElementById("statsWeaponLevel").textContent = playerWeapon.level;
  document.getElementById("statsMaxArrows").textContent = playerWeapon.maxArrows;
  document.getElementById("statsReloadTime").textContent = (playerWeapon.reloadTime / 1000) + " сек";
  document.getElementById("statsAOE").textContent = playerWeapon.aoe ? "ДА" : "НЕТ";
}

function restartGame() {
  if (confirm("Вы уверены, что хотите перезапустить игру? Весь прогресс будет потерян!")) {
    location.reload();
  }
}

function changeVolume(value) {
  soundVolume = value / 100;
  document.getElementById("volumeValue").textContent = value + "%";
}

function toggleMute() {
  soundEnabled = !soundEnabled;
  const btn = document.getElementById("muteBtn");
  btn.textContent = soundEnabled ? "Звук: ВКЛ" : "Звук: ВЫКЛ";
  btn.style.background = soundEnabled ? 
    "linear-gradient(135deg, #4CAF50, #45a049)" : 
    "linear-gradient(135deg, #f44336, #d32f2f)";
}

// Переключение вкладок магазина
function switchTab(tabName) {
  document.querySelectorAll('.shop-content').forEach(content => {
    content.classList.remove('active');
  });
  document.querySelectorAll('.shop-tab').forEach(tab => {
    tab.classList.remove('active');
  });

  document.getElementById(tabName + '-content').classList.add('active');
  event.target.classList.add('active');
}

// Энциклопедия
function toggleEncyclopedia() {
  const encyclopedia = document.getElementById("encyclopedia");
  const isVisible = encyclopedia.style.display !== "none";
  encyclopedia.style.display = isVisible ? "none" : "block";
  paused = !isVisible;
}

function openEncyclopediaFromSettings() {
  // Закрываем настройки
  document.getElementById("settings").style.display = "none";
  // Открываем энциклопедию
  document.getElementById("encyclopedia").style.display = "block";
  paused = true;
}

// Переключение вкладок энциклопедии
function switchEncyclopediaTab(tabName) {
  document.querySelectorAll('.encyclopedia-content').forEach(content => {
    content.classList.remove('active');
  });
  document.querySelectorAll('.encyclopedia-tab').forEach(tab => {
    tab.classList.remove('active');
  });

  document.getElementById(tabName + '-encyclopedia').classList.add('active');
  event.target.classList.add('active');
}

// Магазин
function toggleShop() {
  const shop = document.getElementById("shop");
  const isVisible = shop.style.display !== "none";
  shop.style.display = isVisible ? "none" : "block";
  paused = !isVisible;

  if (!paused) {
    soldierQueue.forEach(s => soldiers.push(s));
    soldierQueue = [];
  }

  updateShopPrices();
}

function updateShopPrices() {
  // Обновляем цены солдат
  Object.keys(soldierTypes).forEach(type => {
    const element = document.getElementById(`${type}-cost`);
    if (element) element.textContent = soldierTypes[type].cost;
  });

  // Обновляем улучшения
  document.getElementById("archer-dmg-lvl").textContent = `Ур. ${upgrades.archerDamage.level}`;
  document.getElementById("archer-dmg-cost").textContent = upgrades.archerDamage.cost;
  document.getElementById("fire-rate-lvl").textContent = `Ур. ${upgrades.fireRate.level}`;
  document.getElementById("fire-rate-cost").textContent = upgrades.fireRate.cost;
  document.getElementById("base-hp-lvl").textContent = `Ур. ${upgrades.baseHP.level}`;
  document.getElementById("base-hp-cost").textContent = upgrades.baseHP.cost;
  document.getElementById("base-level-display").textContent = `Ур. ${upgrades.baseLevel.level}`;
  document.getElementById("base-level-cost").textContent = upgrades.baseLevel.cost;
}

// Обновление информации об оружии
function updateWeaponInfo() {
  const weaponNames = {
    'simple': 'Простой лук',
    'crossbow': 'Арбалет',
    'magic': 'Магический лук'
  };

  document.getElementById("weaponType").textContent = weaponNames[playerWeapon.type];
  document.getElementById("weaponDamage").textContent = playerWeapon.damage;
  document.getElementById("weaponLevel").textContent = playerWeapon.level;

  // Перепозиционируем панель после обновления содержимого
  setTimeout(repositionWeaponPanel, 10);
}

// Покупка оружия
function buyWeapon(type) {
  let cost = 0;
  let newWeapon = {...playerWeapon};

  switch(type) {
    case 'crossbow':
      cost = 500;
      if (gold >= cost && playerWeapon.type === 'simple') {
        gold -= cost;
        newWeapon = {
          type: 'crossbow',
          damage: Math.floor(playerWeapon.damage * 1.5),
          maxArrows: 15,
          reloadTime: 4000,
          level: playerWeapon.level,
          aoe: false
        };
        showNotification("Арбалет куплен!");
      }
      break;
    case 'magic':
      cost = 1500;
      if (gold >= cost && playerWeapon.type !== 'magic') {
        gold -= cost;
        newWeapon = {
          type: 'magic',
          damage: playerWeapon.damage,
          maxArrows: 20,
          reloadTime: 3000,
          level: playerWeapon.level,
          aoe: true
        };
        showNotification("Магический лук куплен!");
      }
      break;
  }

  if (newWeapon.type !== playerWeapon.type) {
    playerWeapon = newWeapon;
    arrows = playerWeapon.maxArrows;
    updateWeaponInfo();
  } else if (gold < cost) {
    showNotification("Недостаточно золота!", "#FF4444");
  }
}

// Функция призыва зомби-стикмена
function summonZombie(necromancer) {
  const rand = Math.random();
  let zombieType = 'normal';

  // Определяем тип зомби по шансам
  if (rand < zombieTypes.giant.chance) {
    zombieType = 'giant';
  } else if (rand < zombieTypes.general.chance + zombieTypes.giant.chance) {
    zombieType = 'general';
  } else if (rand < zombieTypes.paladin.chance + zombieTypes.general.chance + zombieTypes.giant.chance) {
    zombieType = 'paladin';
  } else if (rand < zombieTypes.knight.chance + zombieTypes.paladin.chance + zombieTypes.general.chance + zombieTypes.giant.chance) {
    zombieType = 'knight';
  }

  const zombieData = zombieTypes[zombieType];

  zombies.push({
    x: necromancer.x + Math.random() * 60 - 30,
    y: necromancer.y + Math.random() * 60 - 30,
    type: zombieType,
    hp: zombieData.hp,
    maxHp: zombieData.hp,
    damage: zombieData.damage,
    speed: zombieData.speed,
    color: zombieData.color,
    targetX: 0,
    targetY: 200,
    lifetime: 1800,
    animFrame: 0,
    attackCooldown: 0,
    summonCooldown: 0
  });

  createParticle(necromancer.x, necromancer.y, `Зомби-стикмен ${zombieType}!`, zombieData.color);
}

// Покупка солдата
function buySoldier(type) {
  const t = soldierTypes[type];
  if (gold >= t.cost) {
    gold -= t.cost;
    soldierQueue.push({
      x: BASE_X - 50,
      y: BASE_Y + (soldiers.length + soldierQueue.length) * 30 % BASE_HEIGHT,
      type,
      cooldown: 0,
      animFrame: 0,
      hp: t.hp,
      maxHp: t.hp
    });

    // Увеличение стоимости
    if (type === 'archer') {
      t.cost = Math.floor(t.cost * 1.3);
    } else if (type === 'pikeman') {
      t.cost = Math.floor(t.cost * 1.4);
    } else if (type === 'healer' || type === 'necromancer') {
      t.cost = Math.floor(t.cost * 1.8);
    } else {
      t.cost = Math.floor(t.cost * 1.5);
    }

    showNotification(`${t.name} куплен!`);
    createParticle(BASE_X - 50, BASE_Y + 50, "+1 стикмен", "#4CAF50");
  } else {
    showNotification("Недостаточно золота!", "#FF4444");
  }
}

// Улучшения
function buyUpgrade(type) {
  const upgrade = upgrades[type];
  if (gold >= upgrade.cost) {
    gold -= upgrade.cost;
    upgrade.level++;

    switch (type) {
      case 'archerDamage':
        soldierTypes.archer.damage = Math.floor(soldierTypes.archer.damage * upgrade.multiplier);
        upgrade.cost = Math.floor(upgrade.cost * 1.5);
        showNotification("Урон лучников увеличен!");
        break;
      case 'fireRate':
        Object.keys(soldierTypes).forEach(key => {
          soldierTypes[key].cooldown = Math.floor(soldierTypes[key].cooldown * upgrade.multiplier);
        });
        upgrade.cost = Math.floor(upgrade.cost * 1.5);
        showNotification("Скорость стрельбы увеличена!");
        break;
      case 'baseHP':
        maxBaseHP += upgrade.bonus;
        baseHP += upgrade.bonus;
        upgrade.cost = Math.floor(upgrade.cost * 1.5);
        showNotification("Здоровье базы увеличено!");
        break;
      case 'baseLevel':
        baseLevel++;
        maxBaseHP += upgrade.bonus;
        baseHP += upgrade.bonus;
        upgrade.cost = Math.floor(upgrade.cost * 1.6);
        showNotification(`База прокачана до уровня ${baseLevel}!`);
        break;
    }
    updateUI();
  } else {
    showNotification("Недостаточно золота!", "#FF4444");
  }
}

// Покупка предметов
function buyItem(type) {
  let cost = 0;
  let success = false;

  switch (type) {
    case 'arrows':
      cost = 50;
      if (gold >= cost) {
        gold -= cost;
        arrows = Math.min(arrows + 10, playerWeapon.maxArrows);
        showNotification("+10 стрел!");
        success = true;
      }
      break;
    case 'heal':
      cost = 150;
      if (gold >= cost && baseHP < maxBaseHP) {
        gold -= cost;
        baseHP = Math.min(maxBaseHP, baseHP + 50);
        showNotification("База вылечена!");
        success = true;
      }
      break;
    case 'bomb':
      cost = 400;
      if (gold >= cost) {
        gold -= cost;
        enemies.forEach(e => {
          createExplosion(e.x, e.y, 100);
          createParticle(e.x, e.y, "BOOM!", "#FF4444");
          gold += e.reward;
        });
        enemies = [];
        showNotification("Все враги уничтожены!");
        success = true;
      }
      break;
  }

  if (success) {
    updateUI();
  } else if (gold < cost) {
    showNotification("Недостаточно золота!", "#FF4444");
  }
}

// Старт волны
function startWave() {
  if (enemies.length > 0) return;

  wave++;

  // Скрыть кнопку волны
  document.getElementById("waveBtn").style.display = "none";

  // Показать информацию
  const waveInfo = document.getElementById("wave-info");
  const waveDisplay = document.getElementById("wave-display");
  waveDisplay.textContent = wave;
  waveInfo.style.display = "block";

  setTimeout(() => {
    waveInfo.style.display = "none";
  }, 2000);

  // Спавн врагов
  const enemyCount = Math.floor(1 + wave * 0.8);
  for (let i = 0; i < enemyCount; i++) {
    setTimeout(spawnEnemy, i * 800);
  }

  // Награда за волну
  const waveReward = Math.floor((50 + wave * 15) * (1 + wave * 0.1));
  gold += waveReward;
  showNotification(`Волна ${wave} началась! +${waveReward} золота`);
  updateUI();
}

// Спавн врага
function spawnEnemy() {
  const types = Object.keys(enemyTypes);
  let type;

  if (wave % 5 === 0 && wave > 0) {
    const bossTypes = ['ironGolem', 'shadowMage'];
    type = bossTypes[Math.floor(Math.random() * bossTypes.length)];
    showBossWarning(enemyTypes[type].name);
  } else {
    const availableTypes = types.filter(t => !enemyTypes[t].isBoss);
    type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
  }

  const enemyData = enemyTypes[type];

  enemies.push({
    x: -50,
    y: 200 + Math.random() * 100 - 50,
    type: type,
    hp: enemyData.hp + Math.floor(wave * enemyData.hp * 0.1),
    maxHp: enemyData.hp + Math.floor(wave * enemyData.hp * 0.1),
    speed: enemyData.speed,
    damage: enemyData.damage,
    reward: enemyData.reward + Math.floor(wave * 5),
    targetX: BASE_X + BASE_WIDTH / 2,
    targetY: BASE_Y + BASE_HEIGHT / 2,
    shootCooldown: 0,
    animFrame: 0,
    slowEffect: 0,
    poisonEffect: 0,
    poisonDamage: 0,
    summonCooldown: 0
  });
}

// Предупреждение о боссе
function showBossWarning(bossName) {
  const warning = document.createElement('div');
  warning.className = 'boss-warning';
  warning.innerHTML = `⚠️ БОСС-СТИКМЕН ПРИБЛИЖАЕТСЯ! ⚠️<br>${bossName}`;
  document.body.appendChild(warning);

  setTimeout(() => {
    warning.remove();
  }, 3000);
}

// Уведомление на экране
function showNotification(text, color = "#4CAF50") {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = text;
  notification.style.background = color;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Частицы
function createParticle(x, y, text, color) {
  particles.push({
    x: x + camera.x,
    y: y + camera.y,
    text,
    color,
    life: 60,
    dy: -2
  });
}

// Взрыв
function createExplosion(x, y, radius) {
  explosions.push({
    x, y, radius,
    life: 30,
    maxLife: 30
  });
}

// Обработка клика/выстрела
canvas.addEventListener("click", handleShoot);

function handleShoot(e) {
  if (arrows > 0 && !reloading && !paused) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left + camera.x;
    const y = e.clientY - rect.top + camera.y;

    playSound('shootSound');

    bullets.push({
      x: BASE_X + BASE_WIDTH / 2,
      y: BASE_Y + BASE_HEIGHT / 2,
      tx: x,
      ty: y,
      damage: playerWeapon.damage,
      lifetime: 300,
      isPlayerBullet: true,
      aoe: playerWeapon.aoe,
      isArrow: true
    });

    arrows--;
    if (arrows === 0) {
      reloading = true;
      showNotification("Перезарядка...", "#FF8844");
      setTimeout(() => {
        arrows = playerWeapon.maxArrows;
        reloading = false;
        showNotification("Перезарядка завершена!");
        updateUI();
      }, playerWeapon.reloadTime);
    }
    updateUI();
  }
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

// Пауза
function togglePause() {
  paused = !paused;
  showNotification(paused ? "Игра на паузе" : "Игра продолжена", paused ? "#FFA500" : "#4CAF50");
}

// Обновление UI
function updateUI() {
  document.getElementById('gold').textContent = gold;
  document.getElementById('waveNum').textContent = wave;
  document.getElementById('baseHP').textContent = baseHP;
  document.getElementById('baseLevel').textContent = baseLevel;
  document.getElementById('arrows').textContent = arrows;
  document.getElementById('soldierCount').textContent = soldiers.length;

  // Показать кнопку волны только когда нет врагов
  const waveBtn = document.getElementById("waveBtn");
  if (enemies.length === 0 && !paused) {
    waveBtn.style.display = "block";
    waveBtn.textContent = wave === 0 ? "🚀 Начать битву!" : `⚔️ Волна ${wave + 1}`;
  } else {
    waveBtn.style.display = "none";
  }

  updateWeaponInfo();
}

// Игровая логика обновления
function update() {
  if (paused) return;

  // Управление камерой
  const cameraSpeed = 3;
  if (keys['w']) camera.y -= cameraSpeed;
  if (keys['s']) camera.y += cameraSpeed;
  if (keys['a']) camera.x -= cameraSpeed;
  if (keys['d']) camera.x += cameraSpeed;

  camera.x = Math.max(-400, Math.min(400, camera.x));
  camera.y = Math.max(-200, Math.min(200, camera.y));

  // Пассивный доход
  passiveGoldTimer++;
  if (passiveGoldTimer >= 600) {
    gold += Math.floor(1 + wave * 0.5);
    passiveGoldTimer = 0;
  }

  // Обновление фона
  clouds.forEach(cloud => {
    cloud.x += cloud.speed;
    if (cloud.x > 1200) cloud.x = -100;
  });

  // Обновление солдат-стикменов
  soldiers.forEach((soldier, index) => {
    const soldierType = soldierTypes[soldier.type];
    soldier.animFrame++;

    // Поиск цели
    let target = null;
    let minDist = soldierType.range;

    enemies.forEach(enemy => {
      const dist = Math.hypot(enemy.x - soldier.x, enemy.y - soldier.y);
      if (dist < minDist) {
        target = enemy;
        minDist = dist;
      }
    });

    // Атака или движение к цели
    if (target && soldier.cooldown <= 0) {
      if (soldierType.isHealer) {
        // Лечение союзников
        soldiers.forEach(ally => {
          const dist = Math.hypot(ally.x - soldier.x, ally.y - soldier.y);
          if (dist < soldierType.range && ally.hp < soldierTypes[ally.type].hp) {
            ally.hp = Math.min(ally.hp + 20, soldierTypes[ally.type].hp);
            createParticle(ally.x, ally.y, "+HP", "#00FF00");
          }
        });

        // Лечение базы
        if (baseHP < maxBaseHP) {
          baseHP = Math.min(maxBaseHP, baseHP + 10);
          createParticle(BASE_X + BASE_WIDTH/2, BASE_Y + BASE_HEIGHT/2, "+10 HP", "#4CAF50");
        }
        soldier.cooldown = soldierType.cooldown;
      } else if (soldierType.isSummoner) {
        // Некромант призывает зомби-стикменов
        summonZombie(soldier);
        soldier.cooldown = soldierType.cooldown;
      } else if (soldierType.isMage) {
        // Маг атакует магическими шарами с АОЕ уроном
        bullets.push({
          x: soldier.x,
          y: soldier.y,
          tx: target.x,
          ty: target.y,
          damage: soldierType.damage,
          lifetime: 100,
          isPlayerBullet: false,
          isMagicBall: true,
          aoe: true
        });
        soldier.cooldown = soldierType.cooldown;
      } else if (soldier.type === 'warrior') {
        // Воин атакует с расстояния пол карты (400 пикселей)
        if (minDist > 30) {
          // Движение к врагу
          const moveSpeed = 2;
          const dx = target.x - soldier.x;
          const dy = target.y - soldier.y;
          const dist = Math.hypot(dx, dy);
          soldier.x += (dx / dist) * moveSpeed;
          soldier.y += (dy / dist) * moveSpeed;
        } else {
          // Рукопашная атака
          target.hp -= soldierType.damage;
          createParticle(target.x, target.y, `-${soldierType.damage}`, "#FF4444");

          // Враг атакует воина в ответ
          soldier.hp -= 8;
          createParticle(soldier.x, soldier.y, "-8", "#FF6666");

          if (soldier.hp <= 0) {
            soldiers.splice(soldiers.indexOf(soldier), 1);
            createParticle(soldier.x, soldier.y, "Погиб", "#888888");
          }

          soldier.cooldown = soldierType.cooldown;
        }
      } else {
        // Дальний бой для лучников, арбалетчиков и других
        bullets.push({
          x: soldier.x,
          y: soldier.y,
          tx: target.x,
          ty: target.y,
          damage: soldierType.damage,
          lifetime: 100,
          isPlayerBullet: false,
          slow: soldierType.slow,
          isArrow: soldier.type === 'archer' || soldier.type === 'crossbowman'
        });
        soldier.cooldown = soldierType.cooldown;
      }
    }

    if (soldier.cooldown > 0) soldier.cooldown--;
  });

  // Обновление врагов-стикменов
  enemies.forEach((enemy, index) => {
    enemy.animFrame++;

    // Поиск ближайшего воина для боя
    let nearestWarrior = null;
    let minWarriorDist = Infinity;

    soldiers.forEach(soldier => {
      if (soldier.type === 'warrior') {
        const dist = Math.hypot(soldier.x - enemy.x, soldier.y - enemy.y);
        if (dist < minWarriorDist) {
          minWarriorDist = dist;
          nearestWarrior = soldier;
        }
      }
    });

    // Поиск ближайшего зомби для атаки
    let nearestZombie = null;
    let minZombieDist = Infinity;

    zombies.forEach(zombie => {
      const dist = Math.hypot(zombie.x - enemy.x, zombie.y - enemy.y);
      if (dist < minZombieDist) {
        minZombieDist = dist;
        nearestZombie = zombie;
      }
    });

    // Если рядом зомби - останавливаемся и атакуем его
    if (nearestZombie && minZombieDist < 50) {
      // Враг останавливается и атакует зомби
      if (!enemy.combatCooldown) enemy.combatCooldown = 0;
      enemy.combatCooldown++;

      if (enemy.combatCooldown >= 45) { // Атака каждые 0.75 секунды
        nearestZombie.hp -= 15;
        enemy.combatCooldown = 0;
        createParticle(nearestZombie.x, nearestZombie.y, "-15", "#FF6666");

        if (nearestZombie.hp <= 0) {
          zombies.splice(zombies.indexOf(nearestZombie), 1);
          createParticle(nearestZombie.x, nearestZombie.y, "Погиб", "#888888");
        }
      }
    }
    // Если рядом воин - останавливаемся и сражаемся
    else if (nearestWarrior && minWarriorDist < 50) {
      // Враг останавливается и атакует воина
      if (!enemy.combatCooldown) enemy.combatCooldown = 0;
      enemy.combatCooldown++;

      if (enemy.combatCooldown >= 45) { // Атака каждые 0.75 секунды
        nearestWarrior.hp -= 12;
        enemy.combatCooldown = 0;
        createParticle(nearestWarrior.x, nearestWarrior.y, "-12", "#FF6666");

        if (nearestWarrior.hp <= 0) {
          soldiers.splice(soldiers.indexOf(nearestWarrior), 1);
          createParticle(nearestWarrior.x, nearestWarrior.y, "Погиб", "#888888");
        }
      }
    } else {
      // Обычное движение к базе
      const dx = enemy.targetX - enemy.x;
      const dy = enemy.targetY - enemy.y;
      const dist = Math.hypot(dx, dy);

      // Эффекты замедления и яда
      if (enemy.slowEffect > 0) {
        enemy.slowEffect--;
      }
      if (enemy.poisonEffect > 0) {
        enemy.poisonEffect--;
        if (enemy.poisonEffect % 60 === 0) {
          enemy.hp -= enemy.poisonDamage;
          createParticle(enemy.x, enemy.y, `-${enemy.poisonDamage}`, "#9370DB");
        }
      }

      const currentSpeed = enemy.slowEffect > 0 ? enemy.speed * 0.5 : enemy.speed;

      if (dist > 30) {
        enemy.x += (dx / dist) * currentSpeed;
        enemy.y += (dy / dist) * currentSpeed;
      } else {
        // Враг остается у базы и атакует каждые 60 кадров (1 секунда)
        if (!enemy.attackCooldown) enemy.attackCooldown = 0;
        enemy.attackCooldown++;

        if (enemy.attackCooldown >= 60) {
          baseHP -= 5; // Фиксированный урон 5
          enemy.attackCooldown = 0;
          createParticle(BASE_X + BASE_WIDTH/2, BASE_Y + BASE_HEIGHT/2, "-5", "#FF4444");

          if (baseHP <= 0) {
            baseHP = 0;
            showNotification("ПОРАЖЕНИЕ!", "#FF0000");
          }
        }
      }
    }
  });

  // Обновление зомби-стикменов
  zombies.forEach(zombie => {
    zombie.animFrame++;
    zombie.lifetime--;

    // Инициализация кулдауна атаки для зомби
    if (!zombie.attackCooldown) zombie.attackCooldown = 0;
    if (zombie.attackCooldown > 0) zombie.attackCooldown--;

    // Движение к врагам
    let target = null;
    let minDistance = Infinity;

    enemies.forEach(enemy => {
      const dist = Math.hypot(enemy.x - zombie.x, enemy.y - zombie.y);
      if (dist < minDistance && enemy.hp > 0) {
        minDistance = dist;
        target = enemy;
      }
    });

    if (target && minDistance > 20) {
      const dx = target.x - zombie.x;
      const dy = target.y - zombie.y;
      const distance = Math.hypot(dx, dy);
      zombie.x += (dx / distance) * zombie.speed;
      zombie.y += (dy / distance) * zombie.speed;
    } else if (target && minDistance <= 20 && zombie.attackCooldown <= 0) {
      // Атака врага только если кулдаун прошел
      let damage = zombie.damage;
      if (zombieTypes[zombie.type].aoe) {
        // АОЕ урон для гиганта
        enemies.forEach(e => {
          const dist = Math.hypot(e.x - zombie.x, e.y - zombie.y);
          if (dist <= 40 && e.hp > 0) {
            e.hp -= damage;
            createParticle(e.x, e.y, `-${damage}`, "#8B008B");
          }
        });
        createExplosion(zombie.x, zombie.y, 40);
        zombie.attackCooldown = 90; // 1.5 секунды кулдаун для АОЕ
      } else {
        target.hp -= damage;
        createParticle(target.x, target.y, `-${damage}`, "#8B008B");
        zombie.attackCooldown = 60; // 1 секунда кулдаун для обычной атаки
      }

      // Генерал зомби может призывать (реже)
      if (zombieTypes[zombie.type].canSummon && Math.random() < 0.02 && zombie.summonCooldown <= 0) {
        const rand = Math.random();
        let newZombieType = 'normal';
        if (rand < 0.1) newZombieType = 'paladin';
        else if (rand < 0.4) newZombieType = 'knight';

        const newZombieData = zombieTypes[newZombieType];
        zombies.push({
          x: zombie.x + Math.random() * 40 - 20,
          y: zombie.y + Math.random() * 40 - 20,
          type: newZombieType,
          hp: newZombieData.hp,
          maxHp: newZombieData.hp,
          damage: newZombieData.damage,
          speed: newZombieData.speed,
          color: newZombieData.color,
          targetX: 0,
          targetY: 200,
          lifetime: 900,
          animFrame: 0,
          attackCooldown: 0,
          summonCooldown: 0
        });
        zombie.summonCooldown = 300; // 5 секунд кулдаун на призыв
      }
    }

    // Обновление кулдауна призыва
    if (zombie.summonCooldown > 0) zombie.summonCooldown--;
  });

  // Обновление пуль
  bullets.forEach((bullet, index) => {
    const dx = bullet.tx - bullet.x;
    const dy = bullet.ty - bullet.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 5 && bullet.lifetime > 0) {
      bullet.x += (dx / dist) * 8;
      bullet.y += (dy / dist) * 8;
      bullet.lifetime--;
    } else {
      // Попадание
      if ((bullet.isPlayerBullet && bullet.aoe) || bullet.isMagicBall) {
        // АОЕ урон для игрока и магов
        const radius = bullet.isMagicBall ? 80 : 50;
        enemies.forEach(enemy => {
          const enemyDist = Math.hypot(enemy.x - bullet.x, enemy.y - bullet.y);
          if (enemyDist < radius) {
            enemy.hp -= bullet.damage;
            createParticle(enemy.x, enemy.y, `-${bullet.damage}`, bullet.isMagicBall ? "#FF69B4" : "#FF4444");
            playSound('hitSound');

            if (enemy.hp <= 0) {
              gold += enemy.reward;
              createParticle(enemy.x, enemy.y, `+${enemy.reward}`, "#FFD700");
              playSound('enemyDeathSound');
              playSound('goldSound');
              enemies.splice(enemies.indexOf(enemy), 1);
            }
          }
        });
        createExplosion(bullet.x, bullet.y, radius);
      } else {
        // Обычный урон
        enemies.forEach(enemy => {
          const enemyDist = Math.hypot(enemy.x - bullet.x, enemy.y - bullet.y);
          if (enemyDist < 20) {
            enemy.hp -= bullet.damage;
            createParticle(enemy.x, enemy.y, `-${bullet.damage}`, "#FF4444");
            playSound('hitSound');

            // Эффекты
            if (bullet.slow) {
              enemy.slowEffect = 120;
            }

            if (enemy.hp <= 0) {
              gold += enemy.reward;
              createParticle(enemy.x, enemy.y, `+${enemy.reward}`, "#FFD700");
              playSound('enemyDeathSound');
              playSound('goldSound');
              enemies.splice(enemies.indexOf(enemy), 1);
            }
          }
        });
      }
      bullets.splice(index, 1);
    }
  });

  // Обновление частиц
  particles.forEach((particle, index) => {
    particle.y += particle.dy;
    particle.life--;
    if (particle.life <= 0) {
      particles.splice(index, 1);
    }
  });

  // Обновление взрывов
  explosions.forEach((explosion, index) => {
    explosion.life--;
    if (explosion.life <= 0) {
      explosions.splice(index, 1);
    }
  });

  // Удаление мёртвых зомби
  zombies = zombies.filter(z => {
    if (z.lifetime <= 0 || z.hp <= 0) {
      createParticle(z.x, z.y, "Исчез", "#666666");
      return false;
    }
    return true;
  });

  // Добавление солдат из очереди
  if (soldierQueue.length > 0) {
    const soldier = soldierQueue.shift();
    soldiers.push(soldier);
  }

  updateUI();

  // Проверка поражения
  if (baseHP <= 0) {
    alert(`Игра окончена! Вы продержались ${wave} волн.`);
    location.reload();
  }
}

// Отрисовка
function draw() {
  // Очистка экрана - новый градиент для стикмен-мира
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#87CEEB'); // Небо
  gradient.addColorStop(0.3, '#98FB98'); // Светло-зеленый
  gradient.addColorStop(0.5, '#32CD32'); // Зеленый
  gradient.addColorStop(0.7, '#228B22'); // Темно-зеленый
  gradient.addColorStop(1, '#8B4513'); // Земля

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Фон звезд (только в верхней части)
  ctx.fillStyle = 'white';
  backgroundStars.forEach(star => {
    if (star.y < 100) { // Только в небесной части
      ctx.globalAlpha = star.brightness;
      ctx.fillRect(star.x - camera.x * 0.1, star.y - camera.y * 0.1, star.size, star.size);
    }
  });
  ctx.globalAlpha = 1;

  // Отрисовка облаков с улучшенным дизайном
  clouds.forEach(cloud => {
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    const cloudX = cloud.x - camera.x * 0.3;
    const cloudY = cloud.y - camera.y * 0.3;

    // Рисуем облако из нескольких кругов
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      const offsetX = (i - 2) * cloud.size * 0.3;
      const offsetY = Math.sin(i) * cloud.size * 0.2;
      ctx.arc(cloudX + offsetX, cloudY + offsetY, cloud.size * (0.8 + Math.sin(i) * 0.2), 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Отрисовка деревьев
  trees.forEach(tree => {
    const treeX = tree.x - camera.x * 0.7;
    const treeY = tree.y - camera.y * 0.7;

    // Ствол
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(treeX - tree.width/2, treeY, tree.width, tree.height);

    // Крона
    ctx.fillStyle = "#228B22";
    ctx.beginPath();
    ctx.arc(treeX, treeY, tree.width * 2, 0, Math.PI * 2);
    ctx.fill();
  });

  // Отрисовка камней
  rocks.forEach(rock => {
    ctx.fillStyle = "#696969";
    ctx.beginPath();
    ctx.arc(rock.x - camera.x * 0.8, rock.y - camera.y * 0.8, rock.size, 0, Math.PI * 2);
    ctx.fill();
  });

  // Отрисовка травы
  grass.forEach(g => {
    ctx.strokeStyle = "#228B22";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(g.x - camera.x * 0.9, g.y - camera.y * 0.9);
    ctx.lineTo(g.x - camera.x * 0.9, g.y - g.height - camera.y * 0.9);
    ctx.stroke();
  });

  // База (улучшенный дизайн)
  const baseX = BASE_X - camera.x;
  const baseY = BASE_Y - camera.y;

  // Основной корпус базы
  const baseGradient = ctx.createLinearGradient(baseX, baseY, baseX, baseY + BASE_HEIGHT);
  baseGradient.addColorStop(0, "#2E86AB");
  baseGradient.addColorStop(0.5, "#4169E1");
  baseGradient.addColorStop(1, "#1E3A8A");
  ctx.fillStyle = baseGradient;
  ctx.fillRect(baseX, baseY, BASE_WIDTH, BASE_HEIGHT);

  // Металлическая окантовка
  ctx.strokeStyle = "#C0C0C0";
  ctx.lineWidth = 3;
  ctx.strokeRect(baseX, baseY, BASE_WIDTH, BASE_HEIGHT);

  // Верхняя башня
  ctx.fillStyle = "#1E3A8A";
  ctx.fillRect(baseX + 20, baseY - 20, 60, 25);
  ctx.strokeStyle = "#C0C0C0";
  ctx.lineWidth = 2;
  ctx.strokeRect(baseX + 20, baseY - 20, 60, 25);

  // Зубцы на крыше
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = "#1E3A8A";
    ctx.fillRect(baseX + 25 + i * 15, baseY - 30, 8, 10);
    ctx.strokeStyle = "#C0C0C0";
    ctx.strokeRect(baseX + 25 + i * 15, baseY - 30, 8, 10);
  }

  // Детали верхней части
  ctx.fillStyle = "#000080";
  ctx.fillRect(baseX + 5, baseY + 5, BASE_WIDTH - 10, 15);
  ctx.strokeStyle = "#4169E1";
  ctx.lineWidth = 1;
  ctx.strokeRect(baseX + 5, baseY + 5, BASE_WIDTH - 10, 15);

  // Окна с подсветкой
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 2; j++) {
      const windowX = baseX + 15 + i * 25;
      const windowY = baseY + 35 + j * 25;

      // Рамка окна
      ctx.fillStyle = "#2F2F2F";
      ctx.fillRect(windowX - 2, windowY - 2, 14, 14);

      // Само окно с эффектом свечения
      const windowGradient = ctx.createRadialGradient(windowX + 5, windowY + 5, 0, windowX + 5, windowY + 5, 8);
      windowGradient.addColorStop(0, "#87CEEB");
      windowGradient.addColorStop(0.7, "#4682B4");
      windowGradient.addColorStop(1, "#1E3A8A");
      ctx.fillStyle = windowGradient;
      ctx.fillRect(windowX, windowY, 10, 10);

      // Разделители окна
      ctx.strokeStyle = "#2F2F2F";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(windowX + 5, windowY);
      ctx.lineTo(windowX + 5, windowY + 10);
      ctx.moveTo(windowX, windowY + 5);
      ctx.lineTo(windowX + 10, windowY + 5);
      ctx.stroke();
    }
  }

  // Вход в базу
  ctx.fillStyle = "#2F2F2F";
  ctx.fillRect(baseX + 40, baseY + 80, 20, 20);
  const doorGradient = ctx.createLinearGradient(baseX + 40, baseY + 80, baseX + 60, baseY + 100);
  doorGradient.addColorStop(0, "#8B4513");
  doorGradient.addColorStop(1, "#654321");
  ctx.fillStyle = doorGradient;
  ctx.fillRect(baseX + 42, baseY + 82, 16, 16);

  // Ручка двери
  ctx.fillStyle = "#FFD700";
  ctx.beginPath();
  ctx.arc(baseX + 54, baseY + 90, 2, 0, Math.PI * 2);
  ctx.fill();

  // Флаг на башне
  ctx.fillStyle = "#DC143C";
  ctx.fillRect(baseX + 85, baseY - 25, 15, 10);
  ctx.strokeStyle = "#8B0000";
  ctx.lineWidth = 1;
  ctx.strokeRect(baseX + 85, baseY - 25, 15, 10);

  // Флагшток
  ctx.strokeStyle = "#D3D3D3";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(baseX + 85, baseY - 35);
  ctx.lineTo(baseX + 85, baseY - 15);
  ctx.stroke();

  // Номер уровня базы на флаге
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 8px Arial";
  ctx.textAlign = "center";
  ctx.fillText(baseLevel.toString(), baseX + 92, baseY - 19);
  ctx.textAlign = "left";

  // Полоса здоровья базы с улучшенным дизайном
  const hpBarWidth = BASE_WIDTH + 20;
  const hpBarHeight = 12;

  // Фон полосы здоровья
  ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
  ctx.fillRect(baseX - 10, baseY - 20, hpBarWidth, hpBarHeight);

  // Рамка полосы здоровья
  ctx.strokeStyle = "#C0C0C0";
  ctx.lineWidth = 2;
  ctx.strokeRect(baseX - 10, baseY - 20, hpBarWidth, hpBarHeight);

  // Полоса здоровья с градиентом
  const hpPercent = baseHP / maxBaseHP;
  const healthGradient = ctx.createLinearGradient(baseX - 8, baseY - 18, baseX - 8 + (hpBarWidth - 4) * hpPercent, baseY - 18);

  if (hpPercent > 0.6) {
    healthGradient.addColorStop(0, "#00FF00");
    healthGradient.addColorStop(1, "#4CAF50");
  } else if (hpPercent > 0.3) {
    healthGradient.addColorStop(0, "#FFD700");
    healthGradient.addColorStop(1, "#FFA500");
  } else {
    healthGradient.addColorStop(0, "#FF4444");
    healthGradient.addColorStop(1, "#8B0000");
  }

  ctx.fillStyle = healthGradient;
  ctx.fillRect(baseX - 8, baseY - 18, (hpBarWidth - 4) * hpPercent, hpBarHeight - 4);

  // Текст HP на полосе
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 10px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`${baseHP}/${maxBaseHP}`, baseX + BASE_WIDTH/2, baseY - 11);
  ctx.textAlign = "left";

  // Солдаты-стикмены
  soldiers.forEach(soldier => {
    const soldierType = soldierTypes[soldier.type];

    // Отрисовка стикмена-солдата
    drawStickman(soldier.x, soldier.y, soldierType.color, soldier.animFrame, soldier.type, 1);

    // Полоска здоровья солдата
    if (soldier.hp && soldier.hp < soldier.maxHp) {
      const hpRatio = soldier.hp / soldier.maxHp;
      const soldierX = soldier.x - camera.x;
      const soldierY = soldier.y - camera.y;

      ctx.fillStyle = '#333';
      ctx.fillRect(soldierX - 15, soldierY - 35, 30, 5);
      ctx.fillStyle = hpRatio > 0.3 ? '#4CAF50' : '#FF4444';
      ctx.fillRect(soldierX - 15, soldierY - 35, 30 * hpRatio, 5);
    }
  });

  // Враги-стикмены
  enemies.forEach(enemy => {
    const enemyType = enemyTypes[enemy.type];

    // Эффекты состояния
    if (enemy.slowEffect > 0) {
      ctx.fillStyle = "rgba(0, 100, 255, 0.3)";
      ctx.fillRect(enemy.x - camera.x - 20, enemy.y - camera.y - 30, 40, 60);
    }
    if (enemy.poisonEffect > 0) {
      ctx.fillStyle = "rgba(147, 112, 219, 0.3)";
      ctx.fillRect(enemy.x - camera.x - 20, enemy.y - camera.y - 30, 40, 60);
}

    // Отрисовка стикмена-врага
    let size = enemyType.isBoss ? 1.5 : 1;
    drawEnemyStickman(enemy.x, enemy.y, enemyType.color, enemy.animFrame, enemy.type, size);

    // Полоска здоровья врага
    const hpRatio = enemy.hp / enemy.maxHp;
    const enemyX = enemy.x - camera.x;
    const enemyY = enemy.y - camera.y;

    ctx.fillStyle = '#333';
    ctx.fillRect(enemyX - 20, enemyY - 40, 40, 6);
    ctx.fillStyle = hpRatio > 0.3 ? '#4CAF50' : '#FF4444';
    ctx.fillRect(enemyX - 20, enemyY - 40, 40 * hpRatio, 6);
  });

  // Зомби-стикмены
  zombies.forEach(z => {
    // Мигание перед исчезновением
    const alpha = z.lifetime < 60 ? (z.lifetime % 10) / 10 : 1;
    ctx.globalAlpha = alpha;

    drawStickman(z.x, z.y, z.color, z.animFrame, 'zombie', 0.8);

    // Полоса здоровья
    if (z.hp < z.maxHp) {
      const zombieX = z.x - camera.x;
      const zombieY = z.y - camera.y;

      ctx.fillStyle = "black";
      ctx.fillRect(zombieX - 10, zombieY - 30, 20, 3);
      ctx.fillStyle = "#8B008B";
      ctx.fillRect(zombieX - 10, zombieY - 30, (z.hp / z.maxHp) * 20, 3);
    }

    ctx.globalAlpha = 1;
  });

  // Пули/стрелы/магические шары
  bullets.forEach(bullet => {
    if (bullet.isMagicBall) {
      // Магический шар
      ctx.fillStyle = '#FF69B4';
      ctx.shadowColor = '#FF69B4';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(bullet.x - camera.x, bullet.y - camera.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    } else if (bullet.isArrow) {
      // Стрела для лучников и арбалетчиков
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bullet.x - camera.x - 3, bullet.y - camera.y);
      ctx.lineTo(bullet.x - camera.x + 3, bullet.y - camera.y);
      ctx.stroke();
      ctx.fillStyle = '#228B22';
      ctx.fillRect(bullet.x - camera.x - 1, bullet.y - camera.y - 1, 2, 2);
    } else {
      // Обычная пуля
      ctx.fillStyle = '#FFFF00';
      ctx.shadowColor = '#FFFF00';
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(bullet.x - camera.x, bullet.y - camera.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  });

  // Взрывы
  explosions.forEach(explosion => {
    const alpha = explosion.life / explosion.maxLife;
    ctx.globalAlpha = alpha;

    // Внешний круг
    ctx.fillStyle = '#FF4444';
    ctx.beginPath();
    ctx.arc(explosion.x - camera.x, explosion.y - camera.y, explosion.radius * (1 - alpha), 0, Math.PI * 2);
    ctx.fill();

    // Внутренний круг
    ctx.fillStyle = '#FFFF00';
    ctx.beginPath();
    ctx.arc(explosion.x - camera.x, explosion.y - camera.y, explosion.radius * (1 - alpha) * 0.5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  // Частицы
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  particles.forEach(particle => {
    ctx.fillStyle = particle.color;
    ctx.fillText(particle.text, particle.x - camera.x, particle.y - camera.y);
  });
  ctx.textAlign = 'left';

  // Пауза
  if (paused) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('ПАУЗА', canvas.width / 2, canvas.height / 2);
    ctx.textAlign = 'left';
  }
}

// Адаптивное позиционирование панели оружия
function repositionWeaponPanel() {
  const panel = document.getElementById("weapon-info");
  if (!panel) return;

  const rect = panel.getBoundingClientRect();
  const windowWidth = window.innerWidth;

  // Проверяем, не выходит ли панель за правый край экрана
  if (rect.right > windowWidth - 10) {
    panel.style.left = "calc(100% - 20px)";
    panel.style.transform = "translateX(-100%)";
  } else if (rect.left < 10) {
    // Проверяем левый край
    panel.style.left = "20px";
    panel.style.transform = "translateX(0)";
  } else {
    // Возвращаем к центральному позиционированию
    panel.style.left = "50%";
    panel.style.transform = "translateX(-50%)";
  }
}

// Добавляем обработчики событий для адаптивности
window.addEventListener("resize", repositionWeaponPanel);
window.addEventListener("load", repositionWeaponPanel);

// Главный игровой цикл
function gameLoop() {
  requestAnimationFrame(gameLoop);
  update();
  draw();
}

// Старт
initBackground();
updateUI();
gameLoop();