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
        red: {
            default: null,
            type: cc.Node
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    },

    start() {

    },

    // update (dt) {},
    init(x, y, width, height) {
        this.node.active = true;
        this.node.x = x;
        this.node.y = y;
        this.node.width = width;
        this.node.height = height;
        this.initRed();
    },
    initRed() {
        this.red.width = 10;
        this.red.y = this.node.height / 2 - this.red.height / 2;
        this.red.x = 0;
    },
    hide() {
        // this.width = 0;
        // this.red.width = 0;
        this.node.active = false;
    }
});
