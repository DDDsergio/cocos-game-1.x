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
        icon: {
            default: null,
            type: cc.Node
        },
        rotSpeed: 0,//icon旋转速度

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.closeLoad();
    },

    start() {

    },

    // update (dt) { },

    showLoad() {
        this.node.active = true;
        this.loading();
    },
    closeLoad() {
        this.node.active = false;
    },
    //旋转
    loading() {
        console.log("loading");
        var actionBy = cc.rotateBy(this.rotSpeed, 360);
        this.icon.runAction(actionBy);
        var that = this;
        setTimeout(function () {
            try {
                if (that.node.active) {
                    that.loading();
                }
            } catch (error) {
            }
        }, this.rotSpeed * 1000);
    }

});
