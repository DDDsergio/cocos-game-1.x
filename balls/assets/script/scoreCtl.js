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
        score: 0, //分数
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.getComponent(cc.Label).string = "score : 0";
    },

    start() {

    },

    // update (dt) {},
    initScore() {
        this.score = 0;
        this.getComponent(cc.Label).string = "score : " + this.score;
    },
    addScore() {
        this.score++;
        this.getComponent(cc.Label).string = "score : " + this.score;
    },
    getScore() {
        return this.score;
    }

});