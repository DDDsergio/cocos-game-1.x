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
        rank: {
            default: null,
            type: cc.Label
        },
        user: {
            default: null,
            type: cc.Label
        },
        score: {
            default: null,
            type: cc.Label
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},
    init(rank, name, score) {
        if (null == rank) {
            this.rank.string = "";
        } else {
            this.rank.string = rank;
        }
        if (null == name) {
            this.user.string = "";
        } else {
            this.user.string = name;
        }
        if (null == score) {
            this.score.string = "";
        } else {
            this.score.string = score;
        }
    }
});
