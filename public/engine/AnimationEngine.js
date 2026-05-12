/**
 * AnimationEngine - 动画引擎核心
 * 支持：状态机、眨眼、呼吸、尾巴物理、鼠标注视、点击反馈
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
        // 鼠标追踪
        this.mouse = { x: 0, y: 0, active: false, lastMove: 0 };
        // 反馈动作（点击触发）
        this.feedback = { active: false, name: null, time: 0, duration: 0 };
    }
    register(name, cfg) { this.actions[name] = { weight: cfg.weight || 0.5, duration: cfg.duration || [2000, 4000], update: cfg.update || (() => {}) }; }
    setSkin(skin) { this.skin = skin; this.skin.setEngine(this); }
    pickNext() {
        const n = Object.keys(this.actions), w = n.map(k => this.actions[k].weight), t = w.reduce((a, b) => a + b, 0);
        let r = Math.random() * t;
        for (let i = 0; i < n.length; i++) { r -= w[i]; if (r <= 0) { this.state = n[i]; const d = this.actions[n[i]].duration; this.stateDuration = d[0] + Math.random() * (d[1] - d[0]); return; } }
        this.state = 'idle';
    }
    setMouse(dx, dy) {
        this.mouse.x = dx;
        this.mouse.y = dy;
        this.mouse.active = true;
        this.mouse.lastMove = Date.now();
    }
    triggerFeedback(name, duration) {
        if (this.feedback.active || !this.actions[name]) return false;
        this.feedback.active = true;
        this.feedback.name = name;
        this.feedback.time = 0;
        this.feedback.duration = duration || 800;
        return true;
    }
    update(dt) {
        this.breath.phase += dt * 0.002;
        this.blink.timer -= dt;
        if (this.blink.timer <= 0) {
            if (this.blink.open) { this.blink.open = false; this.blink.timer = 150; }
            else { this.blink.open = true; this.blink.timer = 2000 + Math.random() * 3000; }
        }
        // 反馈动作计时
        if (this.feedback.active) {
            this.feedback.time += dt;
            if (this.feedback.time > this.feedback.duration) {
                this.feedback.active = false;
                this.stateTime = 0;
            }
        }
        // 状态机（拖拽或反馈时暂停）
        if (!this.dragging && !this.feedback.active) {
            this.stateTime += dt;
            if (this.stateTime > this.stateDuration) { this.stateTime = 0; this.pickNext(); }
        }
        // 鼠标超时取消注视
        if (this.mouse.active && Date.now() - this.mouse.lastMove > 2000) this.mouse.active = false;

        const pose = { head: { x: 0, y: 0, rotation: 0, scale: 1 }, body: { scaleX: 1, scaleY: 1, offsetX: 0, offsetY: 0 }, eyes: { open: 1, leftX: 0, rightX: 0, pupilSize: 1 }, ears: { leftAngle: 0, rightAngle: 0 }, mouth: { type: 'normal' }, paws: { frontLeft: { x: 0, y: 0 }, frontRight: { x: 0, y: 0 }, backLeft: { x: 0, y: 0 }, backRight: { x: 0, y: 0 } }, tail: [], whiskers: { twitch: 0 }, breath: { scale: 1 } };

        // 执行动作：feedback 优先
        if (this.feedback.active && this.actions[this.feedback.name]) {
            this.actions[this.feedback.name].update(this, pose, this.feedback.time);
        } else if (this.actions[this.state]) {
            this.actions[this.state].update(this, pose, this.stateTime);
        }

        // 鼠标注视（覆盖动作的 head.rotation 和 eyes 偏移）
        if (this.mouse.active) {
            const lookFactorX = Math.max(-1, Math.min(1, this.mouse.x / 150));
            const lookFactorY = Math.max(-1, Math.min(1, this.mouse.y / 100));
            pose.head.rotation = lookFactorX * 0.25;
            pose.eyes.leftX = lookFactorX * 3;
            pose.eyes.rightX = lookFactorX * 3;
        }

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
