
// Object Pool для оптимизации создания/удаления объектов
class ObjectPool {
  constructor(createFn, resetFn, initialSize = 10) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.pool = [];
    this.active = [];
    
    // Предварительно создаем объекты
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFn());
    }
  }

  get() {
    let obj;
    if (this.pool.length > 0) {
      obj = this.pool.pop();
    } else {
      obj = this.createFn();
    }
    this.active.push(obj);
    return obj;
  }

  release(obj) {
    const index = this.active.indexOf(obj);
    if (index > -1) {
      this.active.splice(index, 1);
      this.resetFn(obj);
      this.pool.push(obj);
    }
  }

  releaseAll() {
    while (this.active.length > 0) {
      this.release(this.active[0]);
    }
  }

  getActiveCount() {
    return this.active.length;
  }
}

// Пулы для разных типов объектов
const ObjectPools = {
  bullets: new ObjectPool(
    () => ({ x: 0, y: 0, targetX: 0, targetY: 0, speed: 0, damage: 0, color: '', isPlayer: false }),
    (obj) => { obj.x = 0; obj.y = 0; obj.speed = 0; obj.damage = 0; }
  ),

  particles: new ObjectPool(
    () => ({ x: 0, y: 0, text: '', color: '', life: 0, vy: 0 }),
    (obj) => { obj.text = ''; obj.life = 0; }
  ),

  explosions: new ObjectPool(
    () => ({ x: 0, y: 0, radius: 0, maxRadius: 0, life: 0 }),
    (obj) => { obj.radius = 0; obj.life = 0; }
  )
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ObjectPool, ObjectPools };
} else if (typeof window !== 'undefined') {
  window.ObjectPool = ObjectPool;
  window.ObjectPools = ObjectPools;
}
