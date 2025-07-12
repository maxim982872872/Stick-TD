
// Система достижений
class AchievementSystem {
  constructor() {
    this.unlockedAchievements = new Set();
    this.statistics = {
      enemiesKilled: 0,
      waveReached: 0,
      bossesKilled: 0,
      goldEarned: 0,
      soldiersHired: 0
    };
  }

  checkAchievement(id) {
    if (this.unlockedAchievements.has(id)) return false;

    const achievement = GameConfig.achievements[id];
    if (!achievement) return false;

    let unlocked = false;

    switch (id) {
      case 'firstKill':
        unlocked = this.statistics.enemiesKilled >= 1;
        break;
      case 'wave5':
        unlocked = this.statistics.waveReached >= 5;
        break;
      case 'wave10':
        unlocked = this.statistics.waveReached >= 10;
        break;
      case 'hundredKills':
        unlocked = this.statistics.enemiesKilled >= 100;
        break;
      case 'firstBoss':
        unlocked = this.statistics.bossesKilled >= 1;
        break;
    }

    if (unlocked) {
      this.unlockAchievement(id);
      return true;
    }
    return false;
  }

  unlockAchievement(id) {
    if (this.unlockedAchievements.has(id)) return;

    this.unlockedAchievements.add(id);
    const achievement = GameConfig.achievements[id];
    
    // Показать уведомление
    this.showAchievementNotification(achievement);
    
    // Дать награду
    if (window.gameState) {
      window.gameState.gold += achievement.reward;
      window.gameState.updateUI();
    }
  }

  showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
      <div class="achievement-icon">🏆</div>
      <div class="achievement-text">
        <div class="achievement-title">Достижение разблокировано!</div>
        <div class="achievement-name">${achievement.name}</div>
        <div class="achievement-desc">${achievement.description}</div>
        <div class="achievement-reward">+${achievement.reward} золота</div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 4000);
  }

  updateStatistic(stat, value) {
    if (this.statistics.hasOwnProperty(stat)) {
      this.statistics[stat] = Math.max(this.statistics[stat], value);
      
      // Проверяем достижения после обновления статистики
      Object.keys(GameConfig.achievements).forEach(id => {
        this.checkAchievement(id);
      });
    }
  }

  incrementStatistic(stat, amount = 1) {
    if (this.statistics.hasOwnProperty(stat)) {
      this.statistics[stat] += amount;
      
      Object.keys(GameConfig.achievements).forEach(id => {
        this.checkAchievement(id);
      });
    }
  }

  getProgress() {
    return {
      unlocked: Array.from(this.unlockedAchievements),
      statistics: { ...this.statistics }
    };
  }

  loadProgress(data) {
    if (data.unlocked) {
      this.unlockedAchievements = new Set(data.unlocked);
    }
    if (data.statistics) {
      this.statistics = { ...this.statistics, ...data.statistics };
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AchievementSystem;
} else if (typeof window !== 'undefined') {
  window.AchievementSystem = AchievementSystem;
}
