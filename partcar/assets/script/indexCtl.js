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
cc.Class({
    extends: cc.Component,

    properties: {
        maskLoad: {
            default: null,
            type: cc.Node
        },
        loadData: false, //是否加载完数据
        loadScore: false, //是否加载完分数
        rankName: '',
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.maskLoad.active = true;
        cc.director.preloadScene("game", function () {
            cc.log("Next scene preloaded");
        });
        this.getHistoryScore(); //历史分数
        this.getUserData(); //车辆数据

    },

    start() {

    },

    update(dt) {
        if (this.loadData && this.loadScore) {
            this.maskLoad.active = false;
            this.loadData = false;
            this.loadScore = false;
        }

    },
    //获取车辆数据
    getUserData() {
        var that = this;
        try {
            FBInstant.player.getDataAsync(['partState', "coinAll", "levelMax", "carBuy"])
                .then(function (data) {
                    console.log("获得车辆数据")
                    UserData.partState = data["partState"]; //停车场状态
                    UserData.coinAll = data["coinAll"]; //当前余额
                    UserData.levelMax = data["levelMax"]; //车辆拥有 最大等级
                    UserData.carBuy = data["carBuy"]; //车辆购买记录
                    console.log(data);
                    if ((!UserData.coinAll || isNaN(UserData.coinAll))) {
                        console.log("初始5000金");
                        UserData.coinAll = 5000;
                    }
                    if (!UserData.levelMax || isNaN(UserData.levelMax)) {
                        console.log("初始车辆最大等级1级");
                        UserData.levelMax = 1;
                    }
                    if (!UserData.carBuy) {
                        UserData.carBuy = {}
                    }
                    if (!UserData.partState) {
                        UserData.partState = {}
                    }
                    that.loadData = true;
                });
        } catch (error) {
            UserData.coinAll = 5000;
            UserData.levelMax = 1;
            that.loadData = true;
            console.log("load data error");
        }
    },
    //获取玩家历史最高分数
    getHistoryScore() {
        console.log("查看分数")
        try {
            var that = this;
            FBInstant.getLeaderboardAsync(that.rankName)
                .then(function (leaderboard) {
                    return leaderboard.getPlayerEntryAsync();
                })
                .then(function (entry) {
                    if (null == entry) {
                        UserData.score = 0;
                        that.loadScore = true;
                        return;
                    }
                    console.log("历史分数 : " + entry.getScore());
                    if (entry.getScore()) {
                        UserData.score = entry.getScore();
                    } else {
                        UserData.score = 0;
                    }
                    that.loadScore = true;
                });
        } catch (error) {
            console.log("show history score error : " + error);
            UserData.score = 0;
            that.loadScore = true;
        }
    }, //
    play() {
        cc.director.loadScene("game");
    }
});