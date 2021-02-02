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
        pool: {
            default: null,
            type: cc.Node
        },
        ballPre: {
            default: null,
            type: cc.Prefab
        },
        gameCtl: {
            default: null,
            type: cc.Node
        },
        used: false, //过期
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},
    copy() {
        var node = cc.instantiate(this.ballPre);
        node.x = this.node.x;
        node.y = this.node.y;
        node.getComponent("magic").pool = this.pool;
        node.getComponent("magic").gameCtl = this.gameCtl;
        var ro = Math.random() * 3.14 / 3 + 3.14 / 3;
        var offX = Math.sin(ro) * 600;
        var offY = Math.cos(ro) * 600;
        // console.log("ro : " + ro * 360 / 6.28);
        // console.log("offX : " + offX);
        // console.log("offY : " + offY);
        node.getComponent(cc.RigidBody).linearVelocity = cc.v2(offX, offY);
        this.pool.addChild(node);

        this.gameCtl.getComponent("gameCtl").addBallNum();
    }
});