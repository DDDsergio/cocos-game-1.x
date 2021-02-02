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
        x: -165,
        y: -90,


    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // this.initPosition();//初始化位置
    },

    start() {

    },

    // update (dt) {},
    //初始化位置
    initPosition() {
        this.node.x = this.x;
        this.node.y = this.y;
    },
    //修正位置
    moveByX(x) {
        this.node.x = x;
    }
});
