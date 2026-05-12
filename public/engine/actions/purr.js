/**
 * purr - 呼噜反应（点击触发）
 * 眯眼微笑、身体微颤、胡须抖动
 */
function actionPurrUpdate(engine, pose, time) {
    pose.eyes.open = 0.35 + Math.sin(time * 0.02) * 0.15;
    pose.mouth.type = 'smile';
    pose.body.scaleY = 1 + Math.sin(time * 0.015) * 0.015;
    pose.whiskers.twitch = 0.6 + Math.sin(time * 0.025) * 0.3;
}
