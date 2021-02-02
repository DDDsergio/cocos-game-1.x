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
        ballPre: {
            default: null,
            type: cc.Prefab
        },
        balls: {
            default: null,
            type: cc.Node
        },
        ff: {
            default: null,
            type: cc.Node
        }, //指针
        supLine: {
            default: null,
            type: cc.Node
        }, //指针线
        aiFac: {
            default: null,
            type: cc.Node
        }, //ai工厂
        ballsShow: {
            default: null,
            type: cc.Label
        }, //显示球数
        ball_move: {
            default: null,
            type: cc.Prefab
        }, //假球
        scoreCtl: {
            default: null,
            type: cc.Node
        }, //分数控制
        resultCtl: {
            default: null,
            type: cc.Node
        }, //结果控制
        roundReady: false, //是否准备好
        shootPower: 0, //设计力度
        roundNum: 0, //回合数
        roundBalls: 0, //本局球数 - 设定
        roundBallsReal: 0, //本局球数
        readyCount: 0, //收集完成的球数
        shootClock: null, //定时器 射击
        gameHeight: 0, //游戏屏幕高度
        needBofeng: true, //是否波峰
        bofengRoundLimit: 3, //强制波峰等待回合数
        bofengRoundTemp: 0, //当前波峰等待数
        magicRoundTemp: 0, //当前道具等待回合数
        deadLine: 0, //游戏结束y
        isStoping: true, //暂停

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // this.gameHeight = window.screen.availHeight / window.screen.availWidth * 450;
        this.gameHeight = document.body.clientHeight / document.body.clientWidth * 450;
        this.deadLine = this.ff.y - this.ff.height - 60;
        cc.director.getPhysicsManager().enabled = true; //开启物理引擎
        this.initPlayerEvent();
        this.ballsShow.string = "0";
        this.roundReady = false;
        this.roundNum = 0;
        this.roundBalls = 0;
        this.needBofeng = true;
        this.roundBallsReal = 0;
        this.readyCount = 0;
        this.bofengRoundTemp = 0;
        this.magicRoundTemp = 0;
        this.isStoping = true;
        this.supLine.active = false;
    },

    start() {},
    //开始游戏
    startGame() {
        var list = this.aiFac.children;
        for (var i in list) {
            list[i].getComponent("flag").out = true;
            list[i].destroy();
        }
        list = this.balls.children;
        for (var j in list) {
            list[j].destroy();
        }
        this.ballsShow.string = "0";
        this.roundReady = false;
        this.roundNum = 0;
        this.roundBalls = 0;
        this.needBofeng = true;
        this.roundBallsReal = 0;
        this.readyCount = 0;
        this.bofengRoundTemp = 0;
        this.magicRoundTemp = 0;
        this.isStoping = false; //结束暂停
        this.initGame();
        this.roundNextReady(true);
        this.resultCtl.getComponent("resultCtl").startGame();
    },
    initGame() {
        this.scoreCtl.getComponent("scoreCtl").initScore();
        this.magicRoundTemp = -1; //防止直接刷道具
        this.roundNum = 0;
        this.bofengRoundTemp = 0;
        this.roundBalls = 1;
        this.ballsShow.string = this.roundBalls;
        this.roundBallsReal = 0;
        this.readyCount = 0;
    },
    // update (dt) {},
    //用户点击事件
    initPlayerEvent() {
        var that = this;
        //点击
        this.node.on("touchstart", function (e) {
            if (that.roundReady && !that.isStoping) {
                that.initFF(e);
                that.supLine.active = true;
            }
        });
        // //移动
        this.node.on("touchmove", function (e) {
            if (that.roundReady && !that.isStoping) {
                that.initFF(e);
                that.supLine.active = true;
            }
        });
        //抬起
        this.node.on("touchend", function (e) {
            if (that.roundReady && !that.isStoping) {
                that.supLine.active = false;
                that.startRound(); //开始本回合
            }
        });
    },
    //创建小球
    createBalls(px, py, shootX, shootY) {
        var node = cc.instantiate(this.ballPre);
        node.x = shootX;
        node.y = shootY;
        node.getComponent("magic").pool = this.balls;
        node.getComponent("magic").gameCtl = this.node;
        node.getComponent(cc.RigidBody).linearVelocity = cc.v2(px, py);
        this.balls.addChild(node);
        // node.getComponent(cc.RigidBody).applyForceToCenter(cc.v2(px, py));
    },
    //初始化指针
    initFF(e) {
        var offX = this.ff.x - (e.getLocationX() - 225);
        var offY = this.ff.y - (e.getLocationY() - this.gameHeight / 2);
        if (offY <= 0) {
            if (offX > 0) {
                this.ff.rotation = 85;
            } else {
                this.ff.rotation = -85;
            }
            return;
        }
        var rota = 360 * Math.atan(offX / offY) / (2 * Math.PI)
        if (-85 > rota || 85 < rota) {
            if (offX > 0) {
                rota = 85;
            } else {
                rota = -85;
            }
        }
        this.ff.rotation = rota;

    },
    //回收假球
    moveBall(x, y) {
        var bb = cc.instantiate(this.ball_move);
        bb.x = x;
        bb.y = y;
        this.node.addChild(bb);
        var a1 = cc.moveTo(0.3, x, y + 1000);
        var that = this;
        setTimeout(function () {
            bb.destroy();
            that.readyCount++;
            if (that.readyCount == that.roundBalls) {
                that.roundNextReady();
            }
        }, 300);
        bb.runAction(a1);
    },
    //开始回合
    startRound() {
        // console.log("*********************开始回合**********************");
        this.roundReady = false;
        var offX = -Math.sin(this.ff.rotation * Math.PI / 180) * this.shootPower;
        var offY = -Math.cos(this.ff.rotation * Math.PI / 180) * this.shootPower;
        var shootX = this.ff.x - Math.sin(this.ff.rotation * Math.PI / 180) * this.ff.height;
        var shootY = this.ff.y - Math.cos(this.ff.rotation * Math.PI / 180) * this.ff.height;
        var that = this;
        clearInterval(that.shootClock);
        //射击
        this.shootClock = setInterval(function () {
            if (that.roundBallsReal < that.roundBalls) {
                that.createBalls(offX, offY, shootX, shootY);
                that.roundBallsReal++;
                that.ballsShow.string = that.roundBalls - that.roundBallsReal;
            } else {
                clearInterval(that.shootClock);
            }
        }, 200);
    },
    //增加球数
    addBallNum() {
        this.roundBalls++;
        this.roundBallsReal++;
        // console.log("即将波峰");
        this.needBofeng = true;
    },
    //准备下一回合   - 是否初始化
    roundNextReady(isInit) {
        this.roundNum++;
        this.roundBallsReal = 0;
        this.readyCount = 0;
        if (!this.needBofeng) {
            this.bofengRoundTemp++;
        } else {
            this.bofengRoundTemp = 0;
        }
        if (this.bofengRoundTemp > this.bofengRoundLimit) {
            this.needBofeng = true; //强制波峰
        }
        this.aiFac.getComponent("aiFactory").startRound(isInit, this.roundBalls, this.needBofeng, this.getMagicReady());
        if (1 != this.roundNum) {
            this.moveAi();
        }
        var next = this.isGameOver();
        if (next == "ok") {
            this.needBofeng = false; //波谷
            var that = this;
            setTimeout(function () {
                that.ballsShow.string = that.roundBalls;
                that.roundReady = true;
            }, 500);
        } else if (next == "warning") {
            this.resultCtl.getComponent("resultCtl").showWarninig();
            var that = this;
            setTimeout(function () {
                that.needBofeng = false; //波谷
                that.ballsShow.string = that.roundBalls;
                that.roundReady = true;
            }, 1500);
        } else if (next == "gameover") {
            var that = this;
            setTimeout(function () {
                that.resultCtl.getComponent("resultCtl").gameOver(that.scoreCtl.getComponent("scoreCtl").score);
            }, 500);
        }

    },
    //移动ai
    moveAi() {
        var ais = this.aiFac.children;
        for (var i in ais) {
            // if (null != ais[i].getComponent("ai")) {
            //     ais[i].getComponent("ai").moveUp();
            // }
            //上移
            var ac = cc.moveTo(0.5, ais[i].x, ais[i].y + 60);
            ais[i].runAction(ac);
        }
    },
    //道具规则
    getMagicReady() {
        if (this.roundBalls <= 45) {
            if (this.magicRoundTemp >= 1) {
                this.magicRoundTemp = 0;
                return true;
            }
        } else {
            if (this.magicRoundTemp >= 2) {
                this.magicRoundTemp = 0;
                return true;
            }
        }
        this.magicRoundTemp++;
        return false;
    },
    //失败检测
    isGameOver() {
        var list = this.aiFac.children;
        var result = 0;
        for (var i in list) {
            var s = list[i].getComponent("flag").isGameOver(this.deadLine);
            if (s == 2) {
                // return "gameover";
                result = 2;
            }
            if (s == 1 && result != 2) {
                result = 1;
            }
        }
        if (result == 0) {
            return "ok";
        } else if (result == 1) {
            return "warning"
        } else if (result == 2) {
            return "gameover";
        }
    },
    //暂停
    stop() {
        this.isStoping = true;
        this.resultCtl.getComponent("resultCtl").stop();
    },
    //继续游戏
    continue () {
        this.isStoping = false;
        this.resultCtl.getComponent("resultCtl").continue();
    },
    //返回主页
    return2index(){
        this.roundReady = false;
        this.resultCtl.getComponent("resultCtl").return2Index();
    }


});