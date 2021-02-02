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
var data = require('carData');
cc.Class({
    extends: cc.Component,

    properties: {
        speedZ: 10, //直线速度
        speedW: 180 / 32, //弯道速度
        r: 160, //半径
        startX: -160, //跑道起始x
        startY: -80, //跑道起始y
        income: 0, //每圈秒入
        incomeSec: 0, //收每秒入
        level: 1, //等级
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.x = this.startX;
        this.node.y = this.startY;
        this.speedW = 180 / (this.r * 2 / this.speedZ) / (Math.PI / 2);
    },

    start() {},

    initCar(level) {
        this.level = level;
        this.speedZ = data.carList[this.level].speed;
        this.speedW = 180 / (502 / this.speedZ);
        this.income = data.carList[this.level].income;
        if (this.income) {
            this.incomeSec = parseInt(this.income / (1644 / 15) * 60); //周长/时间*60帧=每秒
        }

        var self = this;
        cc.loader.loadRes(this.level + "-1", cc.SpriteFrame, function (err, spriteFrame) {
            self.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    },

    update(dt) {
        var f = 0;
        if (this.node.rotation > -180) {
            //向下走
            f = -1;
        } else {
            //向上走
            f = 1;
        }
        if (-this.r < this.node.y && this.r > this.node.y) {
            //直道
            this.runZHI(this.speedZ, f);
        } else {
            //弯道
            this.runWAN(this.speedW, f);
        }
    },
    //直道位移  距离   方向(1/-1) 不包括边界
    runZHI(dis, f) {
        //向下走
        var addY = dis; //正数 增加的距离
        var finalY = this.node.y + f * addY; //最终位置
        var sup = 0; //是否超出跑道
        if (f > 0) {
            //向上
            sup = finalY - this.r;
        } else {
            //向下
            sup = -finalY - this.r;
        }
        if (sup < 0) {
            //未越界
            this.node.y = finalY;
            this.node.x = f * this.r;
        } else {
            //越界
            var ro = sup / dis * this.speedW;
            this.runWAN(ro, f);
        }
    },
    //弯道位移  角度   方向(1/-1) 包括边界(刚好在r)
    runWAN(ro, f) {
        var addRo = ro;
        var finalRo = this.node.rotation - addRo;
        var sup = 0;
        if (f > 0) {
            //上半区
            sup = -finalRo - 360;
        } else {
            //下半区
            sup = -finalRo - 180;
        }
        if (sup <= 0) {
            //未越界
            this.node.rotation = finalRo;
            this.node.x = -this.r * Math.cos(finalRo / 180 * Math.PI);
            if (f < 0) {
                this.node.y = this.r * Math.sin(finalRo / 180 * Math.PI) + -this.r;
            } else {
                this.node.y = this.r * Math.sin(finalRo / 180 * Math.PI) + this.r;
            }

        } else {
            //越界
            if (f > 0) {
                this.node.rotation = 0;
                this.node.y = this.r;
                this.node.x = -this.r;
            } else {
                this.node.rotation = -180;
                this.node.y = -this.r;
                this.node.x = this.r;
            }
            var dis = sup / ro * this.speedZ;
            this.runZHI(dis, f * (-1));
        }

    },
    //碰撞
    onCollisionEnter: function (other, self) {
        com.gameCtl.getComponent("gameCtl").getCoin(this.income);
    }
});