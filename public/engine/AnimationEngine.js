/**
 * AnimationEngine - 动画引擎核心
 */
class AnimationEngine {
    constructor() {
        this.state = 'idle'; this.stateTime = 0;
        this.stateDuration = 3000 + Math.random() * 4000;
        this.actions = {};
        this.blink = { timer: 2000 + Math.random() * 3000, open: true };
        this.breath = { phase: 0 };
        this.tail = new TailPhysics(10, 8);
        this.skin = null; this.dragging = false;
    }
    register(name, cfg) { this.actions[name] = { weight: cfg.weight || 0.5, duration: cfg.duration || [2000, 4000], update: cfg.update || (() => {}) }; }
    setSkin(skin) { this.skin = skin; this.skin.setEngine(this); }
    pickNext() {
        const n = Object.keys(this.actions), w = n.map(k => this.actions[k].weight), t = w.reduce((a, b) => a + b, 0);
        let r = Math.random() * t;
        for (let i = 0; i < n.length; i++) { r -= w[i]; if (r <= 0) { this.state = n[i]; const d = this.actions[n[i]].duration; this.stateDuration = d[0] + Math.random() * (d[1] - d[0]); return; } }
        this.state = 'idle';
    }
    update(dt) {
        this.breath.phase += dt * 0.002;
        this.blink.timer -= dt;
        if (this.blink.timer <= 0) {
            if (this.blink.open) { this.blink.open = false; this.blink.timer = 150; }
            else { this.blink.open = true; this.blink.timer = 2000 + Math.random() * 3000; }
        }
        if (!this.dragging) { this.stateTime += dt; if (this.stateTime > this.stateDuration) { this.stateTime = 0; this.pickNext(); } }
        const pose = { head: { x: 0, y: 0, rotation: 0, scale: 1 }, body: { scaleX: 1, scaleY: 1, offsetX: 0, offsetY: 0 }, eyes: { open: 1, leftX: 0, rightX: 0, pupilSize: 1 }, ears: { leftAngle: 0, rightAngle: 0 }, mouth: { type: 'normal' }, paws: { frontLeft: { x: 0, y: 0 }, frontRight: { x: 0, y: 0 }, backLeft: { x: 0, y: 0 }, backRight: { x: 0, y: 0 } }, tail: [], whiskers: { twitch: 0 }, breath: { scale: 1 } };
        if (this.actions[this.state]) this.actions[this.state].update(this, pose, this.stateTime);
        this.tail.update(0.2, 0.97);
        this.tail.constrain(5);
        pose.tail = this.tail.getPoints();
        pose.breath.scale = 1 + Math.sin(this.breath.phase) * 0.02;
        pose.eyes.open = this.blink.open ? 1 : 0.15;
        if (Math.random() < 0.01) pose.whiskers.twitch = 0.3 + Math.random() * 0.7; else pose.whiskers.twitch *= 0.95;
        if (this.skin) this.skin.render(pose);
    }
    setDrag(d) { this.dragging = d; if (!d) { this.state = 'idle'; this.stateTime = 0; } }
}
