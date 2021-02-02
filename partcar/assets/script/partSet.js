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
        cars: {
            default: null,
            type: cc.Node
        }, //停车层
        pdCtl: {
            default: null,
            type: cc.Node
        }, //跑道
        free: true, //是否没车
        isRun: false, //是否在跑
        level : 0,//本地车辆等级

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad() {},

    start() {

    },

    // update (dt) {},
    //放置车辆
    setCar(level) {
        var node = cc.instantiate(com.carStaticPre);
        node.x = this.node.x;
        node.y = this.node.y-5;
        node.getComponent("carStatic").iniByLevel(level);
        this.level = level;
        node.height = 35;
        node.width = 77;
        node.getComponent("carStatic").parentSet = this.node;
        node.name = "p-" + this.node.name; //标记
        this.cars.addChild(node);
        this.free = false;
    },

    //交互事件
    //点击
    pickQuest() {
        if (this.free || com.isPicking) {
            //空闲状态   已有车被提起    是否在跑
            return;
        }
        if (this.isRun) {
            //在跑
            com.isRunningPick = true;
            return;
        }
        // console.log("提起");
        com.isPicking = true;
        var ll = this.cars.children;
        for (var i in ll) {
            if (ll[i].name == "p-" + this.node.name) {
                com.pickCar = ll[i];
                com.pickX = this.node.x;
                com.pickY = this.node.y-5;
                break;
            }
        }
    },
    //在此区结束
    endQuest(key) {
        if (key == "back") {
            if (this.node.name == com.startSetName) {
                if (!this.free && this.isRun) {
                    //从跑道返回
                    this.runningBack();
                    return true;
                }
                return false;
            }
            return false;
        }
        // console.log("结束检测 : " + com.startSetName)
        if (this.free && com.isPicking) {
            //交换车
            // console.log("交换车");
            com.pickCar.x = this.node.x;
            com.pickCar.y = this.node.y-5;
            com.pickCar.getComponent("carStatic").parentSet.getComponent("partSet").loseCar();
            com.pickCar.getComponent("carStatic").parentSet = this.node;
            com.pickCar.name = "p-" + this.node.name; //标记
            com.pickCar = null;
            com.pickX = 0;
            com.pickY = 0;
            com.isPicking = false;
            this.free = false;
            return true;
        } else if (!this.free && com.isPicking && !this.isRun) {
            //叠加
            // console.log("请求叠加");
            var ll = this.cars.children;
            var car2 = null;
            for (var i in ll) {
                if (ll[i].name == "p-" + this.node.name) {
                    car2 = ll[i];
                    break;
                }
            }
            if (null == car2) {
                // console.log("找不到车");
                return false;
            }
            if (com.pickCar.name == car2.name) {
                // console.log("原位置");
                return false;
            }
            if (com.pickCar.getComponent("carStatic").level == car2.getComponent("carStatic").level) {
                //保留car2   清除car1
                var resulLevel = com.pickCar.getComponent("carStatic").level +1;
                if (car2.getComponent("carStatic").levelUp()) {
                    com.pickCar.getComponent("carStatic").parentSet.getComponent("partSet").loseCar();
                    com.pickCar.name = "used";
                    com.pickCar.destroy();
                    com.pickCar = null;
                    com.pickX = 0;
                    com.pickY = 0;
                    com.isPicking = false;
                    this.free = false;
                    com.gameCtl.getComponent("gameCtl").updateUserDataCarMax(resulLevel);
                } else {
                    //无法升级
                    console.log("无法升级");
                    return false;
                }
            } else {
                return false;
            }
            return true;
        }
        return false;

    },
    //交换车辆时
    //失去
    loseCar() {
        this.free = true;
        this.isRun = false;
        this.level = 0;
    },
    //上跑道
    running() {
        this.isRun = true;
    },
    //从跑道返回
    runningBack() {
        // console.log("从跑道返回");
        this.isRun = false;
        var ll = this.cars.children;
        for (var i in ll) {
            if (ll[i].name == "p-" + this.node.name) {
                ll[i].getComponent("carStatic").back();
                this.pdCtl.getComponent("pdCtl").backCar(this.node.name);
                break;
            }
        }
    },
    //是否点击此区域
    isTouchThis(x, y) {
        if (x >= this.node.x - this.node.width / 2 && x <= this.node.x + this.node.width / 2 && y >= this.node.y - this.node.height / 2 && y <= this.node.y + this.node.height / 2) {
            return true;
            // return this.endThis(car);
        }
        return false;
    },
});