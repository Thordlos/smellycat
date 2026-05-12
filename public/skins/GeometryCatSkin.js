/**
 * GeometryCatSkin - 几何线条猫皮肤
 */
class GeometryCatSkin {
    constructor(app) {
        this.app = app;
        this.engine = null;
        this.colors = { body: 0x444444, outline: 0x888888 };
        this.container = app.stage.addChild(new PIXI.Container());
        this.container.x = 200;
        this.container.y = 220;
        this.gfx = this.container.addChild(new PIXI.Graphics());
    }
    setEngine(engine) { this.engine = engine; }
    render(pose) {
        const g = this.gfx;
        const c = this.colors;
        g.clear();
        // 身体
        g.fill({ color: c.body });
        g.ellipse(0, 0, 25, 35);
        g.stroke({ width: 2, color: c.outline });
        g.ellipse(0, 0, 25, 35);
        // 头
        g.fill({ color: c.body });
        g.circle(0, -50, 20);
        g.stroke({ width: 2, color: c.outline });
        g.circle(0, -50, 20);
    }
}
