/**
 * surprise - 受惊反应（点击触发）
 * 快速缩身、耳朵后压、张嘴、眯眼，然后恢复
 */
function actionSurpriseUpdate(engine, pose, time) {
    const t = time / 800;
    const intensity = t < 0.3 ? t / 0.3 : Math.max(0, 1 - (t - 0.3) / 0.7);
    pose.head.rotation = -0.2 * intensity;
    pose.ears.leftAngle = 0.4 * intensity;
    pose.ears.rightAngle = 0.4 * intensity;
    pose.body.scaleY = 1 - 0.08 * intensity;
    pose.mouth.type = 'open';
    pose.eyes.open = 1 - 0.4 * intensity;
}
