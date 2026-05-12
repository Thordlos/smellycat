// lookAround - 左右张望
function actionLookAroundUpdate(engine, pose, time) {
    pose.head.x = Math.sin(time * 0.004) * 5;
    pose.eyes.leftX = Math.sin(time * 0.004) * 2;
    pose.eyes.rightX = Math.sin(time * 0.004) * 2;
}
