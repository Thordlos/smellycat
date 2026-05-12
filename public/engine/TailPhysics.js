/**
 * TailPhysics - Verlet 积分尾巴物理模拟
 */
class TailPhysics {
    constructor(numSegments = 10, segmentLength = 8) {
        this.numSegments = numSegments;
        this.segmentLength = segmentLength;
        this.points = [];
        this.sticks = [];
        this.engine = null;
        this.init();
    }
    
    init() {
        this.points = [];
        this.sticks = [];
        for (let i = 0; i < this.numSegments; i++) {
            this.points.push({ 
                x: 25 + i * 3, 
                y: -20 + i * this.segmentLength, 
                ox: 25 + i * 3, 
                oy: -20 + i * this.segmentLength, 
                pinned: i === 0 
            });
        }
        for (let i = 0; i < this.numSegments - 1; i++) {
            this.sticks.push({ 
                p1: this.points[i], 
                p2: this.points[i + 1], 
                length: this.segmentLength 
            });
        }
    }
    
    setEngine(engine) {
        this.engine = engine;
    }
    
    update(pose) {
        const gravity = 0.5;
        const friction = 0.95;
        
        // 更新根部位置（跟随身体）
        if (!this.points[0].pinned) {
            this.points[0].x = 25;
            this.points[0].y = -20;
        }
        
        // Verlet 积分
        for (const p of this.points) {
            if (p.pinned) continue;
            const vx = (p.x - p.ox) * friction;
            const vy = (p.y - p.oy) * friction;
            p.ox = p.x;
            p.oy = p.y;
            p.x += vx;
            p.y += vy + gravity;
        }
        
        // 约束迭代
        this.constrain(5);
        
        // 应用摆动效果
        if (this.engine && pose) {
            const time = Date.now();
            const wagAmount = Math.sin(time * 0.005) * 2;
            this.points[this.points.length - 1].x += wagAmount;
        }
    }
    
    constrain(iterations) {
        for (let i = 0; i < iterations; i++) {
            for (const s of this.sticks) {
                const dx = s.p2.x - s.p1.x;
                const dy = s.p2.y - s.p1.y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d === 0) continue;
                const f = (s.length - d) / d * 0.5;
                if (!s.p1.pinned) { 
                    s.p1.x -= dx * f; 
                    s.p1.y -= dy * f; 
                }
                s.p2.x += dx * f; 
                s.p2.y += dy * f;
            }
        }
    }
    
    getPoints() {
        return this.points.map(p => ({ x: p.x, y: p.y }));
    }
}
