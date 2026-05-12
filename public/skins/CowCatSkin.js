/**
 * CowCatSkin - 奶牛猫（燕尾服猫）皮肤
 * 特征：黑白分明、像穿燕尾服、白色脸中间一条黑线、绿色眼睛
 */
class CowCatSkin {
    constructor(app) {
        this.app = app;
        this.engine = null;

        this.colors = {
            black: 0x1A1A1A,      // 黑色主体
            white: 0xFFFFFF,      // 白色区域
            belly: 0xF8F8F8,      // 肚子
            outline: 0x333333,    // 轮廓
            eye: 0x4A9B4A,        // 绿色眼睛
            pupil: 0x0A0A0A,      // 瞳孔
            eyeHigh: 0xFFFFFF,    // 高光
            nose: 0xFF88AA,       // 粉色鼻子
            innerEar: 0xFFCCCC,   // 耳朵内部
            paw: 0xFFFFFF,        // 白色爪子
            pawPad: 0xFF88AA,     // 粉色肉球
            whisker: 0xCCCCCC,    // 胡须
            spot: 0x1A1A1A        // 斑点
        };

        this.container = app.stage.addChild(new PIXI.Container());
        this.container.x = 200;
        this.container.y = 220;

        this.gfx = {};
        ['shadow', 'backLegs', 'tail', 'body', 'belly', 'chest', 'headBase', 'headPattern', 'ears', 'face', 'frontPaws', 'whiskers'].forEach(k => {
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

        // === 尾巴（黑色+白尖）===
        g.tail.clear();
        const t = pose.tail;
        if (t.length >= 2) {
            for (let i = 0; i < t.length - 1; i++) {
                const width = 10 - i * 0.5;
                // 尾巴前2/3黑色，后1/3白色
                const color = i < t.length * 0.65 ? c.black : c.white;
                g.tail.stroke({ width: width, color: color });
                g.tail.moveTo(t[i].x, t[i].y);
                g.tail.lineTo(t[i+1].x, t[i+1].y);
            }
            // 白尖端
            const last = t[t.length - 1];
            g.tail.fill({ color: c.white });
            g.tail.circle(last.x, last.y, 5);
        }

        // === 身体（燕尾服分布）===
        g.body.clear();
        // 黑色主体
        g.body.fill({ color: c.black });
        g.body.stroke({ width: 1.5, color: c.outline });
        this._drawBodyShape(g.body, 0, 0, 30, 36);
        g.body.fill({ color: c.black });
        g.body.stroke({ width: 1.5, color: c.outline });

        // 背部白斑（奶牛特征）
        g.body.fill({ color: c.white });
        g.body.ellipse(-8, -10, 8, 6);
        g.body.fill({ color: c.white });
        g.body.ellipse(12, -5, 5, 4);

        // === 腹部（大片白色）===
        g.belly.clear();
        g.belly.fill({ color: c.belly });
        g.belly.ellipse(0, 10, 16, 18);

        // === 胸前白色 ===
        g.chest.clear();
        g.chest.fill({ color: c.white });
        g.chest.ellipse(0, -24, 18, 14);
        // 燕尾服领口效果
        g.chest.stroke({ width: 1, color: c.outline });
        g.chest.moveTo(-10, -18);
        g.chest.quadraticCurveTo(0, -12, 10, -18);

        // === 头部（黑白分明）===
        const hx = pose.head.x;
        const hy = pose.head.y - 50;
        const hr = pose.head.rotation;

        g.headBase.clear();
        g.headBase.x = hx;
        g.headBase.y = hy;
        g.headBase.angle = hr * (180 / Math.PI);

        // 黑色基底
        g.headBase.fill({ color: c.black });
        g.headBase.stroke({ width: 1.5, color: c.outline });
        g.headBase.ellipse(0, 0, 30, 26);
        g.headBase.fill({ color: c.black });
        g.headBase.stroke({ width: 1.5, color: c.outline });

        // === 头部花纹 ===
        g.headPattern.clear();
        g.headPattern.x = hx;
        g.headPattern.y = hy;
        g.headPattern.angle = hr * (180 / Math.PI);

        // 白色嘴套和下巴
        g.headPattern.fill({ color: c.white });
        g.headPattern.ellipse(0, 14, 18, 12);
        // 白色眼周
        g.headPattern.fill({ color: c.white });
        g.headPattern.ellipse(-14, -4, 10, 8);
        g.headPattern.ellipse(14, -4, 10, 8);
        // 额头白色（中间一条黑线分割）
        g.headPattern.fill({ color: c.white });
        g.headPattern.ellipse(-8, -16, 10, 10);
        g.headPattern.ellipse(8, -16, 10, 10);
        // 额头中线黑色
        g.headPattern.stroke({ width: 2, color: c.black });
        g.headPattern.moveTo(0, -20);
        g.headPattern.lineTo(0, -8);

        // === 耳朵 ===
        const la = pose.ears.leftAngle || 0;
        const ra = pose.ears.rightAngle || 0;
        g.ears.clear();
        g.ears.x = hx;
        g.ears.y = hy;
        g.ears.angle = hr * (180 / Math.PI);

        // 左耳（黑色外+粉内）
        g.ears.fill({ color: c.black });
        g.ears.stroke({ width: 1.5, color: c.outline });
        g.ears.moveTo(-18 + la * 10, -16);
        g.ears.lineTo(-28 + la * 18, -40);
        g.ears.lineTo(-10 + la * 8, -20);
        g.ears.closePath();
        g.ears.fill();
        g.ears.fill({ color: c.innerEar });
        g.ears.moveTo(-16 + la * 10, -18);
        g.ears.lineTo(-24 + la * 15, -36);
        g.ears.lineTo(-11 + la * 8, -22);
        g.ears.closePath();
        g.ears.fill();
        // 左耳白色尖端
        g.ears.fill({ color: c.white });
        g.ears.circle(-28 + la * 18, -40, 2.5);

        // 右耳
        g.ears.fill({ color: c.black });
        g.ears.stroke({ width: 1.5, color: c.outline });
        g.ears.moveTo(18 - ra * 10, -16);
        g.ears.lineTo(28 - ra * 18, -40);
        g.ears.lineTo(10 - ra * 8, -20);
        g.ears.closePath();
        g.ears.fill();
        g.ears.fill({ color: c.innerEar });
        g.ears.moveTo(16 - ra * 10, -18);
        g.ears.lineTo(24 - ra * 15, -36);
        g.ears.lineTo(11 - ra * 8, -22);
        g.ears.closePath();
        g.ears.fill();
        // 右耳白色尖端
        g.ears.fill({ color: c.white });
        g.ears.circle(28 - ra * 18, -40, 2.5);

        // === 脸部 ===
        g.face.clear();
        g.face.x = hx;
        g.face.y = hy;
        g.face.angle = hr * (180 / Math.PI);

        const ey = pose.eyes;
        const eyeH = 7 * ey.open;

        // 眼睛（在白色区域中）
        g.face.fill({ color: c.eye });
        g.face.ellipse(-12 + ey.leftX, -4, 9, eyeH);
        g.face.ellipse(12 + ey.rightX, -4, 9, eyeH);
        g.face.stroke({ width: 1, color: c.outline });
        g.face.ellipse(-12 + ey.leftX, -4, 9, eyeH);
        g.face.ellipse(12 + ey.rightX, -4, 9, eyeH);

        if (ey.open > 0.5) {
            // 瞳孔（绿色眼睛的黑色竖瞳）
            g.face.fill({ color: c.pupil });
            g.face.ellipse(-12 + ey.leftX, -4, 2.5, 5);
            g.face.ellipse(12 + ey.rightX, -4, 2.5, 5);
            // 高光
            g.face.fill({ color: c.eyeHigh });
            g.face.circle(-10 + ey.leftX, -6, 2);
            g.face.circle(14 + ey.rightX, -6, 2);
            g.face.circle(-13 + ey.leftX, -3, 1);
            g.face.circle(10 + ey.rightX, -3, 1);
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
            g.face.fill({ color: 0xFF99AA });
            g.face.ellipse(0, 15, 5, 4);
            g.face.fill();
        } else if (pose.mouth.type === 'smile') {
            g.face.moveTo(0, 10);
            g.face.quadraticCurveTo(-4, 16, -7, 13);
            g.face.moveTo(0, 10);
            g.face.quadraticCurveTo(4, 16, 7, 13);
        } else {
            g.face.moveTo(0, 10);
            g.face.quadraticCurveTo(-3, 14, -6, 12);
            g.face.moveTo(0, 10);
            g.face.quadraticCurveTo(3, 14, 6, 12);
        }

        // === 前爪（白色+粉垫）===
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

    _drawBodyShape(g, cx, cy, rw, rh) {
        g.moveTo(cx, cy - rh);
        g.bezierCurveTo(cx - rw * 1.2, cy - rh, cx - rw, cy + rh * 0.3, cx - rw * 0.8, cy + rh * 0.8);
        g.bezierCurveTo(cx - rw * 0.5, cy + rh, cx + rw * 0.5, cy + rh, cx + rw * 0.8, cy + rh * 0.8);
        g.bezierCurveTo(cx + rw, cy + rh * 0.3, cx + rw * 1.2, cy - rh, cx, cy - rh);
        g.closePath();
    }

    _drawBackLeg(g, x, y, s) {
        g.fill({ color: this.colors.black });
        g.stroke({ width: 1.5, color: this.colors.outline });
        g.ellipse(x, y, s, s * 1.4);
        // 白色袜子
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
}
