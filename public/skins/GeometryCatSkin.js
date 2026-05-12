/**
 * GeometryCatSkin - 几何线条猫皮肤
 */
class GeometryCatSkin {
    constructor(app) {
        this.app = app;
        this.engine = null;
        this.colors = { body: 0x444444, outline: 0x888888, eye: 0xFFFF00 };
        this.container = app.stage.addChild(new PIXI.Container());
        this.container.x = 200;
        this.container.y = 220;
        this.gfx = this.container.addChild(new PIXI.Graphics());
        this.tailPhysics = new TailPhysics();
    }
    setEngine(engine) { 
        this.engine = engine;
        this.tailPhysics.setEngine(engine);
    }
    render(pose) {
        const g = this.gfx;
        const c = this.colors;
        g.clear();
        
        // 尾巴（带物理效果）
        this.tailPhysics.update(pose);
        const tailPoints = this.tailPhysics.getPoints();
        g.moveTo(tailPoints[0].x, tailPoints[0].y);
        for (let i = 1; i < tailPoints.length; i++) {
            g.lineTo(tailPoints[i].x, tailPoints[i].y);
        }
        g.stroke({ width: 6, color: c.body, cap: 'round' });
        
        // 后腿
        g.ellipse(-15, 25, 8, 12);
        g.fill({ color: c.body });
        g.stroke({ width: 2, color: c.outline });
        g.ellipse(15, 25, 8, 12);
        g.fill({ color: c.body });
        g.stroke({ width: 2, color: c.outline });
        
        // 身体
        g.ellipse(0, 0, 30, 40);
        g.fill({ color: c.body });
        g.stroke({ width: 2, color: c.outline });
        
        // 前腿
        g.ellipse(-12, 15, 6, 15);
        g.fill({ color: c.body });
        g.stroke({ width: 2, color: c.outline });
        g.ellipse(12, 15, 6, 15);
        g.fill({ color: c.body });
        g.stroke({ width: 2, color: c.outline });
        
        // 头
        g.circle(0, -45, 25);
        g.fill({ color: c.body });
        g.stroke({ width: 2, color: c.outline });
        
        // 耳朵
        g.poly([-18, -60, -8, -75, -5, -55]);
        g.fill({ color: c.body });
        g.stroke({ width: 2, color: c.outline });
        g.poly([18, -60, 8, -75, 5, -55]);
        g.fill({ color: c.body });
        g.stroke({ width: 2, color: c.outline });
        
        // 眼睛
        g.circle(-8, -48, 5);
        g.fill({ color: c.eye });
        g.stroke({ width: 1, color: 0x000000 });
        g.circle(8, -48, 5);
        g.fill({ color: c.eye });
        g.stroke({ width: 1, color: 0x000000 });
        
        // 鼻子
        g.circle(0, -40, 3);
        g.fill({ color: 0xFF9999 });
        
        // 胡须
        g.moveTo(-10, -40);
        g.lineTo(-30, -35);
        g.moveTo(-10, -40);
        g.lineTo(-30, -40);
        g.moveTo(-10, -40);
        g.lineTo(-30, -45);
        g.moveTo(10, -40);
        g.lineTo(30, -35);
        g.moveTo(10, -40);
        g.lineTo(30, -40);
        g.moveTo(10, -40);
        g.lineTo(30, -45);
        g.stroke({ width: 1, color: c.outline });
    }
}
