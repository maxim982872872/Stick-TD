
// Модуль игровых сущностей
class Entity {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.animFrame = 0;
  }

  update() {
    this.animFrame++;
  }

  distanceTo(other) {
    return Math.hypot(other.x - this.x, other.y - this.y);
  }
}

class Enemy extends Entity {
  constructor(x, y, type) {
    super(x, y);
    const config = GameConfig.enemies[type];
    this.type = type;
    this.hp = config.hp;
    this.maxHP = config.hp;
    this.damage = config.damage;
    this.speed = config.speed;
    this.reward = config.reward;
    this.color = config.color;
    this.isBoss = config.isBoss || false;
    this.name = config.name || type;
    this.slowEffect = 0;
    this.attackCooldown = 0;
  }

  update(baseX, baseY) {
    super.update();
    
    if (this.slowEffect > 0) {
      this.slowEffect--;
    }
    
    // Оглушение
    if (this.stunned > 0) {
      this.stunned--;
      return 0; // Не может двигаться или атаковать
    }

    const dx = baseX - this.x;
    const dy = baseY - this.y;
    const distance = this.distanceTo({ x: baseX, y: baseY });

    if (distance > 50) {
      // Движение к базе
      let speed = this.speed;
      if (this.slowEffect > 0) speed *= 0.5;
      
      this.x += (dx / distance) * speed;
      this.y += (dy / distance) * speed;
    } else {
      // Атака базы
      if (this.attackCooldown <= 0) {
        this.attackCooldown = 60; // 1 секунда между атаками
        return this.damage; // Возвращаем урон по базе
      } else {
        this.attackCooldown--;
      }
    }
    return 0;
  }

  takeDamage(damage) {
    // Щит паладина
    if (this.special && this.special.shield && Math.random() < 0.4) {
      return false; // Блокировал атаку
    }
    this.hp -= damage;
    return this.hp <= 0;
  }

  draw(ctx, camera) {
    const x = this.x - camera.x;
    const y = this.y - camera.y;
    
    ctx.save();
    ctx.translate(x, y);

    const bounce = Math.sin(this.animFrame * 0.15) * 1;
    const size = this.isBoss ? 1.5 : 1;

    ctx.scale(size, size);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;

    // Голова
    ctx.beginPath();
    ctx.arc(0, -10 + bounce, 8, 0, GameConfig.TWO_PI);
    ctx.stroke();

    // Злые глаза
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(-3, -12 + bounce, 2, 2);
    ctx.fillRect(1, -12 + bounce, 2, 2);

    // Тело
    ctx.beginPath();
    ctx.moveTo(0, -2 + bounce);
    ctx.lineTo(0, 15 + bounce);
    ctx.stroke();

    // Руки
    ctx.beginPath();
    ctx.moveTo(0, 0 + bounce);
    ctx.lineTo(-10, 8 + bounce);
    ctx.moveTo(0, 0 + bounce);
    ctx.lineTo(10, 8 + bounce);
    ctx.stroke();

    // Ноги
    ctx.beginPath();
    ctx.moveTo(0, 15 + bounce);
    ctx.lineTo(-6, 25 + bounce);
    ctx.moveTo(0, 15 + bounce);
    ctx.lineTo(6, 25 + bounce);
    ctx.stroke();

    // Полоска здоровья
    if (this.hp < this.maxHP) {
      ctx.fillStyle = "#FF0000";
      ctx.fillRect(-15, -25, 30, 4);
      ctx.fillStyle = "#00FF00";
      ctx.fillRect(-15, -25, (this.hp / this.maxHP) * 30, 4);
    }

    // Корона для боссов
    if (this.isBoss) {
      ctx.strokeStyle = "#FFD700";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-8, -18 + bounce);
      ctx.lineTo(-5, -25 + bounce);
      ctx.lineTo(0, -20 + bounce);
      ctx.lineTo(5, -25 + bounce);
      ctx.lineTo(8, -18 + bounce);
      ctx.stroke();
    }

    ctx.restore();
  }
}

class Soldier extends Entity {
  constructor(x, y, type) {
    super(x, y);
    const config = GameConfig.soldiers[type];
    this.type = type;
    this.hp = config.hp;
    this.maxHP = config.hp;
    this.damage = config.damage;
    this.range = config.range;
    this.cooldown = 0;
    this.maxCooldown = config.cooldown;
    this.color = config.color;
    this.special = {
      heal: config.heal || false,
      aoe: config.aoe || false,
      slow: config.slow || false,
      summon: config.summon || false,
      stun: config.stun || false,
      shield: config.shield || false
    };
    this.target = null;
    this.patrolAngle = Math.random() * GameConfig.TWO_PI;
    this.patrolRadius = 80 + Math.random() * 40;
    this.shieldActive = this.special.shield;
  }

  update(enemies, soldiers, baseX, baseY) {
    super.update();
    
    if (this.cooldown > 0) this.cooldown--;

    // Поиск цели
    this.findTarget(enemies);

    if (this.target && this.cooldown <= 0) {
      return this.attack(enemies, soldiers, baseX, baseY);
    } else if (!this.target) {
      this.patrol(baseX, baseY);
    }
    
    return null;
  }

  findTarget(enemies) {
    let target = null;
    let minDistance = Infinity;

    enemies.forEach(enemy => {
      const dist = this.distanceTo(enemy);
      if (dist < this.range && dist < minDistance && enemy.hp > 0) {
        minDistance = dist;
        target = enemy;
      }
    });

    this.target = target;
  }

  attack(enemies, soldiers, baseX, baseY) {
    const actions = [];

    if (this.special.heal) {
      // Лечение союзников
      soldiers.forEach(ally => {
        const dist = this.distanceTo(ally);
        if (dist < this.range && ally.hp < ally.maxHP) {
          ally.hp = Math.min(ally.hp + 20, ally.maxHP);
          actions.push({ type: 'particle', x: ally.x, y: ally.y, text: '+20', color: '#00FF00' });
        }
      });
    } else if (this.special.aoe) {
      // АОЕ атака (маг и гигант)
      enemies.forEach(enemy => {
        const dist = this.distanceTo(enemy);
        if (dist <= this.range && enemy.hp > 0) {
          enemy.hp -= this.damage;
          
          // Оглушение для гиганта
          if (this.special.stun && Math.random() < 0.3) {
            enemy.stunned = 180; // 3 секунды оглушения
            actions.push({ type: 'particle', x: enemy.x, y: enemy.y, text: 'STUN!', color: '#FF6B35' });
          }
          
          actions.push({ type: 'particle', x: enemy.x, y: enemy.y, text: `-${this.damage}`, color: this.color });
        }
      });
      actions.push({ type: 'explosion', x: this.x, y: this.y, radius: this.range });
    } else {
      // Обычная атака
      if (this.target) {
        if (this.special.slow) {
          this.target.slowEffect = 60;
        }
        this.target.hp -= this.damage;
        actions.push({ 
          type: 'bullet', 
          x: this.x, 
          y: this.y, 
          targetX: this.target.x, 
          targetY: this.target.y,
          damage: this.damage,
          color: this.color
        });
        actions.push({ type: 'particle', x: this.target.x, y: this.target.y, text: `-${this.damage}`, color: this.color });
      }
    }

    this.cooldown = this.maxCooldown;
    return actions;
  }

  patrol(baseX, baseY) {
    const targetX = baseX + Math.cos(this.patrolAngle) * this.patrolRadius;
    const targetY = baseY + Math.sin(this.patrolAngle) * this.patrolRadius;

    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const distance = Math.hypot(dx, dy);

    if (distance > 10) {
      this.x += (dx / distance) * 0.5;
      this.y += (dy / distance) * 0.5;
    } else {
      this.patrolAngle += 0.02;
    }
  }

  draw(ctx, camera) {
    const x = this.x - camera.x;
    const y = this.y - camera.y;

    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;

    const bounce = Math.sin(this.animFrame * 0.2) * 2;

    // Голова
    ctx.beginPath();
    ctx.arc(0, -15 + bounce, 5, 0, GameConfig.TWO_PI);
    ctx.stroke();

    // Тело
    ctx.beginPath();
    ctx.moveTo(0, -10 + bounce);
    ctx.lineTo(0, 10 + bounce);
    ctx.stroke();

    // Руки (анимация)
    const armSwing = Math.sin(this.animFrame * 0.3) * 10;
    ctx.beginPath();
    ctx.moveTo(0, -5 + bounce);
    ctx.lineTo(-8 + armSwing, 5 + bounce);
    ctx.moveTo(0, -5 + bounce);
    ctx.lineTo(8 - armSwing, 5 + bounce);
    ctx.stroke();

    // Ноги (анимация ходьбы)
    const legSwing = Math.sin(this.animFrame * 0.4) * 8;
    ctx.beginPath();
    ctx.moveTo(0, 10 + bounce);
    ctx.lineTo(-5 + legSwing, 25 + bounce);
    ctx.moveTo(0, 10 + bounce);
    ctx.lineTo(5 - legSwing, 25 + bounce);
    ctx.stroke();

    // Особые атрибуты для разных типов
    this.drawSpecialAttributes(ctx, bounce);

    // Полоска здоровья
    if (this.hp < this.maxHP) {
      ctx.fillStyle = "#FF0000";
      ctx.fillRect(-15, -35, 30, 4);
      ctx.fillStyle = "#00FF00";
      ctx.fillRect(-15, -35, (this.hp / this.maxHP) * 30, 4);
    }

    ctx.restore();
  }

  drawSpecialAttributes(ctx, bounce) {
    switch (this.type) {
      case 'archer':
      case 'crossbowman':
        // Лук
        ctx.strokeStyle = "#8B4513";
        ctx.beginPath();
        ctx.arc(-10, -5 + bounce, 8, Math.PI * 0.3, Math.PI * 1.7);
        ctx.stroke();
        break;
      case 'warrior':
      case 'pikeman':
        // Меч/копье
        ctx.strokeStyle = "#C0C0C0";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(8, -10 + bounce);
        ctx.lineTo(15, -20 + bounce);
        ctx.stroke();
        break;
      case 'mage':
      case 'necromancer':
        // Посох
        ctx.strokeStyle = "#8B4513";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-8, -5 + bounce);
        ctx.lineTo(-8, -25 + bounce);
        ctx.stroke();
        // Магический кристалл
        ctx.fillStyle = this.type === 'mage' ? "#4B0082" : "#800080";
        ctx.beginPath();
        ctx.arc(-8, -25 + bounce, 3, 0, GameConfig.TWO_PI);
        ctx.fill();
        break;
      case 'healer':
        // Крест целителя
        ctx.strokeStyle = "#FF0000";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-3, -20 + bounce);
        ctx.lineTo(3, -20 + bounce);
        ctx.moveTo(0, -23 + bounce);
        ctx.lineTo(0, -17 + bounce);
        ctx.stroke();
        break;
      case 'giant':
        // Большой молот
        ctx.strokeStyle = "#696969";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(10, -5 + bounce);
        ctx.lineTo(10, -30 + bounce);
        ctx.stroke();
        // Головка молота
        ctx.fillStyle = "#2F4F4F";
        ctx.fillRect(5, -35 + bounce, 10, 8);
        // Искры силы
        for (let i = 0; i < 3; i++) {
          ctx.fillStyle = "#FFD700";
          ctx.beginPath();
          ctx.arc(15 + Math.sin(this.animFrame * 0.2 + i) * 5, -15 + bounce + i * 5, 2, 0, GameConfig.TWO_PI);
          ctx.fill();
        }
        break;
      case 'paladin':
        // Щит
        ctx.strokeStyle = "#FFD700";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(-12, -5 + bounce, 10, Math.PI * 0.2, Math.PI * 1.8);
        ctx.stroke();
        // Крест на щите
        ctx.strokeStyle = "#FF0000";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-15, -8 + bounce);
        ctx.lineTo(-9, -8 + bounce);
        ctx.moveTo(-12, -11 + bounce);
        ctx.lineTo(-12, -5 + bounce);
        ctx.stroke();
        // Меч
        ctx.strokeStyle = "#C0C0C0";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(8, -10 + bounce);
        ctx.lineTo(15, -25 + bounce);
        ctx.stroke();
        // Световой эффект для паладина
        if (this.shieldActive && Math.random() < 0.3) {
          ctx.save();
          ctx.globalAlpha = 0.5;
          ctx.strokeStyle = "#FFD700";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, -5 + bounce, 20, 0, GameConfig.TWO_PI);
          ctx.stroke();
          ctx.restore();
        }
        break;
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Entity, Enemy, Soldier };
} else if (typeof window !== 'undefined') {
  window.Entity = Entity;
  window.Enemy = Enemy;
  window.Soldier = Soldier;
}
