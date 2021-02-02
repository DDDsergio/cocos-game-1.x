// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var com = require('common');
var data = require('carData');
var UserData = require('userData');
cc.Class({
    extends: cc.Component,

    properties: {
        carSp: {
            default: null,
            type: cc.Sprite
        }, //车
        priceShow: {
            default: null,
            type: cc.Label
        }, //价格
        btn1: {
            default: null,
            type: cc.Node
        }, //可买
        btn2: {
            default: null,
            type: cc.Node
        }, //不可买
        priceBase: 0, //基础价格
        price: 0, //购买价格 
        level: 1, //
        state: 0, //按钮状态  0未初始化  1 = 可购买/2 = 不可购买/3=钻石
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad() {},

    start() {

    },

    // update (dt) {},
    //初始化格子      当前按钮车辆等级
    initMenuItemByLevel(level) {
        this.level = level;
        this.priceBase = data.carList[this.level].priceBase;
        var self = this;
        cc.loader.loadRes(this.level + "-2", cc.SpriteFrame, function (err, spriteFrame) {
            self.carSp.spriteFrame = spriteFrame;
        });
        this.price = this.priceBase;
        this.priceShow.string = com.formatNum(this.price);
    },
    //购买
    buyThis() {
        if (this.state == 1) {
            com.gameCtl.getComponent("gameCtl").addCar(this.price, this.level);
        }
    },
    //初始化菜单表现
    initCanBuy() {
        if (this.state == 1) {
            //可购买
            this.carSp.node.color = cc.Color.WHITE;
            this.priceShow.string = com.formatNum(this.price);
            this.btn1.active = true;
            this.btn2.active = false;
        } else if (this.state == 2) {
            //不可购买
            this.carSp.node.color = cc.Color.BLACK;
            this.btn1.active = false;
            this.btn2.active = true;
        }
    },
    //初始化内容
    initMenuItem() {
        //初始化购买状态
        var maxLevel = UserData.levelMax;
        // if (this.level > (maxLevel - 4)) {
        //     //不可购买
        //     if (this.level <= 4) {
        //         if (this.level == 1) {
        //             this.state = 1;
        //         } else {
        //             if (this.level < maxLevel) {
        //                 this.state = 1;
        //             } else {
        //                 this.state = 2;
        //             }
        //         }
        //         //例外
        //     } else {
        //         this.state = 2;
        //     }
        // } else {
        if (this.level > (maxLevel - 2)) {
            //不可购买
            if (this.level == 1) {
                this.state = 1;
            } else {
                this.state = 2;
            }
        } else {
            this.state = 1;
        }

        //初始化显示价格
        var bb = 0;
        try {
            bb = UserData.carBuy["car" + this.level];
            if (!bb) {
                bb = 0;
            }
        } catch (error) {
            bb = 0;
        }
        this.price = parseInt(this.priceBase * Math.pow(1.175, bb));
        this.priceShow.string = com.formatNum(this.price);

        this.initCanBuy(); //修正显示
    }


});