// Конфигурация игры для легкого балансирования
const GameConfig = {
  // Константы математики (кэшируем вычисления)
  TWO_PI: Math.PI * 2,

  // Настройки игрока
  player: {
    startGold: 100,
    startArrows: 5,
    baseHP: 100,
    baseLevel: 1
  },

  // Оружие
  weapons: {
    simple: { damage: 20, maxArrows: 5, reloadTime: 6000 },
    enhanced: { damage: 35, maxArrows: 8, reloadTime: 5000, cost: 800 },
    crossbow: { damage: 50, maxArrows: 3, reloadTime: 8000, piercing: true, cost: 1500 },
    magic: { damage: 100, maxArrows: 20, reloadTime: 1000, aoe: true, cost: 3000 }
  },

  // Солдаты
  soldiers: {
    warrior: { 
      cost: 150, hp: 80, damage: 15, range: 400, cooldown: 60, color: "#8B4513",
      name: "Воин-стикмен"
    },
    archer: { 
      cost: 200, hp: 50, damage: 25, range: 150, cooldown: 45, color: "#228B22",
      name: "Лучник-стикмен"
    },
    crossbowman: { 
      cost: 350, hp: 60, damage: 38, range: 180, cooldown: 56, color: "#8B008B",
      name: "Арбалетчик-стикмен"
    },
    pikeman: { 
      cost: 300, hp: 75, damage: 20, range: 100, cooldown: 50, color: "#CD853F", 
      slow: true, name: "Копейщик-стикмен"
    },
    mage: { 
      cost: 1200, hp: 40, damage: 500, range: 200, cooldown: 180, color: "#4B0082", 
      aoe: true, name: "Маг-стикмен"
    },
    healer: { 
      cost: 500, hp: 60, damage: 0, range: 120, cooldown: 120, color: "#FFD700", 
      heal: true, name: "Целитель-стикмен"
    },
    necromancer: { 
      cost: 2000, hp: 80, damage: 150, range: 160, cooldown: 150, color: "#800080", 
      summon: true, name: "Некромант-стикмен"
    },
    giant: { 
      cost: 3500, hp: 1000, damage: 50, range: 120, cooldown: 60, color: "#2F4F4F", 
      aoe: true, stun: true, name: "Гигант-стикмен"
    },
    paladin: { 
      cost: 2500, hp: 250, damage: 50, range: 150, cooldown: 75, color: "#FFD700", 
      shield: true, name: "Паладин-стикмен"
    }
  },

  // Враги - сбалансированный урон
  enemies: {
    skeleton: { hp: 50, damage: 5, speed: 0.8, reward: 15, color: "#E8E8E8" },
    orc: { hp: 80, damage: 8, speed: 0.6, reward: 25, color: "#228B22" },
    troll: { hp: 150, damage: 12, speed: 0.4, reward: 40, color: "#8B4513" },
    goblin: { hp: 30, damage: 4, speed: 1.2, reward: 12, color: "#32CD32" },
    demon: { hp: 200, damage: 15, speed: 0.7, reward: 60, color: "#8B0000" },
    ironGolem: { hp: 1000, damage: 30, speed: 0.2, reward: 300, color: "#2F4F4F", isBoss: true, name: "Железный Голем" },
    shadowMage: { hp: 600, damage: 25, speed: 0.5, reward: 250, color: "#4B0082", isBoss: true, name: "Теневой Маг" }
  },

  // Настройки волн - исправлено для лучшего баланса
  waves: {
    enemiesPerWave: (wave) => Math.min(2 + Math.floor(wave * 0.8), 8), // Меньше врагов в начале
    spawnDelay: 2000, // 2 секунды между спавнами
    waveReward: (wave) => Math.floor(50 + wave * 15),
    bossWaveInterval: 5
  },

  // Улучшения
  upgrades: {
    archerDamage: { baseCost: 200, multiplier: 1.5, costIncrease: 1.5 },
    fireRate: { baseCost: 300, multiplier: 0.8, costIncrease: 1.5 },
    baseHP: { baseCost: 250, bonus: 50, costIncrease: 1.5 },
    baseLevel: { baseCost: 500, bonus: 100, costIncrease: 1.5 }
  },

  // Достижения
  achievements: {
    firstKill: { name: "Первая кровь", description: "Убейте первого врага", reward: 50 },
    wave5: { name: "Выживший", description: "Дойдите до 5 волны", reward: 100 },
    wave10: { name: "Ветеран", description: "Дойдите до 10 волны", reward: 200 },
    hundredKills: { name: "Убийца", description: "Убейте 100 врагов", reward: 300 },
    firstBoss: { name: "Убийца боссов", description: "Убейте первого босса", reward: 500 }
  }
};

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameConfig;
} else if (typeof window !== 'undefined') {
  window.GameConfig = GameConfig;
}