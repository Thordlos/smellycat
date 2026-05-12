// tailWag - 摇尾巴
function actionTailWagUpdate(engine, pose, time) {
    engine.tail.applyWag(time, 3);
}
