
// Система сохранения и загрузки прогресса
class SaveSystem {
  static SAVE_KEY = 'stickTD_save';

  static save(gameState) {
    const saveData = {
      gold: gameState.gold,
      wave: gameState.wave,
      baseLevel: gameState.baseLevel,
      maxBaseHP: gameState.maxBaseHP,
      achievements: gameState.achievements,
      upgrades: gameState.upgrades,
      statistics: gameState.statistics,
      timestamp: Date.now()
    };

    try {
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
      return true;
    } catch (e) {
      console.error('Ошибка сохранения:', e);
      return false;
    }
  }

  static load() {
    try {
      const saveData = localStorage.getItem(this.SAVE_KEY);
      if (saveData) {
        return JSON.parse(saveData);
      }
    } catch (e) {
      console.error('Ошибка загрузки:', e);
    }
    return null;
  }

  static hasSave() {
    return localStorage.getItem(this.SAVE_KEY) !== null;
  }

  static deleteSave() {
    localStorage.removeItem(this.SAVE_KEY);
  }

  static exportSave() {
    const saveData = this.load();
    if (saveData) {
      const dataStr = JSON.stringify(saveData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `stickTD_save_${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
    }
  }

  static importSave(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const saveData = JSON.parse(e.target.result);
          localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
          resolve(saveData);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SaveSystem;
} else if (typeof window !== 'undefined') {
  window.SaveSystem = SaveSystem;
}
