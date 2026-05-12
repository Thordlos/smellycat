/**
 * GeometryCatSkin - 几何线条猫皮肤（完整版）
 */
class GeometryCatSkin {
    constructor(app) {
        this.app = app;
        this.engine = null;
        this.colors = {
            body: 0x444444, outline: 0x888888, stripe: 0x555555,
            eye: 0x55CCFF, pupil: 0x111111, eyeHigh: 0xFFFFFF,
            nose: 0xFF6688, innerEar: 0xFF99AA, paw: 0x555555,
            whisker: 0x666666, tailTip: 0x666666, tongue: 0xFF5566
        };
        this.container = app.stage.addChild(new PIXI.Container());
        this.container.x = 200;
        this.container.y = 220;
        this.gfx = {};
        ['body', 'tail', 'head', 'face', 'paw', 'whisker'].forEach(k => {
            this.gfx[k] = this.container.addChild(new PIXI.Graphics());
        });
    }
    setEngine(engine) { this.engine = engine; }
    render(pose) {
        const c = this.colors, g = this.gfx, bs = pose.body;
        // 身体
        g.body.clear();
        g.body.moveTo(0, -25);
        g.body.bezierCurveTo(-20, -25, -22, 0, -20, 15);
        g.body.bezierCurveTo(-15, 25, 15, 25, 20, 15);
        g.body.bezierCurveTo(22, 0, 20, -25, 0, -25);
        g.body.closePath();
        g.body.fill({ color: c.body });
        g.body.stroke({ width: 1.5, color: c.outline });
        g.body.stroke({ width: 1, color: c.stripe });
        for (let i = 0; i < 3; i++) {
            const y = -10 + i * 8;
            g.body.moveTo(-18, y);
            g.body.bezierCurveTo(-10, y + 5, 10, y + 5, 18, y);
        }
        this._leg(g.body, -15, 15, 6);
        this._leg(g.body, 15, 15, 6);
        // 尾巴
        g.tail.clear();
        const t = pose.tail;
        if (t.length >= 2) {
            g.tail.stroke({ width: 6, color: c.body });
            g.tail.moveTo(t[0].x, t[0].y);
            for (let i = 1; i < t.length - 1; i++)
                g.tail.quadraticCurveTo(t[i].x, t[i].y, (t[i].x + t[i + 1].x) / 2, (t[i].y + t[i + 1].y) / 2);
            g.tail.fill({ color: c.tailTip });
            g.tail.circle(t[t.length - 1].x, t[t.length - 1].y, 4);
        }
        // 头部
        g.head.clear();
        g.head.x = pose.head.x;
        g.head.y = pose.head.y - 45;
        g.head.angle = pose.head.rotation * (180 / Math.PI);
        g.head.arc(0, 0, 20, 0, Math.PI * 2, true);
        g.head.closePath();
        g.head.fill({ color: c.body });
        g.head.stroke({ width: 1.5, color: c.outline });
        g.head.stroke({ width: 1, color: c.stripe });
        g.head.moveTo(0, -17); g.head.lineTo(0, -10);
        g.head.moveTo(-3, -15); g.head.lineTo(-5, -8);
        g.head.moveTo(3, -15); g.head.lineTo(5, -8);
        // 耳朵
        g.head.fill({ color: c.body }); g.head.stroke({ width: 1.5, color: c.outline });
        g.head.moveTo(-15, -13); g.head.lineTo(-25, -33); g.head.lineTo(-10, -18); g.head.closePath(); g.head.fill();
        g.head.fill({ color: c.innerEar, alpha: 0.6 }); g.head.moveTo(-13, -14); g.head.lineTo(-20, -28); g.head.lineTo(-9, -17); g.head.closePath(); g.head.fill();
        g.head.fill({ color: c.body }); g.head.stroke({ width: 1.5, color: c.outline });
        g.head.moveTo(15, -13); g.head.lineTo(25, -33); g.head.lineTo(10, -18); g.head.closePath(); g.head.fill();
        g.head.fill({ color: c.innerEar, alpha: 0.6 }); g.head.moveTo(13, -14); g.head.lineTo(20, -28); g.head.lineTo(9, -17); g.head.closePath(); g.head.fill();
        // 脸
        g.face.clear();
        g.face.x = g.head.x; g.face.y = g.head.y; g.face.angle = g.head.angle;
        const ey = pose.eyes, eyeH = 5 * ey.open;
        g.face.fill({ color: c.eye });
        g.face.ellipse(-7 + ey.leftX, -3, 5, eyeH);
        g.face.ellipse(7 + ey.rightX, -3, 5, eyeH);
        if (ey.open > 0.5) {
            g.face.fill({ color: c.pupil });
            g.face.ellipse(-7 + ey.leftX, -3, 2, 3);
            g.face.ellipse(7 + ey.rightX, -3, 2, 3);
            g.face.fill({ color: c.eyeHigh });
            g.face.circle(-6 + ey.leftX, -4, 1.2);
            g.face.circle(8 + ey.rightX, -4, 1.2);
        }
        g.face.fill({ color: c.nose });
        g.face.moveTo(0, 5); g.face.lineTo(-2.5, 7); g.face.lineTo(2.5, 7); g.face.closePath(); g.face.fill();
        g.face.stroke({ width: 1, color: c.outline });
        g.face.moveTo(0, 7); g.face.lineTo(0, 10);
        if (pose.mouth.type === 'open') {
            g.face.fill({ color: c.tongue, alpha: 0.7 });
            g.face.arc(0, 10, 3, 0, Math.PI, false); g.face.fill();
        } else {
            g.face.arc(-4, 10, 4, -Math.PI / 2, Math.PI / 2, false);
            g.face.moveTo(0, 10);
            g.face.arc(4, 10, 4, Math.PI / 2, -Math.PI / 2, false);
        }
        // 胡须
        g.whisker.clear();
        g.whisker.x = g.head.x; g.whisker.y = g.head.y; g.whisker.angle = g.head.angle;
        g.whisker.stroke({ width: 0.8, color: c.whisker });
        const tw = pose.whiskers.twitch;
        for (let i = -1; i <= 1; i++) {
            const tx = tw * (Math.random() - 0.5) * 3, y = -40 + i * 4;
            g.whisker.moveTo(-8, y); g.whisker.lineTo(-22 + tx, y - 2 + i * 5);
            g.whisker.moveTo(8, y); g.whisker.lineTo(22 - tx, y - 2 + i * 5);
        }
        // 爪子
        g.paw.clear();
        this._paw(g.paw, pose.paws.frontLeft.x, pose.paws.frontLeft.y + 20 + bs.offsetY);
        this._paw(g.paw, pose.paws.frontRight.x, pose.paws.frontRight.y + 20 + bs.offsetY);
    }
    _leg(g, x, y, s) {
        g.fill({ color: this.colors.body });
        g.stroke({ width: 1.5, color: this.colors.outline });
        g.ellipse(x, y, s, s * 1.2);
    }
    _paw(g, x, y) {
        const c = this.colors;
        g.fill({ color: c.body });
        g.stroke({ width: 1.5, color: c.outline });
        g.ellipse(x, y, 6, 4);
        g.fill({ color: c.paw });
        g.circle(x, y, 2);
    }
}
