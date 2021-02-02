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
        scoreShow: {
            default: null,
            type: cc.Label
        },
        scoreCtl: {
            default: null,
            type: cc.Node
        },
        shakeCountSet: 8, //抖动帧数 - set
        shakeSizeSet: 3, //抖动幅度 - set
        initx: 0, //抖动初始x
        inity: 0, //抖动初始y
        isShaking: false, //是否抖动
        shakeCount: 0, //剩余抖动帧数
        moveDis: 60, //上移距离
        score: 0, //分数
        needReset: false, //是否需要回正

    },


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {},

    update(dt) {
        if (this.isShaking) {
            this.shakeCount--;
            this.shake();
            if (this.shakeCount == 0) {
                this.isShaking = false;
                this.needReset = true;
            }
        }
        if (!this.isShaking && this.needReset) {
            this.node.x = this.initx;
            this.node.y = this.inity;
            this.needReset = false;
        }
    },
    //碰撞
    onBeginContact(c, a, b) {
        this.cutScore();
        this.shakeStart();
        b.body.gravityScale = 3;
        this.scoreCtl.getComponent("scoreCtl").addScore();
    },
    //抖动
    shakeStart() {
        if (!this.isShaking) {
            this.initx = this.node.x;
            this.inity = this.node.y;
        }
        this.isShaking = true;
        this.shakeCount = this.shakeCountSet;
    },
    //抖动
    shake() {
        // var ro = cc.randomMinus1To1() * 6.29;  -1 ~ 1 
        var ro = (Math.random()*2-1) * 6.29;
        
        var offX = Math.sin(ro) * this.shakeSizeSet;
        var offY = Math.cos(ro) * this.shakeSizeSet;
        this.node.x = this.initx + offX;
        this.node.y = this.inity + offY;
    },
    //上移
    moveUp() {
        var ac = cc.moveTo(0.5, this.node.x, this.node.y + this.moveDis);
        this.node.runAction(ac);
    },
    initAi(score) {
        this.score = score;
        this.scoreShow.string = this.score;
        //偏移角度
        var rot = Math.random() * 360;
        this.node.rotation = rot;
        this.scoreShow.node.rotation = -rot;
        this.initColor();
    },
    cutScore() {
        this.score--;
        if (0 == this.score) {
            this.node.destroy();
            return;
        }
        this.scoreShow.string = this.score;
    },
    initColor() {
        var c = Math.random() * 6;
        if (c < 1) {
            this.node.color = new cc.Color(36, 229, 209);
        } else if (c < 2) {
            this.node.color = new cc.Color(114, 149, 252);
        } else if (c < 3) {
            this.node.color = new cc.Color(0, 241, 68);
        } else if (c < 4) {
            this.node.color = new cc.Color(183, 3, 222);
        } else if (c < 5) {
            this.node.color = new cc.Color(255, 221, 32);
        } else {
            this.node.color = new cc.Color(245, 20, 163);
        }
        // this.scoreShow.node.color = cc.Color.WHITE;
    }

});