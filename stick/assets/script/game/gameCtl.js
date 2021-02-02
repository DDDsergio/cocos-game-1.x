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
        cvs: {
            default: null,
            type: cc.Node
        },
        human: {
            default: null,
            type: cc.Node
        },
        humanStand: {
            default: null,
            type: cc.SpriteFrame
        },
        g1: {
            default: null,
            type: cc.Node
        },
        g2: {
            default: null,
            type: cc.Node
        },
        g3: {
            default: null,
            type: cc.Node
        },
        L1: {
            default: null,
            type: cc.Node
        },
        L2: {
            default: null,
            type: cc.Node
        },
        scoreShow: {
            default: null,
            type: cc.Label
        },
        historyScoreShow: {
            default: null,
            type: cc.Label
        },
        historyScoreShowBg: {
            default: null,
            type: cc.Node
        },
        resultShow: {
            default: null,
            type: cc.Node
        },
        perfectShow: {
            default: null,
            type: cc.Node
        },
        loadMask: {
            default: null,
            type: cc.Node
        },

        score: 0,
        mainX: 0,//人物起始点x
        maxWidth: 0,//最大宽度
        minWidth: 0,//最小宽度
        maxDistance: 0,//最远距离 距离 = 两底柱中点间距离 
        gHeight: 0,
        gY: 0,
        timeTemp: 0,//调整时间s
        lineBorder: 0,//线条宽度
        gameReady: false,//是否可触摸
        gameFree: false,//是否允许手指抬起
        lineAct: false,//线条是否变长
        lineSpeed: 3,//线条变长速度

        roundDistance: 0,//本回合距离
        roundNum: 1,//回合数  从1开始
        humanMoveSpead: 10,//人物移动速度
        lineMoveTime: 0.7,//线条掉落时间
        perfectCount: 0,
        historyScore: 0,//历史最高得分
        rankName: 'testRank',//排行榜名\\
        newShareImg: '',//分享图片
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {


    },

    start() {
        this.initGame();
        this.initTouchEvent();//用户操作

        this.historyScoreShow.node.active = false;
        this.historyScoreShowBg.active = false;
        this.getHistoryScore();
    },

    update(dt) {
        if (this.lineAct) {
            this.getLineStatic(1).height += this.lineSpeed;
            if (this.getLineStatic(1).height >= this.cvs.width) {
                this.stopLine()
                this.gameFree = false;
            }
        }

    },
    //回index
    pageToIndex() {
        if (this.isLoading()) {
            return;
        }
        cc.director.loadScene("index");
    },
    //回index
    pageToRank() {
        if (this.isLoading()) {
            return;
        }
        com.ac = 1;
        cc.director.loadScene("index");
    },
    //回index
    pageToShare() {
        if (this.isLoading()) {
            return;
        }
        com.ac = 2;
        cc.director.loadScene("index");
    },
    //初始化游戏
    initGame() {
        this.perfectShow.active = false;
        this.score = 0;
        this.scoreShow.string = this.score;
        this.perfectCount = 0;
        this.resultShow.active = false;
        this.human.getComponent("human").initPosition();
        this.mainX = this.human.x;
        this.minWidth = this.human.width;
        this.maxWidth = 4 * this.human.width;
        this.maxDistance = this.cvs.width / 2 - this.mainX - this.lineBorder * 2;
        if (this.human.y > 0) {
            this.gHeight = this.cvs.height / 2 - this.human.y
        } else {
            this.gHeight = this.cvs.height / 2 + this.human.y
        }
        this.gHeight = this.gHeight - this.human.height / 2;
        this.gY = -this.cvs.height / 2 + this.gHeight / 2;
        // console.log("画布宽度 :" + this.cvs.width);
        // console.log("人物宽度 :" + this.human.width);
        // console.log("设置人物起始点 :" + this.mainX);
        // console.log("设置方块最小宽度 :" + this.minWidth);
        // console.log("设置方块最大宽度 :" + this.maxWidth);
        // console.log("设置最远距离 :" + this.maxDistance);
        // console.log("设置底柱高度 :" + this.gHeight);
        // console.log("设置底柱Y :" + this.gY);
        this.gameReady = false;
        this.gameFree = false;
        this.roundDistance = 0;
        this.roundNum = 1;
        this.initG()
    },
    initG() {
        //初始底柱位置
        var w1 = this.getNewWidth();
        var x1 = this.mainX - (w1 / 2 - this.human.width / 2);
        this.getGroundStatic(1).getComponent("g").init(x1, this.gY, w1, this.gHeight);
        var distance = this.getNewDistance(w1);
        this.roundDistance = distance;
        var x2 = x1 + distance;
        var w2 = this.getNewWidth(w1, distance);
        this.getGroundStatic(2).getComponent("g").init(x2, this.gY, w2, this.gHeight);
        //初始人物位置
        // var reX = x1 + w1 / 2 - this.human.width / 2 - this.lineBorder;
        // this.human.getComponent("human").moveByX(reX);
        this.readyLine();
    },
    //获得一个底柱宽度
    getNewWidth(w1, distance) {
        if (null == w1 && null == distance) {
            return this.minWidth + (this.maxWidth - this.minWidth) * cc.random0To1();
        }
        var w1max = (distance - (w1 / 2) - this.lineBorder) * 2;
        if (w1max > this.maxWidth) {
            return this.minWidth + (this.maxWidth - this.minWidth) * cc.random0To1();
        } else {
            return this.minWidth + (w1max - this.minWidth) * cc.random0To1();
        }

    },
    //获得一个新的距离    距离 = 两底柱中点间距离 
    getNewDistance(w1) {
        // return this.minDistance + (this.maxDistance - this.minDistance) * cc.random0To1();
        return w1 + this.lineBorder + (this.maxDistance - w1) * cc.random0To1();
    },
    //让线条到预定位置
    readyLine() {
        var x = this.getGroundStatic(1).x + this.getGroundStatic(1).width / 2;
        var y = this.getGroundStatic(1).y + this.getGroundStatic(1).height / 2;
        if (this.roundNum > 2) {
            this.getLineStatic(1).getComponent("line").ready(x, y, true);
        } else {
            this.getLineStatic(1).getComponent("line").ready(x, y);
        }

        //回合开始
        this.startRound();
    },
    //点击事件
    initTouchEvent: function () {
        var that = this;
        this.cvs.on("touchstart", function (e) {
            if (that.gameReady) {
                that.gameReady = false;
                that.gameFree = true;
                that.activeLine();
            }
        });
        this.cvs.on("touchend", function (e) {
            if (that.gameFree) {
                that.stopLine()
                that.gameFree = false;
            }
        });
    },
    //线条开始变长
    activeLine() {
        this.lineAct = true;
    },
    //线条停止变化
    stopLine() {
        this.lineAct = false;
        this.lineAction(this.getLineStatic(1), 90);

    },
    //线条旋转
    lineAction(line, rot) {
        var actionBy = cc.rotateBy(this.lineMoveTime, rot);
        actionBy.easing(cc.easeIn(5.0))
        var funCallback = cc.callFunc(function () {
            this.closeRound()
        }, this);
        var ac = cc.sequence(actionBy, funCallback)
        line.runAction(ac);
    },
    //结束本回合  进入结算流程
    closeRound() {
        var real = this.getLineStatic(1).height;
        var minAns = this.roundDistance - this.getGroundStatic(1).width / 2 - this.getGroundStatic(2).width / 2;
        var maxAns = this.roundDistance - this.getGroundStatic(1).width / 2 + this.getGroundStatic(2).width / 2;
        if (real >= minAns && real <= maxAns) {
            this.successAction();
        } else {
            this.humanToLine();
        }

    },
    //失败动画
    //人物走到线条尽头 线条人物同时掉落
    humanToLine() {
        var x = this.getLineStatic(1).x + this.getLineStatic(1).height - this.human.width / 2;
        var human1 = cc.moveTo(this.getHumanMoveTime(), x, this.human.y);//人物走动
        var back1 = cc.callFunc(function () {
            this.human.getComponent(cc.Animation).stop();
            this.human.getComponent(cc.Sprite).spriteFrame = this.humanStand;
            var line1 = cc.rotateBy(this.timeTemp / 2, 90);
            this.getLineStatic(1).runAction(line1);
            this.gamOver();
        }, this);

        var ac = cc.sequence(human1, back1)
        this.human.getComponent(cc.Animation).play();
        this.human.runAction(ac);
    },
    //游戏结束
    gamOver() {
        var human2 = cc.moveTo(this.timeTemp / 2, this.human.x, -this.cvs.height / 2 - this.human.height / 2);
        var back2 = cc.callFunc(function () {
            this.resultShow.getComponent("resultShow").show(this.score, this.historyScore);
            //上传分数
            if (this.historyScore == null || this.historyScore < this.score) {
                this.updateScore(this.score);
            }
        }, this)
        var ac2 = cc.sequence(human2, back2)
        this.human.runAction(ac2);
    },
    //获得人物走动时间
    getHumanMoveTime(rex) {
        if (null == rex) {
            //失败  沿着线走
            return this.getLineStatic(1).height / this.humanMoveSpead;
        } else {
            //成功  走到柱子边缘
            return (rex - this.human.x) / this.humanMoveSpead;
        }
    },
    //成功动画
    //人物走到底柱边缘 场景左移
    successAction() {
        var rex = this.getGroundStatic(2).x + this.getGroundStatic(2).width / 2 - this.human.width / 2;
        var human1 = cc.moveTo(this.getHumanMoveTime(rex), rex, this.human.y);//人物走动

        //场景移动
        var back1 = cc.callFunc(function () {
            this.human.getComponent(cc.Animation).stop();
            this.human.getComponent(cc.Sprite).spriteFrame = this.humanStand;
            this.addScore();//计算得分
            //计算左移距离
            var rex = this.getGroundStatic(2).x - this.mainX + (this.getGroundStatic(2).width / 2 - this.human.width / 2);
            //场景左移
            this.pageMove(rex);
        }, this)

        var seq = cc.sequence(human1, back1);
        this.human.getComponent(cc.Animation).play();
        this.human.runAction(seq);
    },
    //场景左移
    pageMove(rex) {
        this.pageMoveNode(this.getGroundStatic(1), rex);
        this.pageMoveNode(this.getGroundStatic(2), rex);
        this.pageMoveNode(this.getLineStatic(1), rex);
        this.pageMoveNode(this.getLineStatic(2), rex);
        this.getNewG(this.getGroundStatic(2).x - rex, this.getGroundStatic(2).width);
        var callback = cc.callFunc(function () {
            this.roundNum++;
            //回合开始
            this.readyLine();
        }, this)
        var ac = cc.moveTo(this.timeTemp, this.human.x - rex, this.human.y);
        var seq = cc.sequence(ac, callback);
        this.human.runAction(seq);
    },
    //结算分数
    addScore() {
        var result = this.getLineStatic(1).height - this.getGroundStatic(2).width / 2;
        var ans = this.roundDistance - this.getGroundStatic(1).width / 2 - this.getGroundStatic(2).width / 2;
        if (ans - 5 <= result && result <= ans + 5) {
            this.perfectCount++;
            this.score += 1;
            this.score += this.perfectCount;
            this.superScore();
        } else {
            this.perfectCount = 0;
            this.score += 1;
        }
        this.scoreShow.string = this.score;
    },
    //左移动作
    pageMoveNode(node, rex) {
        var ac = cc.moveTo(this.timeTemp, node.x - rex, node.y);
        node.runAction(ac);
    },
    //获得新底柱
    getNewG(rex, w1) {
        var distance = this.getNewDistance(w1);
        this.roundDistance = distance;
        var w2 = this.getNewWidth(w1, distance);
        this.getGroundStatic(3).getComponent("g").init(this.cvs.width, this.gY, w2, this.gHeight);
        var ac = cc.moveTo(this.timeTemp, rex + distance, this.gY);
        this.getGroundStatic(3).runAction(ac);
    },
    //回合开始
    startRound() {
        this.gameReady = true;
        this.gameFree = false;
    },
    //获取底柱
    getGroundStatic(num) {
        var r = this.roundNum % 3;
        switch (num) {
            case 1: if (1 == r) { return this.g1 } else if (2 == r) { return this.g2 } else { return this.g3 }
            case 2: if (1 == r) { return this.g2 } else if (2 == r) { return this.g3 } else { return this.g1 }
            case 3: if (1 == r) { return this.g3 } else if (2 == r) { return this.g1 } else { return this.g2 }
        }
    },
    //获得线条
    getLineStatic(num) {
        var r = this.roundNum % 2;
        switch (num) {
            case 1: if (1 == r) { return this.L1 } else { return this.L2 }
            case 2: if (1 == r) { return this.L2 } else { return this.L1 }
        }
    },
    //游戏重新开始
    reStart() {
        if (this.roundNum == 1) {
            this.getLineStatic(1).getComponent("line").reInit(-180);
        } else {
            this.getLineStatic(1).getComponent("line").reInit(-180);
            this.getLineStatic(2).getComponent("line").reInit(-90);
        }
        this.getGroundStatic(1).getComponent("g").hide();
        this.getGroundStatic(2).getComponent("g").hide();
        this.getGroundStatic(3).getComponent("g").hide();
        this.getLineStatic(1).heght = 0;
        this.getLineStatic(2).heght = 0;
        this.initGame();
    },
    //得分动画
    superScore() {
        this.perfectShow.getComponent(cc.Label).string = "perfect ×" + this.perfectCount;
        this.perfectShow.active = true;
        var that = this;
        setTimeout(function () {
            that.perfectShow.active = false;
        }, 1000);
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
                    that.historyScore = entry.getScore();
                    that.iniHisScore();
                });
        } catch (error) {
            this.historyScoreShow.node.active = false;
            this.historyScoreShowBg.active = false;
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
                .then(function (entry) {
                    that.historyScore = entry.getScore();
                    that.iniHisScore();
                });
        } catch (error) {
            this.historyScoreShow.node.active = false;
            this.historyScoreShowBg.active = false;
            console.log("update history score error : " + error);
        }
    },
    //初始化历史分数
    iniHisScore() {
        if (0 == this.historyScore || null == this.historyScore) {
            this.historyScoreShow.node.active = false;
            this.historyScoreShowBg.active = false;
        } else {
            this.historyScoreShow.node.active = true;
            this.historyScoreShowBg.active = true;
            this.historyScoreShow.string = "highest : " + this.historyScore;
        }
    },
    //分享
    shareRequest() {
        if (this.isLoading()) {
            return;
        }
        this.loadMask.getComponent("mask").showLoad();//打开查询遮罩
        var that = this;
        try {
            FBInstant.shareAsync({
                intent: 'SHARE',//"INVITE" 邀请 | "REQUEST" 请求| "CHALLENGE" //挑战| "SHARE" 分享)
                image: that.newShareImg,
                text: 'oh bro ,i need ur help',
                // data: { myReplayData: '...' },//分享时  希望传递的数据块
            }).then(function () {
                // continue with the game.
                that.loadMask.getComponent("mask").closeLoad();//关闭查询遮罩
                console.log("share finish");
            });

        } catch (error) {
            that.loadMask.getComponent("mask").closeLoad();//关闭查询遮罩
            console.log("share error : ")
            console.log(error)
        }
    },

    //是否可用按钮
    isLoading() {
        if (this.loadMask.active) {
            return true;
        } else {
            return false
        }
    }




});
