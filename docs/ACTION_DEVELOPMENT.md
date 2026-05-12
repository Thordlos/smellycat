# 动作开发指南

> 本文档面向**动作开发 Agent**，定义如何添加新动作。

---

## 📐 动作接口

每个动作通过 `engine.register()` 注册：

```javascript
engine.register(name, config);
```

### 参数说明

| 参数 | 类型 | 说明 |
|------|------|------|
| `name` | string | 动作名称（唯一标识符） |
| `config.weight` | number | 随机权重（0-1），越高越容易出现 |
| `config.duration` | array | 持续时间 `[最小ms, 最大ms]` |
| `config.update` | function | `(engine, pose, time) => void` 每帧调用 |

### 返回值

无。动作注册后自动加入状态机。

---

## 🎬 update 函数

`update` 函数每帧被调用，参数：

| 参数 | 类型 | 说明 |
|------|------|------|
| `engine` | AnimationEngine | 动画引擎实例 |
| `pose` | Object | 当前帧 Pose 数据 |
| `time` | number | 当前动作已执行时间（ms） |

### 职责

- 修改 `pose` 对象的属性
- 根据 `time` 计算动画效果（常用 `Math.sin()`）
- 不改变引擎状态（由引擎自动切换）

---

## 💡 动作示例

### 1. 歪头（已存在）

```javascript
engine.register('headTilt', {
    weight: 0.8,
    duration: [1500, 3000],
    update: (engine, pose, time) => {
        pose.head.rotation = Math.sin(time * 0.003) * 0.15;
    }
});
```

### 2. 伸懒腰（已存在）

```javascript
engine.register('stretch', {
    weight: 0.5,
    duration: [1500, 2500],
    update: (engine, pose, time) => {
        const s = Math.sin(time * 0.002);
        pose.body.scaleX = 1 + s * 0.08;
        pose.body.scaleY = 1 - s * 0.04;
        pose.body.offsetY = s * 3;
    }
});
```

### 3. 舔爪子（已存在）

```javascript
engine.register('pawLick', {
    weight: 0.3,
    duration: [2000, 3000],
    update: (engine, pose, time) => {
        const l = Math.sin(time * 0.005);
        pose.paws.frontLeft.x = l * 8;
        pose.paws.frontLeft.y = l * -5;
        pose.head.rotation = l * 0.1;
        pose.mouth.type = l > 0.5 ? 'open' : 'normal';
    }
});
```

### 4. 打哈欠（新动作示例）

```javascript
engine.register('yawn', {
    weight: 0.3,
    duration: [1500, 2500],
    update: (engine, pose, time) => {
        const y = Math.sin(time * 0.003);
        pose.mouth.type = y > 0 ? 'open' : 'normal';
        pose.head.rotation = y * 0.1;
        pose.body.scaleY = 1 + y * 0.03;
    }
});
```

### 5. 跳跃

```javascript
engine.register('jump', {
    weight: 0.4,
    duration: [1000, 1500],
    update: (engine, pose, time) => {
        const t = time / 1500; // 归一化 0-1
        const jump = Math.sin(t * Math.PI);
        pose.body.offsetY = -jump * 15;
        pose.body.scaleY = 1 - jump * 0.1;
        pose.head.y = -jump * 10;
    }
});
```

### 6. 眨眼（独立于状态机）

眨眼已内置，如需自定义：
```javascript
engine.blink.timer = 3000; // 下次眨眼倒计时（ms）
```

---

## 📊 动作权重参考

| 权重 | 频率 | 适用动作 |
|------|------|----------|
| 1.0 | 最高 | idle（空闲） |
| 0.8-0.9 | 高 | 常用动作（歪头、摇尾巴） |
| 0.5-0.7 | 中 | 普通动作（伸懒腰、张望） |
| 0.3-0.4 | 低 | 稀有动作（打哈欠、跳跃） |
| 0.1-0.2 | 最低 | 特殊动作 |

---

## ⚠️ 注意事项

1. **不要修改引擎状态** - `update` 函数只修改 `pose`
2. **使用正弦波** - `Math.sin(time * 频率)` 是最常用的动画方式
3. **归一化时间** - 对于有开始/结束的动作，用 `time / duration` 归一化
4. **避免突变** - 动作切换时 `pose` 会重置，不要依赖跨帧状态
5. **尾巴由物理系统处理** - 不需要在动作中修改 `pose.tail`

---

## 🔧 调试技巧

```javascript
// 强制切换到某个动作
engine.state = 'yawn';
engine.stateTime = 0;

// 查看当前状态
console.log(engine.getState());

// 查看当前 pose
console.log(engine.getPose());
```

---

*最后更新：2026-05-11*
