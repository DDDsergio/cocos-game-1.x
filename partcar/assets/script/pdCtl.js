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
cc.Class({
    extends: cc.Component,

    properties: {
        carRunPre: {
            default: null,
            type: cc.Prefab
        },
        numShow: {
            default: null,
            type: cc.Label
        },
        gameCtl: {
            default: null,
            type: cc.Node
        },
        limit: 10, //最大数量
        activeCount: 0, //当前数量
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.numShow.string = this.activeCount + "/" + this.limit;
    },

    start() {

    },

    // update (dt) {},
    addCar(level) {
        if (this.activeCount < this.limit) {
            var node = cc.instantiate(this.carRunPre);
            node.name = "pd-" + com.startSetName;
            node.getComponent("car").initCar(level);
            this.node.addChild(node);
            this.addCount(1);
            // console.log("run car : " + node.name);
            return true;
        }
        return false;

    },
    //增加车辆
    addCount(num) {
        this.activeCount += num;
        this.numShow.string = this.activeCount + "/" + this.limit;
        this.sumIncome();
    },
    //计算每秒总收入
    sumIncome() {
        var ll = this.node.children;
        var sum = 0;
        for (var i in ll) {
            if(ll[i].name != "used"){
                sum += ll[i].getComponent("car").incomeSec;
            }
        }
        this.gameCtl.getComponent("gameCtl").coinSec = sum;
        this.gameCtl.getComponent("gameCtl").coinSecShow.string = this.gameCtl.getComponent("gameCtl").getCoinSec();;
    },
    //收回车辆
    backCar(setName) {
        var ll = this.node.children;
        for (var i in ll) {
            if (ll[i].name == "pd-" + setName) {
                ll[i].name = "used";
                ll[i].destroy();
                this.addCount(-1);
                return;
            }
        }
    }
});