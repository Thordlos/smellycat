# SmellyCat - 项目文档中心

> 多智能体协同开发，所有 Agent 必须遵循本文档规范。

---

## 📁 文档索引

| 文档 | 路径 | 说明 | 适用 Agent |
|------|------|------|------------|
| **架构总览** | `ARCHITECTURE.md` | 系统架构、模块划分、数据流 | 所有 |
| **动画引擎规范** | `ANIMATION_ENGINE.md` | 动画系统 API、Pose 数据结构、注册新动作 | 动画开发 |
| **皮肤开发指南** | `SKIN_DEVELOPMENT.md` | 如何开发新皮肤、渲染接口、示例 | 美术/皮肤开发 |
| **动作开发指南** | `ACTION_DEVELOPMENT.md` | 如何添加新动作、参数说明、示例代码 | 动作开发 |
| **Tauri 配置** | `TAURI_CONFIG.md` | 窗口配置、打包、发布 | 工程/打包 |
| **开发规范** | `DEVELOPMENT_STANDARDS.md` | 代码规范、Git 提交、文件命名 | 所有 |
| **任务跟踪** | `TASKS.md` | 当前任务、进度、分工 | 所有 |

---

## 🏗️ 项目架构

```
public/
├── index.html           ← 主入口（包含所有代码）
├── pixi.min.js          ← PixiJS 渲染引擎
├── animation-engine.js  ← 动画引擎（状态机 + 物理）
├── skin.js              ← 渲染皮肤（几何猫）
└── pet.js               ← 主程序（初始化 + 事件）

docs/                    ← 文档目录
└── *.md                 ← 所有文档

public/anims/            ← 自定义动作脚本（待添加）
public/skins/            ← 自定义皮肤脚本（待添加）
```

---

## 🤖 多智能体分工

| Agent | 职责 | 修改范围 | 依赖 |
|-------|------|----------|------|
| **动画引擎 Agent** | 状态机、物理模拟、Pose 数据 | `AnimationEngine` 类 | 无 |
| **皮肤开发 Agent** | 渲染逻辑、视觉效果 | `Skin` 类 | 动画引擎的 Pose 接口 |
| **动作开发 Agent** | 新动作逻辑 | `registerAction()` 调用 | 动画引擎的 Pose 接口 |
| **工程 Agent** | 打包、配置、优化 | `tauri.conf.json`、构建流程 | 无 |

---

## 🔗 模块接口

### 动画引擎 → 皮肤（Pose 数据）

动画引擎每帧输出标准化 `Pose` 对象，皮肤只需读取并渲染：

```javascript
{
  head:   { x, y, rotation, scale },
  body:   { scaleX, scaleY, offsetX, offsetY },
  eyes:   { open, leftX, rightX, pupilSize },
  ears:   { leftAngle, rightAngle },
  mouth:  { type: 'normal' | 'open' | 'smile' },
  paws:   { frontLeft, frontRight, backLeft, backRight },
  tail:   [{x,y}, ...],
  whiskers: { twitch: 0-1 },
  breath: { scale: 1 }
}
```

### 皮肤接口

```javascript
class MySkin {
    setEngine(engine) { this.engine = engine; }
    render(pose) { /* 根据 pose 绘制 */ }
}
```

### 动作接口

```javascript
engine.register('actionName', {
    weight: 0.5,
    duration: [2000, 4000],
    update: (engine, pose, time) => { /* 修改 pose */ }
});
```

---

*最后更新：2026-05-11*
