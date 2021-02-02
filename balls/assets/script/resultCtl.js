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
        warning: {
            default: null,
            type: cc.Label
        },
        btns: {
            default: null,
            type: cc.Node
        },
        scoreShow: {
            default: null,
            type: cc.Node
        },
        mask: {
            default: null,
            type: cc.Node
        },
        scorePage: {
            default: null,
            type: cc.Node
        },
        title: {
            default: null,
            type: cc.Node
        },
        stopNode: {
            default: null,
            type: cc.Node
        },
        scoreReal: {
            default: null,
            type: cc.Label
        }, //本局分数
        scoreHighest: {
            default: null,
            type: cc.Label
        }, //最高分数
        itemRank: {
            default: null,
            type: cc.Prefab
        }, //排名
        selfRank: {
            default: null,
            type: cc.Node
        }, //排名
        cont: {
            default: null,
            type: cc.Node
        }, //排名
        leaderboard: {
            default: null,
            type: cc.Node
        }, //排名
        maskLoad: {
            default: null,
            type: cc.Node
        }, //排名
        hisScore: 0, //历史分数
        userName: "user", //用户名
        rank: 0, //用户排名
        rankName: 'rank',
        itemY: -144, //第一条排名位置
        itemMargin: 20, //间隔
        shareImg: "", //分享图片
        shareWord: "", //间隔
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.warning.node.active = false;
        this.maskLoad.active = false;
        this.scoreShow.active = false;
        this.stopNode.active = false;
        this.scorePage.active = false;
        this.leaderboard.active = false;
        this.getHistoryScore();
    },

    start() {

    },
    // update (dt) {},
    showWarninig() {
        this.warning.node.active = true;
        var ac2 = cc.fadeOut(0.5)
        var ac3 = cc.fadeIn(0.5)
        var ac4 = cc.fadeOut(0.5)

        var seq = cc.sequence(ac2, ac3, ac4);
        this.warning.node.runAction(seq)
    },
    //开始游戏
    startGame() {
        this.scorePage.active = false;
        this.mask.active = false;
        this.title.active = false;
        this.btns.active = false;
        this.scoreShow.active = false;
        this.warning.node.active = false;
        this.stopNode.active = false;
    },
    //结束游戏
    gameOver(score) {
        this.stopNode.active = false;
        this.scoreReal.string = score;
        if (score > this.hisScore) {
            this.updateScore(score);
            this.hisScore = score;
        }
        this.scoreHighest.string = this.hisScore;
        this.mask.active = true;
        this.btns.active = true;
        this.scoreShow.active = true;
        this.scorePage.active = true;
    },
    //暂停
    stop() {
        if (this.btns.active) {
            return;
        }
        this.mask.active = true;
        this.stopNode.active = true;
    },
    //继续
    continue () {
        this.mask.active = false;
        this.stopNode.active = false;
    },
    //获取玩家历史最高分数
    getHistoryScore() {
        try {
            var that = this;
            FBInstant.getLeaderboardAsync(this.rankName)
                .then(function (leaderboard) {
                    return leaderboard.getPlayerEntryAsync();
                })
                .then(function (entry) {
                    that.hisScore = entry.getScore();
                    // that.userName = entry.getPlayer().getName();
                    // that.rank = entry.getRank();
                });
        } catch (error) {
            console.log("show history score error : " + error);
        }

    },
    //更新玩家分数
    updateScore(resultScore) {
        try {
            var that = this;
            FBInstant.getLeaderboardAsync(this.rankName)
                .then(function (leaderboard) {
                    return leaderboard.setScoreAsync(resultScore);
                })
                .then(function (entry) {});
        } catch (error) {
            console.log("update history score error : " + error);
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
    //打开排行榜
    showLeaderboard() {
        this.maskLoad.active = true;
        this.leaderboard.active = true;
        try {
            var that = this;
            FBInstant.getLeaderboardAsync(this.rankName)
                .then(function (leaderboard) {
                    return leaderboard.getPlayerEntryAsync();
                })
                .then(function (entry) {
                    that.hisScore = entry.getScore();
                    that.userName = entry.getPlayer().getName();
                    that.rank = entry.getRank();
                    that.selfRank.getComponent("rankItem").init(that.rank, that.userName, that.hisScore)
                    that.getRankList();
                });
        } catch (error) {
            this.maskLoad.active = false;
            console.log("show history score error : " + error);
        }
    },
    closeRankList() {
        this.maskLoad.active = false;
        this.leaderboard.active = false;
    },
    test() {
        console.log("test")
    },
    //分享
    shareRequest() {
        this.maskLoad.active = true;
        var that = this;
        try {
            FBInstant.shareAsync({
                intent: 'SHARE', //"INVITE" 邀请 | "REQUEST" 请求| "CHALLENGE" //挑战| "SHARE" 分享)
                image: that.shareImg,
                text: that.shareWord,
                // data: { myReplayData: '...' },//分享时  希望传递的数据块
            }).then(function () {
                // continue with the game.
                that.maskLoad.active = false;
            });
        } catch (error) {
            that.maskLoad.active = false;
        }
    },
    return2Index(){
        this.warning.node.active = false;
        this.maskLoad.active = false;
        this.scoreShow.active = false;
        this.stopNode.active = false;
        this.scorePage.active = false;
        this.leaderboard.active = false;

        this.mask.active = true;
        this.btns.active = true;
        this.title.active = true;
    }



});