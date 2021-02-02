// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var limit = require('carData');
cc.Class({
    extends: cc.Component,

    properties: {
        parentSet: {
            default: null,
            type: cc.Node
        },
        backBtn: {
            default: null,
            type: cc.Node
        },
        levelShow: {
            default: null,
            type: cc.Label
        },
        level: 1, //车辆等级
        priceBase: 0, //基础价格
        priceReal: 0, //真实价格
        income: 0, //产出
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.resetThis();
        this.backBtn.active = false;
    },

    start() {

    },

    // update (dt) {},
    //根据的等级初始化
    iniByLevel(level) {
        this.level = level;
        this.resetThis();
    },
    levelUp() {
        if (this.level >= limit.maxLevel) {
            console.log("车辆已达到最高级");
            return false;
        }
        // console.log("升级 : " + this.level + " -> " + (this.level + 1));
        this.level++;
        this.resetThis();
        return true;
    },
    //重新初始化
    resetThis() {
        this.levelShow.string = this.level;
        this.initImg();
        this.initVal();
    },
    //初始化图片
    initImg() {
        var self = this;
        console.log(this.level+"-2")
        cc.loader.loadRes( this.level+"-2", cc.SpriteFrame, function (err, spriteFrame) {
            self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    },
    //初始化价值
    initVal() {
        this.priceBase = limit.carList[this.level].priceBase;
        this.income = limit.carList[this.level].income;
        this.priceReal = this.priceBase;
    },
    //上跑道
    run() {
        this.node.opacity = 200;
        this.backBtn.active = true;
        this.parentSet.getComponent("partSet").running();
    },
    //从跑道返回
    back() {
        this.node.opacity = 255;
        this.backBtn.active = false;
    },
});