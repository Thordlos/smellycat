/**
 * GingerCatSkin - 橘猫皮肤
 * 特征：橘黄底色+深橘条纹、琥珀色眼睛、白色下巴肚子爪子、圆脸
 */
class GingerCatSkin {
    constructor(app) {
        this.app = app;
        this.engine = null;

        this.colors = {
            base: 0xFF9933,       // 橘黄底色
            stripe: 0xCC6600,     // 深橘条纹
            light: 0xFFB366,      // 浅橘
            white: 0xFFFFFF,      // 白色区域
            belly: 0xFFF5E6,      // 肚子
            outline: 0x8B4513,    // 轮廓
            eye: 0xFFB347,        // 琥珀色眼睛
            pupil: 0x1A1A1A,      // 瞳孔
            eyeHigh: 0xFFFFFF,    // 高光
            nose: 0xFF6699,       // 粉色鼻子
            innerEar: 0xFFCCAA,   // 耳朵内部
            paw: 0xFFFFFF,        // 白色爪子
            pawPad: 0xFF99AA,     // 粉色肉球
            whisker: 0xDDCCBB,    // 胡须
            tailRing: 0xCC6600    // 尾巴环纹
        };

        this.container = app.stage.addChild(new PIXI.Container());
        this.container.x = 200;
        this.container.y = 220;

        this.gfx = {};
        ['shadow', 'backLegs', 'tail', 'body', 'belly', 'chest', 'headBase', 'ears', 'face', 'frontPaws', 'whiskers'].forEach(k => {
            this.gfx[k] = this.container.addChild(new PIXI.Graphics());
        });
    }

    setEngine(engine) { this.engine = engine; }

    destroy() {
        this.app.stage.removeChild(this.container);
        this.container.destroy({ children: true });
        this.gfx = null;
        this.engine = null;
    }

    render(pose) {
        const c = this.colors, g = this.gfx, bs = pose.body;

        // === 阴影 ===
        g.shadow.clear();
        g.shadow.fill({ color: 0x000000, alpha: 0.08 });
        g.shadow.ellipse(4, 32, 34, 10);

        // === 后腿 ===
        g.backLegs.clear();
        this._drawBackLeg(g.backLegs, -20, 24, 7);
        this._drawBackLeg(g.backLegs, 20, 24, 7);

        // === 尾巴（环状条纹）===
        g.tail.clear();
        const t = pose.tail;
        if (t.length >= 2) {
            for (let i = 0; i < t.length - 1; i++) {
                const width = 10 - i * 0.5;
                g.tail.stroke({ width: width, color: c.base });
                g.tail.moveTo(t[i].x, t[i].y);
                g.tail.lineTo(t[i+1].x, t[i+1].y);
            }
            // 环纹
            for (let i = 1; i < t.length - 1; i += 2) {
                g.tail.stroke({ width: 3, color: c.tailRing });
                const perp = this._perp(t, i);
                g.tail.moveTo(t[i].x - perp.x * 5, t[i].y - perp.y * 5);
                g.tail.lineTo(t[i].x + perp.x * 5, t[i].y + perp.y * 5);
            }
            const last = t[t.length - 1];
            g.tail.fill({ color: c.tailRing });
            g.tail.circle(last.x, last.y, 4);
        }

        // === 身体（圆润）===
        g.body.clear();
        g.body.fill({ color: c.base });
        g.body.stroke({ width: 1.5, color: c.outline });
        this._drawRoundBody(g.body, 0, 0, 30, 36);
        g.body.fill({ color: c.base });
        g.body.stroke({ width: 1.5, color: c.outline });

        // 身体条纹
        g.body.stroke({ width: 2, color: c.stripe });
        for (let i = 0; i < 3; i++) {
            const y = -12 + i * 11;
            g.body.moveTo(-22, y);
            g.body.quadraticCurveTo(0, y + 4, 22, y);
        }

        // === 腹部（白色）===
        g.belly.clear();
        g.belly.fill({ color: c.belly });
        g.belly.ellipse(0, 10, 14, 16);

        // === 胸前白毛 ===
        g.chest.clear();
        g.chest.fill({ color: c.white });
        g.chest.ellipse(0, -24, 16, 12);

        // === 头部（圆脸）===
        const hx = pose.head.x;
        const hy = pose.head.y - 50;
        const hr = pose.head.rotation;

        g.headBase.clear();
        g.headBase.x = hx;
        g.headBase.y = hy;
        g.headBase.angle = hr * (180 / Math.PI);

        // 圆脸
        g.headBase.fill({ color: c.base });
        g.headBase.stroke({ width: 1.5, color: c.outline });
        g.headBase.ellipse(0, 0, 30, 26);
        g.headBase.fill({ color: c.base });
        g.headBase.stroke({ width: 1.5, color: c.outline });

        // 白色下巴和嘴套
        g.headBase.fill({ color: c.white });
        g.headBase.ellipse(0, 16, 16, 10);
        g.headBase.fill({ color: c.white });
        g.headBase.ellipse(-18, 8, 10, 8);
        g.headBase.ellipse(18, 8, 10, 8);

        // 额头条纹
        g.headBase.stroke({ width: 2, color: c.stripe });
        g.headBase.moveTo(-6, -22);
        g.headBase.lineTo(-4, -14);
        g.headBase.lineTo(0, -18);
        g.headBase.lineTo(4, -14);
        g.headBase.lineTo(6, -22);

        // === 耳朵 ===
        const la = pose.ears.leftAngle || 0;
        const ra = pose.ears.rightAngle || 0;
        g.ears.clear();
        g.ears.x = hx;
        g.ears.y = hy;
        g.ears.angle = hr * (180 / Math.PI);

        // 左耳
        g.ears.fill({ color: c.base });
        g.ears.stroke({ width: 1.5, color: c.outline });
        g.ears.moveTo(-18 + la * 10, -16);
        g.ears.quadraticCurveTo(-28 + la * 18, -40, -10 + la * 8, -20);
        g.ears.closePath();
        g.ears.fill();
        g.ears.fill({ color: c.innerEar });
        g.ears.moveTo(-16 + la * 10, -18);
        g.ears.quadraticCurveTo(-24 + la * 15, -36, -11 + la * 8, -22);
        g.ears.closePath();
        g.ears.fill();

        // 右耳
        g.ears.fill({ color: c.base });
        g.ears.stroke({ width: 1.5, color: c.outline });
        g.ears.moveTo(18 - ra * 10, -16);
        g.ears.quadraticCurveTo(28 - ra * 18, -40, 10 - ra * 8, -20);
        g.ears.closePath();
        g.ears.fill();
        g.ears.fill({ color: c.innerEar });
        g.ears.moveTo(16 - ra * 10, -18);
        g.ears.quadraticCurveTo(24 - ra * 15, -36, 11 - ra * 8, -22);
        g.ears.closePath();
        g.ears.fill();

        // === 脸部 ===
        g.face.clear();
        g.face.x = hx;
        g.face.y = hy;
        g.face.angle = hr * (180 / Math.PI);

        const ey = pose.eyes;
        const eyeH = 7 * ey.open;

        // 眼睛（大而圆）
        g.face.fill({ color: c.eye });
        g.face.ellipse(-12 + ey.leftX, -4, 10, eyeH);
        g.face.ellipse(12 + ey.rightX, -4, 10, eyeH);
        g.face.stroke({ width: 1, color: c.outline });
        g.face.ellipse(-12 + ey.leftX, -4, 10, eyeH);
        g.face.ellipse(12 + ey.rightX, -4, 10, eyeH);

        if (ey.open > 0.5) {
            // 瞳孔（圆瞳）
            g.face.fill({ color: c.pupil });
            g.face.circle(-12 + ey.leftX, -4, 3.5);
            g.face.circle(12 + ey.rightX, -4, 3.5);
            // 高光
            g.face.fill({ color: c.eyeHigh });
            g.face.circle(-10 + ey.leftX, -6, 2.5);
            g.face.circle(14 + ey.rightX, -6, 2.5);
            g.face.circle(-13 + ey.leftX, -2, 1);
            g.face.circle(10 + ey.rightX, -2, 1);
        }

        // 鼻子
        g.face.fill({ color: c.nose });
        g.face.moveTo(0, 6);
        g.face.lineTo(-3, 10);
        g.face.quadraticCurveTo(0, 12, 3, 10);
        g.face.closePath();
        g.face.fill();
        g.face.stroke({ width: 0.5, color: c.outline });

        // 嘴巴
        g.face.stroke({ width: 1.5, color: c.outline });
        if (pose.mouth.type === 'open') {
            g.face.fill({ color: 0xFF8899 });
            g.face.ellipse(0, 15, 5, 4);
            g.face.fill();
        } else if (pose.mouth.type === 'smile') {
            g.face.moveTo(0, 10);
            g.face.quadraticCurveTo(-5, 16, -8, 13);
            g.face.moveTo(0, 10);
            g.face.quadraticCurveTo(5, 16, 8, 13);
        } else {
            g.face.moveTo(0, 10);
            g.face.quadraticCurveTo(-3, 14, -6, 12);
            g.face.moveTo(0, 10);
            g.face.quadraticCurveTo(3, 14, 6, 12);
        }

        // === 前爪（白色）===
        g.frontPaws.clear();
        this._drawFrontPaw(g.frontPaws, pose.paws.frontLeft.x - 14, pose.paws.frontLeft.y + 28 + bs.offsetY);
        this._drawFrontPaw(g.frontPaws, pose.paws.frontRight.x + 14, pose.paws.frontRight.y + 28 + bs.offsetY);

        // === 胡须 ===
        g.whiskers.clear();
        g.whiskers.x = hx;
        g.whiskers.y = hy;
        g.whiskers.angle = hr * (180 / Math.PI);
        g.whiskers.stroke({ width: 1, color: c.whisker });

        const tw = pose.whiskers.twitch;
        for (let i = -2; i <= 2; i++) {
            const tx = tw * (Math.random() - 0.5) * 3;
            const y = 2 + i * 4;
            g.whiskers.moveTo(-16, y);
            g.whiskers.quadraticCurveTo(-24, y - 1, -34 + tx, y - 2);
            g.whiskers.moveTo(16, y);
            g.whiskers.quadraticCurveTo(24, y - 1, 34 - tx, y - 2);
        }
    }

    _drawRoundBody(g, cx, cy, rw, rh) {
        g.moveTo(cx, cy - rh);
        g.bezierCurveTo(cx - rw * 1.3, cy - rh * 0.8, cx - rw, cy + rh * 0.4, cx - rw * 0.7, cy + rh * 0.9);
        g.bezierCurveTo(cx - rw * 0.3, cy + rh * 1.1, cx + rw * 0.3, cy + rh * 1.1, cx + rw * 0.7, cy + rh * 0.9);
        g.bezierCurveTo(cx + rw, cy + rh * 0.4, cx + rw * 1.3, cy - rh * 0.8, cx, cy - rh);
        g.closePath();
    }

    _drawBackLeg(g, x, y, s) {
        g.fill({ color: this.colors.base });
        g.stroke({ width: 1.5, color: this.colors.outline });
        g.ellipse(x, y, s, s * 1.4);
        // 白色爪子
        g.fill({ color: this.colors.white });
        g.ellipse(x, y + s * 0.9, s * 0.6, s * 0.4);
    }

    _drawFrontPaw(g, x, y) {
        const c = this.colors;
        g.fill({ color: c.paw });
        g.stroke({ width: 1.5, color: c.outline });
        g.ellipse(x, y, 8, 6);
        g.fill({ color: c.pawPad });
        g.circle(x, y + 1, 3.5);
        g.fill({ color: c.pawPad });
        g.circle(x - 3.5, y - 1, 1.5);
        g.circle(x + 3.5, y - 1, 1.5);
    }

    _perp(points, i) {
        if (i === 0) {
            const dx = points[1].x - points[0].x;
            const dy = points[1].y - points[0].y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            return { x: -dy / len, y: dx / len };
        }
        const dx = points[i].x - points[i - 1].x;
        const dy = points[i].y - points[i - 1].y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        return { x: -dy / len, y: dx / len };
    }
}
