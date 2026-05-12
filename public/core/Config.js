/**
 * 全局配置
 */
const CONFIG = {
    canvasWidth: 400, canvasHeight: 400,
    tail: { segments: 10, segmentLength: 8, gravity: 0.2, friction: 0.97, constraintIterations: 5 },
    animation: { breathSpeed: 0.002, breathAmplitude: 1.5, blinkInterval: [2000, 5000], blinkDuration: 150 },
    actionDefaults: {
        idle:       { weight: 1.0, duration: [3000, 7000] },
        headTilt:   { weight: 0.8, duration: [1500, 3000] },
        tailWag:    { weight: 0.7, duration: [2000, 4000] },
        stretch:    { weight: 0.5, duration: [1500, 2500] },
        lookAround: { weight: 0.6, duration: [2000, 3500] },
        sit:        { weight: 0.4, duration: [3000, 5000] },
        pawLick:    { weight: 0.3, duration: [2000, 3000] }
    },
    window: { width: 400, height: 400, catX: 200, catY: 220, hitRadius: 80 }
};
