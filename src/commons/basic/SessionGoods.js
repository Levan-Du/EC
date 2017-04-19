var findOne = (id) => {
    var goods = get();
    var selectEl = goods.find(el => {
        return el.ID == id;
    });
    return selectEl;
}

var updateOne = (id, key, value) => {
    var goods = get();
    var selectEl = goods.find(el => {
        return el.ID == id;
    });
    selectEl[key] = value;
    sessionStorage.Goods = JSON.stringify(goods);
}

var get = () => {
    return JSON.parse(sessionStorage.Goods);
}

var set = (obj) => {
    sessionStorage.Goods = JSON.stringify(obj);
}


var SessionGoods = {
    get: get,
    set: set,
    findOne: findOne,
    updateOne: updateOne
}

export default SessionGoods;
