# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SmellyCat is a desktop pet application built with **Tauri 2.0** (Rust backend) and **PixiJS 8** (vanilla JS frontend). It renders an animated cat in a transparent, frameless, always-on-top window. The codebase is small (~1K lines of JS) and uses an engine/skin decoupled architecture.

## Build & Development Commands

Prerequisites: Node.js 18+, Rust toolchain.

| Command | Description |
|---------|-------------|
| `npm install` | Install Node dependencies (run once) |
| `npm run dev` | Start Tauri dev server with hot reload |
| `npm run build` | Build production executable (`src-tauri/target/release/SmellyCat.exe`) |

There are no test or lint scripts configured.

## Architecture

The frontend follows a strict **engine/skin decoupling** pattern:

```
AnimationEngine (state machine + physics) → Pose object → Skin (PixiJS renderer)
```

**AnimationEngine** (`public/engine/AnimationEngine.js`) manages the per-frame update loop: breathing (sine wave), blinking (timer-based), state machine (weighted random action selection), and tail physics. It outputs a standardized `Pose` object and calls `skin.render(pose)`.

**TailPhysics** (`public/engine/TailPhysics.js`) uses Verlet integration with 10 segments. It runs independently each frame. Actions must **not** modify `pose.tail` — only `TailPhysics` owns it.

**Actions** (`public/engine/actions/*.js`) are plain functions registered via `engine.register(name, { weight, duration: [min, max], update })`. The `update(engine, pose, time)` callback mutates the `pose` object using `Math.sin()` over `time` (ms). Weighted random selection picks the next action when the current duration expires.

**Skins** (`public/skins/*.js`) are classes that receive a `PIXI.Application` in their constructor and implement `setEngine(engine)` and `render(pose)`. Each frame they `clear()` all `PIXI.Graphics` objects and redraw from the `pose` data. Skins do not own animation logic.

## Key Interfaces

### Pose Data (engine → skin contract)

```javascript
{
  head: { x, y, rotation, scale },
  body: { scaleX, scaleY, offsetX, offsetY },
  eyes: { open: 1|0.15, leftX, rightX, pupilSize },
  ears: { leftAngle, rightAngle },
  mouth: { type: 'normal'|'open'|'smile' },
  paws: { frontLeft: {x,y}, frontRight: {x,y}, backLeft: {x,y}, backRight: {x,y} },
  tail: [{x,y}, ...],      // 10 points, owned by TailPhysics
  whiskers: { twitch: 0 },
  breath: { scale: 1 }
}
```

### Skin Class Contract

```javascript
class MySkin {
  constructor(app) { /* create PIXI.Container + PIXI.Graphics layers */ }
  setEngine(engine) { this.engine = engine; }
  render(pose) { /* clear all graphics, redraw from pose */ }
}
```

### Action Registration

```javascript
engine.register('actionName', {
  weight: 0.5,              // random selection weight (0-1)
  duration: [2000, 4000],   // [minMs, maxMs]
  update: (engine, pose, time) => { /* mutate pose */ }
});
```

## Important Constraints

- **PixiJS 8**: `PIXI.Graphics` does **not** support `save()`/`restore()`. Use `.x`, `.y`, `.angle` for transforms instead.
- **Skin selection** happens in `public/index.html` by commenting/uncommenting `<script src="skins/...">` tags. Only one skin is active at a time.
- **Action scripts** must be loaded as `<script>` tags in `index.html` and registered before the ticker starts.
- **Window behavior** is controlled in `src-tauri/tauri.conf.json`: 400x400, transparent, frameless, always-on-top, skipTaskbar, acceptFirstMouse. The Rust backend (`src-tauri/src/main.rs`) is minimal — just Tauri setup with the shell plugin.
- **Drag interaction** is implemented in `index.html` via mouse events on the canvas, not through Tauri APIs. Dragging pauses the action state machine (`engine.setDrag(true)`).

## File Boundaries for Changes

- **New actions**: create `public/engine/actions/<name>.js`, load it in `index.html`, register it in the inline script.
- **New skins**: create `public/skins/<Name>Skin.js`, swap the script tag in `index.html`.
- **Engine changes**: modify `public/engine/AnimationEngine.js` or `TailPhysics.js`.
- **Window behavior**: modify `src-tauri/tauri.conf.json` or `src-tauri/src/main.rs`.
