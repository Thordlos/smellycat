# SmellyCat - 多智能体协同开发指南

> 本文档定义如何在多 Agent 环境下协同开发 SmellyCat 项目。

---

## 🤖 Agent 角色与分工

| Agent 角色 | 职责 | 可修改文件 | 依赖文档 |
|-----------|------|-----------|----------|
| **动画引擎 Agent** | 状态机、物理模拟、Pose 数据 | `AnimationEngine` 类 | `ANIMATION_ENGINE.md` |
| **皮肤开发 Agent** | 渲染逻辑、视觉效果 | `Skin` 类 | `SKIN_DEVELOPMENT.md` |
| **动作开发 Agent** | 新动作逻辑 | `registerAction()` 调用 | `ACTION_DEVELOPMENT.md` |
| **工程 Agent** | 打包、配置、优化 | `tauri.conf.json`、构建流程 | `TAURI_CONFIG.md` |

---

## 🔗 协作接口

### 1. 动画引擎 → 皮肤（Pose 数据）

动画引擎每帧输出标准化 `Pose` 对象：

```javascript
const pose = {
  head:   { x, y, rotation, scale },
  body:   { scaleX, scaleY, offsetX, offsetY },
  eyes:   { open, leftX, rightX, pupilSize },
  ears:   { leftAngle, rightAngle },
  mouth:  { type: 'normal' | 'open' | 'smile' },
  paws:   { frontLeft, frontRight, backLeft, backRight },
  tail:   [{x,y}, ...],
  whiskers: { twitch: 0-1 },
  breath: { scale: 1 }
};
```

**规则：**
- 动画引擎负责生成 Pose
- 皮肤只能读取 Pose，不能修改
- 新增字段需更新 `ANIMATION_ENGINE.md`

### 2. 动画引擎 → 动作（注册接口）

```javascript
engine.register(name, {
    weight: number,
    duration: [min, max],
    update: (engine, pose, time) => { /* 修改 pose */ }
});
```

**规则：**
- 动作只能修改 `pose` 对象
- 不能修改引擎内部状态
- 新动作需在 `ACTION_DEVELOPMENT.md` 中记录

---

## 📁 文件管理

| 目录 | 内容 | 负责 Agent |
|------|------|-----------|
| `public/` | 前端代码 | 所有 |
| `public/anims/` | 自定义动作脚本 | 动作 Agent |
| `public/skins/` | 自定义皮肤脚本 | 皮肤 Agent |
| `docs/` | 项目文档 | 所有 |
| `src-tauri/` | Rust 后端 | 工程 Agent |

---

## 🔄 开发流程

### 1. 动画引擎 Agent 开发新动作
1. 阅读 `ANIMATION_ENGINE.md`
2. 在代码中添加 `engine.register()`
3. 更新 `docs/ACTION_DEVELOPMENT.md` 记录新动作
4. 测试动作效果

### 2. 皮肤 Agent 开发新皮肤
1. 阅读 `SKIN_DEVELOPMENT.md`
2. 创建 `public/skins/my-skin.js`
3. 实现 `Skin` 接口
4. 在 `pet.js` 中切换皮肤
5. 测试渲染效果

### 3. 工程 Agent 打包
1. 阅读 `TAURI_CONFIG.md`
2. 配置 `tauri.conf.json`
3. 运行 `tauri build`
4. 测试打包产物

---

## ⚠️ 协作规则

1. **不跨边界修改** - 动画 Agent 不改皮肤代码，皮肤 Agent 不改动画代码
2. **接口变更需同步** - 修改 Pose 结构需通知所有相关 Agent
3. **文档先行** - 新增功能先更新文档，再写代码
4. **测试隔离** - 每个 Agent 负责自己模块的测试

---

*最后更新：2026-05-11*
