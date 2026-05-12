/**
 * SkinManager - 运行时皮肤切换管理器
 */
class SkinManager {
    constructor(app, engine) {
        this.app = app;
        this.engine = engine;
        this.skins = {
            'TabbyCat': () => new TabbyCatSkin(app),
            'GingerCat': () => new GingerCatSkin(app),
            'CowCat': () => new CowCatSkin(app)
        };
        this.currentSkinName = null;
        this.currentSkin = null;
    }

    switchSkin(name) {
        if (!this.skins[name]) {
            console.error('Unknown skin:', name);
            return false;
        }
        if (this.currentSkinName === name) return false;

        const savedX = this.currentSkin ? this.currentSkin.container.x : 200;
        const savedY = this.currentSkin ? this.currentSkin.container.y : 220;

        if (this.currentSkin) {
            this.currentSkin.destroy();
        }

        this.currentSkin = this.skins[name]();
        this.currentSkin.container.x = savedX;
        this.currentSkin.container.y = savedY;
        this.engine.setSkin(this.currentSkin);
        this.currentSkinName = name;
        console.log('Switched to skin:', name);
        return true;
    }

    getCurrentSkinName() { return this.currentSkinName; }

    getSkinNames() { return Object.keys(this.skins); }
}
