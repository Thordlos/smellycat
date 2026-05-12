/**
 * RealisticCatSkin - 写实可爱猫皮肤
 * 特点：写实比例、柔和色彩、完整五官、毛茸茸质感
 */
class RealisticCatSkin {
    constructor(app) {
        this.app = app;
        this.engine = null;
        
        // 柔和写实配色
        this.colors = {
            fur: 0xD4A574,        // 浅棕色毛发
            furDark: 0x8B6F47,    // 深色毛发
            furLight: 0xE8C896,   // 浅色毛发
            belly: 0xF5E6D3,      // 腹部浅色
            outline: 0x6B5340,    // 柔和轮廓
            eye: 0x7EC84D,        // 绿色眼睛
            pupil: 0x1A1A1A,      // 瞳孔
            eyeHigh: 0xFFFFFF,    // 高光
            nose: 0xE894A9,       // 粉色鼻子
            innerEar: 0xF4A6B5,   // 耳朵内部
            paw: 0xF2B5C4,        // 粉色爪垫
            whisker: 0xF5F5F5,    // 白色胡须
            tailRing: 0x8B6F47    // 尾巴环纹
        };
        
        this.container = app.stage.addChild(new PIXI.Container());
        this.container.x = 200;
        this.container.y = 220;
        
        // 精细分层
        this.gfx = {};
        ['body', 'belly', 'legs', 'tail', 'head', 'ears', 'face', 'paws', 'whiskers'].forEach(k => {
            this.gfx[k] = this.container.addChild(new PIXI.Graphics());
        });
    }
    
    setEngine(engine) { this.engine = engine; }
    
    render(pose) {
        const c = this.colors, g = this.gfx, bs = pose.body;
        
        // === 身体（毛茸茸的轮廓）===
        g.body.clear();
        g.body.fill({ color: c.fur });
        g.body.stroke({ width: 1.5, color: c.outline });
        
        // 身体主轮廓
        g.body.moveTo(0, -30);
        for (let angle = 0; angle < Math.PI * 2; angle += 0.3) {
            const r = 25 + Math.sin(angle * 3) * 2;
            const x = Math.cos(angle) * r * 0.9;
            const y = Math.sin(angle) * r * 1.3 - 5;
            g.body.lineTo(x, y);
        }
        g.body.closePath();
        g.body.fill();
        g.body.stroke({ width: 1.5, color: c.outline });
        
        // 腹部（浅色区域）
        g.belly.clear();
        g.belly.fill({ color: c.belly });
        g.belly.ellipse(0, 8, 10, 15);
        
        // 后腿
        g.legs.clear();
        this._leg(g.legs, -14, 22, 6);
        this._leg(g.legs, 14, 22, 6);
        
        // === 尾巴（蓬松有环纹）===
        g.tail.clear();
        const t = pose.tail;
        if (t.length >= 2) {
            for (let i = 0; i < t.length - 1; i++) {
                const width = 7 - i * 0.5;
                g.tail.stroke({ width: width, color: c.fur });
                g.tail.moveTo(t[i].x, t[i].y);
                g.tail.lineTo(t[i+1].x, t[i+1].y);
            }
            
            g.tail.stroke({ width: 2, color: c.tailRing });
            for (let i = 2; i < t.length - 1; i += 3) {
                g.tail.moveTo(t[i].x - 4, t[i].y);
                g.tail.lineTo(t[i].x + 4, t[i].y);
            }
            
            const last = t[t.length - 1];
            g.tail.fill({ color: c.tailRing });
            g.tail.circle(last.x, last.y, 4);
        }
        
        // === 头部（完整的圆形）===
        g.head.clear();
        g.head.x = pose.head.x;
        g.head.y = pose.head.y - 45;
        g.head.angle = pose.head.rotation * (180 / Math.PI);
        
        // 头部毛发
        g.head.fill({ color: c.fur });
        g.head.stroke({ width: 1.5, color: c.outline });
        g.head.circle(0, 0, 26);
        g.head.fill({ color: c.fur });
        g.head.stroke({ width: 1.5, color: c.outline });
        
        // === 耳朵（立体的三角形）===
        g.ears.clear();
        g.ears.x = 0;
        g.ears.y = 0;
        
        // 左耳
        g.ears.fill({ color: c.fur });
        g.ears.stroke({ width: 1.5, color: c.outline });
        g.ears.moveTo(-18, -18);
        g.ears.lineTo(-26, -42);
        g.ears.lineTo(-10, -22);
        g.ears.closePath();
        g.ears.fill();
        g.ears.stroke({ width: 1.5, color: c.outline });
        
        // 左耳内部
        g.ears.fill({ color: c.innerEar });
        g.ears.moveTo(-16, -20);
        g.ears.lineTo(-22, -38);
        g.ears.lineTo(-12, -22);
        g.ears.closePath();
        g.ears.fill();
        
        // 右耳
        g.ears.fill({ color: c.fur });
        g.ears.stroke({ width: 1.5, color: c.outline });
        g.ears.moveTo(18, -18);
        g.ears.lineTo(26, -42);
        g.ears.lineTo(10, -22);
        g.ears.closePath();
        g.ears.fill();
        g.ears.stroke({ width: 1.5, color: c.outline });
        
        // 右耳内部
        g.ears.fill({ color: c.innerEar });
        g.ears.moveTo(16, -20);
        g.ears.lineTo(22, -38);
        g.ears.lineTo(12, -22);
        g.ears.closePath();
        g.ears.fill();
        
        // === 脸部（完整五官）===
        g.face.clear();
        g.face.x = g.head.x;
        g.face.y = g.head.y;
        g.face.angle = g.head.angle;
        
        const ey = pose.eyes;
        const eyeH = 7 * ey.open;
        
        // 眼白
        g.face.fill({ color: c.eye });
        g.face.ellipse(-10, -5, 8, eyeH);
        g.face.ellipse(10, -5, 8, eyeH);
        g.face.stroke({ width: 1, color: c.outline });
        g.face.ellipse(-10, -5, 8, eyeH);
        g.face.stroke({ width: 1, color: c.outline });
        g.face.ellipse(10, -5, 8, eyeH);
        
        if (ey.open > 0.5) {
            // 瞳孔（杏仁状）
            g.face.fill({ color: c.pupil });
            g.face.ellipse(-10, -5, 3, 5);
            g.face.ellipse(10, -5, 3, 5);
            
            // 高光（两个）
            g.face.fill({ color: c.eyeHigh });
            g.face.circle(-8, -7, 2);
            g.face.circle(12, -7, 2);
            g.face.circle(-11, -4, 1);
            g.face.circle(9, -4, 1);
        }
        
        // 鼻子（立体的小三角）
        g.face.fill({ color: c.nose });
        g.face.moveTo(0, 10);
        g.face.lineTo(-4, 15);
        g.face.lineTo(4, 15);
        g.face.closePath();
        g.face.fill();
        g.face.stroke({ width: 0.5, color: c.outline });
        g.face.moveTo(0, 10);
        g.face.lineTo(0, 15);
        
        // 嘴巴（可爱的 W 形）
        g.face.stroke({ width: 1.5, color: c.outline });
        g.face.moveTo(0, 15);
        g.face.quadraticCurveTo(-3, 19, -6, 17);
        g.face.moveTo(0, 15);
        g.face.quadraticCurveTo(3, 19, 6, 17);
        
        // === 爪子（带肉球）===
        g.paws.clear();
        this._paw(g.paws, pose.paws.frontLeft.x, pose.paws.frontLeft.y + 24 + bs.offsetY);
        this._paw(g.paws, pose.paws.frontRight.x, pose.paws.frontRight.y + 24 + bs.offsetY);
        
        // === 胡须（细长白色）===
        g.whiskers.clear();
        g.whiskers.x = g.head.x;
        g.whiskers.y = g.head.y;
        g.whiskers.angle = g.head.angle;
        g.whiskers.stroke({ width: 1, color: c.whisker });
        
        const tw = pose.whiskers.twitch;
        for (let i = -2; i <= 2; i++) {
            const tx = tw * (Math.random() - 0.5) * 3;
            const y = -2 + i * 5;
            g.whiskers.moveTo(-12, y);
            g.whiskers.quadraticCurveTo(-20, y-1, -30 + tx, y-2);
            g.whiskers.moveTo(12, y);
            g.whiskers.quadraticCurveTo(20, y-1, 30 - tx, y-2);
        }
    }
    
    _leg(g, x, y, s) {
        g.fill({ color: this.colors.fur });
        g.stroke({ width: 1.5, color: this.colors.outline });
        g.ellipse(x, y, s, s * 1.4);
        g.fill({ color: this.colors.paw });
        g.circle(x, y + s * 0.9, 2.5);
    }
    
    _paw(g, x, y) {
        const c = this.colors;
        g.fill({ color: c.fur });
        g.stroke({ width: 1.5, color: c.outline });
        g.ellipse(x, y, 8, 6);
        g.fill({ color: c.paw });
        g.circle(x, y + 2, 4);
        g.fill({ color: c.paw });
        g.circle(x - 4, y - 1, 2);
        g.circle(x, y - 2, 2);
        g.circle(x + 4, y - 1, 2);
    }
}
