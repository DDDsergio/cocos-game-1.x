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
        border: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},
    ready(x, y,needBack) {
        this.node.width = this.border;
        this.node.height = 0;
        this.node.x = x;
        this.node.y = y;
        if(needBack){
            var ac  = cc.rotateBy(0, -90);
            this.node.runAction(ac);
        }
    },
    //重新开始游戏  回正
    reInit(rat){
        this.node.height = 0;
        var ac  = cc.rotateBy(0, rat);
        this.node.runAction(ac);
    }

});
