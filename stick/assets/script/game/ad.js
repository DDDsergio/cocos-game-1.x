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
        adId: '', //id
        ad: null, //实例

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {},

    start() {},

    // update (dt) {},
    //显示广告
    show() {
        console.log("start");

        // FBInstant.getRewardedVideoAsync(
        //     this.adId
        // ).then(function (rewardedVideo) {
        //     console.log(rewardedVideo.getPlacementID())
        //     rewardedVideo.getPlacementID(); // 'my_placement_id'
        // });
        var ad = null;
        FBInstant.getRewardedVideoAsync(
            '489687378154315_489914618131591',
        ).then(function (rewardedVideo) {
            ad = rewardedVideo;
            return ad.loadAsync();
        }).then(function () {
            // Ad loaded
            return ad.showAsync();
        }).then(function () {
            // Ad watched
        });

    }
});