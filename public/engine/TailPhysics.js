/**
 * TailPhysics - Verlet 积分尾巴物理模拟
 */
class TailPhysics {
    constructor(numSegments = 10, segmentLength = 8) {
        this.points = []; this.sticks = [];
        for (let i = 0; i < numSegments; i++)
            this.points.push({ x: 10, y: -15 + i * segmentLength, ox: 10, oy: -15 + i * segmentLength, pinned: i === 0 });
        for (let i = 0; i < numSegments - 1; i++)
            this.sticks.push({ p1: this.points[i], p2: this.points[i + 1], length: segmentLength });
    }
    update(gravity, friction) {
        for (const p of this.points) {
            if (p.pinned) continue;
            const vx = (p.x - p.ox) * friction, vy = (p.y - p.oy) * friction;
            p.ox = p.x; p.oy = p.y; p.x += vx; p.y += vy + gravity;
        }
    }
    constrain(iterations) {
        for (let i = 0; i < iterations; i++)
            for (const s of this.sticks) {
                const dx = s.p2.x - s.p1.x, dy = s.p2.y - s.p1.y, d = Math.sqrt(dx * dx + dy * dy);
                if (d === 0) continue;
                const f = (s.length - d) / d * 0.5;
                if (!s.p1.pinned) { s.p1.x -= dx * f; s.p1.y -= dy * f; }
                s.p2.x += dx * f; s.p2.y += dy * f;
            }
    }
    applyWag(time, amp = 3) { this.points[this.points.length - 1].x += Math.sin(time * 0.01) * amp; }
    getPoints() { return this.points.map(p => ({ x: p.x, y: p.y })); }
}
