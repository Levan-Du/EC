export var getPayPrice = (g) => {
    var t = parseInt(g.PayType);
    switch (t) {
        case 1:
            return g.ScorePrice;
        case 2:
            return g.DiamondPrice;
        case 3:
            return g.PointPrice;
        default:
            return 0;
    }
}

export var sumAmount = (el, type) => {
    return (el.PayType == type ? parseInt(getPayPrice(el)) * parseInt(el.Num) : 0);
};
