// Основной игровой файл - максимально улучшенная версия с эпичной графикой

// Игровые переменные
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Звуковые настройки
let soundEnabled = true;
let soundVolume = 0.3;

// Система локализации
let currentLanguage = 'ru';
const translations = {
  ru: {
    gold: "💰 Золото:",
    arrows: "🏹 Стрелы:",
    base: "🏰 База:",
    baseLevel: "🎯 Уровень базы:",
    wave: "Волна:",
    startWave: "🌊 Начать волну",
    shop: "🛒 Магазин",
    settings: "⚙️ Настройки",
    encyclopedia: "📖 Энциклопедия",
    reloading: "Перезарядка...",
    language: "🌍 Язык:",
    sound: "🔊 Звук",
    volume: "Громкость:",
    controls: "🎮 Управление",
    save: "💾 Сохранение",
    game: "🔄 Игра",
    close: "Закрыть"
  },
  en: {
    gold: "💰 Gold:",
    arrows: "🏹 Arrows:",
    base: "🏰 Base:",
    baseLevel: "🎯 Base Level:",
    wave: "Wave:",
    startWave: "🌊 Start Wave",
    shop: "🛒 Shop",
    settings: "⚙️ Settings",
    encyclopedia: "📖 Encyclopedia",
    reloading: "Reloading...",
    language: "🌍 Language:",
    sound: "🔊 Sound",
    volume: "Volume:",
    controls: "🎮 Controls",
    save: "💾 Save",
    game: "🔄 Game",
    close: "Close"
  },
  uk: {
    gold: "💰 Золото:",
    arrows: "🏹 Стріли:",
    base: "🏰 База:",
    baseLevel: "🎯 Рівень бази:",
    wave: "Хвиля:",
    startWave: "🌊 Почати хвилю",
    shop: "🛒 Магазин",
    settings: "⚙️ Налаштування",
    encyclopedia: "📖 Енциклопедія",
    reloading: "Перезарядка...",
    language: "🌍 Мова:",
    sound: "🔊 Звук",
    volume: "Гучність:",
    controls: "🎮 Керування",
    save: "💾 Збереження",
    game: "🔄 Гра",
    close: "Закрити"
  },
  de: {
    gold: "💰 Gold:",
    arrows: "🏹 Pfeile:",
    base: "🏰 Basis:",
    baseLevel: "🎯 Basis Level:",
    wave: "Welle:",
    startWave: "🌊 Welle starten",
    shop: "🛒 Geschäft",
    settings: "⚙️ Einstellungen",
    encyclopedia: "📖 Enzyklopädie",
    reloading: "Nachladen...",
    language: "🌍 Sprache:",
    sound: "🔊 Ton",
    volume: "Lautstärke:",
    controls: "🎮 Steuerung",
    save: "💾 Speichern",
    game: "🔄 Spiel",
    close: "Schließen"
  },
  zh: {
    gold: "💰 金币:",
    arrows: "🏹 箭矢:",
    base: "🏰 基地:",
    baseLevel: "🎯 基地等级:",
    wave: "波次:",
    startWave: "🌊 开始波次",
    shop: "🛒 商店",
    settings: "⚙️ 设置",
    encyclopedia: "📖 百科全书",
    reloading: "重新装填...",
    language: "🌍 语言:",
    sound: "🔊 声音",
    volume: "音量:",
    controls: "🎮 控制",
    save: "💾 保存",
    game: "🔄 游戏",
    close: "关闭"
  },
  es: {
    gold: "💰 Oro:",
    arrows: "🏹 Flechas:",
    base: "🏰 Base:",
    baseLevel: "🎯 Nivel de Base:",
    wave: "Oleada:",
    startWave: "🌊 Iniciar Oleada",
    shop: "🛒 Tienda",
    settings: "⚙️ Configuración",
    encyclopedia: "📖 Enciclopedia",
    reloading: "Recargando...",
    language: "🌍 Idioma:",
    sound: "🔊 Sonido",
    volume: "Volumen:",
    controls: "🎮 Controles",
    save: "💾 Guardar",
    game: "🔄 Juego",
    close: "Cerrar"
  },
  fr: {
    gold: "💰 Or:",
    arrows: "🏹 Flèches:",
    base: "🏰 Base:",
    baseLevel: "🎯 Niveau de Base:",
    wave: "Vague:",
    startWave: "🌊 Commencer la Vague",
    shop: "🛒 Boutique",
    settings: "⚙️ Paramètres",
    encyclopedia: "📖 Encyclopédie",
    reloading: "Rechargement...",
    language: "🌍 Langue:",
    sound: "🔊 Son",
    volume: "Volume:",
    controls: "🎮 Contrôles",
    save: "💾 Sauvegarder",
    game: "🔄 Jeu",
    close: "Fermer"
  },
  it: {
    gold: "💰 Oro:",
    arrows: "🏹 Frecce:",
    base: "🏰 Base:",
    baseLevel: "🎯 Livello Base:",
    wave: "Ondata:",
    startWave: "🌊 Inizia Ondata",
    shop: "🛒 Negozio",
    settings: "⚙️ Impostazioni",
    encyclopedia: "📖 Enciclopedia",
    reloading: "Ricaricamento...",
    language: "🌍 Lingua:",
    sound: "🔊 Suono",
    volume: "Volume:",
    controls: "🎮 Controlli",
    save: "💾 Salva",
    game: "🔄 Gioco",
    close: "Chiudi"
  },
  pt: {
    gold: "💰 Ouro:",
    arrows: "🏹 Flechas:",
    base: "🏰 Base:",
    baseLevel: "🎯 Nível da Base:",
    wave: "Onda:",
    startWave: "🌊 Iniciar Onda",
    shop: "🛒 Loja",
    settings: "⚙️ Configurações",
    encyclopedia: "📖 Enciclopédia",
    reloading: "Recarregando...",
    language: "🌍 Idioma:",
    sound: "🔊 Som",
    volume: "Volume:",
    controls: "🎮 Controles",
    save: "💾 Salvar",
    game: "🔄 Jogo",
    close: "Fechar"
  },
  ja: {
    gold: "💰 金貨:",
    arrows: "🏹 矢:",
    base: "🏰 基地:",
    baseLevel: "🎯 基地レベル:",
    wave: "ウェーブ:",
    startWave: "🌊 ウェーブ開始",
    shop: "🛒 ショップ",
    settings: "⚙️ 設定",
    encyclopedia: "📖 百科事典",
    reloading: "リロード中...",
    language: "🌍 言語:",
    sound: "🔊 音",
    volume: "音量:",
    controls: "🎮 操作",
    save: "💾 セーブ",
    game: "🔄 ゲーム",
    close: "閉じる"
  },
  ko: {
    gold: "💰 골드:",
    arrows: "🏹 화살:",
    base: "🏰 기지:",
    baseLevel: "🎯 기지 레벨:",
    wave: "웨이브:",
    startWave: "🌊 웨이브 시작",
    shop: "🛒 상점",
    settings: "⚙️ 설정",
    encyclopedia: "📖 백과사전",
    reloading: "재장전 중...",
    language: "🌍 언어:",
    sound: "🔊 소리",
    volume: "볼륨:",
    controls: "🎮 조작",
    save: "💾 저장",
    game: "🔄 게임",
    close: "닫기"
  },
  ar: {
    gold: "💰 ذهب:",
    arrows: "🏹 سهام:",
    base: "🏰 القاعدة:",
    baseLevel: "🎯 مستوى القاعدة:",
    wave: "موجة:",
    startWave: "🌊 بدء الموجة",
    shop: "🛒 متجر",
    settings: "⚙️ الإعدادات",
    encyclopedia: "📖 الموسوعة",
    reloading: "إعادة التحميل...",
    language: "🌍 اللغة:",
    sound: "🔊 الصوت",
    volume: "مستوى الصوت:",
    controls: "🎮 التحكم",
    save: "💾 حفظ",
    game: "🔄 اللعبة",
    close: "إغلاق"
  },
  hi: {
    gold: "💰 सोना:",
    arrows: "🏹 तीर:",
    base: "🏰 आधार:",
    baseLevel: "🎯 आधार स्तर:",
    wave: "लहर:",
    startWave: "🌊 लहर शुरू करें",
    shop: "🛒 दुकान",
    settings: "⚙️ सेटिंग्स",
    encyclopedia: "📖 विश्वकोश",
    reloading: "पुनः लोड हो रहा...",
    language: "🌍 भाषा:",
    sound: "🔊 ध्वनि",
    volume: "आवाज़:",
    controls: "🎮 नियंत्रण",
    save: "💾 सहेजें",
    game: "🔄 खेल",
    close: "बंद करें"
  },
  tr: {
    gold: "💰 Altın:",
    arrows: "🏹 Oklar:",
    base: "🏰 Üs:",
    baseLevel: "🎯 Üs Seviyesi:",
    wave: "Dalga:",
    startWave: "🌊 Dalga Başlat",
    shop: "🛒 Mağaza",
    settings: "⚙️ Ayarlar",
    encyclopedia: "📖 Ansiklopedi",
    reloading: "Yeniden yükleniyor...",
    language: "🌍 Dil:",
    sound: "🔊 Ses",
    volume: "Ses Seviyesi:",
    controls: "🎮 Kontroller",
    save: "💾 Kaydet",
    game: "🔄 Oyun",
    close: "Kapat"
  },
  nl: {
    gold: "💰 Goud:",
    arrows: "🏹 Pijlen:",
    base: "🏰 Basis:",
    baseLevel: "🎯 Basis Niveau:",
    wave: "Golf:",
    startWave: "🌊 Start Golf",
    shop: "🛒 Winkel",
    settings: "⚙️ Instellingen",
    encyclopedia: "📖 Encyclopedie",
    reloading: "Herladen...",
    language: "🌍 Taal:",
    sound: "🔊 Geluid",
    volume: "Volume:",
    controls: "🎮 Besturing",
    save: "💾 Opslaan",
    game: "🔄 Spel",
    close: "Sluiten"
  },
  sv: {
    gold: "💰 Guld:",
    arrows: "🏹 Pilar:",
    base: "🏰 Bas:",
    baseLevel: "🎯 Bas Nivå:",
    wave: "Våg:",
    startWave: "🌊 Starta Våg",
    shop: "🛒 Affär",
    settings: "⚙️ Inställningar",
    encyclopedia: "📖 Encyklopedi",
    reloading: "Laddar om...",
    language: "🌍 Språk:",
    sound: "🔊 Ljud",
    volume: "Volym:",
    controls: "🎮 Kontroller",
    save: "💾 Spara",
    game: "🔄 Spel",
    close: "Stäng"
  },
  pl: {
    gold: "💰 Złoto:",
    arrows: "🏹 Strzały:",
    base: "🏰 Baza:",
    baseLevel: "🎯 Poziom Bazy:",
    wave: "Fala:",
    startWave: "🌊 Rozpocznij Falę",
    shop: "🛒 Sklep",
    settings: "⚙️ Ustawienia",
    encyclopedia: "📖 Encyklopedia",
    reloading: "Przeładowywanie...",
    language: "🌍 Język:",
    sound: "🔊 Dźwięk",
    volume: "Głośność:",
    controls: "🎮 Sterowanie",
    save: "💾 Zapisz",
    game: "🔄 Gra",
    close: "Zamknij"
  },
  cs: {
    gold: "💰 Zlato:",
    arrows: "🏹 Šípy:",
    base: "🏰 Základna:",
    baseLevel: "🎯 Úroveň Základny:",
    wave: "Vlna:",
    startWave: "🌊 Spustit Vlnu",
    shop: "🛒 Obchod",
    settings: "⚙️ Nastavení",
    encyclopedia: "📖 Encyklopedie",
    reloading: "Nabíjení...",
    language: "🌍 Jazyk:",
    sound: "🔊 Zvuk",
    volume: "Hlasitost:",
    controls: "🎮 Ovládání",
    save: "💾 Uložit",
    game: "🔄 Hra",
    close: "Zavřít"
  },
  no: {
    gold: "💰 Gull:",
    arrows: "🏹 Piler:",
    base: "🏰 Base:",
    baseLevel: "🎯 Base Nivå:",
    wave: "Bølge:",
    startWave: "🌊 Start Bølge",
    shop: "🛒 Butikk",
    settings: "⚙️ Innstillinger",
    encyclopedia: "📖 Leksikon",
    reloading: "Laster på nytt...",
    language: "🌍 Språk:",
    sound: "🔊 Lyd",
    volume: "Volum:",
    controls: "🎮 Kontroller",
    save: "💾 Lagre",
    game: "🔄 Spill",
    close: "Lukk"
  },
  da: {
    gold: "💰 Guld:",
    arrows: "🏹 Pile:",
    base: "🏰 Base:",
    baseLevel: "🎯 Base Niveau:",
    wave: "Bølge:",
    startWave: "🌊 Start Bølge",
    shop: "🛒 Butik",
    settings: "⚙️ Indstillinger",
    encyclopedia: "📖 Encyklopædi",
    reloading: "Genindlæser...",
    language: "🌍 Sprog:",
    sound: "🔊 Lyd",
    volume: "Lydstyrke:",
    controls: "🎮 Kontroller",
    save: "💾 Gem",
    game: "🔄 Spil",
    close: "Luk"
  }
};

const languageNames = {
  ru: "🇷🇺 Русский",
  en: "🇺🇸 English",
  uk: "🇺🇦 Українська",
  de: "🇩🇪 Deutsch",
  zh: "🇨🇳 中文",
  es: "🇪🇸 Español",
  fr: "🇫🇷 Français",
  it: "🇮🇹 Italiano",
  pt: "🇵🇹 Português",
  ja: "🇯🇵 日本語",
  ko: "🇰🇷 한국어",
  ar: "🇸🇦 العربية",
  hi: "🇮🇳 हिन्दी",
  tr: "🇹🇷 Türkçe",
  nl: "🇳🇱 Nederlands",
  sv: "🇸🇪 Svenska",
  pl: "🇵🇱 Polski",
  cs: "🇨🇿 Čeština",
  no: "🇳🇴 Norsk",
  da: "🇩🇰 Dansk"
};

function t(key) {
  return translations[currentLanguage][key] || translations['ru'][key] || key;
}

function changeLanguage(lang) {
  if (translations[lang]) {
    currentLanguage = lang;
    localStorage.setItem('gameLanguage', lang);
    updateUITexts();
    showNotification(`🌍 ${t('language')} ${languageNames[lang]}`, "#9C27B0");
  }
}

function updateUITexts() {
  // Обновляем все тексты интерфейса
  const elements = {
    'gold-label': () => t('gold'),
    'arrows-label': () => t('arrows'),
    'base-label': () => t('base'),
    'baseLevel-label': () => t('baseLevel'),
    'wave-counter': () => `${t('wave')} ${gameState.wave}`,
    'start-wave-btn': () => t('startWave'),
    'shop-btn': () => t('shop'),
    'settings-btn': () => t('settings'),
    'encyclopedia-btn': () => t('encyclopedia')
  };

  // Обновляем лейблы в UI
  const goldLabel = document.querySelector('.stat-label');
  if (goldLabel && goldLabel.textContent.includes('💰')) {
    goldLabel.textContent = t('gold');
  }

  const arrowsLabel = document.querySelectorAll('.stat-label')[1];
  if (arrowsLabel && arrowsLabel.textContent.includes('🏹')) {
    arrowsLabel.textContent = t('arrows');
  }

  const baseLabel = document.querySelectorAll('.stat-label')[2];
  if (baseLabel && baseLabel.textContent.includes('🏰')) {
    baseLabel.textContent = t('base');
  }

  const baseLevelLabel = document.querySelectorAll('.stat-label')[3];
  if (baseLevelLabel && baseLevelLabel.textContent.includes('🎯')) {
    baseLevelLabel.textContent = t('baseLevel');
  }

  // Обновляем кнопки
  const shopBtn = document.querySelector('.shop-button');
  if (shopBtn) shopBtn.textContent = t('shop');

  const settingsBtn = document.querySelector('.settings-button');
  if (settingsBtn) settingsBtn.textContent = t('settings');

  const encyclopediaBtn = document.querySelector('.encyclopedia-button');
  if (encyclopediaBtn) encyclopediaBtn.textContent = t('encyclopedia');

  const waveBtn = document.querySelector('.wave-start-button');
  if (waveBtn) waveBtn.textContent = t('startWave');

  gameState.updateUI();
}

// Чит-коды система
let cheatBuffer = '';
let lastCheatTime = 0;

// Состояние игры
let gameState = {
  gold: 100,
  wave: 0,
  baseHP: 100,
  maxBaseHP: 100,
  baseLevel: 1,
  arrows: 10,
  reloading: false,
  paused: false,
  gameStarted: false,
  passiveGoldTimer: 0,
  dayNightCycle: 0,
  timeOfDay: 'day',

  // Системы
  achievementSystem: {
    statistics: { 
      enemiesKilled: 0, 
      bossesKilled: 0, 
      megaBossesKilled: 0,
      waveReached: 0, 
      soldiersHired: 0,
      weaponsUpgraded: 0,
      goldenShotsHit: 0,
      siegeUnitsBuilt: 0
    },
    achievements: [],
    incrementStatistic: function(stat) { this.statistics[stat] = (this.statistics[stat] || 0) + 1; },
    updateStatistic: function(stat, value) { this.statistics[stat] = Math.max(this.statistics[stat] || 0, value); },
    checkAchievements: function() {
      const newAchievements = [];

      // Все новые достижения
      if (this.statistics.enemiesKilled >= 1 && !this.achievements.includes('firstBlood')) {
        newAchievements.push({ id: 'firstBlood', name: '🩸 Первая кровь', desc: 'Убейте первого врага', reward: 50 });
      }
      if (this.statistics.enemiesKilled >= 10 && !this.achievements.includes('killer10')) {
        newAchievements.push({ id: 'killer10', name: '⚔️ Убийца 10', desc: 'Убейте 10 врагов', reward: 100 });
      }
      if (this.statistics.enemiesKilled >= 50 && !this.achievements.includes('killer50')) {
        newAchievements.push({ id: 'killer50', name: '⚔️ Убийца 50', desc: 'Убейте 50 врагов', reward: 200 });
      }
      if (this.statistics.enemiesKilled >= 100 && !this.achievements.includes('killer100')) {
        newAchievements.push({ id: 'killer100', name: '⚔️ Убийца 100', desc: 'Убейте 100 врагов', reward: 300 });
      }
      if (this.statistics.waveReached >= 5 && !this.achievements.includes('survivor5')) {
        newAchievements.push({ id: 'survivor5', name: '🛡️ Выживший 5', desc: 'Дойдите до 5 волны', reward: 100 });
      }
      if (this.statistics.waveReached >= 10 && !this.achievements.includes('survivor10')) {
        newAchievements.push({ id: 'survivor10', name: '🛡️ Выживший 10', desc: 'Дойдите до 10 волны', reward: 200 });
      }
      if (this.statistics.waveReached >= 20 && !this.achievements.includes('survivor20')) {
        newAchievements.push({ id: 'survivor20', name: '🛡️ Выживший 20', desc: 'Дойдите до 20 волны', reward: 800 });
      }
      if (this.statistics.bossesKilled >= 1 && !this.achievements.includes('bossKiller')) {
        newAchievements.push({ id: 'bossKiller', name: '👑 Убийца боссов', desc: 'Победите первого босса', reward: 500 });
      }
      if (this.statistics.megaBossesKilled >= 1 && !this.achievements.includes('megaBossKiller')) {
        newAchievements.push({ id: 'megaBossKiller', name: '👑 Убийца мега-боссов', desc: 'Победите мега-босса', reward: 1000 });
      }
      if (this.statistics.soldiersHired >= 5 && !this.achievements.includes('recruiter')) {
        newAchievements.push({ id: 'recruiter', name: '🎖️ Рекрутер', desc: 'Наймите 5 солдат', reward: 150 });
      }
      if (this.statistics.soldiersHired >= 20 && !this.achievements.includes('commander')) {
        newAchievements.push({ id: 'commander', name: '🎖️ Командир', desc: 'Наймите 20 солдат', reward: 400 });
      }
      if (this.statistics.siegeUnitsBuilt >= 3 && !this.achievements.includes('siegeMaster')) {
        newAchievements.push({ id: 'siegeMaster', name: '🏰 Мастер осады', desc: 'Постройте 3 осадных орудия', reward: 500 });
      }
      if (this.statistics.weaponsUpgraded >= 1 && !this.achievements.includes('weaponMaster')) {
        newAchievements.push({ id: 'weaponMaster', name: '🏹 Мастер оружия', desc: 'Улучшите оружие', reward: 300 });
      }
      if (this.statistics.goldenShotsHit >= 10 && !this.achievements.includes('marksman')) {
        newAchievements.push({ id: 'marksman', name: '🎯 Меткий стрелок', desc: '10 золотых выстрелов', reward: 250 });
      }

      newAchievements.forEach(achievement => {
        this.achievements.push(achievement.id);
        gameState.gold += achievement.reward;
        showNotification(`🏆 ${achievement.name}: +${achievement.reward}💰`, "#FFD700");
      });
    }
  },

  // Оружие игрока
  playerWeapon: { damage: 20, maxArrows: 10, reloadTime: 6000, type: 'simple', aoe: false },

  // Улучшения
  upgrades: {
    archerDamage: { cost: 200, level: 0 },
    fireRate: { cost: 300, level: 0 },
    baseHP: { cost: 250, level: 0 },
    baseLevel: { cost: 500, level: 0 }
  },

  updateUI: function() {
    document.getElementById('gold').textContent = this.gold;
    document.getElementById('arrows').textContent = this.reloading ? t('reloading') : this.arrows;
    document.getElementById('baseLevel').textContent = this.baseLevel;
    document.getElementById('waveCounter').textContent = `${t('wave')} ${this.wave}`;

    const healthPercentage = (this.baseHP / this.maxBaseHP) * 100;
    document.getElementById('baseHealth').style.width = healthPercentage + '%';

    if (this.reloading) {
      document.getElementById('reloadStatus').innerHTML = `<span class="reload-indicator">🔄 ${t('reloading')}</span>`;
    } else {
      document.getElementById('reloadStatus').innerHTML = '';
    }
  }
};

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
let weatherEffects = [];

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

// Конфигурация солдат-стикменов с новыми юнитами
const soldierTypes = {
  warrior: { name: "Воин-стикмен", cost: 150, hp: 80, damage: 15, range: 400, cooldown: 60, color: "#8B4513" },
  archer: { name: "Лучник-стикмен", cost: 200, hp: 50, damage: 25, range: 150, cooldown: 45, color: "#228B22" },
  crossbowman: { name: "Арбалетчик-стикмен", cost: 350, hp: 60, damage: 38, range: 180, cooldown: 56, color: "#8B008B" },
  pikeman: { name: "Копейщик-стикмен", cost: 300, hp: 75, damage: 20, range: 100, cooldown: 50, color: "#CD853F", slow: true },
  mage: { name: "Маг-стикмен", cost: 1200, hp: 40, damage: 500, range: 200, cooldown: 180, color: "#4B0082", isMage: true, aoe: true },
  healer: { name: "Целитель-стикмен", cost: 500, hp: 60, damage: 0, range: 120, cooldown: 120, color: "#FFD700", isHealer: true },
  necromancer: { name: "Некромант-стикмен", cost: 2000, hp: 80, damage: 150, range: 160, cooldown: 150, color: "#800080", isSummoner: true },
  giant: { name: "Гигант-стикмен", cost: 3500, hp: 1000, damage: 50, range: 120, cooldown: 60, color: "#8B4513", aoe: true, stun: true },
  paladin: { name: "Паладин-стикмен", cost: 2500, hp: 250, damage: 50, range: 150, cooldown: 60, color: "#FFD700", shield: true },
  knight: { name: "Рыцарь-стикмен", cost: 800, hp: 150, damage: 40, range: 120, cooldown: 50, color: "#C0C0C0", armor: true },
  catapult: { name: "Катапульта", cost: 4000, hp: 200, damage: 300, range: 250, cooldown: 300, color: "#8B4513", aoe: true, isSiege: true },
  ballista: { name: "Баллиста", cost: 6000, hp: 180, damage: 800, range: 300, cooldown: 900, color: "#2F4F4F", piercing: true, isSiege: true },
  king: { name: "Король-стикмен", cost: 8000, hp: 500, damage: 50, range: 200, cooldown: 800, color: "#FFD700", canSummon: true, isRoyal: true }
};

// Конфигурация врагов-стикменов с новыми врагами
const enemyTypes = {
  goblin: { name: "Гоблин-стикмен", hp: 30, speed: 1, damage: 8, reward: 15, color: "#228B22" },
  hobgoblin: { name: "Хобгоблин-стикмен", hp: 80, speed: 0.9, damage: 18, reward: 35, color: "#8B4513" },
  orc: { name: "Орк-стикмен", hp: 60, speed: 0.8, damage: 15, reward: 25, color: "#8B4513" },
  troll: { name: "Тролль-стикмен", hp: 120, speed: 0.6, damage: 25, reward: 40, color: "#696969" },
  demon: { name: "Демон-стикмен", hp: 200, speed: 0.7, damage: 35, reward: 60, color: "#8B0000" },
  dragon: { name: "Дракон-стикмен", hp: 300, speed: 0.5, damage: 50, reward: 80, color: "#DC143C", isFlying: true },
  darkMage: { name: "Темный Маг", hp: 150, speed: 0.6, damage: 45, reward: 70, color: "#2F2F2F", canCast: true },
  golem: { name: "Голем", hp: 250, speed: 0.4, damage: 55, reward: 85, color: "#8B7D6B" },
  darkEnergy: { name: "Темная Энергия", hp: 180, speed: 1.2, damage: 40, reward: 90, color: "#4B0082", isSpirit: true },
  mummy: { name: "Мумия", hp: 200, speed: 0.5, damage: 30, reward: 75, color: "#D2691E", canSlow: true },
  ironGolem: { name: "Железный Голем", hp: 800, speed: 0.3, damage: 80, reward: 200, color: "#708090", isBoss: true },
  shadowMage: { name: "Теневой Маг", hp: 600, speed: 0.4, damage: 60, reward: 180, color: "#4B0082", isBoss: true, canSummon: true },
  destroyer: { name: "Уничтожитель", hp: 1500, speed: 0.2, damage: 120, reward: 400, color: "#800000", isBoss: true, isMegaBoss: true },
  giantKing: { name: "Король Гигантов", hp: 2000, speed: 0.15, damage: 150, reward: 500, color: "#FFD700", isBoss: true, isMegaBoss: true, canSummon: true }
};

// Чит-коды
const cheatCodes = {
  'admin': () => {
    gameState.gold += 999999;
    gameState.playerWeapon.damage = 10000;
    gameState.playerWeapon.maxArrows = 100;
    gameState.arrows = 100;
    gameState.playerWeapon.aoe = true;
    showNotification("🔥 ADMIN MODE: Бесконечные деньги и супер оружие!", "#FF0000");
    createParticle(canvas.width/2, canvas.height/2, "👑 ADMIN! 👑", "#FF0000", 'cheat');
    gameState.updateUI();
  },
  'money': () => {
    gameState.gold += 50000;
    showNotification("💰 +50000 золота!", "#FFD700");
    createParticle(canvas.width/2, canvas.height/2, "💰 +50000!", "#FFD700", 'cheat');
    gameState.updateUI();
  },
  'health': () => {
    gameState.baseHP = gameState.maxBaseHP;
    showNotification("❤️ Здоровье базы восстановлено!", "#4CAF50");
    createParticle(BASE_X + 50, BASE_Y + 50, "❤️ ПОЛНОЕ HP!", "#4CAF50", 'cheat');
    gameState.updateUI();
  },
  'wave': () => {
    gameState.wave += 5;
    showNotification("🌊 +5 волн!", "#2196F3");
    createParticle(canvas.width/2, canvas.height/2, "🌊 +5 ВОЛН!", "#2196F3", 'cheat');
    gameState.updateUI();
  },
  'god': () => {
    gameState.baseHP = 999999;
    gameState.maxBaseHP = 999999;
    showNotification("🛡️ Режим бога активирован!", "#9C27B0");
    createParticle(BASE_X + 50, BASE_Y + 50, "🛡️ БОГ!", "#9C27B0", 'cheat');
    gameState.updateUI();
  },
  'army': () => {
    const armyTypes = ['warrior', 'archer', 'mage', 'paladin', 'giant'];
    armyTypes.forEach((type, i) => {
      setTimeout(() => {
        soldiers.push({
          x: BASE_X + (i * 30) - 60,
          y: BASE_Y + Math.random() * 50,
          type: type,
          hp: soldierTypes[type].hp,
          maxHP: soldierTypes[type].hp,
          cooldown: 0,
          animFrame: 0
        });
      }, i * 500);
    });
    showNotification("⚔️ Мощная армия призвана!", "#FF5722");
    createParticle(canvas.width/2, canvas.height/2, "⚔️ АРМИЯ!", "#FF5722", 'cheat');
  },
  'nuke': () => {
    enemies.forEach(enemy => {
      createExplosion(enemy.x, enemy.y, 100, "#FF0000");
      gameState.gold += Math.floor(enemy.reward * 0.5);
    });
    enemies = [];
    showNotification("💥 Все враги уничтожены!", "#FF6B35");
    createParticle(canvas.width/2, canvas.height/2, "💥 NUKE!", "#FF6B35", 'cheat');
    gameState.updateUI();
  }
};

// Функция обработки чит-кодов
function handleCheatInput(char) {
  const currentTime = Date.now();

  // Сбрасываем буфер если прошло много времени
  if (currentTime - lastCheatTime > 2000) {
    cheatBuffer = '';
  }

  cheatBuffer += char.toLowerCase();
  lastCheatTime = currentTime;

  // Проверяем чит-коды
  for (const [code, action] of Object.entries(cheatCodes)) {
    if (cheatBuffer.includes(code)) {
      action();
      cheatBuffer = ''; // Очищаем буфер после использования
      break;
    }
  }

  // Ограничиваем длину буфера
  if (cheatBuffer.length > 20) {
    cheatBuffer = cheatBuffer.slice(-10);
  }
}

// Звуковые функции с улучшенными эффектами
function playSound(soundId, volume = soundVolume) {
  if (!soundEnabled) return;

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  switch(soundId) {
    case 'shootSound':
      createShootSound(audioContext, volume);
      break;
    case 'goldSound':
      createGoldSound(audioContext, volume);
      break;
    case 'soldierBuySound':
      createBuySound(audioContext, volume);
      break;
  }
}

function createShootSound(audioContext, volume) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);

  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
}

function createGoldSound(audioContext, volume) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
  oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
  oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);

  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.3);
}

function createBuySound(audioContext, volume) {
  [440, 554, 659, 880].forEach((freq, i) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.1);
    gainNode.gain.setValueAtTime(volume * 0.3, audioContext.currentTime + i * 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.1 + 0.15);

    oscillator.start(audioContext.currentTime + i * 0.1);
    oscillator.stop(audioContext.currentTime + i * 0.1 + 0.15);
  });
}

// Уведомления с улучшенной графикой
function showNotification(text, color = "#4CAF50") {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerHTML = `<div style="display: flex; align-items: center; gap: 10px;"><span style="font-size: 24px;">✨</span><span>${text}</span></div>`;
  notification.style.background = `linear-gradient(135deg, ${color}, ${adjustColor(color, -20)})`;
  document.body.appendChild(notification);

  setTimeout(() => {
    if (document.body.contains(notification)) {
      document.body.removeChild(notification);
    }
  }, 3000);
}

function adjustColor(color, amount) {
  const usePound = color[0] === "#";
  color = usePound ? color.slice(1) : color;
  const num = parseInt(color, 16);
  let r = (num >> 16) + amount;
  let g = (num >> 8 & 0x00FF) + amount;
  let b = (num & 0x0000FF) + amount;
  r = r > 255 ? 255 : r < 0 ? 0 : r;
  g = g > 255 ? 255 : g < 0 ? 0 : g;
  b = b > 255 ? 255 : b < 0 ? 0 : b;
  return (usePound ? "#" : "") + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
}

// Создание частиц и эффектов
function createParticle(x, y, text, color = "#FFFFFF", type = 'normal') {
  particles.push({
    x: x,
    y: y,
    text: text,
    color: color,
    life: 80,
    maxLife: 80,
    vy: -2 - Math.random() * 2,
    vx: (Math.random() - 0.5) * 2,
    type: type,
    scale: 1,
    rotation: 0,
    opacity: 1
  });
}

function createExplosion(x, y, radius, color = "#FF6B35") {
  explosions.push({
    x: x,
    y: y,
    radius: 0,
    maxRadius: radius,
    life: 30,
    color: color,
    particles: []
  });

  for (let i = 0; i < 15; i++) {
    const angle = (i / 15) * Math.PI * 2;
    particles.push({
      x: x,
      y: y,
      text: "💥",
      color: color,
      life: 40,
      maxLife: 40,
      vy: Math.sin(angle) * 3,
      vx: Math.cos(angle) * 3,
      type: 'explosion',
      scale: 1,
      rotation: Math.random() * Math.PI * 2,
      opacity: 1
    });
  }

  playSound('explosionSound');
}

// Генерация улучшенного фона
function generateBackground() {
  for (let i = 0; i < 100; i++) {
    backgroundStars.push({
      x: Math.random() * 1600,
      y: Math.random() * 300,
      size: Math.random() * 3 + 1,
      twinkle: Math.random() * 100,
      brightness: Math.random() * 0.8 + 0.2,
      color: `hsl(${Math.random() * 60 + 200}, 70%, ${70 + Math.random() * 30}%)`
    });
  }

  for (let i = 0; i < 12; i++) {
    clouds.push({
      x: Math.random() * 1600,
      y: Math.random() * 150 + 50,
      size: Math.random() * 80 + 60,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.5 + 0.3,
      parts: Array.from({length: 5}, () => ({
        offsetX: (Math.random() - 0.5) * 60,
        offsetY: (Math.random() - 0.5) * 30,
        size: Math.random() * 0.8 + 0.6
      }))
    });
  }

  for (let i = 0; i < 20; i++) {
    trees.push({
      x: Math.random() * 1600,
      y: 350 + Math.random() * 100,
      height: Math.random() * 60 + 40,
      width: Math.random() * 20 + 15,
      type: Math.random() > 0.5 ? 'pine' : 'oak',
      swayOffset: Math.random() * Math.PI * 2
    });
  }

  for (let i = 0; i < 30; i++) {
    rocks.push({
      x: Math.random() * 1600,
      y: 400 + Math.random() * 150,
      size: Math.random() * 25 + 10,
      color: `hsl(${Math.random() * 30 + 15}, 20%, ${30 + Math.random() * 20}%)`,
      shape: Math.random() > 0.5 ? 'round' : 'angular'
    });
  }

  for (let i = 0; i < 150; i++) {
    grass.push({
      x: Math.random() * 1600,
      y: 380 + Math.random() * 180,
      height: Math.random() * 20 + 8,
      windOffset: Math.random() * Math.PI * 2,
      color: `hsl(${90 + Math.random() * 40}, ${40 + Math.random() * 30}%, ${30 + Math.random() * 25}%)`
    });
  }
}

// Рисование улучшенного фона
function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#87CEEB');
  gradient.addColorStop(0.3, '#98FB98');
  gradient.addColorStop(1, '#32CD32');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  backgroundStars.forEach(star => {
    const alpha = (Math.sin(star.twinkle) + 1) / 2 * star.brightness;
    ctx.fillStyle = star.color.replace(')', `, ${alpha})`).replace('hsl', 'hsla');
    ctx.shadowColor = star.color;
    ctx.shadowBlur = star.size * 2;
    ctx.beginPath();
    ctx.arc(star.x - camera.x * 0.1, star.y - camera.y * 0.1, star.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    star.twinkle += 0.1;
  });

  clouds.forEach(cloud => {
    ctx.save();
    ctx.globalAlpha = cloud.opacity;

    cloud.parts.forEach(part => {
      ctx.fillStyle = `rgba(255, 255, 255, 0.8)`;
      ctx.beginPath();
      ctx.arc(
        cloud.x - camera.x * 0.3 + part.offsetX,
        cloud.y - camera.y * 0.3 + part.offsetY,
        cloud.size * part.size,
        0, Math.PI * 2
      );
      ctx.fill();
    });

    cloud.x += cloud.speed;
    if (cloud.x > 1600) cloud.x = -100;
    ctx.restore();
  });

  trees.forEach(tree => {
    const treeX = tree.x - camera.x * 0.8;
    const treeY = tree.y - camera.y * 0.8;
    const sway = Math.sin(Date.now() * 0.002 + tree.swayOffset) * 3;

    ctx.save();

    ctx.fillStyle = `hsl(25, 50%, 20%)`;
    ctx.fillRect(treeX - tree.width/4, treeY, tree.width/2, tree.height);

    ctx.translate(treeX, treeY - tree.height/2);
    ctx.rotate(sway * 0.01);

    if (tree.type === 'pine') {
      ctx.fillStyle = `hsl(120, 60%, 25%)`;
      ctx.beginPath();
      ctx.moveTo(0, -tree.height/2);
      ctx.lineTo(-tree.width, tree.height/4);
      ctx.lineTo(tree.width, tree.height/4);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillStyle = `hsl(100, 50%, 30%)`;
      ctx.beginPath();
      ctx.arc(0, -tree.height/4, tree.width, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  });

  rocks.forEach(rock => {
    ctx.fillStyle = rock.color;
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 3;

    if (rock.shape === 'round') {
      ctx.beginPath();
      ctx.arc(rock.x - camera.x, rock.y - camera.y, rock.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(rock.x - camera.x - rock.size/2, rock.y - camera.y - rock.size/2, rock.size, rock.size);
    }
  });
  ctx.shadowColor = 'transparent';

  ctx.strokeStyle = "#32CD32";
  ctx.lineWidth = 2;
  grass.forEach(g => {
    const windSway = Math.sin(Date.now() * 0.003 + g.windOffset) * 2;    ctx.strokeStyle = g.color;
    ctx.beginPath();
    ctx.moveTo(g.x - camera.x, g.y - camera.y);
    ctx.lineTo(g.x - camera.x + windSway, g.y - g.height - camera.y);
    ctx.stroke();
  });
}

// Рисование стикменов
function drawStickman(x, y, color, animFrame, type = 'normal', size = 1, isEnemy = false) {
  ctx.save();
  ctx.translate(x - camera.x, y - camera.y);
  ctx.scale(size, size);

  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(0, 25, 15 * size, 5 * size, 0, 0, Math.PI * 2);
  ctx.fill();

  const bounce = Math.sin(animFrame * 0.2) * 2;
  const armSwing = Math.sin(animFrame * 0.3) * 0.3;
  const legSwing = Math.sin(animFrame * 0.4) * 0.5;

  const gradient = ctx.createLinearGradient(0, -20, 0, 20);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, adjustColor(color, -30));
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Голова
  ctx.beginPath();
  ctx.arc(0, -15 + bounce, 6, 0, Math.PI * 2);
  ctx.stroke();

  // Глаза
  ctx.fillStyle = isEnemy ? '#FF0000' : '#FFFFFF';
  ctx.fillRect(-3, -17 + bounce, 2, 2);
  ctx.fillRect(1, -17 + bounce, 2, 2);

  // Рот
  ctx.strokeStyle = isEnemy ? '#FF0000' : color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  if (isEnemy) {
    ctx.arc(0, -12 + bounce, 2, 0, Math.PI);
  } else {
    ctx.arc(0, -13 + bounce, 1, 0, Math.PI);
  }
  ctx.stroke();

  ctx.strokeStyle = gradient;
  ctx.lineWidth = 3;

  // Тело
  ctx.beginPath();
  ctx.moveTo(0, -9 + bounce);
  ctx.lineTo(0, 10 + bounce);
  ctx.stroke();

  // Руки
  ctx.beginPath();
  ctx.moveTo(0, -5 + bounce);
  ctx.lineTo(-8 + armSwing, 2 + bounce);
  ctx.moveTo(0, -5 + bounce);
  ctx.lineTo(8 - armSwing, 2 + bounce);
  ctx.stroke();

  // Ноги
  ctx.beginPath();
  ctx.moveTo(0, 10 + bounce);
  ctx.lineTo(-5 + legSwing, 20 + bounce);
  ctx.moveTo(0, 10 + bounce);
  ctx.lineTo(5 - legSwing, 20 + bounce);
  ctx.stroke();

  // Оружие в зависимости от типа
  if (type === 'archer') {
    ctx.strokeStyle = '#8B4513';
    ctx.beginPath();
    ctx.arc(-10 + armSwing, -5 + bounce, 8, Math.PI * 0.7, Math.PI * 1.3);
    ctx.stroke();
  } else if (type === 'warrior') {
    ctx.strokeStyle = '#C0C0C0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(8 - armSwing, 2 + bounce);
    ctx.lineTo(12 - armSwing, -8 + bounce);
    ctx.stroke();
  } else if (type === 'mage') {
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(8 - armSwing, 2 + bounce);
    ctx.lineTo(8 - armSwing, -15 + bounce);
    ctx.stroke();

    const time = Date.now() * 0.01;
    ctx.fillStyle = `hsl(${280 + Math.sin(time) * 30}, 70%, 60%)`;
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(8 - armSwing, -17 + bounce, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  ctx.restore();
}

// Рисование базы
function drawBase() {
  const x = BASE_X - camera.x;
  const y = BASE_Y - camera.y;

  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fillRect(x + 5, y + 5, BASE_WIDTH, BASE_HEIGHT);

  const baseGradient = ctx.createLinearGradient(x, y, x, y + BASE_HEIGHT);
  baseGradient.addColorStop(0, '#4A90E2');
  baseGradient.addColorStop(0.5, '#357ABD');
  baseGradient.addColorStop(1, '#1E3A8A');
  ctx.fillStyle = baseGradient;
  ctx.fillRect(x, y, BASE_WIDTH, BASE_HEIGHT);

  ctx.strokeStyle = '#C0C0C0';
  ctx.lineWidth = 4;
  ctx.strokeRect(x, y, BASE_WIDTH, BASE_HEIGHT);

  ctx.strokeStyle = '#87CEEB';
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 2, y + 2, BASE_WIDTH - 4, BASE_HEIGHT - 4);

  for (let i = 0; i < 5; i++) {
    const battlementX = x + i * 20;
    ctx.fillStyle = '#1E3A8A';
    ctx.fillRect(battlementX + 2, y - 20, 16, 20);
    ctx.strokeStyle = '#C0C0C0';
    ctx.lineWidth = 2;
    ctx.strokeRect(battlementX + 2, y - 20, 16, 20);
  }

  const towerGradient = ctx.createLinearGradient(x + 40, y - 40, x + 60, y - 20);
  towerGradient.addColorStop(0, '#5A9FE3');
  towerGradient.addColorStop(1, '#2E5A87');
  ctx.fillStyle = towerGradient;
  ctx.fillRect(x + 40, y - 40, 20, 25);

  ctx.strokeStyle = '#C0C0C0';
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 40, y - 40, 20, 25);

  const flagWave = Math.sin(Date.now() * 0.01) * 2;
  ctx.fillStyle = '#FF0000';
  ctx.fillRect(x + 62, y - 45, 20 + flagWave, 12);

  ctx.strokeStyle = '#8B4513';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + 62, y - 50);
  ctx.lineTo(x + 62, y - 30);
  ctx.stroke();

  // Полоса здоровья
  const hpBarWidth = BASE_WIDTH + 40;
  const hpBarHeight = 15;
  const hpPercent = gameState.baseHP / gameState.maxBaseHP;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fillRect(x - 20, y - 30, hpBarWidth, hpBarHeight);

  ctx.strokeStyle = '#C0C0C0';
  ctx.lineWidth = 2;
  ctx.strokeRect(x - 20, y - 30, hpBarWidth, hpBarHeight);

  const healthGradient = ctx.createLinearGradient(x - 18, y - 28, x - 18 + (hpBarWidth - 4) * hpPercent, y - 28);
  if (hpPercent > 0.6) {
    healthGradient.addColorStop(0, '#00FF00');
    healthGradient.addColorStop(1, '#32CD32');
  } else if (hpPercent > 0.3) {
    healthGradient.addColorStop(0, '#FFD700');
    healthGradient.addColorStop(1, '#FFA500');
  } else {
    healthGradient.addColorStop(0, '#FF4444');
    healthGradient.addColorStop(1, '#8B0000');
  }

  ctx.fillStyle = healthGradient;
  ctx.fillRect(x - 18, y - 28, (hpBarWidth - 4) * hpPercent, hpBarHeight - 4);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 12px Arial';
  ctx.textAlign = 'center';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.strokeText(`${gameState.baseHP}/${gameState.maxBaseHP}`, x + BASE_WIDTH/2, y - 19);
  ctx.fillText(`${gameState.baseHP}/${gameState.maxBaseHP}`, x + BASE_WIDTH/2, y - 19);

  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 16px Arial';
  ctx.strokeText(`Lv.${gameState.baseLevel}`, x + BASE_WIDTH/2, y - 50);
  ctx.fillText(`Lv.${gameState.baseLevel}`, x + BASE_WIDTH/2, y - 50);
}

// Стрельба игрока
function handleShoot(event) {
  if (gameState.reloading || gameState.arrows <= 0 || gameState.paused) return;

  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left + camera.x;
  const mouseY = event.clientY - rect.top + camera.y;

  const playerX = BASE_X + 50;
  const playerY = BASE_Y + 50;

  bullets.push({
    x: playerX,
    y: playerY,
    targetX: mouseX,
    targetY: mouseY,
    speed: 12,
    damage: gameState.playerWeapon.damage,
    color: "#FFD700",
    isPlayer: true,
    trail: [],
    life: 100
  });

  gameState.arrows--;
  playSound('shootSound');

  createParticle(playerX, playerY, "💫", "#FFD700", 'shoot');

  if (gameState.arrows === 0) {
    gameState.reloading = true;
    showNotification("🔄 Перезарядка...", "#FF8844");
    setTimeout(() => {
      gameState.arrows = gameState.playerWeapon.maxArrows;
      gameState.reloading = false;
      showNotification("✅ Перезарядка завершена!");
      playSound('goldSound');
      gameState.updateUI();
    }, gameState.playerWeapon.reloadTime);
  }
  gameState.updateUI();
}

// Старт новой волны
function startWave() {
  if (enemies.length > 0) {
    showNotification("⏳ Дождитесь окончания текущей волны!", "#FF8844");
    return;
  }

  gameState.wave++;
  gameState.gameStarted = true;

  gameState.achievementSystem.updateStatistic('waveReached', gameState.wave);

  const waveReward = Math.floor(50 + gameState.wave * 20 + gameState.wave * gameState.wave * 2);
  gameState.gold += waveReward;

  showNotification(`🌊 Волна ${gameState.wave} началась! +${waveReward}💰`, "#E91E63");

  const enemyCount = Math.floor(3 + gameState.wave * 1.2);
  for (let i = 0; i < enemyCount; i++) {
    setTimeout(() => spawnEnemy(), i * 800);
  }

  gameState.updateUI();
}

// Спавн врага
function spawnEnemy() {
  const types = Object.keys(enemyTypes);
  let type;

  if (gameState.wave % 10 === 0 && gameState.wave >= 10) {
    const megaBossTypes = types.filter(t => enemyTypes[t].isMegaBoss);
    type = megaBossTypes[Math.floor(Math.random() * megaBossTypes.length)];
    showMegaBossWarning(enemyTypes[type].name);
  } else if (gameState.wave % 5 === 0 && gameState.wave > 0) {
    const bossTypes = types.filter(t => enemyTypes[t].isBoss && !enemyTypes[t].isMegaBoss);
    type = bossTypes[Math.floor(Math.random() * bossTypes.length)];
    showBossWarning(enemyTypes[type].name);
  } else {
    const availableTypes = types.filter(t => !enemyTypes[t].isBoss);
    type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
  }

  const enemyData = enemyTypes[type];
  const scalingFactor = 1 + gameState.wave * 0.15;

  enemies.push({
    x: -80,
    y: 200 + Math.random() * 200,
    type: type,
    hp: Math.floor(enemyData.hp * scalingFactor),
    maxHP: Math.floor(enemyData.hp * scalingFactor),
    speed: enemyData.speed,
    damage: Math.floor(enemyData.damage * (1 + gameState.wave * 0.1)),
    reward: Math.floor(enemyData.reward * (1 + gameState.wave * 0.1)),
    targetX: BASE_X + BASE_WIDTH / 2,
    targetY: BASE_Y + BASE_HEIGHT / 2,
    animFrame: 0,
    statusEffects: {},
    trail: [],
    attackCooldown: 0,
    summonCooldown: 0
  });

  createParticle(-80, 200 + Math.random() * 200, "💀", enemyData.color, 'spawn');
}

function showMegaBossWarning(bossName) {
  const warning = document.createElement('div');
  warning.className = 'boss-warning';
  warning.style.background = 'linear-gradient(135deg, #8B0000, #DC143C)';
  warning.style.fontSize = '28px';
  warning.innerHTML = `
    <div style="font-size: 50px; margin-bottom: 20px;">👑💀👑</div>
    <div>МЕГА-БОСС ПОЯВЛЯЕТСЯ!</div>
    <div style="font-size: 24px; margin-top: 15px; color: #FFD700;">${bossName}</div>
  `;
  document.body.appendChild(warning);

  canvas.style.animation = 'shake 0.5s ease-in-out 10';

  setTimeout(() => {
    if (document.body.contains(warning)) document.body.removeChild(warning);
    canvas.style.animation = '';
  }, 4000);
}

function showBossWarning(bossName) {
  const warning = document.createElement('div');
  warning.className = 'boss-warning';
  warning.innerHTML = `
    <div style="font-size: 40px; margin-bottom: 15px;">⚡👹⚡</div>
    <div>БОСС ПОЯВЛЯЕТСЯ!</div>
    <div style="font-size: 20px; margin-top: 10px; color: #FFD700;">${bossName}</div>
  `;
  document.body.appendChild(warning);

  canvas.style.animation = 'shake 0.5s ease-in-out 6';

  setTimeout(() => {
    if (document.body.contains(warning)) document.body.removeChild(warning);
    canvas.style.animation = '';
  }, 3000);
}

// Покупка солдата
function buySoldier(type) {
  const config = soldierTypes[type];
  if (gameState.gold >= config.cost) {
    gameState.gold -= config.cost;

    soldierQueue.push({
      type: type,
      spawnTime: Date.now() + 2000
    });

    soldierTypes[type].cost = Math.floor(config.cost * 1.2);

    gameState.achievementSystem.incrementStatistic('soldiersHired');

    if (config.isSiege) {
      gameState.achievementSystem.incrementStatistic('siegeUnitsBuilt');
    }

    playSound('soldierBuySound');
    showNotification(`🎖️ ${config.name} куплен! Прибудет через 2 сек.`, "#4CAF50");

    createParticle(canvas.width/2, canvas.height/2, "⭐ КУПЛЕНО! ⭐", "#FFD700", 'purchase');

    gameState.updateUI();
    updateShopPrices();
    gameState.achievementSystem.checkAchievements();
  } else {
    showNotification("💰 Недостаточно золота!", "#FF4444");
  }
}

// Обработка очереди солдат
function processSoldierQueue() {
  const now = Date.now();
  for (let i = soldierQueue.length - 1; i >= 0; i--) {
    const queueItem = soldierQueue[i];
    if (now >= queueItem.spawnTime) {
      const soldier = {
        x: BASE_X + Math.random() * 100 - 50,
        y: BASE_Y + Math.random() * 100 - 50,
        type: queueItem.type,
        hp: soldierTypes[queueItem.type].hp,
        maxHP: soldierTypes[queueItem.type].hp,
        cooldown: 0,
        animFrame: 0,
        trail: []
      };

      soldiers.push(soldier);
      soldierQueue.splice(i, 1);

      showNotification(`⚔️ ${soldierTypes[queueItem.type].name} готов к бою!`, "#4CAF50");
      playSound('goldSound');
      createParticle(soldier.x, soldier.y, "🎖️ ГОТОВ!", "#4CAF50", 'ready');
    }
  }
}

// Основной игровой цикл
function gameLoop() {
  if (!gameState.paused) {
    gameState.passiveGoldTimer++;
    if (gameState.passiveGoldTimer >= 180) {
      const passiveGold = 3 + Math.floor(gameState.wave * 0.5);
      gameState.gold += passiveGold;
      createParticle(50, 50, `+${passiveGold}💰`, "#FFD700", 'passive');
      gameState.passiveGoldTimer = 0;
    }

    processSoldierQueue();

    // Обновление врагов
    enemies.forEach((enemy, index) => {
      enemy.animFrame++;

      if (enemy.hp <= 0) {
        gameState.gold += enemy.reward;
        gameState.achievementSystem.incrementStatistic('enemiesKilled');

        if (enemyTypes[enemy.type].isMegaBoss) {
          gameState.achievementSystem.incrementStatistic('megaBossesKilled');
          createExplosion(enemy.x, enemy.y, 120, "#8B0000");
          showNotification(`👑 МЕГА-БОСС ПОВЕРЖЕН! +${enemy.reward}💰`, "#FFD700");
        } else if (enemyTypes[enemy.type].isBoss) {
          gameState.achievementSystem.incrementStatistic('bossesKilled');
          createExplosion(enemy.x, enemy.y, 80, "#FF6B35");
          showNotification(`🏆 Босс повержен! +${enemy.reward}💰`, "#FFD700");
        } else {
          createExplosion(enemy.x, enemy.y, 40, "#FF8C00");
        }

        createParticle(enemy.x, enemy.y, `+${enemy.reward}💰`, "#FFD700");
        enemies.splice(index, 1);
        gameState.achievementSystem.checkAchievements();
        return;
      }

      // Движение к базе
      const dx = enemy.targetX - enemy.x;
      const dy = enemy.targetY - enemy.y;
      const distance = Math.hypot(dx, dy);

      if (distance > 30) {
        enemy.x += (dx / distance) * enemy.speed;
        enemy.y += (dy / distance) * enemy.speed;

        enemy.trail.push({ x: enemy.x, y: enemy.y });
        if (enemy.trail.length > 5) enemy.trail.shift();
      } else {
        if (enemy.attackCooldown <= 0) {
          gameState.baseHP -= enemy.damage;
          createParticle(BASE_X + 50, BASE_Y + 50, `-${enemy.damage}❤️`, "#FF0000", 'damage');
          createExplosion(BASE_X + 50, BASE_Y + 50, 30, "#FF0000");
          enemy.attackCooldown = 60;

          if (gameState.baseHP <= 0) {
            gameOver();
          }
        } else {
          enemy.attackCooldown--;
        }
      }
    });

    // Обновление солдат
    soldiers.forEach((soldier, index) => {
      soldier.animFrame++;

      if (soldier.hp <= 0) {
        createExplosion(soldier.x, soldier.y, 25, "#888888");
        createParticle(soldier.x, soldier.y, "💀 Погиб", "#888888");
        soldiers.splice(index, 1);
        return;
      }

      const soldierType = soldierTypes[soldier.type];

      let target = null;
      let minDist = soldierType.range;

      enemies.forEach(enemy => {
        const dist = Math.hypot(enemy.x - soldier.x, enemy.y - soldier.y);
        if (dist < minDist) {
          target = enemy;
          minDist = dist;
        }
      });

      if (target && soldier.cooldown <= 0) {
        if (soldierType.isHealer) {
          soldiers.forEach(ally => {
            const dist = Math.hypot(ally.x - soldier.x, ally.y - soldier.y);
            if (dist < soldierType.range && ally.hp < ally.maxHP) {
              ally.hp = Math.min(ally.hp + 25, ally.maxHP);
              createParticle(ally.x, ally.y, "+25❤️", "#00FF00", 'heal');
            }
          });

          if (gameState.baseHP < gameState.maxBaseHP) {
            gameState.baseHP = Math.min(gameState.baseHP + 15, gameState.maxBaseHP);
            createParticle(BASE_X + 50, BASE_Y + 50, "+15❤️", "#4CAF50", 'heal');
          }
        } else if (soldierType.isSiege) {
          if (soldier.type === 'catapult') {
            enemies.forEach(enemy => {
              const dist = Math.hypot(enemy.x - target.x, enemy.y - target.y);
              if (dist <= 80) {
                enemy.hp -= soldierType.damage;
                createParticle(enemy.x, enemy.y, `-${soldierType.damage}💥`, "#FF6B35", 'aoe');
              }
            });
            createExplosion(target.x, target.y, 80, "#FF6B35");
          } else if (soldier.type === 'ballista') {
            const angle = Math.atan2(target.y - soldier.y, target.x - soldier.x);
            enemies.forEach(enemy => {
              const enemyAngle = Math.atan2(enemy.y - soldier.y, enemy.x - soldier.x);
              const angleDiff = Math.abs(enemyAngle - angle);
              const dist = Math.hypot(enemy.x - soldier.x, enemy.y - soldier.y);
              if (angleDiff < 0.2 && dist <= soldierType.range) {
                enemy.hp -= soldierType.damage;
                createParticle(enemy.x, enemy.y, `-${soldierType.damage}🏹`, "#2F4F4F", 'pierce');
              }
            });
          }
        } else {
          bullets.push({
            x: soldier.x,
            y: soldier.y,
            targetX: target.x,
            targetY: target.y,
            speed: 10,
            damage: soldierType.damage,
            color: soldierType.color,
            isPlayer: false,
            trail: [],
            life: 80,
            type: soldier.type
          });
        }

        soldier.cooldown = soldierType.cooldown;
      }

      if (soldier.cooldown > 0) soldier.cooldown--;
    });

    // Обновление пуль
    bullets.forEach((bullet, index) => {
      const dx = bullet.targetX - bullet.x;
      const dy = bullet.targetY - bullet.y;
      const distance = Math.hypot(dx, dy);

      bullet.trail.push({ x: bullet.x, y: bullet.y });
      if (bullet.trail.length > 8) bullet.trail.shift();

      if (distance < bullet.speed || bullet.life <= 0) {
        if (bullet.isPlayer && gameState.playerWeapon.aoe) {
          enemies.forEach(enemy => {
            const dist = Math.hypot(enemy.x - bullet.x, enemy.y - bullet.y);
            if (dist <= 60) {
              enemy.hp -= bullet.damage;
              createParticle(enemy.x, enemy.y, `-${bullet.damage}💥`, "#FFD700", 'aoe');
            }
          });
          createExplosion(bullet.x, bullet.y, 60, "#FFD700");
        } else {
          enemies.forEach(enemy => {
            const dist = Math.hypot(enemy.x - bullet.x, enemy.y - bullet.y);
            if (dist < 25) {
              enemy.hp -= bullet.damage;
              createParticle(enemy.x, enemy.y, `-${bullet.damage}`, bullet.color);

              // Статистика золотых выстрелов (если игрок попал)
              if (bullet.isPlayer && Math.random() < 0.1) {
                gameState.achievementSystem.incrementStatistic('goldenShotsHit');
                createParticle(enemy.x, enemy.y, "⭐ ЗОЛОТОЙ!", "#FFD700", 'golden');
              }

              if (bullet.type === 'mage') {
                createExplosion(enemy.x, enemy.y, 40, "#9966FF");
                playSound('magicSound', 0.3);
              }
            }
          });
        }
        bullets.splice(index, 1);
      } else {
        bullet.x += (dx / distance) * bullet.speed;
        bullet.y += (dy / distance) * bullet.speed;
        bullet.life--;
      }
    });

    // Обновление частиц
    particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life--;
      particle.opacity = particle.life / particle.maxLife;

      switch (particle.type) {
        case 'explosion':
          particle.scale = 1 + (particle.maxLife - particle.life) / particle.maxLife;
          particle.rotation += 0.2;
          break;
        case 'heal':
          particle.vy -= 0.1;
          particle.scale = 1 + Math.sin(particle.life * 0.3) * 0.2;
          break;
        case 'purchase':
          particle.scale = 1 + Math.sin(particle.life * 0.2) * 0.5;
          particle.vy -= 0.15;
          break;
        case 'cheat':
          particle.scale = 1 + Math.sin(particle.life * 0.1) * 0.8;
          particle.vy -= 0.2;
          particle.rotation += 0.3;
          break;
      }

      if (particle.life <= 0) {
        particles.splice(index, 1);
      }
    });

    // Обновление взрывов
    explosions.forEach((explosion, index) => {
      explosion.radius += explosion.maxRadius / 30;
      explosion.life--;
      if (explosion.life <= 0) {
        explosions.splice(index, 1);
      }
    });

    gameState.updateUI();

    if (gameState.baseHP <= 0) {
      gameOver();
    }
  }

  // Рисование
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();
  drawBase();

  // Рисование врагов
  enemies.forEach(enemy => {
    ctx.globalAlpha = 0.3;
    enemy.trail.forEach((point, i) => {
      ctx.fillStyle = enemyTypes[enemy.type].color;
      ctx.beginPath();
      ctx.arc(point.x - camera.x, point.y - camera.y, (i + 1) * 0.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    const size = enemyTypes[enemy.type].isBoss ? 1.8 : 1.2;
    drawStickman(enemy.x, enemy.y, enemyTypes[enemy.type].color, enemy.animFrame, enemy.type, size, true);

    if (enemy.hp < enemy.maxHP) {
      const hpRatio = enemy.hp / enemy.maxHP;
      const enemyX = enemy.x - camera.x;
      const enemyY = enemy.y - camera.y;

      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(enemyX - 25, enemyY - 45, 50, 8);

      const healthGradient = ctx.createLinearGradient(enemyX - 25, enemyY - 45, enemyX + 25, enemyY - 45);
      healthGradient.addColorStop(0, hpRatio > 0.5 ? '#4CAF50' : hpRatio > 0.25 ? '#FFA500' : '#FF4444');
      healthGradient.addColorStop(1, hpRatio > 0.5 ? '#8BC34A' : hpRatio > 0.25 ? '#FFD700' : '#FF6B6B');

      ctx.fillStyle = healthGradient;
      ctx.fillRect(enemyX - 23, enemyY - 43, 46 * hpRatio, 4);

      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.strokeRect(enemyX - 25, enemyY - 45, 50, 8);
    }
  });

  // Рисование солдат
  soldiers.forEach(soldier => {
    const soldierType = soldierTypes[soldier.type];
    drawStickman(soldier.x, soldier.y, soldierType.color, soldier.animFrame, soldier.type, 1, false);

    if (soldier.hp < soldier.maxHP) {
      const hpRatio = soldier.hp / soldier.maxHP;
      const soldierX = soldier.x - camera.x;
      const soldierY = soldier.y - camera.y;

      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(soldierX - 20, soldierY - 40, 40, 6);

      ctx.fillStyle = hpRatio > 0.3 ? '#4CAF50' : '#FF4444';
      ctx.fillRect(soldierX - 18, soldierY - 38, 36 * hpRatio, 2);
    }
  });

  // Рисование пуль
  bullets.forEach(bullet => {
    ctx.globalAlpha = 0.6;
    bullet.trail.forEach((point, i) => {
      const alpha = (i + 1) / bullet.trail.length * 0.5;
      ctx.fillStyle = bullet.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba').replace('#', 'rgba(');
      if (!bullet.color.includes('rgba')) {
        ctx.fillStyle = bullet.color + '80';
      }
      ctx.beginPath();
      ctx.arc(point.x - camera.x, point.y - camera.y, (i + 1), 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    ctx.fillStyle = bullet.color;
    ctx.shadowColor = bullet.color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(bullet.x - camera.x - camera.x, bullet.y - camera.y, bullet.isPlayer ? 4 : 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  // Рисование частиц
  particles.forEach(particle => {
    ctx.save();
    ctx.translate(particle.x - camera.x, particle.y - camera.y);
    ctx.rotate(particle.rotation || 0);
    ctx.scale(particle.scale || 1, particle.scale || 1);
    ctx.globalAlpha = particle.opacity;

    ctx.font = "bold 16px Arial";
    ctx.fillStyle = particle.color;
    ctx.textAlign = "center";

    ctx.strokeStyle = 'rgba(0,0,0,0.8)';
    ctx.lineWidth = 3;
    ctx.strokeText(particle.text, 0, 0);
    ctx.fillText(particle.text, 0, 0);

    ctx.restore();
  });

  // Рисование взрывов
  explosions.forEach(explosion => {
    ctx.save();
    ctx.globalAlpha = explosion.life / 30;

    const outerGradient = ctx.createRadialGradient(
      explosion.x - camera.x, explosion.y - camera.y, 0,
      explosion.x - camera.x, explosion.y - camera.y, explosion.radius
    );
    outerGradient.addColorStop(0, explosion.color + '00');
    outerGradient.addColorStop(0.7, explosion.color + '80');
    outerGradient.addColorStop(1, explosion.color + 'FF');

    ctx.fillStyle = outerGradient;
    ctx.beginPath();
    ctx.arc(explosion.x - camera.x, explosion.y - camera.y, explosion.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.globalAlpha = (explosion.life / 30) * 0.8;
    ctx.beginPath();
    ctx.arc(explosion.x - camera.x, explosion.y - camera.y, explosion.radius * 0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  });

  requestAnimationFrame(gameLoop);
}

// Управление интерфейсом
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
  const clickedTab = event.target;
  const currentActiveTab = document.querySelector('.shop-tab.active');
  
  // Если кликнули на уже активную вкладку - закрываем её
  if (clickedTab === currentActiveTab) {
    document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('[id$="-content"]').forEach(c => c.style.display = 'none');
    showNotification("📁 Вкладка закрыта", "#888888");
    return;
  }

  // Открываем новую вкладку
  document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('[id$="-content"]').forEach(c => c.style.display = 'none');

  clickedTab.classList.add('active');
  const content = document.getElementById(`${tab}-content`);
  if (content) {
    content.style.display = 'block';
  }
}

function getTabName(tab) {
  const names = {
    'soldiers': 'Стикмены',
    'weapons': 'Оружие', 
    'upgrades': 'Улучшения',
    'items': 'Предметы'
  };
  return names[tab] || tab;
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
  const clickedTab = event.target;
  const currentActiveTab = document.querySelector('#encyclopediaOverlay .shop-tab.active');
  
  // Если кликнули на уже активную вкладку - закрываем её
  if (clickedTab === currentActiveTab) {
    document.querySelectorAll('.encyclopedia-content').forEach(content => {
      content.style.display = 'none';
    });
    document.querySelectorAll('#encyclopediaOverlay .shop-tab').forEach(tabBtn => {
      tabBtn.classList.remove('active');
    });
    showNotification("📁 Вкладка закрыта", "#888888");
    return;
  }

  // Открываем новую вкладку
  document.querySelectorAll('.encyclopedia-content').forEach(content => {
    content.style.display = 'none';
  });
  document.querySelectorAll('#encyclopediaOverlay .shop-tab').forEach(tabBtn => {
    tabBtn.classList.remove('active');
  });
  document.getElementById(tab + '-info').style.display = 'block';
  clickedTab.classList.add('active');
}

// Покупки
function buyUpgrade(type) {
  const upgrade = gameState.upgrades[type];
  if (gameState.gold >= upgrade.cost) {
    gameState.gold -= upgrade.cost;
    upgrade.level++;
    upgrade.cost = Math.floor(upgrade.cost * 1.5);

    showNotification(`⬆️ Улучшение куплено!`, "#9C27B0");
    gameState.updateUI();
    updateShopPrices();
  } else {
    showNotification("💰 Недостаточно золота!", "#FF4444");
  }
}

function buyWeapon(type) {
  let cost = 0;
  switch(type) {
    case 'enhanced': cost = 800; break;
    case 'crossbow': cost = 1500; break;
    case 'magic': cost = 3000; break;
    case 'magicCrossbow': cost = 5000; break;
  }

  if (gameState.gold >= cost) {
    gameState.gold -= cost;
    gameState.playerWeapon.type = type;

    switch(type) {
      case 'enhanced':
        gameState.playerWeapon.damage = 35;
        gameState.playerWeapon.maxArrows = 12;
        break;
      case 'crossbow':
        gameState.playerWeapon.damage = 50;
        gameState.playerWeapon.maxArrows = 8;
        break;
      case 'magic':
        gameState.playerWeapon.damage = 100;
        gameState.playerWeapon.maxArrows = 15;
        gameState.playerWeapon.aoe = true;
        break;
      case 'magicCrossbow':
        gameState.playerWeapon.damage = 200;
        gameState.playerWeapon.maxArrows = 10;
        gameState.playerWeapon.aoe = true;
        gameState.playerWeapon.piercing = true;
        break;
    }

    gameState.arrows = gameState.playerWeapon.maxArrows;

    gameState.achievementSystem.incrementStatistic('weaponsUpgraded');

    showNotification(`🏹 Оружие улучшено!`, "#9C27B0");
    gameState.updateUI();
    gameState.achievementSystem.checkAchievements();
  } else {
    showNotification("💰 Недостаточно золота!", "#FF4444");
  }
}

function buyItem(type) {
  let cost = 0, success = false;

  switch (type) {
    case 'arrows':
      cost = 50;
      if (gameState.gold >= cost) {
        gameState.gold -= cost;
        gameState.arrows = Math.min(gameState.arrows + 10, gameState.playerWeapon.maxArrows);
        showNotification("🏹 +10 стрел!");
        success = true;
      }
      break;
    case 'heal':
      cost = 150;
      if (gameState.gold >= cost && gameState.baseHP < gameState.maxBaseHP) {
        gameState.gold -= cost;
        gameState.baseHP = Math.min(gameState.baseHP + 50, gameState.maxBaseHP);
        createParticle(BASE_X + 50, BASE_Y + 50, "+50❤️", "#4CAF50", 'heal');
        showNotification("❤️ База восстановлена!");
        success = true;
      }
      break;
    case 'bomb':
      cost = 400;
      if (gameState.gold >= cost) {
        gameState.gold -= cost;
        enemies.forEach(enemy => {
          createExplosion(enemy.x, enemy.y, 60, "#FF6B35");
          gameState.gold += Math.floor(enemy.reward * 0.5);
        });
        enemies = [];
        showNotification("💣 Все враги уничтожены!");
        success = true;
      }
      break;
  }

  if (success) {
    gameState.updateUI();
  } else {
    showNotification("💰 Недостаточно золота!", "#FF4444");
  }
}

function updateShopPrices() {
  Object.keys(soldierTypes).forEach(type => {
    const element = document.getElementById(`${type}-cost`);
    if (element) element.textContent = soldierTypes[type].cost;
  });
}

function changeVolume(value) {
  soundVolume = value / 100;
  document.getElementById('volumeValue').textContent = value + '%';
}

function toggleMute() {
  soundEnabled = !soundEnabled;
  showNotification(soundEnabled ? "🔊 Звук включен" : "🔇 Звук выключен");
}

function gameOver() {
  gameState.paused = true;

  canvas.style.filter = 'grayscale(50%) blur(2px)';

  showNotification(`💀 Игра окончена! Волн пройдено: ${gameState.wave}`, "#FF0000");

  setTimeout(() => {
    if (confirm(`🏆 Игра окончена!\n\n📊 Статистика:\n• Волн пройдено: ${gameState.wave}\n• Врагов убито: ${gameState.achievementSystem.statistics.enemiesKilled}\n• Боссов повержено: ${gameState.achievementSystem.statistics.bossesKilled}\n• Солдат нанято: ${gameState.achievementSystem.statistics.soldiersHired}\n\n🔄 Хотите начать заново?`)) {
      restartGame();
    }
  }, 2000);
}

function restartGame() {
  gameState.gold = 100;
  gameState.wave = 0;
  gameState.baseHP = 100;
  gameState.maxBaseHP = 100;
  gameState.baseLevel = 1;
  gameState.arrows = 10;
  gameState.reloading = false;
  gameState.paused = false;
  gameState.gameStarted = false;

  enemies = [];
  soldiers = [];
  soldierQueue = [];
  bullets = [];
  particles = [];
  explosions = [];

  camera = { x: 0, y: 0 };
  canvas.style.filter = 'none';

  gameState.updateUI();
  updateShopPrices();
  showNotification("🎮 Новая игра началась!", "#4CAF50");
}

function saveGame() {
  const saveData = {
    gold: gameState.gold,
    wave: gameState.wave,
    baseLevel: gameState.baseLevel,
    maxBaseHP: gameState.maxBaseHP,
    achievements: gameState.achievementSystem.achievements,
    statistics: gameState.achievementSystem.statistics
  };

  localStorage.setItem('stickTD_save', JSON.stringify(saveData));
  showNotification("💾 Игра сохранена!", "#4CAF50");
}

function loadGame() {
  const saveData = JSON.parse(localStorage.getItem('stickTD_save') || 'null');
  if (saveData) {
    gameState.gold = saveData.gold || gameState.gold;
    gameState.wave = saveData.wave || gameState.wave;
    gameState.baseLevel = saveData.baseLevel || gameState.baseLevel;
    gameState.maxBaseHP = saveData.maxBaseHP || gameState.maxBaseHP;
    gameState.baseHP = gameState.maxBaseHP;

    if (saveData.statistics) {
      gameState.achievementSystem.statistics = saveData.statistics;
    }

    gameState.updateUI();
    showNotification("📂 Игра загружена!", "#4CAF50");
  } else {
    showNotification("❌ Нет сохранений!", "#FF8844");
  }
}

// Управление
canvas.addEventListener("click", handleShoot);

document.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;

  // Обработка чит-кодов
  handleCheatInput(e.key);

  if (e.key === ' ') {
    e.preventDefault();
    gameState.paused = !gameState.paused;
    showNotification(gameState.paused ? "⏸️ Пауза" : "▶️ Продолжение", gameState.paused ? "#FFA500" : "#4CAF50");
  }
});

document.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

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

// Инициализация игры
function initGame() {
  // Загружаем сохраненный язык
  const savedLanguage = localStorage.getItem('gameLanguage');
  if (savedLanguage && translations[savedLanguage]) {
    currentLanguage = savedLanguage;
    document.getElementById('languageSelect').value = savedLanguage;
  }

  generateBackground();
  gameState.updateUI();
  updateShopPrices();
  updateUITexts();

  showNotification("🎮 " + (currentLanguage === 'ru' ? "Добро пожаловать в Stick TD Ultimate! Приготовьтесь к эпичным битвам!" : 
                            currentLanguage === 'en' ? "Welcome to Stick TD Ultimate! Prepare for epic battles!" :
                            currentLanguage === 'uk' ? "Ласкаво просимо до Stick TD Ultimate! Готуйтеся до епічних битв!" :
                            currentLanguage === 'de' ? "Willkommen bei Stick TD Ultimate! Bereitet euch auf epische Schlachten vor!" :
                            currentLanguage === 'zh' ? "欢迎来到火柴人TD终极版！准备史诗般的战斗！" :
                            currentLanguage === 'es' ? "¡Bienvenido a Stick TD Ultimate! ¡Prepárate para batallas épicas!" :
                            currentLanguage === 'fr' ? "Bienvenue dans Stick TD Ultimate ! Préparez-vous aux batailles épiques !" :
                            currentLanguage === 'it' ? "Benvenuto in Stick TD Ultimate! Preparati per battaglie epiche!" :
                            "Добро пожаловать в Stick TD Ultimate! Приготовьтесь к эпичным битвам!"), "#4CAF50");

  if (localStorage.getItem('stickTD_save')) {
    setTimeout(() => {
      const confirmText = currentLanguage === 'ru' ? "💾 Найдено сохранение! Загрузить игру?" :
                         currentLanguage === 'en' ? "💾 Save found! Load game?" :
                         currentLanguage === 'uk' ? "💾 Знайдено збереження! Завантажити гру?" :
                         currentLanguage === 'de' ? "💾 Speicherdatei gefunden! Spiel laden?" :
                         currentLanguage === 'zh' ? "💾 找到存档！加载游戏？" :
                         currentLanguage === 'es' ? "💾 ¡Guardado encontrado! ¿Cargar juego?" :
                         currentLanguage === 'fr' ? "💾 Sauvegarde trouvée ! Charger le jeu ?" :
                         currentLanguage === 'it' ? "💾 Salvataggio trovato! Caricare il gioco?" :
                         "💾 Найдено сохранение! Загрузить игру?";
      if (confirm(confirmText)) {
        loadGame();
      }
    }, 1000);
  }

  gameLoop();
}

// Запуск игры
window.addEventListener('load', initGame);