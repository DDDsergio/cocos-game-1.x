module.exports = {

    isPicking: false, //是否有被提起
    isRunningPick: false, //是否有被提起 在跑的车
    pickX: 0, //起点 用于还原
    pickY: 0, //起点 用于还原
    pickCar: {
        default: null,
        type: cc.Node
    },
    startSetName: "", //按下时set的name
    carStaticPre: {
        default: null,
        type: cc.Prefab
    }, //预制资源

    formatNum: function (num) {
        if (num < 10000) {
            return num;
        } else if (num < 1000000) {
            num = num / 1000;
            return num.toFixed(2) + "k";
        } else if (num < 1000000000) {
            num = num / 1000000;
            return num.toFixed(2) + "m";
        } else {
            num = num / 1000000000;
            return num.toFixed(2) + "b";
        }
        return num;
    }
};