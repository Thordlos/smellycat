# SmellyCat - 架构总览

> 所有 Agent 必须了解本文档内容，这是协同开发的基础。

---

## 🏗️ 系统架构

```
┌─────────────────────────────────────────────────────┐
│                    SmellyCat 应用                     │
│                                                      │
│  ┌──────────────┐    Pose 数据     ┌──────────────┐  │
│  │  动画引擎     │ ──────────────→  │   渲染皮肤    │  │
│  │ Animation    │                  │    Skin      │  │
│  │  Engine      │                  │              │  │
│  │              │                  │              │  │
│  │ • 状态机     │                  │ • 接收 Pose  │  │
│  │ • 动作调度   │                  │ • 绘制图形   │  │
│  │ • 眨眼系统   │                  │ • 分层渲染   │  │
│  │ • 呼吸系统   │                  │              │  │
│  │ • 尾巴物理   │                  │              │  │
│  └──────────────┘                  └──────────────┘  │
│                                                      │
│  ┌──────────────┐                                    │
│  │   主程序      │                                    │
│  │   Main       │                                    │
│  │              │                                    │
│  │ • Pixi App   │                                    │
│  │ • 事件绑定   │                                    │
│  │ • 拖拽逻辑   │                                    │
│  └──────────────┘                                    │
└─────────────────────────────────────────────────────┘
```

---

## 📁 文件结构

```
smellycat/
├── public/
│   ├── index.html              ← 主入口（所有代码集中于此）
│   ├── pixi.min.js             ← PixiJS v8.18.1
│   ├── animation-engine.js     ← 动画引擎（可独立修改）
│   ├── skin.js                 ← 几何猫皮肤（可独立修改）
│   ├── pet.js                  ← 主程序（可独立修改）
│   ├── anims/                  ← 自定义动作脚本（预留）
│   └── skins/                  ← 自定义皮肤脚本（预留）
│
├── src-tauri/
│   ├── src/main.rs             ← Rust 后端
│   ├── tauri.conf.json         ← 窗口/打包配置
│   ├── build.rs                ← 构建脚本
│   └── Cargo.toml              ← Rust 依赖
│
├── docs/                       ← 项目文档
│   ├── README.md               ← 文档索引
│   ├── ARCHITECTURE.md         ← 架构总览
│   ├── ANIMATION_ENGINE.md     ← 动画引擎规范
│   ├── SKIN_DEVELOPMENT.md     ← 皮肤开发指南
│   ├── ACTION_DEVELOPMENT.md   ← 动作开发指南
│   ├── TAURI_CONFIG.md         ← Tauri 配置
│   ├── DEVELOPMENT_STANDARDS.md← 开发规范
│   └── TASKS.md                ← 任务跟踪
│
├── package.json                ← NPM 配置
└── README.md                   ← 项目说明
```

---

## 🔗 模块接口

### 1. 动画引擎 → 皮肤（Pose 数据流）

动画引擎每帧输出 `Pose` 对象，皮肤只需读取：

```javascript
const pose = {
  head:   { x: 0, y: 0, rotation: 0, scale: 1 },      // 头部
  body:   { scaleX: 1, scaleY: 1, offsetX: 0, offsetY: 0 }, // 身体
  eyes:   { open: 1, leftX: 0, rightX: 0, pupilSize: 1 },     // 眼睛
  ears:   { leftAngle: 0, rightAngle: 0 },              // 耳朵
  mouth:  { type: 'normal' },                           // 嘴型
  paws:   { frontLeft: {x:0,y:0}, frontRight: {x:0,y:0},
           backLeft: {x:0,y:0}, backRight: {x:0,y:0} }, // 爪子
  tail:   [{x:10,y:0}, ...],                            // 尾巴物理点
  whiskers: { twitch: 0 },                              // 胡须抖动
  breath: { scale: 1 }                                  // 呼吸
};
```

### 2. 皮肤接口

```javascript
class MySkin {
    /**
     * @param {PIXI.Application} app
     */
    constructor(app) {
        this.app = app;
        this.engine = null;
        // 初始化 Graphics 等
    }

    /**
     * 接收引擎引用
     * @param {AnimationEngine} engine
     */
    setEngine(engine) { this.engine = engine; }

    /**
     * 每帧渲染
     * @param {Object} pose - 姿势数据
     */
    render(pose) { /* 根据 pose 绘制 */ }
}
```

### 3. 动作接口

```javascript
engine.register('actionName', {
    weight: 0.5,                    // 随机权重（0-1，越高越容易出现）
    duration: [2000, 4000],         // 持续时间 [最小ms, 最大ms]
    update: (engine, pose, time) => {
        // 修改 pose 对象
        pose.head.rotation = Math.sin(time * 0.003) * 0.2;
    }
});
```

---

## 🔄 数据流

```
每帧 (app.ticker)
  ↓
AnimationEngine.update(dt)
  ↓
1. 更新呼吸、眨眼
2. 状态切换
3. 执行当前动作 → 修改 pose
4. 更新尾巴物理 → pose.tail
5. 调用 skin.render(pose)
  ↓
GeometryCatSkin.render(pose)
  ↓
按 pose 数据绘制各部位
```

---

## 📊 当前状态

| 模块 | 状态 | 负责人 |
|------|------|--------|
| 动画引擎 | ✅ 完成 | - |
| 几何猫皮肤 | ✅ 完成 | - |
| 拖拽交互 | ✅ 完成 | - |
| 窗口透明 | ✅ 完成 | - |
| 打包发布 | ⏳ 待测试 | 工程 Agent |
| 新动作开发 | 🔄 可扩展 | 动作 Agent |
| 新皮肤开发 | 🔄 可扩展 | 皮肤 Agent |

---

*最后更新：2026-05-11*
