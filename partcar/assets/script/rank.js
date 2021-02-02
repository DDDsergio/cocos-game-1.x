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
        cont: {
            default: null,
            type: cc.Node
        }, //排名
        itemRank: {
            default: null,
            type: cc.Prefab
        }, //排名
        selfRank: {
            default: null,
            type: cc.Node
        }, //排名
        maskLoad: {
            default: null,
            type: cc.Node
        }, //排名
        rankName: 'test',
        itemMargin: 0, //每行间隔
        itemY: -130
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},
    //打开
    open() {
        this.maskLoad.active = true;
        this.node.active = true;
        var ll = this.cont.childern;
        for (var i in ll) {
            ll[i].destroy();
        }
        try {
            var that = this;
            FBInstant.getLeaderboardAsync(this.rankName)
                .then(function (leaderboard) {
                    return leaderboard.getPlayerEntryAsync();
                })
                .then(function (entry) {
                    console.log(entry);
                    if (null == entry) {} else {
                        that.selfRank.getComponent("rankItem").init(entry.getRank(), entry.getPlayer().getName(), entry.getScore());
                    }
                    that.getRankList();
                });
        } catch (error) {
            this.maskLoad.active = false;
            console.log("show history score error : " + error);
        }
    },

    //获得排行列表
    getRankList() {
        var rank = 0;
        var that = this;
        try {
            FBInstant.getLeaderboardAsync(this.rankName)
                .then(function (leaderboard) {
                    return leaderboard.getEntriesAsync(100, 0); //从0开始前100
                })
                .then(function (entries) {
                    that.initRankList(entries);
                    that.maskLoad.active = false;
                });
        } catch (error) {
            console.log("getRankList error : " + error);
        }
    },
    //初始化排行榜
    initRankList(list) {
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
        newItem.getComponent("rankItem").init(rank, name, score);
        newItem.setPosition(0, this.itemY - (this.itemRank.data.height + this.itemMargin) * index);
        this.cont.addChild(newItem);
    },
    close() {
        this.node.active = false;
    }
});