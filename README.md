# 🐱 SmellyCat - Tauri + PixiJS 桌面宠物

一个轻量级、高性能的桌面宠物应用，使用 Tauri (Rust) 和 PixiJS (WebGL) 构建。

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ 特性

- 🪟 **透明窗口** - 无边框、完全透明背景
- 📌 **始终置顶** - 宠物始终显示在桌面最上层
- 🖱️ **点击穿透** - 按 `T` 键切换，透明区域点击传递到桌面
- 🐈 **物理尾巴** - Verlet 积分模拟，尾巴自然飘动
- 🎨 **极简设计** - 几何线条猫咪，可爱又轻量
- 📦 **小巧体积** - 最终 exe 约 5-10MB（相比 Unity 的 100MB+）

---

## 🚀 快速开始

### 前置要求

| 软件 | 版本 | 下载链接 |
|------|------|----------|
| Node.js | 18+ | https://nodejs.org/ |
| Rust | 最新 | https://rustup.rs/ |

### 安装步骤

**1. 安装 Rust**
```powershell
# Windows 用户，在 PowerShell 中运行
winget install Rustlang.Rustup
# 或访问 https://rustup.rs/ 下载安装
```

**2. 安装 Node.js**
```powershell
winget install OpenJS.NodeJS.LTS
# 或访问 https://nodejs.org/ 下载安装
```

**3. 安装项目依赖**
```powershell
cd C:\Users\thordlos\.jvs\smellycat
npm install
```

**4. 运行开发版本**
```powershell
npm run tauri:dev
```

**5. 构建发布版本**
```powershell
npm run tauri:build
```

构建完成后，exe 文件位于：
```
src-tauri/target/release/SmellyCat.exe
```

---

## 🎮 使用说明

| 操作 | 效果 |
|------|------|
| **鼠标拖拽头部** | 移动猫咪位置 |
| **按 T 键** | 切换点击穿透模式 |
| **关闭程序** | Alt+F4 或任务管理器 |

### 点击穿透模式

- **ON（开启）**：鼠标点击透明区域会穿透到桌面应用（推荐）
- **OFF（关闭）**：可以正常与猫咪交互

---

## 📁 项目结构

```
smellycat/
├── public/
│   ├── index.html        # 前端页面
│   └── pet.js            # PixiJS 渲染 + 物理模拟
├── src-tauri/
│   ├── src/
│   │   └── main.rs       # Rust 主进程
│   ├── icons/            # 应用图标
│   ├── Cargo.toml        # Rust 依赖配置
│   └── tauri.conf.json   # Tauri 窗口配置
├── package.json          # Node.js 依赖
└── README.md
```

---

## 🛠️ 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 后端 | Rust + Tauri 2 | 系统窗口管理、打包 |
| 渲染 | PixiJS 8 | WebGL 2D 渲染引擎 |
| 物理 | 手写 Verlet | 尾巴物理模拟 |
| 前端 | 原生 JS | 无框架依赖 |

---

## 🔧 配置说明

### 窗口配置 (`src-tauri/tauri.conf.json`)

```json
{
  "app": {
    "windows": [{
      "transparent": true,      // 透明窗口
      "decorations": false,     // 无边框
      "alwaysOnTop": true,      // 始终置顶
      "skipTaskbar": true,      // 隐藏任务栏
      "acceptFirstMouse": true  // 接受鼠标事件
    }]
  }
}
```

### 猫咪配置 (`public/pet.js`)

```javascript
const CONFIG = {
    catColor: 0x333333,      // 猫咪颜色
    tailSegments: 8,          // 尾巴节数
    gravity: 0.3,             // 重力
    friction: 0.98            // 摩擦力
};
```

---

## 📝 开发笔记

### Verlet 积分物理

尾巴使用 Verlet 积分模拟：
- 每个节点存储当前位置和上一帧位置
- 速度通过位置差隐式计算
- 约束通过迭代求解保持长度

优点：
- 稳定、不易爆炸
- 代码简单
- 性能优秀

### 点击穿透实现

通过 Tauri API `setIgnoreCursorEvents()` 实现：
- 穿透开启：窗口忽略鼠标事件，传递给下层应用
- 穿透关闭：正常响应鼠标事件（拖拽猫咪）

---

## 🐛 常见问题

### Q: 构建时提示 Rust 错误
**A:** 确保 Rust 已正确安装，运行 `rustc --version` 验证

### Q: 窗口不透明
**A:** 检查 `tauri.conf.json` 中 `transparent: true` 是否设置

### Q: 构建后 exe 无法运行
**A:** 可能需要安装 [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)

### Q: 猫咪不显示
**A:** 检查控制台是否有 JavaScript 错误，确保 `pet.js` 正确加载

---

## 📄 许可证

MIT License

---

*Created with ❤️ using Tauri + PixiJS*
