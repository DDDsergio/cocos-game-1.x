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
        mask: {
            default: null,
            type: cc.Node
        },
        cont: {
            default: null,
            type: cc.Node
        },
        itemRank: {
            default: null,
            type: cc.Prefab
        },
        playerRank: {
            default: null,
            type: cc.Node
        },
        loadMask: {
            default: null,
            type: cc.Node
        },
        itemX: 140, //单条  x
        itemY: -95, //第一条记录y
        itemMargin: 20, //间隔
        rankName: 'testRank', //排行榜名
        pageSize: 100, //每页条数
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // this.close();
        //防止关闭loadmask
        this.clear();
        this.node.active = false;
        this.mask.active = false;
        if (1 == com.ac) {
            com.ac = 0;
            this.open();
        }
    },

    start() {

    },

    // update (dt) {},
    close() {
        this.loadMask.getComponent("mask").closeLoad(); //关闭查询遮罩
        this.clear();
        this.node.active = false;
        this.mask.active = false;
    },
    open() {
        if (this.isLoading()) {
            return;
        }
        this.loadMask.getComponent("mask").showLoad(); //打开查询遮罩
        this.node.active = true;
        this.mask.active = true;
        // this.initCont();
        this.playerRank.active = false;
        this.getPlayScore();
    },
    //获得用户得分
    getPlayScore() {
        try {
            var that = this;
            FBInstant.getLeaderboardAsync(this.rankName)
                .then(function (leaderboard) {
                    return leaderboard.getPlayerEntryAsync();
                })
                .then(function (entry) {
                    try {
                        that.playerRank.getComponent("item").init(entry.getRank(), entry.getPlayer().getName(), entry.getScore());
                    } catch (error) {}
                    that.playerRank.active = true;
                    that.getRankList();
                });
        } catch (error) {
            that.loadMask.getComponent("mask").closeLoad(); //关闭查询遮罩
            console.log("getPlayScore error : " + error);
        }
    },
    //获得排行列表
    getRankList() {
        var rank = 0;
        var that = this;
        try {
            FBInstant.getLeaderboardAsync(this.rankName)
                .then(function (leaderboard) {
                    return leaderboard.getEntriesAsync(this.pageSize, rank);
                })
                .then(function (entries) {
                    that.initCont(entries);
                    that.loadMask.getComponent("mask").closeLoad(); //关闭查询遮罩
                });
        } catch (error) {
            that.loadMask.getComponent("mask").closeLoad(); //关闭查询遮罩
            console.log("getRankList error : " + error);
        }
    },
    //初始化面板
    initCont(list) {
        var heightR = -this.itemY + (this.itemRank.data.height + this.itemMargin) * list.length;
        var nowHeight = this.cont.height;
        if (heightR > nowHeight) {
            this.cont.height = heightR;
        }
        for (var i in list) {
            this.addItem(list[i].getRank(), list[i].getPlayer().getName(), list[i].getScore(), i);
        }

    },
    //增加一条记录
    addItem(rank, name, score, index) {
        var newItem = cc.instantiate(this.itemRank);
        newItem.getComponent("item").init(rank, name, score);
        newItem.setPosition(this.itemX, this.itemY - (this.itemRank.data.height + this.itemMargin) * index);
        this.cont.addChild(newItem);
    },
    //清除
    clear() {
        var l = this.cont.children;
        for (var i in l) {
            l[i].destroy();
        }
    },
    //是否可用按钮
    isLoading() {
        if (this.loadMask.active || this.mask.active) {
            return true;
        } else {
            return false
        }
    }
});