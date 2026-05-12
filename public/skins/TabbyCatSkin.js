/**
 * TabbyCatSkin - 狸花猫皮肤
 * 特征：棕黄底色+深棕虎斑条纹、绿色眼睛、粉色鼻子、M形额头纹、条纹尾巴
 */
class TabbyCatSkin {
    constructor(app) {
        this.app = app;
        this.engine = null;

        this.colors = {
            base: 0xC4915C,       // 棕黄底色
            stripe: 0x5C3D2E,     // 深棕条纹
            light: 0xD4A574,      // 浅色毛发
            belly: 0xF5E6D3,      // 米白腹部
            chest: 0xFFF8F0,      // 胸前白毛
            outline: 0x4A3728,    // 轮廓
            eye: 0x6B8E23,        // 绿色眼睛
            pupil: 0x1A1A1A,      // 瞳孔
            eyeHigh: 0xFFFFFF,    // 高光
            nose: 0xE894A9,       // 粉色鼻子
            innerEar: 0xF4A6B5,   // 耳朵内部
            paw: 0xF5E6D3,        // 爪子（白色）
            pawPad: 0xE894A9,     // 粉色肉球
            whisker: 0xE8D5C4,    // 浅色胡须
            tailTip: 0x5C3D2E     // 尾巴尖
        };

        this.container = app.stage.addChild(new PIXI.Container());
        this.container.x = 200;
        this.container.y = 220;

        // 精细分层：阴影→后腿→尾巴→身体→腹部→头部→耳朵→脸→前爪→胡须
        this.gfx = {};
        ['shadow', 'backLegs', 'tail', 'body', 'belly', 'chest', 'headBase', 'headStripes', 'ears', 'face', 'frontPaws', 'whiskers'].forEach(k => {
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
        g.shadow.ellipse(4, 32, 32, 10);

        // === 后腿 ===
        g.backLegs.clear();
        this._drawBackLeg(g.backLegs, -18, 24, 7);
        this._drawBackLeg(g.backLegs, 18, 24, 7);

        // === 尾巴（条纹）===
        g.tail.clear();
        const t = pose.tail;
        if (t.length >= 2) {
            // 主尾
            for (let i = 0; i < t.length - 1; i++) {
                const width = 9 - i * 0.5;
                g.tail.stroke({ width: width, color: c.base });
                g.tail.moveTo(t[i].x, t[i].y);
                g.tail.lineTo(t[i+1].x, t[i+1].y);
            }
            // 条纹环
            for (let i = 1; i < t.length - 1; i += 2) {
                g.tail.stroke({ width: 3, color: c.stripe });
                const perp = this._perp(t, i);
                g.tail.moveTo(t[i].x - perp.x * 4, t[i].y - perp.y * 4);
                g.tail.lineTo(t[i].x + perp.x * 4, t[i].y + perp.y * 4);
            }
            // 尾巴尖
            const last = t[t.length - 1];
            g.tail.fill({ color: c.tailTip });
            g.tail.circle(last.x, last.y, 4);
        }

        // === 身体（带条纹）===
        g.body.clear();
        // 主体轮廓
        g.body.fill({ color: c.base });
        g.body.stroke({ width: 1.5, color: c.outline });
        this._drawBodyShape(g.body, 0, 0, 28, 35);
        g.body.fill({ color: c.base });
        g.body.stroke({ width: 1.5, color: c.outline });

        // 身体条纹（虎斑）
        g.body.stroke({ width: 2, color: c.stripe });
        for (let i = 0; i < 4; i++) {
            const y = -15 + i * 10;
            const w = 20 - Math.abs(y) * 0.3;
            g.body.moveTo(-w, y);
            g.body.quadraticCurveTo(0, y + 3, w, y);
        }
        // 侧面条纹
        g.body.moveTo(-22, -5); g.body.lineTo(-26, 5); g.body.lineTo(-22, 15);
        g.body.moveTo(22, -5); g.body.lineTo(26, 5); g.body.lineTo(22, 15);

        // === 腹部（白色）===
        g.belly.clear();
        g.belly.fill({ color: c.belly });
        g.belly.ellipse(0, 8, 12, 18);

        // === 胸前白毛 ===
        g.chest.clear();
        g.chest.fill({ color: c.chest });
        g.chest.ellipse(0, -22, 14, 10);

        // === 头部底色 ===
        const hx = pose.head.x;
        const hy = pose.head.y - 48;
        const hr = pose.head.rotation;

        g.headBase.clear();
        g.headBase.x = hx;
        g.headBase.y = hy;
        g.headBase.angle = hr * (180 / Math.PI);

        // 头型（略宽）
        g.headBase.fill({ color: c.base });
        g.headBase.stroke({ width: 1.5, color: c.outline });
        g.headBase.ellipse(0, 0, 28, 24);
        g.headBase.fill({ color: c.base });
        g.headBase.stroke({ width: 1.5, color: c.outline });

        // 额头 M 形纹
        g.headBase.stroke({ width: 2, color: c.stripe });
        g.headBase.moveTo(-8, -18);
        g.headBase.lineTo(-4, -12);
        g.headBase.lineTo(0, -16);
        g.headBase.lineTo(4, -12);
        g.headBase.lineTo(8, -18);
        // 额头小斑点
        g.headBase.fill({ color: c.stripe });
        g.headBase.circle(-3, -8, 1.5);
        g.headBase.circle(3, -8, 1.5);
        g.headBase.circle(0, -5, 1);

        // 脸颊条纹
        g.headBase.stroke({ width: 1.5, color: c.stripe });
        g.headBase.moveTo(-20, -5); g.headBase.lineTo(-14, -2);
        g.headBase.moveTo(-20, 0); g.headBase.lineTo(-14, 2);
        g.headBase.moveTo(20, -5); g.headBase.lineTo(14, -2);
        g.headBase.moveTo(20, 0); g.headBase.lineTo(14, 2);

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
        g.ears.lineTo(-28 + la * 18, -38);
        g.ears.lineTo(-10 + la * 8, -20);
        g.ears.closePath();
        g.ears.fill();
        // 左耳内部
        g.ears.fill({ color: c.innerEar });
        g.ears.moveTo(-16 + la * 10, -18);
        g.ears.lineTo(-24 + la * 15, -34);
        g.ears.lineTo(-11 + la * 8, -22);
        g.ears.closePath();
        g.ears.fill();
        // 左耳尖
        g.ears.fill({ color: c.stripe });
        g.ears.circle(-28 + la * 18, -38, 2);

        // 右耳
        g.ears.fill({ color: c.base });
        g.ears.stroke({ width: 1.5, color: c.outline });
        g.ears.moveTo(18 - ra * 10, -16);
        g.ears.lineTo(28 - ra * 18, -38);
        g.ears.lineTo(10 - ra * 8, -20);
        g.ears.closePath();
        g.ears.fill();
        // 右耳内部
        g.ears.fill({ color: c.innerEar });
        g.ears.moveTo(16 - ra * 10, -18);
        g.ears.lineTo(24 - ra * 15, -34);
        g.ears.lineTo(11 - ra * 8, -22);
        g.ears.closePath();
        g.ears.fill();
        // 右耳尖
        g.ears.fill({ color: c.stripe });
        g.ears.circle(28 - ra * 18, -38, 2);

        // === 脸部 ===
        g.face.clear();
        g.face.x = hx;
        g.face.y = hy;
        g.face.angle = hr * (180 / Math.PI);

        const ey = pose.eyes;
        const eyeH = 7 * ey.open;

        // 眼睛轮廓
        g.face.fill({ color: c.eye });
        g.face.ellipse(-11 + ey.leftX, -4, 9, eyeH);
        g.face.ellipse(11 + ey.rightX, -4, 9, eyeH);
        g.face.stroke({ width: 1, color: c.outline });
        g.face.ellipse(-11 + ey.leftX, -4, 9, eyeH);
        g.face.ellipse(11 + ey.rightX, -4, 9, eyeH);

        if (ey.open > 0.5) {
            // 瞳孔（竖瞳，猫眼特征）
            g.face.fill({ color: c.pupil });
            g.face.ellipse(-11 + ey.leftX, -4, 2.5, 5);
            g.face.ellipse(11 + ey.rightX, -4, 2.5, 5);
            // 高光
            g.face.fill({ color: c.eyeHigh });
            g.face.circle(-9 + ey.leftX, -6, 2);
            g.face.circle(13 + ey.rightX, -6, 2);
            g.face.circle(-12 + ey.leftX, -3, 1);
            g.face.circle(10 + ey.rightX, -3, 1);
        }

        // 鼻子（立体倒三角）
        g.face.fill({ color: c.nose });
        g.face.moveTo(0, 8);
        g.face.lineTo(-3.5, 13);
        g.face.quadraticCurveTo(0, 15, 3.5, 13);
        g.face.closePath();
        g.face.fill();
        g.face.stroke({ width: 0.5, color: c.outline });
        // 鼻子中线
        g.face.stroke({ width: 0.8, color: c.outline });
        g.face.moveTo(0, 13);
        g.face.lineTo(0, 16);

        // 嘴巴（W形）
        g.face.stroke({ width: 1.5, color: c.outline });
        if (pose.mouth.type === 'open') {
            g.face.fill({ color: 0xFF99AA });
            g.face.ellipse(0, 19, 5, 4);
            g.face.fill();
        } else if (pose.mouth.type === 'smile') {
            g.face.moveTo(0, 16);
            g.face.quadraticCurveTo(-4, 20, -7, 17);
            g.face.moveTo(0, 16);
            g.face.quadraticCurveTo(4, 20, 7, 17);
        } else {
            g.face.moveTo(0, 16);
            g.face.quadraticCurveTo(-3, 19, -6, 17);
            g.face.moveTo(0, 16);
            g.face.quadraticCurveTo(3, 19, 6, 17);
        }

        // 下巴白毛
        g.face.fill({ color: c.chest });
        g.face.ellipse(0, 20, 8, 4);

        // === 前爪（白色+粉色肉球）===
        g.frontPaws.clear();
        this._drawFrontPaw(g.frontPaws, pose.paws.frontLeft.x - 12, pose.paws.frontLeft.y + 26 + bs.offsetY);
        this._drawFrontPaw(g.frontPaws, pose.paws.frontRight.x + 12, pose.paws.frontRight.y + 26 + bs.offsetY);

        // === 胡须 ===
        g.whiskers.clear();
        g.whiskers.x = hx;
        g.whiskers.y = hy;
        g.whiskers.angle = hr * (180 / Math.PI);
        g.whiskers.stroke({ width: 1, color: c.whisker });

        const tw = pose.whiskers.twitch;
        for (let i = -2; i <= 2; i++) {
            const tx = tw * (Math.random() - 0.5) * 3;
            const y = -2 + i * 5;
            g.whiskers.moveTo(-14, y);
            g.whiskers.quadraticCurveTo(-22, y - 2, -32 + tx, y - 3);
            g.whiskers.moveTo(14, y);
            g.whiskers.quadraticCurveTo(22, y - 2, 32 - tx, y - 3);
        }
    }

    _drawBodyShape(g, cx, cy, rw, rh) {
        g.moveTo(cx, cy - rh);
        g.bezierCurveTo(cx - rw * 1.2, cy - rh, cx - rw, cy + rh * 0.3, cx - rw * 0.8, cy + rh * 0.8);
        g.bezierCurveTo(cx - rw * 0.5, cy + rh, cx + rw * 0.5, cy + rh, cx + rw * 0.8, cy + rh * 0.8);
        g.bezierCurveTo(cx + rw, cy + rh * 0.3, cx + rw * 1.2, cy - rh, cx, cy - rh);
        g.closePath();
    }

    _drawBackLeg(g, x, y, s) {
        g.fill({ color: this.colors.base });
        g.stroke({ width: 1.5, color: this.colors.outline });
        g.ellipse(x, y, s, s * 1.4);
        // 后腿条纹
        g.stroke({ width: 1, color: this.colors.stripe });
        g.moveTo(x - s + 2, y - 4);
        g.lineTo(x + s - 2, y - 4);
        g.moveTo(x - s + 2, y + 2);
        g.lineTo(x + s - 2, y + 2);
        // 爪子
        g.fill({ color: this.colors.paw });
        g.ellipse(x, y + s * 0.9, s * 0.6, s * 0.4);
    }

    _drawFrontPaw(g, x, y) {
        const c = this.colors;
        g.fill({ color: c.paw });
        g.stroke({ width: 1.5, color: c.outline });
        g.ellipse(x, y, 7, 5);
        // 粉色肉球
        g.fill({ color: c.pawPad });
        g.circle(x, y + 1, 3);
        g.fill({ color: c.pawPad });
        g.circle(x - 3, y - 1, 1.5);
        g.circle(x + 3, y - 1, 1.5);
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
