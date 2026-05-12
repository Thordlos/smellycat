/**
 * CuteCatSkin - 可爱精致猫皮肤
 * 特点：圆润造型、更多细节、渐变效果、更生动的表情
 */
class CuteCatSkin {
    constructor(app) {
        this.app = app;
        this.engine = null;
        
        this.colors = {
            body: 0xFFB366, bodyDark: 0xFF9933, bodyLight: 0xFFCC99,
            outline: 0xCC6600, belly: 0xFFE0B3, eye: 0x66CCFF,
            pupil: 0x111111, eyeHigh: 0xFFFFFF, nose: 0xFF6699,
            innerEar: 0xFF99BB, paw: 0xFFB380, whisker: 0x996633,
            tailTip: 0xFF9933, tongue: 0xFF5577, blush: 0xFF99AA
        };
        
        this.container = app.stage.addChild(new PIXI.Container());
        this.container.x = 200;
        this.container.y = 220;
        
        this.gfx = {};
        ['shadow', 'body', 'belly', 'tail', 'head', 'face', 'ears', 'paw', 'whisker', 'blush'].forEach(k => {
            this.gfx[k] = this.container.addChild(new PIXI.Graphics());
        });
    }
    
    setEngine(engine) { this.engine = engine; }
    
    render(pose) {
        const c = this.colors, g = this.gfx, bs = pose.body;
        
        // 阴影
        g.shadow.clear();
        g.shadow.fill({ color: 0x000000, alpha: 0.1 });
        g.shadow.circle(5, 5, 40);
        
        // 身体
        g.body.clear();
        g.body.moveTo(0, -28);
        g.body.bezierCurveTo(-22, -28, -25, 0, -22, 18);
        g.body.bezierCurveTo(-18, 28, 18, 28, 22, 18);
        g.body.bezierCurveTo(25, 0, 22, -28, 0, -28);
        g.body.closePath();
        g.body.fill({ color: c.body });
        g.body.stroke({ width: 2, color: c.outline });
        
        g.body.stroke({ width: 2, color: c.bodyDark });
        for (let i = 0; i < 4; i++) {
            const y = -12 + i * 9;
            g.body.moveTo(-20, y);
            g.body.bezierCurveTo(-5, y+8, 5, y+8, 20, y);
        }
        
        g.belly.clear();
        g.belly.fill({ color: c.belly });
        g.belly.ellipse(0, 5, 12, 18);
        
        this._leg(g.body, -16, 20, 7);
        this._leg(g.body, 16, 20, 7);
        
        // 尾巴
        g.tail.clear();
        const t = pose.tail;
        if (t.length >= 2) {
            g.tail.stroke({ width: 8, color: c.body });
            g.tail.moveTo(t[0].x, t[0].y);
            for (let i = 1; i < t.length - 1; i++)
                g.tail.quadraticCurveTo(t[i].x, t[i].y, (t[i].x+t[i+1].x)/2, (t[i].y+t[i+1].y)/2);
            
            const last = t[t.length - 1];
            g.tail.fill({ color: c.tailTip });
            g.tail.circle(last.x, last.y, 6);
        }
        
        // 头部
        g.head.clear();
        g.head.x = pose.head.x;
        g.head.y = pose.head.y - 45;
        g.head.angle = pose.head.rotation * (180 / Math.PI);
        
        g.head.arc(0, 0, 24, 0, Math.PI * 2, true);
        g.head.closePath();
        g.head.fill({ color: c.body });
        g.head.stroke({ width: 2, color: c.outline });
        
        // 耳朵
        g.ears.clear();
        g.ears.x = 0; g.ears.y = 0;
        
        g.ears.fill({ color: c.body });
        g.ears.stroke({ width: 2, color: c.outline });
        g.ears.moveTo(-16, -16);
        g.ears.quadraticCurveTo(-28, -40, -12, -20);
        g.ears.closePath();
        g.ears.fill();
        
        g.ears.fill({ color: c.innerEar, alpha: 0.7 });
        g.ears.moveTo(-14, -18);
        g.ears.quadraticCurveTo(-24, -35, -12, -22);
        g.ears.closePath();
        g.ears.fill();
        
        g.ears.fill({ color: c.body });
        g.ears.stroke({ width: 2, color: c.outline });
        g.ears.moveTo(16, -16);
        g.ears.quadraticCurveTo(28, -40, 12, -20);
        g.ears.closePath();
        g.ears.fill();
        
        g.ears.fill({ color: c.innerEar, alpha: 0.7 });
        g.ears.moveTo(14, -18);
        g.ears.quadraticCurveTo(24, -35, 12, -22);
        g.ears.closePath();
        g.ears.fill();
        
        // 脸
        g.face.clear();
        g.face.x = g.head.x; g.face.y = g.head.y; g.face.angle = g.head.angle;
        
        const ey = pose.eyes, eyeH = 6 * ey.open;
        
        g.face.fill({ color: c.eye });
        g.face.ellipse(-9, -4, 7, eyeH);
        g.face.ellipse(9, -4, 7, eyeH);
        
        if (ey.open > 0.5) {
            g.face.fill({ color: c.pupil });
            g.face.ellipse(-9, -4, 3, 4);
            g.face.ellipse(9, -4, 3, 4);
            g.face.fill({ color: c.eyeHigh });
            g.face.circle(-7, -6, 2);
            g.face.circle(11, -6, 2);
        }
        
        g.face.fill({ color: c.nose });
        g.face.moveTo(0, 8);
        g.face.quadraticCurveTo(-3, 12, 0, 14);
        g.face.quadraticCurveTo(3, 12, 0, 8);
        g.face.closePath();
        g.face.fill();
        
        g.face.stroke({ width: 1.5, color: c.outline });
        g.face.moveTo(0, 14);
        g.face.quadraticCurveTo(-3, 18, -5, 16);
        g.face.moveTo(0, 14);
        g.face.quadraticCurveTo(3, 18, 5, 16);
        
        // 腮红
        g.blush.clear();
        g.blush.x = g.head.x; g.blush.y = g.head.y; g.blush.angle = g.head.angle;
        g.blush.fill({ color: c.blush, alpha: 0.4 });
        g.blush.circle(-14, 5, 5);
        g.blush.circle(14, 5, 5);
        
        // 胡须
        g.whisker.clear();
        g.whisker.x = g.head.x; g.whisker.y = g.head.y; g.whisker.angle = g.head.angle;
        g.whisker.stroke({ width: 1.2, color: c.whisker });
        
        const tw = pose.whiskers.twitch;
        for (let i = -2; i <= 2; i++) {
            const tx = tw * (Math.random() - 0.5) * 4;
            const y = -8 + i * 5;
            g.whisker.moveTo(-10, y);
            g.whisker.quadraticCurveTo(-18, y-2, -26 + tx, y-4);
            g.whisker.moveTo(10, y);
            g.whisker.quadraticCurveTo(18, y-2, 26 - tx, y-4);
        }
        
        // 爪子
        g.paw.clear();
        this._paw(g.paw, pose.paws.frontLeft.x, pose.paws.frontLeft.y + 22 + bs.offsetY);
        this._paw(g.paw, pose.paws.frontRight.x, pose.paws.frontRight.y + 22 + bs.offsetY);
    }
    
    _leg(g, x, y, s) {
        g.fill({ color: this.colors.body });
        g.stroke({ width: 2, color: this.colors.outline });
        g.ellipse(x, y, s, s * 1.3);
        g.fill({ color: this.colors.paw });
        g.circle(x, y + s * 0.8, 3);
    }
    
    _paw(g, x, y) {
        const c = this.colors;
        g.fill({ color: c.body });
        g.stroke({ width: 2, color: c.outline });
        g.ellipse(x, y, 7, 5);
        g.fill({ color: c.paw });
        g.circle(x, y, 3);
    }
}
