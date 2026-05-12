// stretch - 伸懒腰
function actionStretchUpdate(engine, pose, time) {
    const s = Math.sin(time * 0.002);
    pose.body.scaleX = 1 + s * 0.08;
    pose.body.scaleY = 1 - s * 0.04;
    pose.body.offsetY = s * 3;
}
