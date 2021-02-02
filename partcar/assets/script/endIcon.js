// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        dis: 30,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var ro = Math.random() * 2 * Math.PI;
        var rx = this.dis * Math.sin(ro)
        var ry = this.dis * Math.cos(ro)
        var rx1 = 1.5 * rx;
        var ry1 = 1.5 * ry;
        var a1 = cc.moveBy(0.4, cc.v2(rx1, ry1));
        var a3 = cc.moveBy(0.2, cc.v2(rx, ry));
        var a2 = cc.scaleTo(0.2, 0)
        var sp = cc.spawn(a2, a3)
        var finished = cc.callFunc(function () {
            this.node.destroy();
        }, this);
        var seq = cc.sequence(a1, sp, finished)
        this.node.runAction(seq)

    },

    start() {

    },

    // update (dt) {},
});