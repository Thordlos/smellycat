// pawLick - 舔爪子
function actionPawLickUpdate(engine, pose, time) {
    const lick = Math.sin(time * 0.005);
    pose.paws.frontLeft.x = lick * 8;
    pose.paws.frontLeft.y = lick * -5;
    pose.head.rotation = lick * 0.1;
    pose.mouth.type = lick > 0.5 ? 'open' : 'normal';
}
