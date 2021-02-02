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
var UserData = require('userData');
var carData = require('carData');
cc.Class({
    extends: cc.Component,

    properties: {
        coinSecShow: {
            default: null,
            type: cc.Label
        },
        coinAllShow: {
            default: null,
            type: cc.Label
        },
        partCtl: {
            default: null,
            type: cc.Node
        },
        runStart: {
            default: null,
            type: cc.Node
        }, //跑道开始
        trash: {
            default: null,
            type: cc.Node
        }, //垃圾桶
        pdCtl: {
            default: null,
            type: cc.Node
        }, //跑道
        carStaticPre: {
            default: null,
            type: cc.Prefab
        }, //静态车
        part: {
            default: null,
            type: cc.Node
        }, //静态车库
        menu: {
            default: null,
            type: cc.Node
        }, //菜单
        coinSec: 0, //每秒可得金币数
        coinAll: 0, //可用金币数
        gameHeight: 0, //窗口高度
        rankName: "", //得分名
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.gameHeight = document.body.clientHeight / document.body.clientWidth * 450;
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        com.carStaticPre = this.carStaticPre;
        com.gameCtl = this.node;

        this.initUserData()


        this.coinSec = 0;
        this.coinSecShow.string = this.getCoinSec();
        this.coinAllShow.string = this.getCoinAll();
        this.initToucjEvent();
    },

    start() {

    },
    back2index() {
        cc.director.loadScene("index");
    },
    // update (dt) {},
    //format每秒金币
    getCoinSec() {
        return com.formatNum(this.coinSec) + "/s";
    },
    //format总金币
    getCoinAll() {
        return com.formatNum(this.coinAll);
    },
    //增加车辆
    addCar(spend, level) {
        if (this.coinAll >= spend) {
            var result = this.partCtl.getComponent("partCtl").addCar(level);
            if (result) {
                //购买成功
                this.useCoin(spend); //扣钱
                this.updateUserDateCarBuy(level); //修改配置文件
                this.updateUserPartData(); //修改场面
                this.menu.getComponent("menu").initMenuItem(level);
            } else {
                console.log("没有空地");
            }
        } else {
            //买不起
            console.log("买不起");
        }
    },
    //修改配置文件  用户购买车
    updateUserDateCarBuy(level) {
        if (UserData.carBuy["car" + level]) {
            UserData.carBuy["car" + level]++;
        } else {
            UserData.carBuy["car" + level] = 1;
        }
    },
    //购买一级车
    buyLevel1() {
        this.addCar(1000, 1)
    },
    //花钱
    useCoin(num) {
        this.coinAll -= num;
        this.coinAllShow.string = this.getCoinAll();
        this.setUserScore(); //修改钱
    },
    //获得钱
    getCoin(num) {
        if (null == this.coinAll) {
            this.coinAll = 0;
        }
        this.coinAll += num;
        this.coinAllShow.string = this.getCoinAll();
        if (!UserData.score) {
            UserData.score = 0;
        }
        UserData.score += num;
        this.setUserScore(); //修改钱
    },
    //点击事件
    initToucjEvent() {
        var that = this;
        this.node.on("touchstart", function (e) {
            //按下
            if (com.isPicking) {
                return;
            }
            var endX = e.getLocationX() - 225;
            var endY = e.getLocationY() - that.gameHeight / 2;
            var set = that.isFoucsPartSet(endX, endY);
            if (null != set) {
                com.startSetName = set.name;
                set.getComponent("partSet").pickQuest();
            } else {
                com.startSetName = "";
            }
            // console.log("从[" + com.startSetName + "]开始");
        });

        this.node.on("touchmove", function (e) {
            //移动
            if (com.isPicking) {
                com.pickCar.x = (e.getLocationX() - 225);
                com.pickCar.y = (e.getLocationY() - that.gameHeight / 2);
            }
        });

        this.node.on("touchend", function (e) {
            //结束
            if (com.isRunningPick) {
                var endX = e.getLocationX() - 225;
                var endY = e.getLocationY() - that.gameHeight / 2;
                var set = that.isFoucsPartSet(endX, endY);
                if (null != set) {
                    set.getComponent("partSet").endQuest("back");
                }
                com.isRunningPick = false;
                return;
            }
            if (!com.isPicking) {
                return;
            }
            var endX = e.getLocationX() - 225;
            var endY = e.getLocationY() - that.gameHeight / 2;
            var set = that.isFoucsPartSet(endX, endY);
            var needBack = true;
            if (null != set) {
                //停车
                needBack = !set.getComponent("partSet").endQuest();
                if (!needBack) {
                    that.updateUserPartData(); //修改场面
                }
            } else if (that.isTouchThis(endX, endY, that.runStart)) {
                //起跑
                // console.log("run!");
                needBack = !that.pdCtl.getComponent("pdCtl").addCar(com.pickCar.getComponent("carStatic").level);
                if (!needBack) {
                    com.pickCar.getComponent("carStatic").run();
                    com.pickCar.x = com.pickX;
                    com.pickCar.y = com.pickY;
                    com.isPicking = false;
                    com.pickX = 0;
                    com.pickY = 0;
                    com.pickCar = null;
                }
            } else if (that.isTouchThis(endX, endY, that.trash)) {
                //垃圾桶
                // console.log("扔垃圾!");
                var can = that.partCtl.getComponent("partCtl").hasOneMoreCar();
                if (can) {
                    com.pickCar.getComponent("carStatic").parentSet.getComponent("partSet").loseCar();
                    com.pickCar.name = "used";
                    com.pickCar.destroy();
                    that.getCoin(carData.carList[com.pickCar.getComponent("carStatic").level].priceBase);
                    com.pickCar = null;
                    com.isPicking = false;
                    com.pickX = 0;
                    com.pickY = 0;
                    needBack = false;
                    that.updateUserPartData(); //修改场面
                } else {
                    needBack = true;
                }
            }
            if (needBack) {
                // console.log("还原");
                var a1 = cc.moveTo(0.15, com.pickX, com.pickY);
                com.pickCar.runAction(a1);
                com.pickCar = null;
                com.isPicking = false;
                com.pickX = 0;
                com.pickY = 0;
            }
        });

    },
    //是否点在partSet上
    isFoucsPartSet(x, y) {
        var ll = this.partCtl.children;
        for (var i in ll) {
            if (ll[i].getComponent("partSet").isTouchThis(x, y)) {
                // console.log(ll[i].name);
                return ll[i];
            }
        }
        return null;
    },
    //是否点击此区域
    isTouchThis(x, y, node) {
        if (x >= node.x - node.width / 2 && x <= node.x + node.width / 2 && y >= node.y - node.height / 2 && y <= node.y + node.height / 2) {
            return true;
        }
        return false;
    },
    //facebook交互
    //上传数据
    setUserData() {
        console.log("上传数据");
        console.log(UserData.carBuy)

        try {
            FBInstant.player.setDataAsync({
                    partState: UserData.partState,
                    carBuy: UserData.carBuy,
                    levelMax: UserData.levelMax,
                })
                .then(function () {
                    console.log('车辆数据更新');
                });
        } catch (error) {
            console.log("setUserData error : " + error);
        }
    },
    //上传余额 与分数
    setUserScore() {
        // console.log("上传余额");
        // console.log(this.coinAll)
        var that = this;
        try {
            FBInstant.player.setDataAsync({
                    coinAll: that.coinAll
                })
                .then(function () {
                    // console.log('coinAll is set');
                });
        } catch (error) {
            console.log("setUserScore error : " + error);
        }
        that.updateScore();
    },
    //更新玩家分数
    updateScore() {
        // console.log("实时分数 : " + UserData.score);
        try {
            var that = this;
            FBInstant.getLeaderboardAsync(that.rankName)
                .then(function (leaderboard) {
                    return leaderboard.setScoreAsync(UserData.score);
                })
                .then(function (entry) {
                    // console.log("线上分数 : " + entry.getScore());
                });
        } catch (error) {
            console.log("update history score error : " + error);
        }
    },

    //初始化场面
    initUserData() {
        this.coinAll = UserData.coinAll; //初始化余额

        if (UserData.partState) {
            for (var i in UserData.partState) {
                if (i.indexOf("set") == 0 && UserData.partState[i].level != 0) {
                    var num = i.substr(3, 2); //车位序号
                    var addresult = this.partCtl.getComponent("partCtl").addCar(UserData.partState[i].level, "set-" + num);
                    if (addresult) {
                        //成功创建
                    } else {
                        console.log("initcar error : " + num);
                    }
                }
            }
        }
    },

    //更新场面
    updateUserPartData() {
        var partData = {};
        for (var i in this.part.children) {
            if (this.part.children[i].name != "used") {
                var aa = {};
                aa.level = this.part.children[i].getComponent("carStatic").level;
                partData["set" + this.part.children[i].name.substr(6, 2)] = aa;
            }
        }
        UserData.partState = partData;
        // console.log("场面更改");
        // console.log(partData);
        this.setUserData(); //上传
    },
    //root重置
    reset() {
        try {
            var that = this;
            FBInstant.player.setDataAsync({
                    coinAll: null,
                    partState: null,
                })
                .then(function () {
                    console.log('重置数据ok');
                });
        } catch (error) {
            console.log("update history score error : " + error);
        }
    },
    //更新用户拥有最大等级车
    updateUserDataCarMax(level) {
        console.log("请求更新");
        if (level > UserData.levelMax) {
            UserData.levelMax = level;
            console.log("更新为 " + level);
            this.menu.getComponent("menu").initMenuItem();
        }
    }




});