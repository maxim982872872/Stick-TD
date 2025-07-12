
// Система крафта для создания солдат и врагов
// Stick TD - Crafting System

class CraftingSystem {
  constructor() {
    this.soldierTemplates = new Map();
    this.enemyTemplates = new Map();
    this.initializeBasicTemplates();
  }

  // Инициализация базовых шаблонов
  initializeBasicTemplates() {
    // Базовые характеристики для солдат
    this.soldierBaseStats = {
      hp: 50,              // Здоровье
      damage: 10,          // Урон
      range: 100,          // Дальность атаки/обнаружения
      attackSpeed: 1.0,    // Скорость атаки (множитель)
      speed: 1.0,          // Скорость передвижения
      defense: 0,          // Броня/защита
      aoeRadius: 0,        // Радиус АОЕ атаки
      piercingChance: 0,   // Шанс пронзания (0-1)
      slashingChance: 0,   // Шанс прорезания (0-1)
      stunChance: 0,       // Шанс оглушения (0-1)
      stunDuration: 0,     // Длительность оглушения в тиках
      healAmount: 0,       // Количество лечения
      summonCooldown: 0,   // Перезарядка призыва
      summonType: null,    // Что призывает
      attackRange: 100,    // Реальная дальность атаки
      isMelee: false,      // Ближний/дальний бой
      cost: 100,           // Стоимость
      cooldown: 60         // Перезарядка между атаками
    };

    // Базовые характеристики для врагов
    this.enemyBaseStats = {
      hp: 30,              // Здоровье
      damage: 8,           // Урон по базе
      speed: 1.0,          // Скорость движения
      reward: 15,          // Золото за убийство
      size: 1,             // Размер (1 = обычный, 2 = большой)
      abilities: [],       // Особые способности
      resistances: {},     // Сопротивления к типам урона
      immunities: []       // Полная защита от эффектов
    };
  }

  // Создать нового солдата
  createSoldier(config) {
    const soldier = {
      // Основная информация
      name: config.name || "Неизвестный солдат",
      description: config.description || "Базовый солдат",
      color: config.color || "#808080",
      
      // Боевые характеристики
      hp: config.hp || this.soldierBaseStats.hp,
      damage: config.damage || this.soldierBaseStats.damage,
      range: config.range || this.soldierBaseStats.range,
      attackSpeed: config.attackSpeed || this.soldierBaseStats.attackSpeed,
      speed: config.speed || this.soldierBaseStats.speed,
      defense: config.defense || this.soldierBaseStats.defense,
      
      // Специальные атаки
      aoeRadius: config.aoeRadius || this.soldierBaseStats.aoeRadius,
      piercingChance: config.piercingChance || this.soldierBaseStats.piercingChance,
      slashingChance: config.slashingChance || this.soldierBaseStats.slashingChance,
      
      // Оглушение
      stunChance: config.stunChance || this.soldierBaseStats.stunChance,
      stunDuration: config.stunDuration || this.soldierBaseStats.stunDuration,
      
      // Магические способности
      healAmount: config.healAmount || this.soldierBaseStats.healAmount,
      summonCooldown: config.summonCooldown || this.soldierBaseStats.summonCooldown,
      summonType: config.summonType || this.soldierBaseStats.summonType,
      
      // Тип атаки
      isMelee: config.isMelee || this.soldierBaseStats.isMelee,
      attackRange: config.attackRange || config.range || this.soldierBaseStats.attackRange,
      
      // Экономика
      cost: config.cost || this.soldierBaseStats.cost,
      cooldown: config.cooldown || this.soldierBaseStats.cooldown,
      
      // Способности
      abilities: config.abilities || [],
      special: config.special || {},
      size: config.size || 1
    };

    // Валидация характеристик
    this.validateSoldierStats(soldier);
    
    return soldier;
  }

  // Создать нового врага
  createEnemy(config) {
    const enemy = {
      // Основная информация
      name: config.name || "Неизвестный враг",
      description: config.description || "Базовый враг",
      color: config.color || "#FF0000",
      
      // Боевые характеристики
      hp: config.hp || this.enemyBaseStats.hp,
      damage: config.damage || this.enemyBaseStats.damage,
      speed: config.speed || this.enemyBaseStats.speed,
      
      // Награда и размер
      reward: config.reward || this.enemyBaseStats.reward,
      size: config.size || this.enemyBaseStats.size,
      
      // Специальные способности
      abilities: config.abilities || this.enemyBaseStats.abilities,
      resistances: config.resistances || this.enemyBaseStats.resistances,
      immunities: config.immunities || this.enemyBaseStats.immunities
    };

    // Валидация характеристик
    this.validateEnemyStats(enemy);
    
    return enemy;
  }

  // Валидация характеристик солдата
  validateSoldierStats(soldier) {
    if (soldier.hp <= 0) soldier.hp = 1;
    if (soldier.damage < 0) soldier.damage = 0;
    if (soldier.range < 0) soldier.range = 50;
    if (soldier.attackSpeed <= 0) soldier.attackSpeed = 0.1;
    if (soldier.speed <= 0) soldier.speed = 0.1;
    if (soldier.defense < 0) soldier.defense = 0;
    if (soldier.cost < 0) soldier.cost = 10;
    if (soldier.cooldown < 1) soldier.cooldown = 1;
    
    // Ограничение шансов от 0 до 1
    soldier.piercingChance = Math.max(0, Math.min(1, soldier.piercingChance));
    soldier.slashingChance = Math.max(0, Math.min(1, soldier.slashingChance));
    soldier.stunChance = Math.max(0, Math.min(1, soldier.stunChance));
  }

  // Валидация характеристик врага
  validateEnemyStats(enemy) {
    if (enemy.hp <= 0) enemy.hp = 1;
    if (enemy.damage < 0) enemy.damage = 1;
    if (enemy.speed <= 0) enemy.speed = 0.1;
    if (enemy.reward < 0) enemy.reward = 1;
    if (enemy.size <= 0) enemy.size = 1;
  }

  // Сохранить шаблон солдата
  saveSoldierTemplate(id, config) {
    const soldier = this.createSoldier(config);
    this.soldierTemplates.set(id, soldier);
    console.log(`Шаблон солдата "${id}" сохранен:`, soldier);
    return soldier;
  }

  // Сохранить шаблон врага
  saveEnemyTemplate(id, config) {
    const enemy = this.createEnemy(config);
    this.enemyTemplates.set(id, enemy);
    console.log(`Шаблон врага "${id}" сохранен:`, enemy);
    return enemy;
  }

  // Получить шаблон солдата
  getSoldierTemplate(id) {
    return this.soldierTemplates.get(id);
  }

  // Получить шаблон врага
  getEnemyTemplate(id) {
    return this.enemyTemplates.get(id);
  }

  // Список всех шаблонов солдат
  getAllSoldierTemplates() {
    return Array.from(this.soldierTemplates.entries());
  }

  // Список всех шаблонов врагов
  getAllEnemyTemplates() {
    return Array.from(this.enemyTemplates.entries());
  }

  // Экспорт в JSON
  exportToJSON() {
    return {
      soldiers: Object.fromEntries(this.soldierTemplates),
      enemies: Object.fromEntries(this.enemyTemplates)
    };
  }

  // Импорт из JSON
  importFromJSON(data) {
    if (data.soldiers) {
      for (const [id, config] of Object.entries(data.soldiers)) {
        this.soldierTemplates.set(id, config);
      }
    }
    if (data.enemies) {
      for (const [id, config] of Object.entries(data.enemies)) {
        this.enemyTemplates.set(id, config);
      }
    }
  }
}

// Примеры создания солдат и врагов
const craftingExamples = {
  // Пример создания мощного солдата
  createCustomWarrior: function(crafting) {
    return crafting.createSoldier({
      name: "Элитный Воин",
      description: "Мощный ближний боец с оглушением",
      color: "#8B0000",
      hp: 120,
      damage: 30,
      range: 80,
      attackSpeed: 1.2,
      speed: 1.1,
      defense: 10,
      stunChance: 0.3,        // 30% шанс оглушения
      stunDuration: 90,       // 1.5 секунды
      isMelee: true,
      cost: 400,
      cooldown: 50,
      abilities: ["melee", "stun"]
    });
  },

  // Пример создания мага с АОЕ
  createCustomMage: function(crafting) {
    return crafting.createSoldier({
      name: "Архимаг",
      description: "Мощный маг с большой областью поражения",
      color: "#4B0082",
      hp: 60,
      damage: 800,
      range: 250,
      attackSpeed: 0.4,
      speed: 0.8,
      defense: 2,
      aoeRadius: 100,
      isMelee: false,
      cost: 2000,
      cooldown: 200,
      abilities: ["magic", "aoe"]
    });
  },

  // Пример создания сильного врага
  createCustomBoss: function(crafting) {
    return crafting.createEnemy({
      name: "Король Демонов",
      description: "Мощный босс с особыми способностями",
      color: "#8B0000",
      hp: 800,
      damage: 60,
      speed: 0.8,
      reward: 300,
      size: 3,
      abilities: ["teleport", "rage", "summon"],
      resistances: {
        physical: 0.5,  // 50% сопротивление к физическому урону
        magic: 0.3      // 30% сопротивление к магии
      },
      immunities: ["stun"] // Иммунитет к оглушению
    });
  },

  // Пример создания быстрого врага
  createCustomAssassin: function(crafting) {
    return crafting.createEnemy({
      name: "Теневой Убийца",
      description: "Быстрый враг с невидимостью",
      color: "#2F2F2F",
      hp: 40,
      damage: 25,
      speed: 1.8,
      reward: 50,
      size: 1,
      abilities: ["stealth", "critical"],
      immunities: ["slow"] // Иммунитет к замедлению
    });
  }
};

// Инициализация системы крафта
const craftingSystem = new CraftingSystem();

// Примеры использования:
console.log("=== Система крафта инициализирована ===");
console.log("Примеры создания юнитов:");

// Создание и сохранение шаблонов
const customWarrior = craftingExamples.createCustomWarrior(craftingSystem);
craftingSystem.saveSoldierTemplate("elite_warrior", customWarrior);

const customMage = craftingExamples.createCustomMage(craftingSystem);
craftingSystem.saveSoldierTemplate("archmage", customMage);

const customBoss = craftingExamples.createCustomBoss(craftingSystem);
craftingSystem.saveEnemyTemplate("demon_king", customBoss);

const customAssassin = craftingExamples.createCustomAssassin(craftingSystem);
craftingSystem.saveEnemyTemplate("shadow_assassin", customAssassin);

console.log("Все шаблоны созданы и сохранены!");

// Экспорт для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CraftingSystem, craftingExamples };
}
