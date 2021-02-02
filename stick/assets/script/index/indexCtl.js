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
        rankName: "testRank",//排行榜名字\
        newShareImg: '',//分享图片
        loadMask: {
            default: null,
            type: cc.Node
        },
        rankMask: {
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.director.preloadScene("game", function () {
            console.log("Next scene preloaded");
        });

    },

    start() {
        if(2 == com.ac){
            com.ac = 0;
            this.shareRequest()
        }
    },

    // update (dt) {},
    //进入游戏
    pageToGame() {
        if (this.isLoading()) {
            return;
        }
        cc.director.loadScene("game");
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
                console.log("ok");
            });

        } catch (error) {
            that.loadMask.getComponent("mask").closeLoad();//关闭查询遮罩
            console.log("share error : ")
            console.log(error)
        }
    },
    //是否可用按钮
    isLoading() {
        if (this.loadMask.active || this.rankMask.active) {
            return true;
        } else {
            return false
        }
    }

});
