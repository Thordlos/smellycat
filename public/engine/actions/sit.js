// sit - 坐下
function actionSitUpdate(engine, pose, time) {
    pose.body.offsetY = -5;
    pose.body.scaleY = 0.9;
    pose.paws.frontLeft.y = 3;
    pose.paws.frontRight.y = 3;
}
