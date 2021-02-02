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
cc.Class({
    extends: cc.Component,

    properties: {
        gameCtl: {
            default: null,
            type: cc.Node
        },
        coinShow: {
            default: null,
            type: cc.Label
        },
        menuItem: {
            default: null,
            type: cc.Prefab
        },
        cont: {
            default: null,
            type: cc.Node
        },
        addCost: 1.175, //购买一次的价格上浮比例
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.initCarData(); //重置车辆信息
        this.coinShow.string = "000";
        this.node.active = false;
        this.initMenu();
    },

    start() {

    },

    update(dt) {
        this.coinShow.string = this.gameCtl.getComponent("gameCtl").getCoinAll();
    },
    showMenu() {
        this.node.active = true;
    },
    closeMenu() {
        this.node.active = false;
    },
    //初始化菜单
    initMenu() {
        var node = null;
        var itemMargin = 20;
        var heightOld = this.cont.height;
        var heightSet = data.maxLevel * (this.menuItem.data.height + itemMargin) + 150;
        if (heightSet > heightOld) {
            this.cont.height = heightSet;
        }
        for (var i = 1; i <= data.maxLevel; i++) {
            node = cc.instantiate(this.menuItem);
            node.getComponent("menu-item").initMenuItemByLevel(i);
            node.x = 0;
            node.y = -150 - (node.height + itemMargin) * (i - 1);
            this.cont.addChild(node);
        }
        this.initMenuItem();
    },
    //初始化菜单内容   是否指定一个等级
    initMenuItem(level) {
        if (level) {
            var ll = this.cont.children;
            for (i in ll) {
                if (ll[i].getComponent("menu-item").level == level) {
                    console.log(level);
                    ll[i].getComponent("menu-item").initMenuItem();
                    break;
                }
            }
        } else {
            var ll = this.cont.children;
            for (i in ll) {
                ll[i].getComponent("menu-item").initMenuItem();
            }
        }
    },
    //初始化车辆信息
    initCarData() {
        for (var i = 1; i <= data.maxLevel; i++) {
            data.carList[i] = {};
            data.carList[i].priceBase = i * 1000;
            data.carList[i].income = i * 1000;
            data.carList[i].speed = 6 + i * 0.5;
        }
    }

});