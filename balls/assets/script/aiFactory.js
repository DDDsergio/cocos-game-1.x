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
        ai0Pre: {
            default: null,
            type: cc.Prefab
        }, //yuan
        ai3Pre: {
            default: null,
            type: cc.Prefab
        }, //
        ai4Pre: {
            default: null,
            type: cc.Prefab
        }, //
        ai5Pre: {
            default: null,
            type: cc.Prefab
        }, //
        ai6Pre: {
            default: null,
            type: cc.Prefab
        }, //
        magic1Pre: {
            default: null,
            type: cc.Prefab
        }, //add
        w: {
            default: null,
            type: cc.Node
        }, //左墙
        scoreCtl: {
            default: null,
            type: cc.Node
        }, //分数控制
        validWidth: 0, //可用宽度
        validCount: 0, //一排最大数量
        initY: 0, //出生y
        aiSize: 60, //大小


    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.validWidth = this.w.width - 20;
        this.validCount = parseInt(this.validWidth / this.aiSize);
    },

    start() {

    },

    // update (dt) {},
    //开始回合 //是否初始化  -  球数 - 是否波峰 - 是否增加道具
    startRound(init, ballCount, type, needMagic) {
        // console.log(needMagic);
        if (init) {
            var y2 = this.initY;
            this.initY = this.initY + 180;
            this.createAis(ballCount, type, true);
            this.initY = this.initY - 60;
            this.createAis(ballCount, type, true);
            this.initY = this.initY - 60;
            this.createAis(ballCount, type, true);
            this.initY = y2;
        } else {
            this.createAis(ballCount, type, needMagic);
        }
    },
    //创建一行得分块   是否波峰
    createAis(ballCount, type, needMagic) {
        // var num = Math.floor(Math.random() * this.validCount) + 1;
        var num = this.getAiReady(ballCount, needMagic);
        var things = num;
        if (needMagic) {
            num--;
        }
        var scoreSum = this.getScoreReady(ballCount, type);
        // console.log("nul : " + num);
        var posWidth = this.validWidth;
        var lastX = 0;
        // console.log(posWidth)
        var achieveAiCount = 0;
        var achieveMagicCount = 0;
        var isMagci = false;
        for (var i = 0; i < things; i++) {
            // console.log("********  : " + i);
            var initx = this.getInitX(posWidth - (things - i - 1) * this.aiSize);
            // console.log("随机数 : " + initx);
            lastX = lastX + initx; //
            // console.log("坐标 : " + lastX);
            if (needMagic && (achieveMagicCount == 0)) {
                if (Math.random() > 0.5) {
                    isMagci = true;
                } else {
                    if (things - 1 == i) {
                        isMagci = true;
                    }
                }
            }
            if (isMagci) {
                isMagci = false;
                achieveMagicCount++;
                var node = cc.instantiate(this.magic1Pre);
                node.y = this.initY;
                node.x = lastX + this.w.x + 10 - this.w.width / 2;
                this.node.addChild(node);
            } else {
                achieveAiCount++;
                var node = cc.instantiate(this.randAiType());
                node.getComponent("ai").scoreCtl = this.scoreCtl;
                node.y = this.initY;
                node.x = lastX + this.w.x + 10 - this.w.width / 2;
                var scoreTemp = 0;
                if (achieveAiCount == num) {
                    scoreTemp = scoreSum;
                } else {
                    scoreTemp = parseInt((scoreSum - (num - achieveAiCount) - 1) * Math.random() + 1);
                    scoreSum = scoreSum - scoreTemp;
                }
                node.getComponent("ai").initAi(scoreTemp);
                this.node.addChild(node);
            }
            lastX += this.aiSize / 2;
            // console.log("实际占用 : " + lastX);
            posWidth = posWidth - initx - this.aiSize / 2;
            // console.log("剩余宽度 : " + posWidth);
        }
    },

    //获得ai出生位置   剩余可用宽度,之后需留几个位置
    getInitX(width) {
        // console.log("可用 : " + width)
        if (width < this.aiSize) {
            return null; //不可创建
        } else {
            return this.aiSize / 2 + Math.random() * (width - this.aiSize);
        }
    },
    //随机ai类型
    randAiType() {
        var nn = Math.random() * 5;
        if (nn < 1) {
            return this.ai0Pre //
        } else if (nn < 2) {
            return this.ai3Pre //
        } else if (nn < 3) {
            return this.ai4Pre //
        } else if (nn < 4) {
            return this.ai5Pre //
        } else {
            return this.ai6Pre //
        }
    },
    //获得出生分数     //是否波峰
    getScoreReady(ballCount, type) {
        var scoreBase = 0; //基准
        if (59 >= ballCount) {
            scoreBase = (2 + (ballCount / 60) * 10) * ballCount;
            scoreBase = scoreBase * (0.8 + Math.random() * 0.4);
        } else {
            //60球以后
            scoreBase = 700 + 299 * Math.random();
        }
        if (!type) {
            //波谷
            scoreBase = scoreBase * (0.2 + 0.2 * Math.random());
        }
        scoreBase = parseInt(scoreBase);
        if (scoreBase < 6) {
            scoreBase = 6;
        }
        return scoreBase;
    },
    //获得ai数
    getAiReady(ballCount, needMagic) {
        if (ballCount < 45) {
            console.log('cc',cc);
            var k = Math.random();
            console.log('Math.random()',k);
            if (k < 0.3) {
                if (needMagic) {
                    return 2;
                }
                return 1;
            } else if (k < 0.6) {
                return 2;
            } else if (k < 0.9) {
                return 3;
            } else if (k < 0.95) {
                return 4;
            } else {
                return 5;
            }
        } else {
            var k = Math.random();
            if (k < 0.2) {
                if (needMagic) {
                    return 2;
                }
                return 1;
            } else if (k < 0.4) {
                return 2;
            } else if (k < 0.6) {
                return 3;
            } else if (k < 0.8) {
                return 4;
            } else {
                return 5;
            }
        }
    }
});