# 动画引擎规范

> 本文档面向**动画引擎开发 Agent**，定义动画系统的 API、数据结构和扩展方法。

---

## 📐 Pose 数据结构

动画引擎每帧输出的 `Pose` 对象，是动画系统与渲染系统的**唯一数据接口**。

```javascript
const pose = {
  head:   { x, y, rotation, scale },      // 头部位置和旋转
  body:   { scaleX, scaleY, offsetX, offsetY }, // 身体形变
  eyes:   { open, leftX, rightX, pupilSize },   // 眼睛状态
  ears:   { leftAngle, rightAngle },        // 耳朵角度
  mouth:  { type: 'normal' | 'open' | 'smile' }, // 嘴型
  paws:   {                                 // 爪子偏移
    frontLeft:  {x, y},
    frontRight: {x, y},
    backLeft:   {x, y},
    backRight:  {x, y}
  },
  tail:     [{x, y}, ...],                  // 尾巴物理点（10个）
  whiskers: { twitch: 0-1 },                // 胡须抖动
  breath:   { scale: 1 }                    // 呼吸缩放
};
```

### 字段说明

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `head.x` | number | 0 | 头部 X 偏移（像素） |
| `head.y` | number | 0 | 头部 Y 偏移（像素） |
| `head.rotation` | number | 0 | 头部旋转（弧度） |
| `head.scale` | number | 1 | 头部缩放 |
| `body.scaleX` | number | 1 | 身体 X 缩放 |
| `body.scaleY` | number | 1 | 身体 Y 缩放 |
| `body.offsetX` | number | 0 | 身体 X 偏移 |
| `body.offsetY` | number | 0 | 身体 Y 偏移 |
| `eyes.open` | number | 1 | 眼睛开合度（0=闭，1=开） |
| `eyes.leftX` | number | 0 | 左眼 X 偏移 |
| `eyes.rightX` | number | 0 | 右眼 X 偏移 |
| `eyes.pupilSize` | number | 1 | 瞳孔大小 |
| `ears.leftAngle` | number | 0 | 左耳角度（弧度） |
| `ears.rightAngle` | number | 0 | 右耳角度（弧度） |
| `mouth.type` | string | 'normal' | 嘴型：normal, open, smile |
| `paws.*.x/y` | number | 0 | 各爪子偏移 |
| `tail` | array | [] | 尾巴物理点 [{x,y}, ...] |
| `whiskers.twitch` | number | 0 | 胡须抖动（0-1） |
| `breath.scale` | number | 1 | 呼吸缩放 |

---

## 🔧 动画引擎 API

### 构造函数

```javascript
const engine = new AnimationEngine();
```

### 注册动作

```javascript
engine.register(name, config);
```

| 参数 | 类型 | 说明 |
|------|------|------|
| `name` | string | 动作名称（唯一） |
| `config.weight` | number | 随机权重（0-1） |
| `config.duration` | array | 持续时间 `[最小ms, 最大ms]` |
| `config.update` | function | `(engine, pose, time) => void` |

### 绑定皮肤

```javascript
engine.setSkin(skin);
```

### 设置拖拽状态

```javascript
engine.setDragState(true);  // 开始拖拽（暂停动作切换）
engine.setDragState(false); // 结束拖拽（恢复 idle）
```

### 获取状态

```javascript
engine.getState();  // => 'idle' | 'headTilt' | ...
engine.getPose();   // => 当前 Pose 对象
```

---

## 🎬 内置动作

| 动作 | 权重 | 持续时间 | 效果 |
|------|------|----------|------|
| idle | 1.0 | 3000-7000ms | 空闲，轻微呼吸 |
| headTilt | 0.8 | 1500-3000ms | 歪头（正弦波旋转） |
| tailWag | 0.7 | 2000-4000ms | 摇尾巴（物理系统处理） |
| stretch | 0.5 | 1500-2500ms | 伸懒腰（身体伸缩） |
| lookAround | 0.6 | 2000-3500ms | 左右张望（眼睛跟随） |
| sit | 0.4 | 3000-5000ms | 坐下（身体下压） |
| pawLick | 0.3 | 2000-3000ms | 舔爪子（前爪移动+张嘴） |

---

## 💡 扩展示例

### 添加打哈欠动作

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

### 添加眨眼动作（独立于状态机）

眨眼已内置，如需自定义频率：
```javascript
engine.blink.timer = 3000; // 下次眨眼倒计时（ms）
```

### 修改动作权重

```javascript
engine.actions.idle.weight = 0.8;        // 降低空闲频率
engine.actions.headTilt.weight = 1.2;    // 提高歪头频率
```

---

## 🔬 物理系统

### 尾巴物理（TailPhysics）

```javascript
class TailPhysics {
    constructor();
    update(dt, state);     // 更新物理模拟
    getPoints();           // 获取当前尾巴点 [{x,y}, ...]
}
```

- 10 个物理点，Verlet 积分
- 重力：0.2
- 摩擦：0.97
- 约束迭代：5 次

### 呼吸系统

```javascript
engine.breath.phase += dt * 0.002;
pose.breath.scale = 1 + Math.sin(engine.breath.phase) * 0.02;
```

### 眨眼系统

```javascript
engine.blink.timer -= dt;
if (engine.blink.timer <= 0) {
    if (engine.blink.open) {
        engine.blink.open = false;
        engine.blink.timer = 150;
    } else {
        engine.blink.open = true;
        engine.blink.timer = 2000 + Math.random() * 3000;
    }
}
```

---

*最后更新：2026-05-11*
