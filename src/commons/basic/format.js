export var formatPayType = (PayType) => {
    var t = parseInt(PayType);
    switch (t) {
        case 1:
            return '金币';
        case 2:
            return '钻石';
        case 3:
            return '积分';
        default:
            return '金币';
    }
}