# 皮肤开发指南

> 本文档面向**皮肤开发 Agent**，定义如何开发新皮肤。

---

## 📐 皮肤接口

每个皮肤必须实现以下接口：

```javascript
class MySkin {
    /**
     * @param {PIXI.Application} app
     */
    constructor(app) {
        this.app = app;
        this.engine = null;
        
        // 创建容器和 Graphics
        this.container = app.stage.addChild(new PIXI.Container());
        this.container.x = 200;
        this.container.y = 220;
        
        this.gfx = {};
        ['body', 'head', 'face', 'tail', 'paw', 'whisker'].forEach(k => {
            this.gfx[k] = this.container.addChild(new PIXI.Graphics());
        });
    }

    /**
     * 接收引擎引用
     * @param {AnimationEngine} engine
     */
    setEngine(engine) {
        this.engine = engine;
    }

    /**
     * 每帧渲染
     * @param {Object} pose - 姿势数据（见 ANIMATION_ENGINE.md）
     */
    render(pose) {
        // 根据 pose 数据绘制
        // 调用 graphics.clear() 清除上一帧
        // 使用 pose 数据绘制新帧
    }
}
```

---

## 🎨 Pose 数据结构

皮肤接收的 `pose` 对象结构：

```javascript
{
  head:   { x: 0, y: 0, rotation: 0, scale: 1 },
  body:   { scaleX: 1, scaleY: 1, offsetX: 0, offsetY: 0 },
  eyes:   { open: 1, leftX: 0, rightX: 0, pupilSize: 1 },
  ears:   { leftAngle: 0, rightAngle: 0 },
  mouth:  { type: 'normal' },      // 'normal' | 'open' | 'smile'
  paws:   { frontLeft: {x,y}, ... },
  tail:   [{x,y}, ...],            // 10 个尾巴点
  whiskers: { twitch: 0 },
  breath: { scale: 1 }
}
```

详细字段说明见 `ANIMATION_ENGINE.md`。

---

## 📝 开发步骤

### 1. 创建皮肤文件

在 `public/skins/` 下创建新皮肤文件：

```
public/
└── skins/
    └── my-new-skin.js
```

### 2. 实现皮肤类

```javascript
// public/skins/my-new-skin.js

class MyNewSkin {
    constructor(app) {
        this.app = app;
        this.engine = null;
        
        this.colors = {
            body: 0xFF8888,      // 红色猫
            outline: 0xCC4444,
            eye: 0x88FF88,
            // ... 更多颜色
        };
        
        this.container = app.stage.addChild(new PIXI.Container());
        this.container.x = 200;
        this.container.y = 220;
        
        this.gfx = {};
        ['body', 'head', 'face', 'tail', 'paw', 'whisker'].forEach(k => {
            this.gfx[k] = this.container.addChild(new PIXI.Graphics());
        });
    }
    
    setEngine(engine) { this.engine = engine; }
    
    render(pose) {
        const c = this.colors;
        const g = this.gfx;
        
        // === 身体 ===
        g.body.clear();
        g.body.moveTo(0, -25);
        // ... 绘制身体
        
        // === 头部 ===
        g.head.clear();
        g.head.x = pose.head.x;
        g.head.y = pose.head.y - 45;
        g.head.angle = pose.head.rotation * (180 / Math.PI);
        // ... 绘制头部
        
        // ... 其他部位
    }
    
    // 辅助方法
    _drawLeg(gfx, x, y, size) { /* ... */ }
    _drawPaw(gfx, x, y) { /* ... */ }
}
```

### 3. 注册皮肤

在 `pet.js` 中切换皮肤：

```javascript
// 原皮肤
// const skin = new GeometryCatSkin(app);

// 新皮肤
const skin = new MyNewSkin(app);
engine.setSkin(skin);
```

---

## 🎨 颜色配置

建议将颜色集中管理，方便更换主题：

```javascript
this.colors = {
    body:       0x444444,    // 身体主色
    outline:    0x888888,    // 轮廓线
    stripe:     0x555555,    // 条纹
    eye:        0x55CCFF,    // 眼睛
    pupil:      0x111111,    // 瞳孔
    eyeHigh:    0xFFFFFF,    // 眼睛高光
    nose:       0xFF6688,    // 鼻子
    innerEar:   0xFF99AA,    // 内耳
    paw:        0x555555,    // 爪垫
    whisker:    0x666666,    // 胡须
    tailTip:    0x666666,    // 尾巴尖
    tongue:     0xFF5566     // 舌头
};
```

---

## 💡 皮肤创意

| 皮肤 | 颜色方案 | 特色 |
|------|----------|------|
| GeometryCat | 灰色几何线条 | 当前默认 |
| OrangeCat | 橘色+白色 | 橘猫 |
| BlackCat | 纯黑+金色眼睛 | 黑猫 |
| WhiteCat | 白色+粉色鼻子 | 白猫 |
| PixelCat | 像素风格 | 复古 |
| WatercolorCat | 水彩风格 | 柔和 |

---

## ⚠️ 注意事项

1. **每帧必须调用 `gfx.clear()`** - 否则上一帧图形会保留
2. **使用 `container` 统一位置** - 方便拖拽
3. **头部用 `x/y/angle` 定位** - 不要用 `save()/restore()`（PixiJS 8 不支持）
4. **尾巴用 `quadraticCurveTo`** - 使线条平滑
5. **分层渲染** - 身体、头部、尾巴等用不同 Graphics

---

*最后更新：2026-05-11*
